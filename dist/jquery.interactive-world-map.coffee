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
        top: 100
        left: 60
    svg:
      pattern:
        circle:
          x: 1
          y: 1
          cx: 3
          cy: 3
          r: 2
        size:
          width: '5'
          height: '5'
    classes:
      popup:
        containerWebsites: 'container-websites'
        containerImage:    'container-image'
        image:             'main-image'
        modal:             'main-modal'
        container:         'container'
        websites:          'websites'
        title:             'title'
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
    "<pattern id='#{id}' width='#{settings.svg.pattern.size.width}' height='#{settings.svg.pattern.size.height}'     patternUnits='userSpaceOnUse'><circle x='#{settings.svg.pattern.circle.x}' y='#{settings.svg.pattern.circle.y}' cx='#{settings.svg.pattern.circle.cx}' cy='#{settings.svg.pattern.circle.cy}' r='#{settings.svg.pattern.circle.r}' style='stroke:none; fill:#{color}'></circle></pattern>"

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
      $(@element).prepend "<div class='#{settings.classes.popup.modal}'><div class='#{settings.classes.popup.container}'><div class='#{settings.classes.popup.containerImage}' ><div class='#{settings.classes.popup.image} flag flag-icon-background  ' ></div></div><div><div class='#{settings.classes.popup.title}'></div><div class='#{settings.classes.popup.containerWebsites}'></div></div></a></p></div></div>"

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
        heightGeneralDots:   '5'
        widthGeneralDots:    '5'
        regionStyle:
          initial:
            fill:     "url(#{settings.ids.dots.general})"
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
            margins: defaults.popup.margins
            country: dataCountries[code]
            element: $(this)
            classes: defaults.classes.popup
          new  $.fn.interactiveWorldMapCountryPopup (optionsPopup)

      #Apply the svg patterns to the DOM
      $defs = $(this).children('.jvectormap-container').children('svg').children('defs');
      $defs.html (patterns.general + patterns.highlighted + patterns.hover)
