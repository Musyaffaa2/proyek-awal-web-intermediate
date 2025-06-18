class NotFoundPage {
  async render() {
    return `
      <div class="not-found-container">
        <div class="not-found-content">
          <div class="not-found-illustration">
            <h1 class="error-code">404</h1>
            <div class="error-icon">🔍</div>
          </div>
          <h2 class="not-found-title">Halaman Tidak Ditemukan</h2>
          <p class="not-found-description">
            Maaf, halaman yang Anda cari tidak dapat ditemukan. 
            Mungkin halaman telah dipindahkan atau URL yang Anda masukkan salah.
          </p>
          <div class="not-found-actions">
            <a href="#/" class="btn-primary">
              <span class="btn-icon">🏠</span>
              Kembali ke Beranda
            </a>
            <button onclick="history.back()" class="btn-secondary">
              <span class="btn-icon">⬅️</span>
              Halaman Sebelumnya
            </button>
          </div>
          <div class="helpful-links">
            <h3>Mungkin Anda mencari:</h3>
            <ul>
              <li><a href="#/">Beranda</a></li>
              <li><a href="#/story">Upload Story</a></li>
              <li><a href="#/bookmark">Bookmark</a></li>
              <li><a href="#/login">Login</a></li>
            </ul>
          </div>
        </div>
      </div>
    `;
  }

  async afterRender() {
   
    console.log('404 Page rendered');

    if (typeof gtag !== 'undefined') {
      gtag('event', 'page_not_found', {
        'page_path': window.location.hash
      });
    }
  }
}

export default NotFoundPage;