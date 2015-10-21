;$(function( $, window, document, undefined) {

    var pluginName = "interactiveWorldMap";
    var settings;
    var dataCountries = {};                 //Hold the countries information sent by parameters
    var countriesFill = {};                 //Hold the countries code that must be Highlighted for be a YFU Country
    var patterns      = {};                 //Hold all the Svg patterns

    var defaults = {
        colors: {
            general: '#cccccc',
            hover: 'red',
            highlighted: 'green'
        },
        popup: {
            margins: {top: 100, left: 60}
        },
        svg: {
           pattern: {
                circle: {
                    x: 1, y: 1, cx:3, cy: 3, r: 3
                },
               size: {
                   width:  "5",
                   heigth: "5"
               }
           }
        }
    };


    function InteractiveWorldMap(element, options) {
        this.element    = element;
        this._options   = options;
        this.init();
    }


    $.extend(InteractiveWorldMap.prototype, {
            init: function () {
                settings   = $.extend(defaults, $(this.element).data(), this._options);
                if ($.isPlainObject(settings.countries)) {
                    dataCountries = settings.countries;
                }else {
                    dataCountries = jQuery.parseJSON(settings.countries);
                }
                this.createPatterns();
                this.prependModalContainer();
            },
            createPatterns: function() {

                patterns = {
                    highlighted: createSVGPattern("dotsHighlighted", settings.colors.highlighted),
                    general:     createSVGPattern("dotsGeneral",     settings.colors.general),
                    hover:       createSVGPattern("dotsHover",       settings.colors.hover)
                };

            },
            prependModalContainer: function() {
                $(this.element).parent().prepend('<div class="main-modal"><div class="container"><div class="title"></div><div class="container-image" ><img src="" class="main-image" alt=""></div><p><h2></h2><div class="description"></div></p></div></div>');

            }
        }
    );

    function createSVGPattern(id, color) {
        return '<pattern id="' + id + '" width="' + settings.svg.pattern.size.width + '" height="' + settings.svg.pattern.size.heigth + '"     patternUnits="userSpaceOnUse"><circle x="' + settings.svg.pattern.circle.x + '" y="' + settings.svg.pattern.circle.y + '" cx="' + settings.svg.pattern.circle.cx + '" cy="' + settings.svg.pattern.circle.cy + '" r="' + settings.svg.pattern.circle.r + '" style="stroke:none; fill:' + color + '"></circle></pattern>';
    }

    $.fn[ pluginName ] = function(options) {
        return this.each(function() {
                new InteractiveWorldMap(this, options);                //Call the constructor

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
                        distanceXtop = $offset.top  - settings.popup.margins.top;
                        distanceLeft = $offset.left + settings.popup.margins.left;

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
                $('defs').html(patterns.general + patterns.highlighted + patterns.hover);
            }
        );
    };
});

