'use strict';

(function () {
  var PIN_MAIN_OFFSET = 18;
  var PIN_MAIN_MIN_X = 0;
  var PIN_MAIN_MIN_Y = 130;
  var PIN_MAIN_MAX_Y = 630;

  var map = document.querySelector('.map');

  var setCoords = function (actualAddress, shift) {
    var x = actualAddress.x + shift.x;
    var y = actualAddress.y + shift.y;

    if (x < PIN_MAIN_MIN_X) {
      x = PIN_MAIN_MIN_X;
    } else if (x > map.offsetWidth) {
      x = map.offsetWidth;
    }
    if (y < PIN_MAIN_MIN_Y) {
      y = PIN_MAIN_MIN_Y;
    } else if (y > PIN_MAIN_MAX_Y) {
      y = PIN_MAIN_MAX_Y;
    }

    return {
      x: x,
      y: y
    };
  };

  var initMove = function (handle, callback) {
    handle.addEventListener('mousedown', function (evt) {
      evt.preventDefault();

      var startCoords = {
        x: evt.clientX,
        y: evt.clientY
      };

      var bottomHandleCoords = {
        x: Math.floor(handle.offsetLeft + handle.offsetWidth / 2),
        y: handle.offsetTop + handle.offsetHeight + PIN_MAIN_OFFSET
      };

      var dragged = false;

      var onMouseMove = function (moveEvt) {
        moveEvt.preventDefault();

        dragged = true;

        var shift = {
          x: moveEvt.clientX - startCoords.x,
          y: moveEvt.clientY - startCoords.y
        };

        var moveAddress = setCoords(bottomHandleCoords, shift);

        var top = moveAddress.y - (handle.offsetHeight + PIN_MAIN_OFFSET);
        var left = moveAddress.x - handle.offsetWidth / 2;

        handle.style.top = top + 'px';
        handle.style.left = left + 'px';

        callback(moveAddress);
      };

      var onMouseUp = function (upEvt) {
        upEvt.preventDefault();

        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);

        if (dragged) {
          var onClickPreventDefault = function (clickEvt) {
            clickEvt.preventDefault();
            handle.removeEventListener('click', onClickPreventDefault);
          };

          handle.addEventListener('click', onClickPreventDefault);
        }
      };

      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    });
  };

  window.move = {
    initMove: initMove
  };
})();
