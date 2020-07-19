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

    if (housingPrice.value !== 'any') {
      if (housingPrice.value === 'low') {
        newFiltersObj.price = {from: 0, to: 10000};
      }
      if (housingPrice.value === 'middle') {
        newFiltersObj.price = {from: 10000, to: 50000};
      }
      if (housingPrice.value === 'high') {
        newFiltersObj.price = {from: 50000, to: 1000000};
      }
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

  mapFilters.addEventListener('change', function () {
    if (callback) {
      callback(parseFilters());
    }
  });

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
