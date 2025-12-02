import {Loader} from "./Loader.js"
import { Comments } from "./utilsComments.js";

export class Products {
  constructor() {
    this.products = [];
    this.singleItem = {};
    this.Loader = new Loader();
    this.comments = new Comments();
  }

  async fetchProducts() {
    this.Loader.show();
    try {
      const res = await fetch('https://dummyjson.com/products');
      const data = await res.json();
      this.products = data?.products || [];
      console.log('Fetched products:', this.products);
    } catch (error) {
      console.error('Error fetching products:', error);
    }finally{
      this.Loader.hide();
    }
  }
  
  showProducts(){
    const container = document.querySelector(".cont");
    if (!container) return;

    container.innerHTML = "";
    this.products.forEach((el) => {
          const rating = this.comments.getProductRating(el.id); 
          let product_card = `
                <div class="product" data-item-id="${el?.id}">
                    <div class="img-holder">
                        <img src=${el?.thumbnail} alt="Can't load" width="200">
                    </div>
                    ${el?.discountPercentage && el?.discountPercentage > 10.0 ? 
                      `<span class="discount">${el?.discountPercentage.toFixed(0)}% Off</span>`
                      : 
                    " "}
                    <div class="description">
                        <h1>${el?.title}</h1>
                        <div class="rating-prod">
                          <section>
                            ${this.comments.createRatingCircles(rating.avg)}
                          </section>
                          <p>(${rating.count})</p>
                        </div>
                        <p ${el?.discountPercentage && el?.discountPercentage > 10.0 ? `class="price-before"` : " "}>€${el?.price}</p>
                        <p>${el?.discountPercentage && el?.discountPercentage > 10.0 ? `<b/>€${Number((el?.price*(1-el?.discountPercentage/100)).toFixed(2))}</b>` : " "}</p>
                    </div>
                </div>
            `
      document.querySelector(".cont").innerHTML += product_card;
    });
    this.addProductClickEvents();
  }
  updateProducts() {
    const sortType = document.querySelector("#filterType").value;

    const checked = [...document.querySelectorAll("#filterProdType input[type='checkbox']:checked")].map(el => el.value);
    let filtered = this.filterByCategory(checked);

    filtered = [...filtered]; 
    switch (sortType) {
      case "Price-low":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "Price-high":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "AtoZ":
        filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "ZtoA":
        filtered.sort((a, b) => b.title.localeCompare(a.title));
        break;
    }

    this.showFilteredProducts(filtered);
  }
  showFilteredProducts(list) {
    const container = document.querySelector(".cont");
    container.innerHTML = "";

    list.forEach((el) => {
      const rating = this.comments.getProductRating(el.id); 
      let product_card = `
        <div class="product" data-item-id="${el.id}">
          <div class="img-holder">
            <img src="${el.thumbnail}" alt="Can't load" width="200">
          </div>
          ${el.discountPercentage && el.discountPercentage > 10
            ? `<span class="discount">${el.discountPercentage.toFixed(0)}% Off</span>`
            : ""
          }
          <div class="description">
            <h1>${el.title}</h1>
            <div class="rating-prod">
              <section>
                ${this.comments.createRatingCircles(rating.avg)}
              </section>
              <p>(${rating.count})</p>
            </div>
            <p ${el.discountPercentage > 10 ? `class="price-before"` : ""}>€${el.price}</p>
            ${el.discountPercentage > 10
              ? `<p><b>€${(el.price * (1 - el.discountPercentage / 100)).toFixed(2)}</b></p>`
              : ""
            }
          </div>
        </div>
      `;
      container.innerHTML += product_card;
    });

    this.addProductClickEvents();
  }

  filtersForProducts() {
    let filters = [];
    this.products.forEach((el) => {
      if (!filters.includes(el.category)) {
        filters.push(el.category);
      }
    });
    return filters;
  }
  filterByCategory(selectedCategories) {
    if (selectedCategories.length === 0) return this.products;

    return this.products.filter(p => selectedCategories.includes(p.category));
  }

  async getProduct() {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    console.log("URL ID:", id);

    if (!id) {
      console.warn('No product ID in URL.');
      return;
    }

    try {
      const res = await fetch(`https://dummyjson.com/products/${id}`);
      const data = await res.json();
      this.singleItem = data || {};
      console.log('Fetched Item:', this.singleItem);
    } catch (error) {
      console.error('Error fetching Item:', error);
    }
  }

  addProductClickEvents() {
    document.querySelectorAll(".product").forEach((productEl) => {
      productEl.addEventListener("click", () => {
        const productId = productEl.dataset.itemId;
        window.location.href = `./route.html?id=${productId}`;
      });
    });
  }

}




