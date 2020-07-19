'use strict';

(function () {
  var debounce = function (cb, delay) {
    var timeoutId = null;

    return function fnDebounced() {
      var parameters = arguments;

      if (timeoutId) {
        window.clearTimeout(timeoutId);
      }

      timeoutId = window.setTimeout(function () {
        cb.apply(null, parameters);
      }, delay);
    };
  };

  window.debounce = debounce;
})();
