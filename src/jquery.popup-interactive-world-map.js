;$(function( $, window, document, undefined) {
    var pluginName = "interactiveWorldMapCountryPopup";
    var settings;
    var element;
    var mainModal;

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
            settings  = $.extend(defaults, this._options);
            element   = $('g', settings.element).find("[data-code='" + settings.code  + "']");
            mainModal = element.parents(':eq(4)');
        }
    });


    $.fn[pluginName] = function(options) {
        return jQuery(this).each(function () {

            new Popup(options);

            $offset  = element.offset();

            $modal   = mainModal.find("." + settings.classes.modal);

            $modal.toggleClass("active");
            // Calculate the distance between the country and the top for show with the correctly space the popup
            distanceXtop = $offset.top  - settings.margins.top;
            distanceLeft = $offset.left + settings.margins.left;

            countryName  = settings.country.name;
            websites     = settings.country.websites;
            $('.' + settings.classes.containerWebsites).empty(); // If has something appended inside from another country
            $.each(websites, function (index, web ) {
                    classBtn = (web.main) ?  settings.classes.websites : 'regularBtn'; // if setted main then we show the button else a regular link
                    $('.' + settings.classes.containerWebsites).append('<a href="' + web.url + '" class="' + classBtn  + '">' + web.label + '</a>');
                }
            );

            $modal.css("top", distanceXtop + 'px').css("left", distanceLeft + 'px');

            mainModal.find('.' + settings.classes.title).text(countryName); //Set the title (country name)

            imageElement = '.' + settings.classes.image;
            lastClass = $(imageElement).attr('class').split(' ').pop();
            if(lastClass != settings.classes.image) {
                $(imageElement).removeClass(lastClass); //Remove the last flag css
            }
            $(imageElement).addClass('flag-icon-' + settings.code.toLowerCase());
        });
    };
});
