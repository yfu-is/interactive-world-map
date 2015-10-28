$ ($, window, document) ->
  pluginName = 'interactiveWorldMapCountryPopup'
  settings   = null
  element    = null
  mainModal  = null

  defaults =
    popup:
      margins:
        top:  100
        left: 60

  Popup = (options) ->
    @_options = options;
    @init();

  $.extend Popup.prototype,
    init: ->
      settings  = $.extend(defaults, @_options)
      element   = $('g', settings.element).find("[data-code='#{settings.code}']");
      mainModal = element.parents(':eq(4)');

  $.fn[pluginName] = (options) ->

    jQuery(this).each ->
      new Popup (options)
      $offset = element.offset()
      $modal  = mainModal.find(".#{settings.classes.modal}")
      $modal.toggleClass('active')

      # Calculate the distance between the country and the top of the browser for show with the correctly space the popup
      distanceXtop = $offset.top  - settings.margins.top
      distanceLeft = $offset.left + settings.margins.left
      countryName  = settings.country.name
      websites     = settings.country.websites
      $(".#{settings.classes.containerWebsites}").empty()


      # If has something appended inside from another country
      $.each websites, (index, web) ->
        classBtn = `(web.main) ? settings.classes.websites : 'regularBtn'`
        # if comes  "main" then we show the button else we just show a regular link for this website
        $(".#{settings.classes.containerWebsites}").append "<a href='#{web.url}' class='#{classBtn}'>#{web.label}</a>"

      $modal.css('top',"#{distanceXtop}px").css 'left',  "#{distanceLeft}px"
      mainModal.find(".#{settings.classes.title}").text(countryName)

      #Set the title (country name)
      imageElement = ".#{settings.classes.image}"

      #Remove the last flag class
      lastClass = $(imageElement).attr('class').split(' ').pop()
      if lastClass != settings.classes.image
        $(imageElement).removeClass(lastClass)

      #Add the new flag to the modal
      $(imageElement).addClass("flag-icon-#{settings.code.toLowerCase()}")

