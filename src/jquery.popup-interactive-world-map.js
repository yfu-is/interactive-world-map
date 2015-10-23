;$(function( $, window, document, undefined) {
    var pluginName = "interactiveWorldMapCountryPopup";
    var settings;


    var defaults = {
        popup: {
            margins: {top: 100, left: 60}
        }
    };

    function Popup(options) {
        //Here is going to be all the initializations
        this._options   = options;
        this.init();
    }

    $.extend(Popup.prototype, {
        init: function () {
            settings   = $.extend(defaults, this._options);
        }
    });


    $.fn[pluginName] = function(options) {
        return jQuery(this).each(function () {

            new Popup(options);

            $element     = $('g', settings.element).find("[data-code='" + settings.code  + "']");
            $offset      = $element.offset();

            $(".main-modal, #modal-background").toggleClass("active");
            // Calculate the distance between the country and the top for show with the correctly space the popup
            distanceXtop = $offset.top  - settings.margins.top;
            distanceLeft = $offset.left + settings.margins.left;

            countryName  = settings.country.name;
            websites     = settings.country.websites;
            $('.' + settings.classes.containerWebsites).empty(); // If has something appended inside from another country
            $.each(websites, function (index, web ) {
                    $('.' + settings.classes.containerWebsites).append('<a href="' + web.url + '" class="' + settings.classes.websites  + '">' + web.label + '</a>');
                }
            );
            mainImage    = settings.country.main_image;

            $('.' + settings.classes.modal).css("top", distanceXtop + 'px').css("left", distanceLeft + 'px');
            $('.' + settings.classes.title).text(countryName);
            imageElement = '.' + settings.classes.image;
            lastClass = $(imageElement).attr('class').split(' ').pop();
            if(lastClass != settings.classes.image) {
                $(imageElement).removeClass(lastClass);
            }
            $(imageElement).addClass('flag-icon-' + settings.code.toLowerCase());
        });
    };
});
