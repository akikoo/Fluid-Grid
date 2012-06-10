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
    var jsRow           = doc.getElementById('js-row'),     // Row that contains dynamically generated rows, based on user input
        row             = doc.getElementsByClassName('row'),// Rows that demonstrate a static nested grid
        defaultColumns  = 12,                               // Default column number
        defaultGutter   = 4,                                // Default gutter width (%)
        form            = doc.getElementById('updategrid'), // Configurator form 
        formToggle      = doc.getElementById('toggle'),     // Form visibility toggle
        eventUtil       = {                                 // Event util

            addHandler: function (element, type, handler) {
                if (element.addEventListener) { // W3C
                    element.addEventListener(type, handler, false);
                } else if (element.attachEvent) { // IE
                    element.attachEvent("on" + type, handler);
                } else {
                    element["on" + type] = handler;
                }
            },

            removeHandler: function (element, type, handler) {
                if (element.removeEventListener) {
                    element.removeEventListener(type, handler, false);
                } else if (element.detachEvent) {
                    element.detachEvent("on" + type, handler);
                } else {
                    element["on" + type] = null;
                }
            },

            // Get event element
            getEvent: function (e) {
                return e || window.event; // Dom event object || IE event object
            },

            // Get source element
            getTarget: function (e) {
                return e.target || e.srcElement; // Dom event object || IE event object
            },

            // Prevent default action
            preventDefault: function (e) {
                if (e.preventDefault) { // Dom event object
                    e.preventDefault();
                } else { // IE event object
                    e.returnValue = false;
                }
            },

            // Cancel event bubbling
            stopPropagation: function (e) {
                if (e.stopPropagation) { // Dom event object
                    e.stopPropagation();
                } else { // IE event object
                    e.cancelBubble = true;
                }
            }
        },

        // Initialization
        init = function () {

            // Form markup
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

            // Insert form
            form.innerHTML = formMarkup;

            // Hide dynamic rows
            jsRow.style.display = 'none';

            // Attach events
            // Submit form
            eventUtil.addHandler(form, "submit", function (e) {

                // Get event object
                e = eventUtil.getEvent(e);

                // Prevent form submission
                eventUtil.preventDefault(e);

                // Update values
                getValues();
            });

            // Reset form
            eventUtil.addHandler(form, "reset", function (e) {

                // Get event object
                e = eventUtil.getEvent(e);

                // Reset the form to default values
                reset();
            });

            // Click the form visiblity toggle
            eventUtil.addHandler(formToggle, "click", function (e) {

                // Get event object
                e = eventUtil.getEvent(e);

                // Manage visibility
                toggleVisibility(e);
            });

            // Resize window
            eventUtil.addHandler(window, "resize", function (e) {

                // Get event object
                e = eventUtil.getEvent(e);

                // Calculate widths
                getValues();
            });

            // Calculate widths
            getValues();
        },


        // Generate stylesheet and insert it in the document head
        loadStyleString = function (css) {
            var head    = doc.getElementsByTagName("head")[0],
                style   = doc.createElement("style");
            style.type  = "text/css";
            try {
                style.appendChild(doc.createTextNode(css));
            } catch (ex) { // IE
                style.styleSheet.cssText = css;
            }
            head.appendChild(style);
        },

        // Write columns dynamically based on user input
        generateCols = function (num, onecolpx, gutterpx) {
            var i,
                cols = "";
            for (i = 0; i < num; i += 1) {
                cols += '<div class="col one">' + onecolpx + 'px - ' + gutterpx + 'px</div>';
            }

            // Insert columns
            jsRow.innerHTML = cols;
        },

        // Resize the row container to the selected width and height
        resize = function (w, h) {
            jsRow.style.width   = (w === '') ? '100%' : w + 'px';
            jsRow.style.height  = (h === '') ? '100%' : h + 'px';
        },

        // Reset form, calculate default values and update
        reset = function () {
            var selectbox = doc.forms[0].resolution;

            // Reset the form 
            form.reset();

            // Set default values
            form.elements[0].value = defaultColumns;
            form.elements[1].value = defaultGutter;
            selectbox.options[0].selected = true;

            // Calculate again
            getValues();
        },

        // Handle the form and row visibility
        toggleVisibility = function (e) {
            var elm         = form,                                 // Configuration form
                linkText    = e.target.firstChild.nodeValue,        // Link content
                title       = e.target.title,                       // Link title attribute
                i,                                                  // Counter
                l           = row.length;                           // Number of rows

            // Toggle text and title ttribute content
            e.target.firstChild.nodeValue = (linkText === '+') ? '-' : '+';
            e.target.title = (title === 'Open grid configurator') ? 'Close grid configurator' : 'Open grid configurator';

            // Toggle visibility
            if (elm.style.display === 'block') {

                elm.style.display = 'none';         // Hide form
                form.reset();                       // Reset form

                for (i = 1; i < l; i += 1) {
                    row[i].style.display = 'block'; // Show static rows
                }
                jsRow.style.display = 'none';       // Hide dynamic row

            } else {

                elm.style.display = 'block';        // Show form

                for (i = 1; i < l; i += 1) {
                    row[i].style.display = 'none';  // Hide static rows
                }
                jsRow.style.display = 'block';      // Show dynamic row
            }
        },

        // Calculate new values
        getValues = function () {

            var columns         = form.elements[0].value,                       // Number of columns, based on user input
                gutter          = form.elements[1].value,                       // Gutter width in %, based on user input
                onecol          = (100 - (gutter * (columns - 1))) / columns,   // Column width in % 
                clientWidth     = doc.documentElement.clientWidth,              // Viewport width, no scrollbars
                clientHeight    = doc.documentElement.clientHeight,             // Viewport height, no scrollbars
                browserWidth    = window.innerWidth,                            // Browser window width, including scrollbars
                onecolpx        = Math.round((onecol / 100) * clientWidth),     // Column width in px
                gutterpx        = Math.round((gutter / 100) * clientWidth),     // Gutter width  in %
                docWidth        = doc.getElementById('docWidth'),               // Placeholder for browser and document widths
                styles          = '',                                           // Styles to write
                selectbox       = doc.forms[0].resolution,                      // Resolutions select box
                selectedIndex   = selectbox.selectedIndex,                      // Currently selected index
                selectedOption  = selectbox.options[selectbox.selectedIndex],   // Currently selected option element
                selValue        = selectedOption.value,                         // Currently selected option value
                dimensions      = selValue.split(', '),                         // Array of width and height
                w               = dimensions[0],                                // Selected width
                h               = dimensions[1],                                // Selected height
                colHeight       = dimensions[1] || clientHeight;                // Selected height; otherwise viewport height

            styles += '#toggle {position:absolute; top:40px; left:10px; border:1px solid #ddd; z-index:1; background:#eee; text-decoration:none; padding:0 10px; font-size:18px; border-radius:5px;}';
            styles += '#updategrid {position:absolute; top:0; left:0; width:180px; background:#eee; padding:45px 10px 10px;}';
            styles += '#docWidth {font-size: 14px; margin:0 0 10px; color:#999; display:block;}';
            styles += '#js-row {background:#fff;}';
            styles += '#js-row .col {margin:0 0 0 ' + gutter + '% !important; height:' + colHeight + 'px;}';
            styles += '#js-row .col:first-child {margin-left:0 !important;} ';
            styles += '#js-row .one {width:' + onecol + '% !important;}';

            // Now insert the styles
            loadStyleString(styles);

            // Generate columns
            generateCols(columns, onecolpx, gutterpx);

            // Update width information
            docWidth.innerHTML = clientWidth + 'px Window width <br />' + browserWidth + 'px Browser width <br />' + w + ' Viewport width';

            // Update row dimensions to a predefined option that is selected from the menu
            resize(w, h);
        };

    // Initialize default state
    init();

}(window, document));