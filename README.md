## Vector Map customizable by JSON
Dependency: [Jvectormap](http://jvectormap.com/) <br />
Dependency: [FlagIconCss](https://github.com/lipis/flag-icon-css)


Core :  Jquery.interactive-world-map.js
Popup:  Jquery.popup-interactive-world-map.js

The vector map shows a modal with the information of the country clicked. 

Actual main property:  **countries**

Example:
``` json
var options = {
                "countries": {
                    "AT":
                    {"name": "Austria",   "websites":  [ { label: 'VISIT COUNTRY WEBSITE', url: 'http://www.yfu.at'} ]}
                    ,
                    "AR":
                    {"name": "Argentina", "websites":  [ { label: 'VISIT COUNTRY WEBSITE', url: 'http://www.yfu.at'}, { label: 'VISIT GOV WEBSITE ', url: 'http://www.yfu.at'} ]}
                    ,
                    "BR":
                    {"name": "Brasil",    "websites":  [ { label: 'VISIT COUNTRY WEBSITE', url: 'http://www.yfu.at'} ]}
                 },
                "popup": {
                    "margins" : {"top": 100, "left": 20}
                },
                "colors": {
                    "hover" : "orange",
                    "highlighted": "yellow"
                }
            };
```

**Use:**<br />
In the dom you must add the  div where you want to render the map:
```
<div id="world-map" ></div>
```
And call the plugin 
```
$('#world-map').interactiveWorldMap(options)
```
options can be setted by a simple **hash** like the example above or by **data-** parameters in the element:
```
<div id="world-map" data-colors = '{"hover": "red", "highlighted":  "blue"   }'  data-countries=' {
"AT":
{"name": "Austria", "websites": "..."}
,.....

```
