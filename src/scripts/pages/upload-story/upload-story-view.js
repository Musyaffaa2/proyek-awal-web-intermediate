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
  