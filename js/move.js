'use strict';

(function () {
  var initMove = function (handle, callback) {
    handle.addEventListener('mousedown', function (evt) {
      evt.preventDefault();

      callback('movestart');

      var startCoords = {
        x: evt.clientX,
        y: evt.clientY
      };

      var dragged = false;

      var onMouseMove = function (moveEvt) {
        moveEvt.preventDefault();

        dragged = true;

        var shift = {
          x: moveEvt.clientX - startCoords.x,
          y: moveEvt.clientY - startCoords.y
        };

        callback('move', shift);
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

        callback('moveend');
      };

      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    });
  };

  window.move = {
    initMove: initMove
  };
})();
