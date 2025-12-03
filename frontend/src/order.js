import { Cart } from "../utils/utilsCart.js";
import { requireAuth } from "../auth/authChecker.js";
import { Loader } from "../utils/Loader.js";

document.addEventListener("DOMContentLoaded",()=>{
    requireAuth();
    const cart = new Cart();
    cart.fetchCart().then(() => {
        if(cart.totalQuantity != 0){
            const totalElement = document.getElementById("cart-total");
            const orderStatus = document.getElementById("order-status");

            totalElement.textContent = cart.total.toFixed(2);

            const token = localStorage.getItem("token");

            document.getElementById("place-order").addEventListener("click", async () => {
                if (!token) { alert("Please log in first"); return; }
                const loader = new Loader();
                const transactionType = document.getElementById("transactionType").value;
                const location = document.getElementById("location").value;
                const channel = document.getElementById("channel").value;
                const orderData = {
                    TransactionAmount: cart.total,
                    TransactionType: transactionType,
                    Location: location,
                    Channel: channel,
                    items: cart.cartItems,
                    paymentMethod: transactionType,
                    shippingAddress:"123 New York"
                };

                loader.show();
                try {
                    const res = await fetch("http://127.0.0.1:5000/order/create", {
                        method: "POST",
                        headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                        },
                        body: JSON.stringify(orderData)
                    });

                    const data = await res.json();

                    if (data.isFraudulent) {
                        orderStatus.textContent = `⚠️ Order blocked: Fraud detected! (Risk: ${data.riskScore.toFixed(2)}) Returning to Home...`;
                        await cart.clearCart();
                        loader.show();
                        document.querySelector(".cont").style.display = "none"; 
                        totalElement.textContent = "0.00";
                        setTimeout(()=>{
                            window.location.href = "index.html"
                        },3000)
                    }else{
                        orderStatus.textContent = "✅ Order placed successfully. Thank you for your order! Returning to Home...";
                        await cart.clearCart();
                        loader.show();
                        document.querySelector(".cont").style.display = "none"; 
                        totalElement.textContent = "0.00";
                        setTimeout(()=>{
                            window.location.href = "index.html"
                        },3000)
                    }


                } catch (err) {
                    console.error(err);
                    orderStatus.textContent = "Network error. Please try again.";
                }finally{
                    loader.hide();
                }
            });
        }
    })
});