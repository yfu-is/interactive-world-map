$ ($, window, document) ->
  pluginName    = 'interactiveWorldMap'
  countriesFill = {}        #Hold the countries code that must be Highlighted for be a YFU Country
  settings      = null
  patterns      = {}        #Hold all the Svg patterns
  dataCountries = {}        #Hold the countries information sent by parameters

  defaults =
    colors:
      general: '#cccccc'
      hover: 'red'
      highlighted: 'green'
    popup:
      margins:
        top: 120
        left: 0
    svg:
      pattern:
        size: 5
    classes:
      popup:
        country:
          containerWebsites:         'container-websites'
          containerTitleAndWebsites: 'titleAndWebsites'
          containerImage:            'container-image'
          image:                     'main-image'
          modal:                     'main-modal'
          container:                 'container'
          websites:                  'websites'
          title:                     'title'
        story:
          modal:                          'stories-main-modal'
          containerStories:               'container-stories'
          containerCountryNameAndStories: 'countryAndStories'
          container:                      'container'
          ulClass:                        'stories'
          countryName:                    'title'
    ids:
      dots:
        highlighted: 'dotsHighlighted'
        general:     'dotsGeneral'
        hover:       'dotsHover'

  InteractiveWorldMap = (element, options) ->
    @element = element
    @_options = options
    @init()

  createSVGPattern = (id, color) ->
    "<pattern id='#{id}' width='#{settings.svg.pattern.size}' height='#{settings.svg.pattern.size}'     patternUnits='userSpaceOnUse'><circle  cx='#{settings.svg.pattern.size / 2}' cy='#{settings.svg.pattern.size / 2}' r='#{settings.svg.pattern.size / 4}' style='stroke:none; fill:#{color}'></circle></pattern>"

  $.extend InteractiveWorldMap.prototype,
    init: ->
      settings = $.extend(defaults, $(@element).data(), @_options)
      if $.isPlainObject(settings.countries)  # Check if comes by js object or data-* parameter
        dataCountries = settings.countries
      else
        dataCountries = jQuery.parseJSON(settings.countries)
      @createPatterns()
      @prependModalContainer()


    createPatterns: ->
      patterns =
        highlighted: createSVGPattern(settings.ids.dots.highlighted, settings.colors.highlighted)
        general:     createSVGPattern(settings.ids.dots.general, settings.colors.general)
        hover:       createSVGPattern(settings.ids.dots.hover, settings.colors.hover)
    prependModalContainer: ->
      $(@element).prepend "<div class='#{settings.classes.popup.country.modal}'><span class='closeBtn'>X</span><div class='#{settings.classes.popup.country.container}'><div class='#{settings.classes.popup.country.image} flag flag-icon-background  ' ></div><div class='#{settings.classes.popup.country.containerTitleAndWebsites}'><div class='#{settings.classes.popup.country.title}'></div><div class='#{settings.classes.popup.country.containerWebsites}'></div></div></a></div></div>"
      $(@element).prepend "<div class='#{settings.classes.popup.story.modal}'><span class='closeBtn'>X</span><div   class='#{settings.classes.popup.story.container}'><div class='#{settings.classes.popup.story.containerCountryNameAndStories}'><div class='#{settings.classes.popup.story.countryName}'></div><div class='#{settings.classes.popup.story.containerStories}'><ul class='#{settings.classes.popup.story.ulClass}'></ul></div></div></a></div></div>"

  $.fn[pluginName] = (options) ->
    @each ->
      new InteractiveWorldMap(this, options)
      #Call the constructor
      $.each dataCountries, (index, value) ->
        countriesFill[index] = 'url(#dotsHighlighted)'

      $(this).vectorMap
        map:                'world_mill_en'
        backgroundColor:    'white'
        dotsGeneralId:       settings.ids.dots.general,
        dotsHighlightedId:   settings.ids.dots.highlighted,
        dotsHoverId:         settings.ids.dots.hover,
        regionStyle:
          initial:
            fill:     "url(##{settings.ids.dots.general})"
          hover:
            'fill-opacity': 1
        series:
          regions: [ {
            values: countriesFill
            attribute: 'fill'
            hover:
              'fill-opacity': 0.8
              cursor: 'pointer'
        } ]

        onRegionOver: (e, code) ->
          if dataCountries[code]
            data = new Array
            data[code] = "url(##{settings.ids.dots.hover})";
            mapObject = $(this).parent().vectorMap('get', 'mapObject');
            mapObject.series.regions[0].setValues data;

        onRegionOut: (e, code) ->
          if dataCountries[code]
            data = new Array
            data[code] = "url(##{settings.ids.dots.highlighted})";
            mapObject = $(this).parent().vectorMap('get', 'mapObject');
            mapObject.series.regions[0].setValues data;

        onRegionClick: (e, code) ->
          if !dataCountries[code]
            return

          optionsPopup =
            code: code
            country: dataCountries[code]
            margins: defaults.popup.margins
            element: $(this)

          switch settings.type
            when 'stories'
              optionsPopup.classes = defaults.classes.popup.story
              new  $.fn.interactiveWorldMapStoryPopup (optionsPopup)
            else
              optionsPopup.classes = defaults.classes.popup.country
              new  $.fn.interactiveWorldMapCountryPopup (optionsPopup)

        onViewportChange: (e, scale) ->
          generalDots     = $("#" + settings.ids.dots.general);
          highlightedDots = $("#" + settings.ids.dots.highlighted);
          hoverDots       = $("#" + settings.ids.dots.hover);

          newWidth     = ( settings.svg.pattern.size  / scale );
          newHeight    = ( settings.svg.pattern.size / scale );

          generalDots.attr('width',  newWidth);
          generalDots.attr('height', newHeight);

          highlightedDots.attr('width',  newWidth);
          highlightedDots.attr('height', newHeight);

          hoverDots.attr('width',  newWidth);
          hoverDots.attr('height', newHeight);


          radius = (generalDots.attr('width') / 4);

          generalDots.children('circle').attr('r',  radius)
          generalDots.children('circle').attr('cx', newWidth  / 2)
          generalDots.children('circle').attr('cy', newHeight / 2)

          highlightedDots.children('circle').attr('r',  radius)
          highlightedDots.children('circle').attr('cx', newWidth  / 2)
          highlightedDots.children('circle').attr('cy', newHeight / 2)

          hoverDots.children('circle').attr('r',  radius)
          hoverDots.children('circle').attr('cx', newWidth  / 2)
          hoverDots.children('circle').attr('cy', newHeight / 2)

      #Apply the svg patterns to the DOM
      $defs = $(this).children('.jvectormap-container').children('svg').children('defs');
      $defs.html (patterns.general + patterns.highlighted + patterns.hover)
