export function requireAuth() {
  const token = localStorage.getItem("token");
  if (!token ) {
    window.location.href = "login.html";
  }
  const payload = JSON.parse(atob(token.split(".")[1]));

  const now = Math.floor(Date.now() / 1000);

  if (!payload.exp || payload.exp < now) {
    return (window.location.href = "login.html");
  }
}

export function redirectIfLoggedIn() {
  const token = localStorage.getItem("token");
  if (token) {
    window.location.href = "index.html";
  }
}
