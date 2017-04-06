(function ($) {
    /**
     * Constructor
     *
     * @param {object} element
     */
    var lazyload = function (element) {
        this.$element = $(element);

        this.init();
    };

    lazyload.prototype = {
        init: function () {
            this.assemble();

            $(window).on('resize scroll', () => {
                // Images were created and appended, no need for init
                this.makeImageVisible();
            });
        },
        assemble: function () {
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
        makeImageVisible: function () {
            if (this.$element[0].hasAttribute('data-lazyload-src') && this.isInViewport(this.lazyImage)) {
                this.addSource();
            }
        },
        createImage: function () {
            this.lazyImage = new Image();
            this.lazyImage.src = 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs%3D'; // empty gif

            // Element needs some size so we can detect if it's visible in user's viewport
            this.lazyImage.style = 'width:1px; height:1px';
        },
        addAttributes: function () {
            $.each(this.$element.prop('attributes'), (index, attribute) => {
                $(this.lazyImage).attr(attribute.name, attribute.value || '');
            });
        },
        addSource: function () {
            this.lazyImage.style = '';

            this.lazyImage.setAttribute('src', this.lazyImage.getAttribute('data-lazyload-src'));
            this.$element[0].removeAttribute('data-lazyload-src');

            // Animate image in
            this.lazyImage.onload = () => {
                // Throttle animation
                setTimeout(() => {
                    this.lazyImage.removeAttribute('data-lazyload-src');
                }, 1000/60);
            };
        },
        appendImage: function () {
            this.$element[0].parentNode.insertBefore(this.lazyImage, this.$element[0]);
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
