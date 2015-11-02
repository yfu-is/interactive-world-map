$ ($, window, document) ->
  pluginName   = 'interactiveWorldMapStoryPopup'
  modalElement = null
  settings     = null
  element      = null

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
      settings = $.extend(defaults, @_options)
      element   = $('g', settings.element).find("[data-code='#{settings.code}']")
      @closeModal()
    closeModal: ->
      findModal      = element.parents(':eq(4)');
      modalElement   = findModal.find("." + settings.classes.modal);
      $('.closeBtn').click ->
        modalElement.hide ('slow')

  $.fn[pluginName] = (options) ->

    jQuery(this).each ->
      new Popup (options)
      $offset = element.offset()
      modalElement.toggleClass('active')
      modalElement.css("display", "block");

      # Calculate the distance between the country and the top of the browser for show with the correctly space the popup
      distanceXtop = $offset.top  - settings.margins.top
      distanceLeft = $offset.left + settings.margins.left
      countryName  = settings.country.name
      stories      = settings.country.stories
      $(".#{settings.classes.containerStories} .stories").empty()

      # If has something appended inside from another country
      $.each stories, (index, story) ->
        # if comes  "main" then we show the button else we just show a regular link for this website
        $(".#{settings.classes.containerStories} .stories").append "<li class='#{story.type}'><i></i><a href='#{story.url}' >#{story.title}</a></li>"

      modalElement.css('top',"#{distanceXtop}px").css 'left',  "#{distanceLeft}px"
      modalElement.find(".#{settings.classes.countryName}").text(countryName)


