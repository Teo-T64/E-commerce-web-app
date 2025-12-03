
import {redirectIfLoggedIn} from "./authChecker.js"

redirectIfLoggedIn()

async function Register(){
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const res = await fetch("http://127.0.0.1:5000/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
    });

    const data = await res.json();
    if (res.ok) {
        localStorage.setItem("token", data.token);
        document.querySelector(".registration-res").textContent = "Registration successful! Redirecting to Login...";
        setTimeout(()=>{
            window.location.href = "login.html";
        },2000)
    }else{
        document.querySelector(".registration-res").textContent = "User already exists";

    }

}

document.getElementById("register-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    Register();

});