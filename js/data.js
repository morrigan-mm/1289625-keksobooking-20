'use strict';

(function () {
  var MIN_PRICES = {
    'bungalo': 0,
    'flat': 1000,
    'house': 5000,
    'palace': 10000
  };

  var TYPES = {
    'palace': 'дворец',
    'flat': 'квартира',
    'house': 'дом',
    'bungalo': 'бунгало'
  };

  window.data = {
    MIN_PRICES: MIN_PRICES,
    TYPES: TYPES,
  };
})();
