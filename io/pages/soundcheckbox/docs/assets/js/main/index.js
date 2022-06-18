document.addEventListener('DOMContentLoaded', () => {
    SmoothParallax.init({});
    var scroll = new SmoothScroll('a[href*="#"]', {
        speed: 500,
        speedAsDuration: true
    });
    const $navbarBurgers = Array.prototype.slice.call(document.querySelectorAll('.navbar-burger'), 0);
    var video = document.getElementById('video');
    var modal = document.getElementById('modal');
    var modal_close = document.getElementById('modal-close');
    var modal_back = document.getElementById('modal-background');
    video.onclick = function() {
        modal.className = "modal is-active";
    }
    modal_close.onclick = function() {
        modal.className = "modal";
    }
    modal_back.onclick = function() {
        modal.className = "modal";
    }
    if ($navbarBurgers.length > 0) {
        $navbarBurgers.forEach(el => {
            el.addEventListener('click', () => {
                const target = el.dataset.target;
                const $target = document.getElementById(target);
                el.classList.toggle('is-active');
                $target.classList.toggle('is-active');
            });
        });
    }
});
