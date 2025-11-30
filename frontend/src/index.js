import { Cart } from "../utils/utilsCart.js";
import { Products } from "../utils/utilsProducts.js";
import {requireAuth} from "../auth/authChecker.js";


document.addEventListener("DOMContentLoaded",()=>{
  requireAuth();
  const productManager = new Products();
  const cart = new Cart();
  productManager.fetchProducts().then(() => {
    productManager.showProducts();
    const filterOptions = productManager.filtersForProducts();
    filterOptions.forEach((el)=>{
      let optHTML = `
        <div class="filterType">
          <input id="${el}" name="${el}" type="checkbox" value="${el}"/><br/>
          <label for="${el}">${el}</label>
        </div>
      `
      document.querySelector("#filterProdType").innerHTML += optHTML;
    })
    

    document.getElementById("logoutBtn").addEventListener("click", () => {
      localStorage.removeItem("token");
      window.location.href = "login.html";
    });

    document.querySelector("#filterType").addEventListener("change", () => {
      productManager.updateProducts();
    });

    document.querySelector("#filterProdType").addEventListener("change", () => {
      productManager.updateProducts();
    });

    document.querySelector(".filterBtn").addEventListener("click",()=>{
      const box = document.getElementById("filterProdType");
      box.style.display = box.style.display === "block" ? "none" : "block";
    });



  });

  cart.fetchCart().then(()=>{
    document.querySelector(".num-items").innerHTML = cart.totalQuantity;

  })
});