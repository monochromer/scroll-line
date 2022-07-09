var scrollLine = new window.ScrollLine();
window.addEventListener('beforeunload', scrollLine.destroy);

function getViewportH() {
    return Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
};

function getDocumentHeight() {
    return Math.max(
        document.body.scrollHeight, document.documentElement.scrollHeight,
        document.body.offsetHeight, document.documentElement.offsetHeight,
        document.body.clientHeight, document.documentElement.clientHeight
    );
};

function getMaxScroll() {
    return getDocumentHeight() - getViewportH();
};

function getFactor(elem) {
    return parseFloat(elem.getAttribute('data-factor') || 1);
}

function getBounds(elem) {
    var scrollY = window.scrollY;
    var bounds = elem.getBoundingClientRect();
    return {
        top: bounds.top + scrollY,
        bottom: bounds.bottom + scrollY
    }
}

function toArray(items) {
    return Array.prototype.slice.call(items);
}

var sections = toArray(document.querySelectorAll('.hero-section'));

sections.forEach(function(item, index) {
    var bounds = getBounds(item);
    scrollLine.addScene({
        min: bounds.top,
        max: bounds.bottom,
        freeze: true,
        scope: item,
        image: item.querySelector('.hero-section__image'),
        overlay: item.querySelector('.hero-section__overlay'),
        text: item.querySelector('.text'),
        minOpacity: 0.2,
        maxOpacity: 1,
        // factor: getFactor(item.querySelector('.hero-section__image')),
        fn: function (progress) {
            // if (this.freeze) return;
            // var move = (progress * (this.max - this.min) + this.min) * this.factor;
            var baseMove = (progress * (this.max - this.min));
            var moveImage = baseMove * 0.3;
            var moveText = baseMove * 0.4;
            var opacity = this.minOpacity + progress * (this.maxOpacity - this.minOpacity);
            this.image.style.transform = 'translate3d(0, ' + moveImage + 'px , 0)';
            this.text.style.transform = 'translate3d(0, ' + moveText + 'px , 0)';
            this.overlay.style.opacity = opacity;
        }
    });

});
