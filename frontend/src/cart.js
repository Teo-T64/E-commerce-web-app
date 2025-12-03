import { Cart } from "../utils/utilsCart.js";
import { Products } from "../utils/utilsProducts.js";
import { requireAuth } from "../auth/authChecker.js";


document.addEventListener("DOMContentLoaded",()=>{
  requireAuth();

  const cart = new Cart();
  const products = new Products();
  async function displayCart() {
    await products.fetchProducts();
    const cartItems = await cart.fetchCart(); 

    const container = document.querySelector(".cont");
    container.innerHTML = "";               
    cartItems.forEach(item => {
      const product = products.products.find(p => p.id === item.productId);
      if (!product) return;

      container.innerHTML += `
        <div class="cart-item">
          <img src="${product.thumbnail}" alt="${product.title}" width="100">
          <div class="cart-info">
            <h3>${product.title}</h3>
            <p>Price: €${item.discountPercentage && item.discountPercentage > 10.0 ? Number((item.price*(1-item.discountPercentage/100)).toFixed(2)) : item.price}</p>
            <div class="quantity-control">
              <button class="minus" ${item.quantity == 1 ? "disabled" : " "} data-id="${item.productId}">-</button>
              <span>${item.quantity}</span>
              <button class="plus" data-id="${item.productId}">+</button>
              <button class="remove" data-id="${item.productId}">Remove</button>
            </div>
          </div>
        </div>
      `;
    });

    addCartListeners();
  }

  function addCartListeners() {
    document.querySelectorAll(".plus").forEach(btn => {
      btn.addEventListener("click", async (e) => {
        const id = parseInt(e.target.dataset.id);
        const item = cart.cartItems.find(i => i.productId === id);
        if (item) {
          await cart.updateQuantity(id, item.quantity + 1);
          displayCart();
        }
      });
    });

    document.querySelectorAll(".minus").forEach(btn => {
      btn.addEventListener("click", async (e) => {
        const id = parseInt(e.target.dataset.id);
        const item = cart.cartItems.find(i => i.productId === id);
        if (item && item.quantity > 1) {
          await cart.updateQuantity(id, item.quantity - 1);
          displayCart();
        }

      });
    });

    document.querySelectorAll(".remove").forEach(btn => {
      btn.addEventListener("click", async (e) => {
        const id = parseInt(e.target.dataset.id);
        await cart.removeItem(id);
        displayCart();
      });
    });
    document.querySelector(".total").innerHTML = `Total:   € ${(cart.total).toFixed(2)}`;

    document.querySelector(".clear").addEventListener("click",async()=>{
      if(cart.cartItems.length > 0){
        cart.Loader.show();              
        await cart.clearCart();
        await displayCart();
        cart.Loader.hide();
      }
    })
    if (cart.cartItems.length === 0) {
      document.querySelector(".order").disabled = true;
    } else {
      document.querySelector(".order").disabled = false;
    }

    document.querySelector(".order").addEventListener("click",()=>{
      window.location.href = "./order.html"
    })
  }

  displayCart()

});