(function ($) {
    /**
     * Constructor
     *
     * @param {object} doc
     */
    var lazyload = function (doc) {
        this.$doc = $(doc);

        this.init();
    };

    lazyload.prototype = {
        init: function () {
            this.$doc.find('noscript').each((index, noscript) => {
                const lazyImage = new Image();

                this.assemble(noscript, lazyImage);
            });
        },
        assemble: function (noscript, lazyImage) {
            lazyImage.src = 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs%3D'; // Empty gif
            lazyImage.style = ' width:1px; height: 1px;';

            //Copy attributes from noscript and add them to image
            this.addAttributes(noscript, lazyImage);

            // Append image
            noscript.parentNode.insertBefore(lazyImage, noscript);

            if (this.isInViewport(lazyImage)) {
                setTimeout(() => {
                    this.makeImageVisible(noscript, lazyImage);
                }, 1000 / 60);
            }

            $(window).on('resize scroll', () => {
                setTimeout(() => {
                    this.makeImageVisible(noscript, lazyImage);
                }, 1000 / 60);
            });
        },
        makeImageVisible: function (noscript, lazyImage) {
            if (noscript.hasAttribute('data-lazyload-src') && this.isInViewport(lazyImage)) {
                this.addSource(noscript, lazyImage);
            }
        },
        addAttributes: function (noscript, lazyImage) {
            $.each($(noscript).prop('attributes'), (index, attribute) => {
                $(lazyImage).attr(attribute.name, attribute.value || '');
            });
        },
        addSource: function (noscript, lazyImage) {
            lazyImage.style = '';

            lazyImage.setAttribute('src', lazyImage.getAttribute('data-lazyload-src'));
            noscript.removeAttribute('data-lazyload-src');

            // Animate image in
            lazyImage.onload = () => {
                // Throttle animation
                setTimeout(() => {
                    lazyImage.removeAttribute('data-lazyload-src');
                }, 1000 / 60);
            };
        },
        isInViewport: function (element) {
            let rect = element.getBoundingClientRect();

            /**
             * Only checking vertical position
             * for images positioned outside
             * of the viewport but vetically is in viewport
             */
            return (
                rect.top >= 0 &&
                rect.bottom <= (window.innerHeight || document.documentElement.clientHeight)
            );
        }
    };

    $.fn.lazyload = function () {
        return this.each(() => {
            if (!$.data(this, 'lazyload')) {
                $.data(this, 'lazyload', new lazyload(this));
            }
        });
    };

})(jQuery);