/**

  NUNUX Orbino

  Copyright (c) 2014 Nicolas CARLIER (https://github.com/ncarlier)

  This program is free software: you can redistribute it and/or modify
  it under the terms of the GNU General Public License as published by
  the Free Software Foundation, either version 3 of the License.

  This program is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
  GNU General Public License for more details.

  You should have received a copy of the GNU General Public License
  along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

/* global $, alert, tinycolor, window, toastr */

'use strict';

$(function() {
  var $hueBar = $('#hue-bar');
  var $svBox = $('#sv-box');
  var $hueCursor = $('#hue-cursor');

  var drawHueBar = function() {
    //Get a 2d context to the hue bar canvas element.
    var ctx = $hueBar[0].getContext('2d');
    //get the multiplyer for the hue range based on the height of the hue bar.
    var hSteps = 360 / ctx.canvas.height;
    var hColor = tinycolor({ h: 0, s: 100, v: 100 });
    //Iterate over the hight of the hue bar filling 1px tall areas
    //with the proper hue.
    for(var hi = ctx.canvas.height; hi > 0; hi--){
      //Get the color for the hew at this iteration.
      hColor = tinycolor({ h: hi*hSteps, s: 100, v: 100 });
      //Set the context's fillStyle to the color.
      ctx.fillStyle = hColor.toHexString();
      //fill from the left of the hue bar, to the width of the hue bar
      //with the offset hi pixels from the bottom with a height of 1px.
      ctx.fillRect(0, ctx.canvas.height - hi, ctx.canvas.width, 1);
    }
  }();

  var drawSVBox = function drawSVBox(hue) {
    hue = hue || 1;
    //Get a 2d context to the hue bar canvas element.
    var ctx = $svBox[0].getContext('2d');
    //Get the rgb multiplyer for the number of steps over the height of the SVBox
    var vSteps = 255 / ctx.canvas.height;
    //Get the value multiplyer for the number of steps over the height of the SVBox 
    var svSteps = 100 / ctx.canvas.height;
    //Create a new color for calculating each rows color ranges.
    var svColor = tinycolor({ h: hue, s: 100, v: 100 });
    //Iterate over the hieght of the SVBox.
    for(var vi =  ctx.canvas.height; vi > 0; vi--){
      //Set the brightness for this row
      svColor = tinycolor({ h: hue, s: 100, v: vi*svSteps });
      //Create a new linear Gradient from the canvas context that goes
      //from the left to the right.
      var myLinearGrad = ctx.createLinearGradient(0, 0, ctx.canvas.width, 0);
      //Add a color stop to the gradient that is the current
      //bright ness no need to to the HSV conversion here 
      myLinearGrad.addColorStop(0, "rgb("+vi+","+vi+","+vi+")"); 
      //Add a color stop that is based on the current Hue
      myLinearGrad.addColorStop(1, svColor.toHexString()); 
      //Set the canvas context's fill style to our current gradient.
      ctx.fillStyle = myLinearGrad;
      //Fill the row at 1px high.
      ctx.fillRect(0, ctx.canvas.height - vi, ctx.canvas.height, 1);
    }
  };
  drawSVBox();

  var updateColor = function updateColor(color) {
    $('#submit').text(color).css('background', color);
  };

  var onHueBarChange = function(y) {
    //Get a 2d context to the SVBox canvas element.
    var ctx = $hueBar[0].getContext('2d');
    //Get the coordinates for our hue bar.
    var boxCoords = $hueBar.offset();
    //subtract the left and top of the hue bar from the event.clentX and y then add the window.scrollX and Y
    // to get the click position in the Hue bar and pass those in to the contexts getImageData function.
    var myImageData = ctx.getImageData(1, y - boxCoords.top + window.scrollY, 1, 1);
    //Create a hue color based of the ImageData returned by the getImageData function.
    var color = tinycolor({r: myImageData.data[0], g:myImageData.data[1], b:myImageData.data[2]});
    drawSVBox(color.toHsv().h);
  };

  var svBoxEnabled = false;
  var onSVBoxChange = function(e) {
    if (!svBoxEnabled) return;
    var ctx = $svBox[0].getContext('2d');
    var boxCoords = $svBox.offset();
    var myImageData = ctx.getImageData(e.clientX - boxCoords.left + window.scrollX, e.clientY - boxCoords.top + window.scrollY, 1, 1);
    var color = tinycolor({r: myImageData.data[0], g:myImageData.data[1], b:myImageData.data[2]});
    updateColor(color.toHexString());
  };

  $('body').on('mouseup', function() {
    svBoxEnabled = false;
  });

  $hueBar.on('click', function(e) {
    var offset = $hueCursor.offset();
    offset.top = e.clientY + window.scrollY - 12;
    $hueCursor.offset(offset);
    onHueBarChange(offset.top);
  });

  $svBox.on('mousedown', function() {
    svBoxEnabled = true;
  });
  $svBox.on('mousemove mouseup', onSVBoxChange);

  var hueBarOffset = $hueBar.offset();
  $hueCursor.drag('start', function(ev, dd) {
    dd.limit = {top: -12, bottom: $hueBar.height() - 12};
  }).drag(function(ev, dd) {
    var y = Math.min(dd.limit.bottom,
                     Math.max(dd.limit.top, dd.offsetY - hueBarOffset.top));
                     $(this).css({top: y});
                     onHueBarChange(y + hueBarOffset.top + 12);
  });

  $.ajaxSetup({dataType: 'json'});
  $('#submit').click(function(event) {
    /* stop form from submitting normally */
    event.preventDefault(); 
    /* get some values from elements on the page: */
    var $a = $(this),
    color = $a.text();
    $.post('/color', {color: color}, function(data) {
      if (data.error) {
        return toastr.error(data.error);
      }
      toastr.success(data.status);
    });
    return false;
  });
});
