'use strict';

(function () {
  var removeElement = function (element) {
    if (element.parentElement) {
      element.parentElement.removeChild(element);
    }
  };

  var setElementsActive = function (elementsList, active) {
    for (var i = 0; i < elementsList.length; i++) {
      if (active) {
        elementsList[i].removeAttribute('disabled');
      } else {
        elementsList[i].setAttribute('disabled', true);
      }
    }
  };

  window.utils = {
    removeElement: removeElement,
    setElementsActive: setElementsActive
  };
})();
