var scrollLine = new ScrollLine();

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

function toArray(items) {
    return Array.prototype.slice.call(items);
}

var svgPaths = toArray(document.querySelectorAll('.logo path'));

scrollLine.addScene({
    min: 0,
    max: getMaxScroll(),
    freeze: false,
    elems: svgPaths,
    lens: svgPaths.map(function(item, index) {
        var pathLength = item.getTotalLength();
        item.style.strokeDasharray = pathLength + ' ' + pathLength;
        item.style.strokeDashoffset = pathLength;
        return pathLength;
    }),
    fn: function(progress) {
        if (this.freeze) {
            return;
        };

        for (var len = this.elems.length - 1; len >= 0; len -= 1) {
            var pathLength = this.lens[len],
                elem = this.elems[len];
                drawLength = pathLength * progress;

            elem.style.strokeDashoffset = pathLength - drawLength;
            if (progress >= 0.99) {
                elem.style.strokeDasharray = 'none';
                elem.style.fillOpacity = '1';
                elem.style.strokeOpacity = '0';
            } else {
                elem.style.strokeDasharray = pathLength + ' ' + pathLength;
                elem.style.fillOpacity = '';
                elem.style.strokeOpacity = '';
            }
        };
    }
})