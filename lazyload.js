'use strict';

(function ($) {
    /**
     * Constructor
     *
     * @param {object} doc
     */
    var lazyload = function lazyload(doc) {
        this.$doc = $(doc);

        this.init();
    };

    lazyload.prototype = {
        init: function init() {
            var _this = this;

            this.$doc.find('noscript').each(function (index, noscript) {
                var lazyImage = new Image();

                _this.assemble(noscript, lazyImage);
            });
        },
        assemble: function assemble(noscript, lazyImage) {
            var _this2 = this;

            lazyImage.src = 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs%3D'; // Empty gif
            lazyImage.style = ' width:1px; height: 1px;';

            //Copy attributes from noscript and add them to image
            this.addAttributes(noscript, lazyImage);

            // Append image
            noscript.parentNode.insertBefore(lazyImage, noscript);

            if (this.isInViewport(lazyImage)) {
                setTimeout(function () {
                    _this2.makeImageVisible(noscript, lazyImage);
                }, 1000 / 60);
            }

            $(window).on('resize scroll', function () {
                setTimeout(function () {
                    _this2.makeImageVisible(noscript, lazyImage);
                }, 1000 / 60);
            });
        },
        makeImageVisible: function makeImageVisible(noscript, lazyImage) {
            if (noscript.hasAttribute('data-lazyload-src') && this.isInViewport(lazyImage)) {
                this.addSource(noscript, lazyImage);
            }
        },
        addAttributes: function addAttributes(noscript, lazyImage) {
            $.each($(noscript).prop('attributes'), function (index, attribute) {
                $(lazyImage).attr(attribute.name, attribute.value || '');
            });
        },
        addSource: function addSource(noscript, lazyImage) {
            lazyImage.style = '';

            lazyImage.setAttribute('src', lazyImage.getAttribute('data-lazyload-src'));
            noscript.removeAttribute('data-lazyload-src');

            // Animate image in
            lazyImage.onload = function () {
                // Throttle animation
                setTimeout(function () {
                    lazyImage.removeAttribute('data-lazyload-src');
                }, 1000 / 60);
            };
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
        var _this3 = this;

        return this.each(function () {
            if (!$.data(_this3, 'lazyload')) {
                $.data(_this3, 'lazyload', new lazyload(_this3));
            }
        });
    };
})(jQuery);