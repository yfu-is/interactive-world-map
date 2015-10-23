## Vector Map customizable by JSON
Dependency: [Jvectormap](http://jvectormap.com/)
Dependency: [FlagIconCss](https://github.com/lipis/flag-icon-css)


Core :  Jquery.interactive-world-map.js
Popup:  Jquery.popup-interactive-world-map.js

The vector map shows a modal with the information of the country clicked. 

Actual main properties: **countries**, **margins**

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
