function redirectToGallery() {
    document.querySelector(".log-out-button").classList.remove('hidden');
    const container = document.getElementById('login-container');
    container.classList.add('hidden');

    createGalleryPage();
}

function redirectToLogin() {
    const cleanUrl = window.location.origin + window.location.pathname;
    window.history.replaceState({}, document.title, cleanUrl);
    localStorage.clear();

    document.querySelector(".log-out-button").classList.add('hidden');
    const galleryWrapper = document.querySelector('.wrapper');
    if (galleryWrapper) {
        galleryWrapper.remove();
    }

    const container = document.getElementById('login-container');
    container.classList.remove('hidden');
}