'use strict';

(function () {
  var mapFilters = document.querySelector('.map__filters');

  var parseFilters = function () {
    var newFiltersObj = {};

    var housingType = mapFilters['housing-type'];
    var housingRooms = mapFilters['housing-rooms'];
    var housingPrice = mapFilters['housing-price'];
    var housingGuests = mapFilters['housing-guests'];
    var housingFeatures = mapFilters['housing-features'];

    if (housingType.value !== 'any') {
      newFiltersObj.type = housingType.value;
    }

    if (housingRooms.value !== 'any') {
      newFiltersObj.rooms = parseInt(housingRooms.value, 10);
    }

    switch (housingPrice.value) {
      case 'low':
        newFiltersObj.price = {from: 0, to: 10000};
        break;
      case 'middle':
        newFiltersObj.price = {from: 10000, to: 50000};
        break;
      case 'high':
        newFiltersObj.price = {from: 50000, to: 1000000};
        break;
    }

    if (housingGuests.value !== 'any') {
      newFiltersObj.guests = parseInt(housingGuests.value, 10);
    }

    newFiltersObj.features = Array.from(housingFeatures.querySelectorAll(':checked'))
      .map(function (input) {
        return input.value;
      });

    return newFiltersObj;
  };

  var callback;

  mapFilters.addEventListener('change', window.debounce(function () {
    if (callback) {
      callback(parseFilters());
    }
  }, 500));

  mapFilters.addEventListener('submit', function (evt) {
    evt.preventDefault();
  });

  var initFilters = function (onChange) {
    callback = onChange;
  };

  var resetFilters = function () {
    mapFilters.reset();
  };

  window.filters = {
    initFilters: initFilters,
    resetFilters: resetFilters
  };
})();
