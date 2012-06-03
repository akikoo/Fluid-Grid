/** 
 * Generates a grid configuration tool that can be toggled on and off
 * 
 * Author: Aki Karkkainen, www.akikoo.org
 * http://akikoo.github.com/Fluid-Grid/
 * 
 * Main features:
 *   Change column number and gutter width in a fluid 100% grid (user input)
 *   Change column number and gutter width inside a fixed container (select from 
 *   a list of predefined device dimensions)
 * 
 * Licensed under the MIT license
 *
 **/

(function (window, doc) {

	'use strict';

    // common variables, available to all functions via closure
    var jsRow           = doc.getElementById('js-row'),     // row that contains dynamically generated rows, based on user input
        row             = doc.getElementsByClassName('row'),// rows that demonstrate a static nested grid
        defaultColumns  = 12,                               // default column number
        defaultGutter   = 4,                                // default gutter width (%)
        form            = doc.getElementById('updategrid'), // configurator form 
        formToggle      = doc.getElementById('toggle'),     // form visibility toggle


        // event utility
        addEvent = function (event, elm, fn) {
            if (doc.addEventListener) { // W3C
                elm.addEventListener(event, fn, false);
            } else if (doc.attachEvent) { // IE
                doc.attachEvent(event, fn);
            }
        },


        // initialization
        init = function () {

            // form markup
            var formMarkup      = '';

            formMarkup += '<p>';
            formMarkup += '<span id="docWidth"></span>';
            formMarkup += '<label for="colnum">Columns</label>';
            formMarkup += '<input type="text" name="colnum" id="colnum" value="' + defaultColumns + '">';
            formMarkup += '</p>';
            formMarkup += '<p>';
            formMarkup += '<label for="gutterwidth">Gutter (%)</label>';
            formMarkup += '<input type="text" name="gutterwidth" id="gutterwidth"  value="' + defaultGutter + '">';
            formMarkup += '</p>';
            formMarkup += '<label for="resolution">Resolution</label>';
            formMarkup += '<select name="resolution" id="resolution" class="">';
            formMarkup += '<option value="">-- Fluid --</option>';
            formMarkup += '<option value="240, 320">240x320</option>';
            formMarkup += '<option value="320, 240">320x240</option>';
            formMarkup += '<option value="320, 480">320x480 (iPhone portrait) </option>';
            formMarkup += '<option value="480, 320">480x320 (iPhone landscape, BlackBerry Bold)</option>';
            formMarkup += '<option value="544, 372">544x372 (NTSC TV safe) </option>';
            formMarkup += '<option value="640, 480">640x480 (VGA) </option>';
            formMarkup += '<option value="600, 1024">600x1024 (Kindle portrait)</option>';
            formMarkup += '<option value="768, 1024">768x1024 (iPad portrait) </option>';
            formMarkup += '<option value="800, 600">800x600 (SVGA) </option>';
            formMarkup += '<option value="1024, 600">1024x600 (Kindle landscape)</option>';
            formMarkup += '<option value="1024, 768">1024x768 (XGA, iPad landscape) </option>';
            formMarkup += '<option value="1280, 720">1280x720 (HD 720p) </option>';
            formMarkup += '<option value="1280, 1024">1280x1024 (SXGA)</option>';
            formMarkup += '<option value="1600, 1200">1600x1200 (UXGA) </option>';
            formMarkup += '<option value="1920, 1080">1920x1080 (HD 1080p)</option>';
            formMarkup += '</select>';
            formMarkup += '<input type="reset" value="Reset">';
            formMarkup += '<input type="submit" value="Update">';

            //insert form
            form.innerHTML = formMarkup;

            //hide dynamic rows
            jsRow.style.display = 'none';

            //attach events
            addEvent('submit', form, myHandler);
            addEvent('reset', form, reset);
            addEvent('click', formToggle, toggleVisibility);
            addEvent('resize', window, getValues);

            //calculate widths
            getValues();
        },


        // generate stylesheet and insert it in the document head
        loadStyleString = function (css) {
            var head    = doc.getElementsByTagName("head")[0],
                style   = doc.createElement("style");
            style.type  = "text/css";
            try {
                style.appendChild(doc.createTextNode(css));
            } catch (ex) { //for IE
                style.styleSheet.cssText = css;
            }
            head.appendChild(style);
        },


        // handle submit
        myHandler = function (e) {

            var src;

            // get event and source element
            e = e || window.event;
            src = e.target || e.srcElement;

            // no bubble
            if (typeof e.stopPropagation === "function") {
                e.stopPropagation();
            }

            e.cancelBubble = true;

            // prevent default action
            if (typeof e.preventDefault === "function") {
                e.preventDefault();
            }

            e.returnValue = false;

            // update values
            getValues();
        },


        // write columns dynamically based on user input
        generateCols = function (num, onecolpx, gutterpx) {
            var i,
                cols = "";
            for (i = 0; i < num; i += 1) {
                cols += '<div class="col one">' + onecolpx + 'px - ' + gutterpx + 'px</div>';
            }

            //insert columns
            jsRow.innerHTML = cols;
        },


        // resize the row container to the selected width and height
        resize = function (w, h) {
            jsRow.style.width   = (w === '') ? '100%' : w + 'px';
            jsRow.style.height  = (h === '') ? '100%' : h + 'px';
        },


        // reset form, calculate default values and update
        reset = function () {
            var selectbox = doc.forms[0].resolution;

            //reset the form 
            form.reset();

            //set default values
            form.elements[0].value = defaultColumns;
            form.elements[1].value = defaultGutter;
            selectbox.options[0].selected = true;

            //calculate again
            getValues();
        },


        // handle the form and row visibility
        toggleVisibility = function (e) {
            var elm         = form,                                 // configuration form
                linkText    = e.target.firstChild.nodeValue,        // link content
                title       = e.target.title,                       // link title attribute
                i,                                                  // counter
                l           = row.length;                           // number of rows

            //toggle text and title ttribute content
            e.target.firstChild.nodeValue = (linkText === '+') ? '-' : '+';
            e.target.title = (title === 'Open grid configurator') ? 'Close grid configurator' : 'Open grid configurator';

            //toggle visibility
            if (elm.style.display === 'block') {

                elm.style.display = 'none';         // hide form
                form.reset();                       // reset form

                for (i = 1; i < l; i += 1) {
                    row[i].style.display = 'block'; // show static rows
                }
                jsRow.style.display = 'none';       // hide dynamic row

            } else {

                elm.style.display = 'block';        // show form

                for (i = 1; i < l; i += 1) {
                    row[i].style.display = 'none';  // hide static rows
                }
                jsRow.style.display = 'block';      // show dynamic row
            }

            e.preventDefault();
        },


        //Calculate new values
        getValues = function () {

            var columns         = form.elements[0].value,                       // number of columns, based on user input
                gutter          = form.elements[1].value,                       // gutter width in %, based on user input
                onecol          = (100 - (gutter * (columns - 1))) / columns,   // column width in % 
                clientWidth     = doc.documentElement.clientWidth,              // viewport width, no scrollbars
                clientHeight    = doc.documentElement.clientHeight,             // viewport height, no scrollbars
                browserWidth    = window.innerWidth,                            // browser window width, including scrollbars
                onecolpx        = Math.round((onecol / 100) * clientWidth),     // column width in px
                gutterpx        = Math.round((gutter / 100) * clientWidth),     // gutter width  in %
                docWidth        = doc.getElementById('docWidth'),               // placeholder for browser and document widths
                styles          = '',                                           // styles to write
                selectbox       = doc.forms[0].resolution,                      // resolutions select box
                selectedIndex   = selectbox.selectedIndex,                      // currently selected index
                selectedOption  = selectbox.options[selectbox.selectedIndex],   // currently selected option element
                selValue        = selectedOption.value,                         // currently selected option value
                dimensions      = selValue.split(', '),                         // array of width and height
                w               = dimensions[0],                                // selected width
                h               = dimensions[1],                                // selected height
                colHeight       = dimensions[1] || clientHeight;                // selected height; otherwise viewport height

            styles += '#toggle {position:absolute; top:40px; left:10px; border:1px solid #ddd; z-index:1; background:#eee; text-decoration:none; padding:0 10px; font-size:18px; border-radius:5px;}';
            styles += '#updategrid {position:absolute; top:0; left:0; width:180px; background:#eee; padding:45px 10px 10px;}';
            styles += '#docWidth {font-size: 14px; margin:0 0 10px; color:#999; display:block;}';
            styles += '#js-row {background:#fff;}';
            styles += '#js-row .col {margin:0 0 0 ' + gutter + '% !important; height:' + colHeight + 'px;}';
            styles += '#js-row .col:first-child {margin-left:0 !important;} ';
            styles += '#js-row .one {width:' + onecol + '% !important;}';

            // now insert the styles
            loadStyleString(styles);

            // generate columns
            generateCols(columns, onecolpx, gutterpx);

            // update width information
            docWidth.innerHTML = clientWidth + 'px Window width <br />' + browserWidth + 'px Browser width <br />' + w + ' Viewport width';

            // update row dimensions to a predefined option that is selected from the menu
            resize(w, h);
        };


    //initialize default state
    init();

}(window, document));