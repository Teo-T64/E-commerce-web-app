import { Cart } from "../utils/utilsCart.js";
import { Products } from "../utils/utilsProducts.js";
import { Comments } from "../utils/utilsComments.js";
import { requireAuth } from "../auth/authChecker.js";
const cart = new Cart();
const product = new Products();
const comments = new Comments();
function showItem(item,ratings,avgScore) {
  const container = document.querySelector(".cont");
  if (!container) return;

  container.innerHTML = `
    <div class="product" data-item-id="${item.id}">
      <div class="img-holder">
        <img src="${item.thumbnail}" alt="Can't load" width="300">
      </div>
      <div class="description">
        <h1>${item.title}</h1>
        <div class="details-product">
          <p ${item.discountPercentage && item.discountPercentage > 10.0 ? `class="price-before"` : " "}>€${item.price}</p>
          <p>${item.discountPercentage && item.discountPercentage > 10.0 ? `<b/>€${Number((item.price*(1-item.discountPercentage/100)).toFixed(2))}</b>` : " "}</p>
          ${item.discountPercentage && item.discountPercentage > 10.0 ? 
          `<span class="discount-single">${item.discountPercentage.toFixed(0)}% Off</span>`
          : 
          " "}
          <p>(${avgScore}),</p>
          <p>( ${ratings} )</p>
        </div>
        <p class="desc-p">${item.description}</p>
        <button type="button" class="buy" data-item-id="${item.id}">Add To Cart</button>
      </div>
    </div>
  `;
}

function updateCartQuantity() {
  const numItemsEl = document.querySelector(".num-items");
  if (numItemsEl) numItemsEl.textContent = cart.totalQuantity;
}

async function initProductPage() {
  const productId = new URLSearchParams(window.location.search).get("id");
  if (!productId) return;

  await product.getProduct();
  const item = product.singleItem;
  if (!item) return;

  comments.loadComments(item.id).then(()=>{
    comments.initAddComment(item.id);
    showItem(item,comments.getRatings(),comments.getAverageRating());

  })

  

  
  const buyBtn = document.querySelector(".buy");
  if (!buyBtn) return;

  buyBtn.addEventListener("click", async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "./login.html";
      return;
    }

    try {
      if(item.discountPercentage && item.discountPercentage > 10.0){
        const price = Number((item.price*(1-item.discountPercentage/100)).toFixed(2));
        await cart.addToCart(item.id, price, 1);

      }else{
        await cart.addToCart(item.id, item.price, 1);
      }
    } catch (err) {
      console.error("Add to cart failed:", err);
      return;
    }

    cart.fetchCart().then(updateCartQuantity);

    buyBtn.disabled = true;
    buyBtn.textContent = "Added To Cart!";
    setTimeout(() => {
      buyBtn.disabled = false;
      buyBtn.textContent = "Add To Cart";
    }, 3000);
  });
}

document.addEventListener("DOMContentLoaded",()=>{
  requireAuth();

  cart.fetchCart().then(updateCartQuantity);

  initProductPage();
})

