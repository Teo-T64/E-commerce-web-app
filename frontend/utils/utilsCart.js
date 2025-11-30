import {Loader} from "./Loader.js"
export class Cart {
  constructor(apiUrl = "http://127.0.0.1:5000/cart") {
    this.cartItems = [];
    this.apiUrl = apiUrl;
    this.total = 0;
    this.totalQuantity = 0;
    this.Loader = new Loader();
  }

  totalItems() {
    this.totalQuantity = this.cartItems.length;
  }

  calculateTotal() {
    const fix = n => Math.round(n * 100) / 100;

    this.total = this.cartItems.reduce((sum, item) => {
      const lineTotal = item.price * item.quantity;
      return fix(sum + lineTotal);
    }, 0);
  }


  async fetchCart() {

    const token = localStorage.getItem("token");
    if (!token) return [];

    try {
      const res = await fetch(this.apiUrl, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch cart");
      const data = await res.json();
      this.cartItems = data.cart || [];
      this.calculateTotal();
      this.totalItems();
      return this.cartItems;
    } catch (err) {
      console.error("Error fetching cart:", err);
      return [];
    }
  }

  async addToCart(productId, price, quantity = 1) {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please log in first");
      return;
    }

    try {
      const res = await fetch(this.apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ productId, price, quantity }),
      });

      if (!res.ok) throw new Error("Failed to add to cart");
      const data = await res.json();
      this.cartItems = data.cart || [];
      this.calculateTotal();
      this.totalItems();

      this.totalQuantity++;
      console.log("Cart updated:", this.cartItems);
    } catch (err) {
      console.error("Error adding to cart:", err);
    }
  }

  async updateQuantity(productId, quantity) {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(this.apiUrl, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ productId, quantity }),
      });
      if (!res.ok) throw new Error("Failed to update quantity");
      const data = await res.json();
      this.cartItems = data.cart || [];
      this.calculateTotal();
      this.totalItems();

    } catch (err) {
      console.error("Error updating quantity:", err);
    }
  }

  async removeItem(productId) {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${this.apiUrl}/${productId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to remove item");
      const data = await res.json();
      this.cartItems = data.cart || [];
      this.calculateTotal();
      this.totalItems();

    } catch (err) {
      console.error("Error removing item:", err);
    }
  }
  async clearCart(){
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(this.apiUrl, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to clear cart");
      const data = await res.json();
      this.cartItems = data.cart || [];
      this.calculateTotal();
      this.totalItems();

    } catch (err) {
      console.error("Error clearing cart:", err);
    }
  }
}