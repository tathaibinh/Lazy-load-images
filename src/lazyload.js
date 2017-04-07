(function ($) {
    /**
     * Constructor
     *
     * @param {object} element
     */
    var lazyload = function (element) {
        this.$doc = $(doc);

        this.init();
    };

    lazyload.prototype = {
        init: function () {
            this.$doc.find('noscript').each((index, noscript) => {
                const lazyImage = $(noscript).prev()[0];

                this.assemble(noscript, lazyImage);
            });


            $(window).on('resize scroll', () => {
                this.$doc.find('noscript').each((index, noscript) => {
                    const lazyImage = $(noscript).prev()[0];

                    // Images were created and appended, no need for init
                    setTimeout(() => {
                        this.makeImageVisible(noscript, lazyImage);
                    }, 1000 / 60);
                });
            });
        },
        assemble: function (noscript, lazyImage) {
            //Copy attributes from noscript and add them to image
            this.addAttributes(noscript, lazyImage);
            lazyImage.style = 'position:static; width:1px; height: 1px;';

            if (this.isInViewport(lazyImage)) {
                this.makeImageVisible(noscript, lazyImage);
            }
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
