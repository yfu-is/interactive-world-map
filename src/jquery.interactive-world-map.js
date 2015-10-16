;$(function( $, window, document, undefined) {

    var pluginName = "interactiveWorldMap";
    var generalColor = '#cccccc';
    var marginCountryPopupForLeft;          //distance between the popup launched when you click a country and the left of the browser
    var marginCountryPopupForTop;           //distance between the popup launched when you click a country and the top  of the browser
    var dataCountries = {};                 //Hold the countries information sent by parameters
    var countriesFill = {};                 //Hold the countries code that must be Highlighted for be a YFU Country
    var highlightColor;                     //The #color used for highlighted  the countries
    var hoverPattern;                       //The svg pattern (html code) that uses the hover colors over the YFU countries and make it dotted.
    var hoverColor;                         //The hover color for the YFU countries. It's used by patternHover.
    var yfuCountriesHighlighted;            //The pattern that makes the yfu countries dotted and highlighted
    var generalDottedPatternStyle;          //The general dotted style for all the countries
    /*  Holds the patterns sizes of the map */
    var _cx;
    var _cy;
    var _r;
    var _x;
    var _y;

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
                configMapStyle(this.element);

            }
        }
    );

    function configMapStyle(element) {
        setPatternAttributes(1, 1, 3, 3, 3);
        generalDottedPatternStyle = createPatternSvg("dotsGeneral",     generalColor);
        yfuCountriesHighlighted   = createPatternSvg("dotsHighlighted", highlightColor);
        hoverPattern              = createPatternSvg("dotsHover",       hoverColor);
        prependModalContainer(element);

    }

    function setPatternAttributes(x, y, cx, cy, r) {
        _x  = x;
        _y  = y;
        _cx = cx;
        _cy = cy;
        _r  = r;
    }

    function createPatternSvg(id, color) {
        return '<pattern id="' + id + '" width="5" height="5"     patternUnits="userSpaceOnUse"><circle x="' + _x + '" y="' + _y + '" cx="' + _cx + '" cy="' + _cy + '" r="' + _r + '" style="stroke:none; fill:' + color + '"></circle></pattern>';
    }

    function prependModalContainer(element) {
        $(element).parent().prepend('<div class="main-modal"><div class="container"><div class="title"></div><div class="container-image" ><img src="" class="main-image" alt=""></div><p><h2></h2><div class="description"></div></p></div></div>');
    }

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
        highlightColor                                                     = $.fn[pluginName].defaults.highlightedcoloroption;
        hoverColor                                                         = $.fn[pluginName].defaults.hovercoloroption;
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

