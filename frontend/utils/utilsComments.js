import {Loader} from "./Loader.js"

export class Comments {
  constructor(apiUrl = "http://127.0.0.1:5000") {
    this.comments = [];
    this.allRatings = {};
    this.averageRating = 0;
    this.totalRatings = 0;
    this.apiUrl = apiUrl;
    this.Loader = new Loader();
  }

    async loadComments(productId) {
      try {
        const res = await fetch(`http://127.0.0.1:5000/productInfo/comments/${productId}`);
        this.comments = await res.json();
        if (!Array.isArray(this.comments)) this.comments = [];
        if (this.comments.length === 0) {
          this.averageRating = 0;
          this.totalRatings = 0;
          return;
        }

        const total = this.comments.reduce((sum, c) => sum + (c.rating || 0), 0);
        this.totalRatings = this.comments.length;
        this.averageRating = (total / this.totalRatings).toFixed(1);

      } catch (err) {
        console.error("Failed to load comments:", err);
      }
    }


  async loadAllRatings() {
    try {
      const res = await fetch(`${this.apiUrl}/productInfo/ratings`);
      if (!res.ok) throw new Error("Failed to fetch product ratings");

      const data = await res.json();

      data.forEach(r => {
        this.allRatings[r.productId] = {
          avg: Number(r.avgRating),
          count: r.count
        };
      });

    } catch (error) {
      console.error("Error loading all ratings:", error);
    }
  }

  getAverageRating() {
    return this.averageRating || 0;
  }

  getRatings() {
    return this.totalRatings || 0;
  }

  getProductRating(productId) {
    return this.allRatings[productId] || { avg: 0, count: 0 };
  }

  createRatingCircles(avg) {
    avg = Math.floor(avg);
    let html = "";
    for (let i = 1; i <= 5; i++) {
      html += i <= avg
        ? `<span class="bubble filled"></span>`
        : `<span class="bubble"></span>`;
    }
    return html;
  }
  /*createRatingCircles(rating) {
    let html = "";
    for (let i = 1; i <= 5; i++) {
      html += i <= rating
        ? `<span class="bubble filled"></span>`
        : `<span class="bubble"></span>`;
    }
    return html;
  }
  getAverageRating() {
    if (!this.comments.length) return 0;
    const sum = this.comments.reduce((a, c) => a + c.rating, 0);
    return sum / this.comments.length;
  }

  getRatings() {
    return this.comments.length;
  }*/


  renderComments() {
    const container = document.getElementById("comments-list");
    if (!container) return;

    container.innerHTML = "";

    if (!this.comments.length) {
      container.innerHTML = "<p>No comments yet.</p>";
      return;
    }

    this.comments.forEach((c) => {
      const div = document.createElement("div");
      div.classList.add("comment");

      div.innerHTML = `
        <strong>${c.user.displayName}</strong>
        <div class="rating-bubbles">${this.createRatingCircles(c.rating)}</div>
        <p>${c.content}</p>
        <small>${new Date(c.createdAt).toLocaleString()}</small>
      `;

      container.appendChild(div);
    });
  }


  initAddComment(productId) {
    const commentForm = document.getElementById("comment-form");
    const commentInput = document.getElementById("comment-input");
    if (!commentForm || !commentInput) return;

    commentForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const content = commentInput.value.trim();
      const rating = Number(document.querySelector("input[name='rating']:checked")?.value);

      if (!content) return;
      if (!rating) {
        return;
      }

      const token = localStorage.getItem("token");
      if (!token) {
        window.location.href = "./login.html";
        return;
      }

      try {
        const resUser = await fetch(`${this.apiUrl}/profile/me`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (!resUser.ok) throw new Error("Failed to fetch user");
        const user = await resUser.json();

        const res = await fetch(`${this.apiUrl}/productInfo/comments`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            productId,
            userId: user._id,
            content,
            rating,
          }),
        });

        if (!res.ok) throw new Error("Failed to post comment");

        commentInput.value = "";
        document.querySelector("input[name='rating']:checked").checked = false;

        await this.loadComments(productId);
        this.renderComments();
      } catch (error) {
        console.error("Error posting comment:", error);
      }
    });
  }
}
