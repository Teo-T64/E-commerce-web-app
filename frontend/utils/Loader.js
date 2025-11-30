export class Loader {
  constructor() {
    this.createLoader();
  }

  createLoader() {
    this.loader = document.createElement("div");
    this.loader.className = "loader-overlay hidden";
    this.loader.innerHTML = `
      <div class="spinner"></div>
    `;
    document.body.appendChild(this.loader);
  }

  show() {
    this.loader.classList.remove("hidden");
    document.body.style.pointerEvents = "none";
  }

  hide() {
    this.loader.classList.add("hidden");
    document.body.style.pointerEvents = "auto";
  }
}
