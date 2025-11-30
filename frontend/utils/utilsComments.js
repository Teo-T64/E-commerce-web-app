import {Loader} from "./Loader.js"

export class Comments {
  constructor(apiUrl = "http://127.0.0.1:5000") {
    this.comments = [];
    this.apiUrl = apiUrl;
    this.Loader = new Loader();
  }

  async loadComments(productId) {
    this.Loader.show();
    try {
      const res = await fetch(`${this.apiUrl}/productInfo/comments/${productId}`);
      if (!res.ok) throw new Error("Failed to fetch comments");

      this.comments = await res.json();
      this.renderComments();
    } catch (error) {
      console.error("Error loading comments:", error);
    } finally {
      this.Loader.hide();
    }
  }

  createRatingCircles(rating) {
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
  }


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
  getAverageRating() {
    if (!this.comments.length) return 0;

    const sum = this.comments.reduce((a, c) => a + (parseFloat(c.rating) || 0), 0);
    return (sum / this.comments.length).toFixed(1);
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
      } catch (error) {
        console.error("Error posting comment:", error);
      }
    });
  }
}
