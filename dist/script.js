"use strict";

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
            var self = this;

            self.assemble();

            $(window).on("resize scroll", function () {
                // Images were created and appended, no need for init
                self.makeImageVisible();
            });
        },
        assemble: function assemble() {

            //Create image
            this.createImage();

            //Append image to DOM
            this.appendImage();

            if (this.isInViewport(this.lazyImage)) {
                this.makeImageVisible();
            }
        },
        makeImageVisible: function makeImageVisible() {
            if (this.$element[0].hasAttribute("data-lazyload-src") && this.isInViewport(this.lazyImage)) {

                //Copy attributes from noscript
                this.addAttributes();

                // Add src pointing to the image
                this.addSource();

                // Animate image in
                this.animateImageIn();
            }
        },
        createImage: function createImage() {

            this.lazyImage = new Image();
            this.lazyImage.src = "";

            // Element needs some size so we can detect if it's visible in user's viewport
            this.lazyImage.style = "width:1px; height:1px";
        },
        addAttributes: function addAttributes() {
            var self = this;

            this.lazyImage.style = "";

            $.each(this.$element.prop("attributes"), function () {
                $(self.lazyImage).attr(this.name, this.value || "");
            });
        },
        addSource: function addSource() {

            this.lazyImage.src = this.lazyImage.getAttribute("data-lazyload-src");

            this.$element[0].removeAttribute("data-lazyload-src");
        },
        appendImage: function appendImage() {
            this.$element[0].parentNode.insertBefore(this.lazyImage, this.$element[0]);
        },
        animateImageIn: function animateImageIn() {
            var _this = this;

            this.lazyImage.onload = function () {
                _this.lazyImage.removeAttribute('data-lazyload-src');
            };
        },
        isInViewport: function isInViewport(element) {
            var rect = element.getBoundingClientRect();

            return rect.top >= 0 && rect.left >= 0 && rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) && rect.right <= (window.innerWidth || document.documentElement.clientWidth);
        }
    };

    $.fn.lazyload = function () {
        var _this2 = this;

        return this.each(function () {
            if (!$.data(_this2, 'lazyload')) {
                $.data(_this2, 'lazyload', new lazyload(_this2));
            }
        });
    };
})(jQuery);