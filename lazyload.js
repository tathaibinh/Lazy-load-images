'use strict';

(function ($) {
    /**
     * Constructor
     *
     * @param {object} element
     */
    var lazyload = function lazyload(element) {
        this.$element = $(element);

        this.init();
    };

    lazyload.prototype = {
        init: function init() {
            var _this = this;

            this.assemble();

            $(window).on('resize scroll', function () {
                // Images were created and appended, no need for init
                _this.makeImageVisible();
            });
        },
        assemble: function assemble() {
            //Create image
            this.createImage();

            //Append image to DOM
            this.appendImage();

            //Copy attributes from noscript and add them to image
            this.addAttributes();

            if (this.isInViewport(this.lazyImage)) {
                this.makeImageVisible();
            }
        },
        makeImageVisible: function makeImageVisible() {
            if (this.$element[0].hasAttribute('data-lazyload-src') && this.isInViewport(this.lazyImage)) {
                this.addSource();
            }
        },
        createImage: function createImage() {
            this.lazyImage = new Image();
            this.lazyImage.src = 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs%3D'; // empty gif

            // Element needs some size so we can detect if it's visible in user's viewport
            this.lazyImage.style = 'width:1px; height:1px';
        },
        addAttributes: function addAttributes() {
            var _this2 = this;

            $.each(this.$element.prop('attributes'), function (index, attribute) {
                $(_this2.lazyImage).attr(attribute.name, attribute.value || '');
            });
        },
        addSource: function addSource() {
            var _this3 = this;

            this.lazyImage.style = '';

            this.lazyImage.setAttribute('src', this.lazyImage.getAttribute('data-lazyload-src'));
            this.$element[0].removeAttribute('data-lazyload-src');

            // Animate image in
            this.lazyImage.onload = function () {
                // Throttle animation
                setTimeout(function () {
                    _this3.lazyImage.removeAttribute('data-lazyload-src');
                }, 1000 / 60);
            };
        },
        appendImage: function appendImage() {
            this.$element[0].parentNode.insertBefore(this.lazyImage, this.$element[0]);
        },
        isInViewport: function isInViewport(element) {
            var rect = element.getBoundingClientRect();

            /**
             * Only checking vertical position
             * for images positioned outside
             * of the viewport but vetically is in viewport
            */
            return rect.top >= 0 && rect.bottom <= (window.innerHeight || document.documentElement.clientHeight);
        }
    };

    $.fn.lazyload = function () {
        var _this4 = this;

        return this.each(function () {
            if (!$.data(_this4, 'lazyload')) {
                $.data(_this4, 'lazyload', new lazyload(_this4));
            }
        });
    };
})(jQuery);