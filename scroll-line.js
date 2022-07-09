;(function(root, factory) {

    if (typeof define === "function" && define.amd) {
        define(factory);
    } else if (typeof exports === "object") {
        module.exports = factory();
    } else {
        root.ScrollLine = factory();
    }

})(this, function() {

    function ScrollLine(options) {
        var self = this;

        self._options = options;

        this._state = {
            ticking: false,
            scrollPos: null
        };

        this._scenes = [];

        if (!!options && !!options.scrollContainer && options.scrollContainer != window) {
            this.scrollContainer = options.scrollContainer;
            this._getScrollPos = function() {
                return {
                    y: this.scrollContainer.scrollTop,
                    x: this.scrollContainer.scrollLeft
                }
            }
        } else {
            this._getScrollPos = function() {
                return {
                    y: window.scrollY,
                    x: window.scrollX
                }
            }
        };

        ['_onScroll', '_requestTick', '_update', '_render'].forEach(function(fn) {
            self[fn] = self[fn].bind(self);
        });
        this._bindEvents();
    }

    ScrollLine.prototype = {
        constructor: ScrollLine,

        destroy: function() {
            this._unBindEvents();

            this._options = null;
            this._scenes = null;
            this._state = null;
            ['_getScrollPos', '_onScroll', '_requestTick', '_update', '_render'].forEach(function(fn) {
                self[fn] = null;
            });
        },

        _getScrollPos: function() {},

        addScene: function(scene) {
            this._scenes.push(scene);
        },

        _bindEvents: function() {
            var options = this._options;
            var scrollTarget = !!options && !!options.scrollContainer && options.scrollContainer || window;
            scrollTarget.addEventListener('scroll', this._onScroll);
        },

        _unBindEvents: function() {
            var options = this._options;
            var scrollTarget = !!options && !!options.scrollContainer && options.scrollContainer || window;
            scrollTarget.removeEventListener('scroll', this._onScroll);
        },

        _onScroll: function() {
            // this._state.scrollPos = this._getScrollPos();
            this._requestTick();
        },

        _requestTick: function() {
            var state = this._state;
            if(!state.ticking) {
                state.ticking = true;
                window.requestAnimationFrame(this._update);
            }
            // state.ticking = true;
        },

        _update: function() {
            // var currentScroll = this._state.scrollPos;
            var currentScroll = this._state.scrollPos = this._getScrollPos();
            this._render(currentScroll);
            this._state.ticking = false;
        },

        _renderScene: function(scene, progress) {
            if (scene.freeze) {
                return
            }
            // scene.fn.call(scene, progress)
            scene.fn(progress)
        },

        _render: function(scroll) {
            var scene,
                scenes = this._scenes,
                len = scenes.length;

            for (; len > 0; len -=1) {
                scene = scenes[len - 1];
                if (scroll.y > scene.min && scroll.y < scene.max) {
                    var progress = (scroll.y - scene.min) / (scene.max - scene.min);
                    scene.freeze = false;
                    this._renderScene(scene, progress);
                };

                if (scroll.y >= scene.max) {
                    this._renderScene(scene, 1);
                    scene.freeze = true;
                }

                if (scroll.y <= scene.min) {
                    this._renderScene(scene, 0);
                    scene.freeze = true;
                }
            }
        }
    }

    return ScrollLine;
});
