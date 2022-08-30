document.body.onload = function () {
    setTimeout(function () {
        let preloader = document.body.shadowRoot.querySelector('.preloader')
        if (preloader) {
            if (!preloader.classList.contains('done')) {
                preloader.classList.add('done')
            }
        }
    }, 3000)
}
