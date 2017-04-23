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

var sceneElems = document.querySelectorAll('.scene');

var maxScroll = getMaxScroll();
var part = maxScroll / sceneElems.length;

Array.prototype.forEach.call(sceneElems, function (item, index) {
    scrollLine.addScene({
        min: part * index,
        max: part * (index + 1),
        freeze: false,
        scope: item,
        left: item.querySelector('.scene__part_left'),
        right: item.querySelector('.scene__part_right'),
        fn: function (progress) {
            if (this.freeze) {
                return;
            };

            var left = this.left;
            var right = this.right;

            progress = progress * 100;
            var moveX = 100 - progress;

            left.style['transform'] = 'translate3d(' + -moveX + '%, 0, 0)';
            right.style['transform'] = 'translate3d(' + moveX + '%, 0, 0)';
            // window.requestAnimationFrame(function () {
            // })
        }
    });
});