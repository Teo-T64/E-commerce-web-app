async function loadAccount() {
    const token = localStorage.getItem("token");

    if (!token) {
        console.error("No token found");
        return;
    }

    const resUser = await fetch("http://127.0.0.1:5000/profile/me", {
        headers: {
            "Authorization": `Bearer ${token}`
        }
    });

    const user = await resUser.json();
    console.log("User:", user);

    document.getElementById("userInfo").innerText =
        `Signed in as: ${user.email}`;

    const resOrders = await fetch("http://127.0.0.1:5000/order/my-orders", {
        headers: {
            "Authorization": `Bearer ${token}`
        }
    });

    const data = await resOrders.json();

    console.log("Orders:", data);

    const orderList = document.getElementById("orderList");
    if(data.orders.length == 0){
        orderList.textContent = "No orders"
    }
    data.orders.forEach(order => {
        let li = ' ';
        li+=`
            <div class="single-order">
                <section>
                    <p><b>ID</b>: ${order._id}</p>
                    <button class="show" data-btn-id=${order._id}> Details</button>
                </section>
                <div class="order-data-${order._id} order-info" data-item-id=${order._id}>
                    <p><b>Shipping Adress</b>: ${order.shippingAddress}</p>
                    <p><b>Payment Method</b>: ${order.paymentMethod}</p>
                    <p><b>Total</b>:€ ${order.totalAmount}</p>
                    <p><b>Status</b>: ${order.status}</p>
                </div>
            </div>
        `
        orderList.innerHTML += li;
    });
    document.querySelectorAll(".show").forEach((btn)=>{
        btn.addEventListener("click",()=>{
            const btnId = btn.dataset.btnId;
            const target = document.querySelector(`.order-data-${btnId}`);
            if (target.style.display === "block") {
                target.style.display = "none";
            } else {
                target.style.display = "block";
            }         
        })
    })
    document.getElementById("logoutBtn").addEventListener("click", () => {
      localStorage.removeItem("token");
      window.location.href = "login.html";
    });
    
}

document.addEventListener("DOMContentLoaded", loadAccount);

