## Vector Map customizable by JSON
Dependency: [Jvectormap](http://jvectormap.com/)

Main sources: data.js and the library. It includes the **.coffee** version of **data.js**

The vector map show a modal with the information of the country clicked. The data you should send by Json for the map configuration.

Actual main properties: **countries**, **margins**

Example:
``` json
    var options = { 'countries': {
                "AT":
                    {"name": "Austria", "main_image": "src", "description": "brief description"}
                ,
                "AR":
                    {"name": "Argentina", "main_image": "http://estaticos2.catai.es/content/media/fotos/samples/large/paisaje-austriaco.jpg", "description": "The best country in the world"}
                ,
                "BR":
                    {"name": "Brasil", "country_flag_image": "src", "main_image": "http://www.bvmemorial.fapesp.br/var/home/memorial/htdocs//local/Image/ban_brasil.JPG", "description": "Brasil is worse in football than Argentina"}
                },
                'margins': {
                    "marginCountryPopupForTop"  : 100,
                    "marginCountryPopupForLeft" : 60
                }
            };
```
For add more properties for the Country modal you have to add it in the onRegionClick at data.js and in the ``` $('#world-map').prepend() ``` the dom element.
After that in the json you gonna be able to send it:).