;$(function( $, window, document, undefined) {

    var pluginName = "interactiveWorldMap";
    var marginCountryPopupForLeft;          //distance between the popup launched when you click a country and the left of the browser
    var marginCountryPopupForTop;           //distance between the popup launched when you click a country and the top  of the browser
    var dataCountries = {};                 //Hold the countries information sent by parameters
    var countriesFill = {};                 //Hold the countries code that must be Highlighted for be a YFU Country
    var highlightColor;                     //The #color used for highlighted  the countries
    var hoverPattern;                       //The svg pattern (html code) that uses the hover colors over the YFU countries and make it dotted.
    var hoverColor;                         //The hover color for the YFU countries. It's used by patternHover.
    var yfuCountriesHighlighted;            //The pattern that makes the yfu countries dotted and highlighted
    var generalDottedPatternStyle;          //The general dotted style for all the countries

    var defaults = {
        hovercoloroption : "#FF0000",
        highlightedcoloroption: "#848484",
        marginCountryPopupForTop: 100,
        marginCountryPopupForLeft: 60
    };


    function interactiveWorldMap(element, options) {
        this.element    = element;
        this._defaults  = defaults;
        this._name      = pluginName;
        this._options   = options;
        this.init();
    }


    $.extend(interactiveWorldMap.prototype, {
            init: function () {
                $.fn[this._name].defaults = this._defaults;
                marginCountryPopupForTop  = $.fn[this._name].defaults.marginCountryPopupForTop;
                marginCountryPopupForLeft = $.fn[this._name].defaults.marginCountryPopupForLeft;

                //override defaults
                setOptions(this.element, this._options, this._defaults);

                //Configurations for the map. Dotted Style and popup prepended
                highlightColor                     = $.fn[pluginName].defaults.highlightedcoloroption;
                hoverColor                         = $.fn[pluginName].defaults.hovercoloroption;
                generalDottedPatternStyle          = '<pattern id="dotsGeneral" width="5" height="5" patternUnits="userSpaceOnUse"><circle x="1" y="1" cx="3" cy="3" r="3" style="stroke:none; fill:#cccccc;"></circle></pattern>';
                yfuCountriesHighlighted            = '<pattern id="dotsHighlighted" width="5" height="5" patternUnits="userSpaceOnUse"><circle x="1" y="1" cx="3" cy="3" r="3" style="stroke:none; fill:' + highlightColor + '"></circle></pattern>';
                hoverPattern                       = '<pattern id="dotsHover" width="5" height="5" patternUnits="userSpaceOnUse"><circle x="1" y="1" cx="3" cy="3" r="3" style="stroke:none; fill:' + hoverColor+ '"></circle></pattern>';
                $(this.element).parent().prepend('<div class="main-modal"><div class="container"><div class="title"></div><div class="container-image" ><img src="" class="main-image" alt=""></div><p><h2></h2><div class="description"></div></p></div></div>');
            }
        }
    );


    function setOptions(element, options, defaults) {
        $data = $(element).data();                                                      //Configuration coming from the data-* attributes
        final = $.extend({}, defaults, $data);

        if(options) {
            final = $.extend(final, options, options['colors'], options['margins']);   //Options coming from hash
        }

        marginCountryPopupForTop                                           = final['marginCountryPopupForTop'];
        marginCountryPopupForLeft                                          = final['marginCountryPopupForTop'];
        $.fn[pluginName].defaults.highlightedcoloroption                   = final['highlightedcoloroption'];
        $.fn[pluginName].defaults.hovercoloroption                         = final['hovercoloroption'];
        dataCountries                                                      = final['countries'];
    }

    $.fn[ pluginName ] = function(options) {
        return this.each(function() {
                //Call the constructor
                new interactiveWorldMap(this, options);

                $.each(dataCountries, function(index, value) {
                        countriesFill[index] = 'url(#dotsHighlighted)';
                    }
                );


                $( this ).vectorMap( {
                    map             : 'world_mill_en',
                    backgroundColor : 'white',
                    regionStyle: {

                        initial: {
                            fill            :   'url(#dotsGeneral)'
                        },

                        hover: {
                            "fill-opacity":  1
                        }
                    },
                    series: {
                        regions: [{
                            values: countriesFill,
                            attribute: 'fill',
                            hover: {
                                "fill-opacity":  0.8,
                                cursor:         'pointer'
                            }
                        }]
                    },
                    onRegionOver: function (e, code) {
                        if(dataCountries[code]){
                            data = new Array;
                            data[code] = 'url(#dotsHover)';
                            var mapObject = $(this).parent().vectorMap('get', 'mapObject');
                            mapObject.series.regions[0].setValues(data);
                        }
                    },
                    onRegionOut: function (e, code) {
                        if(dataCountries[code]) {
                            data = new Array;
                            data[code] = 'url(#dotsHighlighted)';
                            var mapObject = $(this).parent().vectorMap('get', 'mapObject');
                            mapObject.series.regions[0].setValues(data);
                        }
                    },

                    onRegionClick: function(e, code){
                        if(!dataCountries[code]) {
                            return;
                        }
                        var $this = $(this);
                        $element   = $('g', $this).find("[data-code='" + code  + "']");
                        $offset    = $element.offset();

                        $(".main-modal, #modal-background").toggleClass("active");
                        // Calculate the distance between the country and the top for show with the correctly space the popup
                        distanceXtop = $offset.top  - marginCountryPopupForTop;
                        distanceLeft = $offset.left + marginCountryPopupForLeft;

                        var first           = dataCountries[code];
                        countryName         = first['name'];
                        description         = first['description'];
                        mainImage           = first['main_image'];

                        $(".main-modal" ).css("top", distanceXtop + 'px').css("left", distanceLeft + 'px');
                        $(".main-modal .description").text(description);
                        $(".main-modal .title").text(countryName);
                        $(".main-image").attr('src', mainImage);

                    }

                });
                //Apply the svg patterns to the DOM
                $('defs').html(generalDottedPatternStyle+yfuCountriesHighlighted+hoverPattern);
            }
        );
    };
});

