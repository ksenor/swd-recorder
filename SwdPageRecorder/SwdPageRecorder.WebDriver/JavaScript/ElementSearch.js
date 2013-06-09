﻿(function () {
    // =================== XPATH 

    function pseudoGuid() {
        var result = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx';
        result = result.replace(/[xy]/g, function(c) 
                 {
                     var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
                     return v.toString(16);
                 });

        return result;
    }

    function getPathTo(element) {
        if (element.id !== '')
            return 'id("' + element.id + '")';
        if (element === document.body)
            return '/html/' + element.tagName.toLowerCase();

        var ix = 0;
        var siblings = element.parentNode.childNodes;
        for (var i = 0; i < siblings.length; i++) {
            var sibling = siblings[i];
            if (sibling === element)
                return getPathTo(element.parentNode) + '/' + element.tagName.toLowerCase() + '[' + (ix + 1) + ']';
            if (sibling.nodeType === 1 && sibling.tagName === element.tagName)
                ix++;
        }
    }

    function getPageXY(element) {
        var x = 0, y = 0;
        while (element) {
            x += element.offsetLeft;
            y += element.offsetTop;
            element = element.offsetParent;
        }
        return [x, y];
    }


    // ==========================

    // ====== SHOW DIV Coords==============

    function showPos(event, xpath) {
        
        var el, x, y;

        el = document.getElementById('SwdPR_PopUp');
        
        if (window.event) {
            x = window.event.clientX + document.documentElement.scrollLeft + document.body.scrollLeft;
            y = window.event.clientY + document.documentElement.scrollTop + document.body.scrollTop;
        }
        else {
            x = event.clientX + window.scrollX;
            y = event.clientY + window.scrollY;
        }
        x -= 2; y -= 2;
        y = y+15;

        el.style.position = "absolute";
        el.style.left = x + "px";
        el.style.top = y + "px";
        el.style.display = "block";
        
        
        
        document.getElementById("SwdPR_PopUp_XPathLocator").innerHTML = xpath;
        document.getElementById("SwdPR_PopUp_ElementText").innerHTML = pseudoGuid();
        

        console.log(x + ";" + y);
    }

    // ================= ADD button
    function addButton(container) {
        //Create an input type dynamically.   
        var element = document.createElement("input");
        //Assign different attributes to the element. 
        element.type = 'button';
        element.value = 'Click Me'; 
        element.name = '';  
        element.onclick = function() { // Note this is a function
            alert("blabla");
        };

        container.appendChild(element);
    }

    function createElementForm() {
        //Create an input type dynamically.   
        var element = document.createElement("div");
        //Assign different attributes to the element. 
        element.id = 'SwdPR_PopUp';
        element.style = 'display: block; position: absolute; left: 100px; top: 50px; border: solid black 1px; padding: 10px; background-color: rgb(200,100,100); text-align: justify; font-size: 12px; width: 135px;';
        element.name = '';  
        document.getElementsByTagName('body')[0].appendChild(element);

        element.innerHTML = 
        ' <table id="SWDTable">' +
        '   <tr>' +
        '     <td>Code identifier</td>' +
        '     <td><span id="SwdPR_PopUp_CodeID"><input type="text" id="SwdPR_PopUp_CodeIDText"></span></td>' +
        '   </tr>' +
        '   <tr>' +
        '     <td>Element</td>' +
        '     <td><span id="SwdPR_PopUp_ElementName">Element</span></td>' +
        '   </tr>' +
        '   <tr>' +
        '     <td>Text:</td>' +
        '     <td><span id="SwdPR_PopUp_ElementText">Element</span></td>' +
        '   </tr>' +
        '   <tr>' +
        '     <td>XPathLocator</td>' +
        '     <td><span id="SwdPR_PopUp_XPathLocator">Element</span></td>' +
        '   </tr>' +
        '   </table>' + 
        '<input type="button" value="Add element" onclick="window.Swd_addElement()">' + 
        '' + 
        '' + 
        '' + 
        ''; 

    }

    window.Swd_addElement = function addElement() {
        var JsonData = {
            "Command": "AddElement",
            "Caller": "addElement",
            "CommandId": pseudoGuid(),

            "ElementCodeName" : document.getElementById("SwdPR_PopUp_CodeIDText").value,
            "ElementXPath"    : document.getElementById("SwdPR_PopUp_XPathLocator").firstChild.nodeValue,

        };

        var myJSONText = JSON.stringify(JsonData, null, 2);

        // TODO: Reduce this copy-paste
        var body = document.getElementsByTagName('body')[0];
        body.setAttribute("swdpr_command", myJSONText);        

    };


    //===========================


    function addStyle(str) {
        var el = document.createElement('style');
        if (el.styleSheet) el.styleSheet.cssText = str;
        else {
            el.appendChild(document.createTextNode(str));
        }
        return document.getElementsByTagName('head')[0].appendChild(el);
    }


    // ========== MAIN !!!!!! ============================
    addStyle(".highlight { background-color:silver !important}");
    addStyle("table#SWDTable { background-color:white; border-collapse:collapse; } table#SWDTable,table#SWDTable th, table#SWDTable td { border: 1px solid black; }");

    createElementForm();
    //===================================================================

    var prev;

    if (document.body.addEventListener) {
        document.body.addEventListener('mouseover', handler, false);
        document.addEventListener("mousedown", function (event) {
            if (event.ctrlKey && event.button == 0) {
                // =====================

                if (event === undefined) event = window.event;                     // IE hack
                var target = 'target' in event ? event.target : event.srcElement; // another IE hack

                var root = document.compatMode === 'CSS1Compat' ? document.documentElement : document.body;
                var mxy = [event.clientX + root.scrollLeft, event.clientY + root.scrollTop];

                var path = getPathTo(target);
                var txy = getPageXY(target);
                // alert('Clicked element '+path+' offset '+(mxy[0]-txy[0])+', '+(mxy[1]-txy[1]));

                // xpath = 'Clicked element '+path+' offset '+(mxy[0]-txy[0])+', '+(mxy[1]-txy[1]);

                var body = document.getElementsByTagName('body')[0];
                var xpath = path;

                var JsonData = {
                    "Command": "GetXPathFromElement",
                    "Caller": "EventListener : mousedown",
                    "CommandId": pseudoGuid(),
                    "XPathValue" : xpath,

                };

                var myJSONText = JSON.stringify(JsonData, null, 2);

                body.setAttribute("swdpr_command", myJSONText);

                // !!! Add button

                // addButton(event.target);

                showPos(event, xpath);

                return false;

            }
        });
    }
    else if (document.body.attachEvent) {
        document.body.attachEvent('mouseover', function (e) {
            return handler(e || window.event);
        });
    }
    else {
        document.body.onmouseover = handler;
    }

    function handler(event) {
        
        if (event.target === document.body ||
            (prev && prev === event.target)) {
            return;
        }
        if (prev) {
            prev.className = prev.className.replace(/\bhighlight\b/, '');
            prev = undefined;
        }
        if (event.target && event.ctrlKey) {
            prev = event.target;
            prev.className += " highlight";
        }
    }

})();

