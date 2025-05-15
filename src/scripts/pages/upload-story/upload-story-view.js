export default class UploadStoryView {
  constructor() {
    this.form = null;
    this.resultDiv = null;
    this.photoInput = null;
    this.fileNameDiv = null;
    this.latInput = null;
    this.lonInput = null;
    this.photoUploadSection = null;
    this.onSubmit = null;
  }

  render(token) {
    const title = token ? "Add New Story" : "Add New Story (Guest)";
    return `
      <section class="container">
        <h1>${title}</h1>
        <form id="upload-form">
          <div id="photo-upload-section">
            <label for="photo">Photo:</label>
            <input type="file" id="photo" name="photo" accept="image/*" required />
          </div>
          <div id="file-name" style="margin-top:8px; color: #555;"></div>

          <div>
            <label for="description">Description:</label>
            <textarea id="description" name="description" required></textarea>
          </div>
          <div>
            <label for="map">Select Location:</label>
            <div id="map" class="map"></div>
          </div>
          <input type="hidden" id="lat" name="lat" />
          <input type="hidden" id="lon" name="lon" />
          <button type="submit">Upload</button>
        </form>
        <div id="upload-result"></div>
      </section>
    `;
  }

  init() {
    this.form = document.getElementById("upload-form");
    this.resultDiv = document.getElementById("upload-result");
    this.photoInput = document.getElementById("photo");
    this.fileNameDiv = document.getElementById("file-name");
    this.latInput = document.getElementById("lat");
    this.lonInput = document.getElementById("lon");
    this.photoUploadSection = document.getElementById("photo-upload-section");

    this.form.addEventListener("submit", (e) => {
      e.preventDefault();
      if (this.onSubmit) {
        const photo = this.photoInput.files[0];
        const description = this.form.description.value;
        const lat = this.latInput.value;
        const lon = this.lonInput.value;
        this.onSubmit(photo, description, lat, lon);
      }
    });
  }

  showLoading() {
    this.resultDiv.innerHTML = "Uploading...";
  }

  showSuccess(message) {
    this.resultDiv.innerHTML = `<p style="color: green;">${message}</p>`;
  }

  showError(message) {
    this.resultDiv.innerHTML = `<p style="color: red;">${message}</p>`;
  }

  updateFileName(fileName) {
    this.fileNameDiv.textContent = `File selected: ${fileName}`;
  }

  resetFileName() {
    this.fileNameDiv.textContent = "";
  }

  clearMap() {
    this.latInput.value = "";
    this.lonInput.value = "";
  }
}
