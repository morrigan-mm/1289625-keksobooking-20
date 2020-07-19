'use strict';

(function () {
  var PIN_MAIN_OFFSET = 18;

  var map = document.querySelector('.map');
  var mapPinMain = map.querySelector('.map__pin--main');
  var mapPins = map.querySelector('.map__pins');
  var mapFilters = map.querySelector('.map__filters');
  var mapFiltersContainer = map.querySelector('.map__filters-container');

  var getInitialAddress = function () {
    var markerTop = parseInt(mapPinMain.style.top, 10);
    var markerLeft = parseInt(mapPinMain.style.left, 10);

    var xCenter = Math.round(markerLeft + mapPinMain.offsetWidth / 2);
    var yCenter = Math.round(markerTop + mapPinMain.offsetHeight / 2);

    return {
      x: xCenter,
      y: yCenter
    };
  };

  var initial = {
    address: getInitialAddress(),
    markerTop: mapPinMain.offsetTop,
    markerLeft: mapPinMain.offsetLeft
  };

  var initMap = function (onAddressChange) {
    var isActive = false;

    var address = {
      x: initial.address.x,
      y: initial.address.y,
    };

    var activeCard;
    var activePin;
    var pins;

    var data = [];

    var clearPins = function () {
      pins = {
        fragment: document.createDocumentFragment(),
        pinObj: {},
      };

      Array.from(mapPins.querySelectorAll('.map__pin:not(.map__pin--main)'))
        .forEach(window.utils.removeElement);

      if (activeCard) {
        activeCard.remove();
        activeCard = null;
      }
    };

    var setMapActive = function (active) {
      map.classList.toggle('map--faded', !active);

      if (!active) {
        window.filters.resetFilters();
        window.utils.setElementsActive(mapFilters.children, !active);
        mapPinMain.style.top = initial.markerTop + 'px';
        mapPinMain.style.left = initial.markerLeft + 'px';
        clearPins();
        setAddress(initial.address);
      }

      isActive = active;
    };

    var applyFilters = function (items, filters) {
      return items.filter(function (item) {
        if (filters.type && filters.type !== item.offer.type) {
          return false;
        }
        if (filters.price && (filters.price.from > item.offer.price || filters.price.to < item.offer.price)) {
          return false;
        }
        if (filters.rooms && filters.rooms !== item.offer.rooms) {
          return false;
        }
        if ((filters.guests || filters.guests === 0) && filters.guests !== item.offer.guests) {
          return false;
        }

        return filters.features.every(function (feature) {
          return item.offer.features.includes(feature);
        });
      });
    };

    var onSuccessLoad = function (serverData) {
      data = serverData.filter(function (item, index) {
        if (item.offer) {
          item.id = index;
          return true;
        }
        return false;
      });

      if (data.length > 0) {
        window.utils.setElementsActive(mapFilters.children, true);
        window.filters.initFilters(function (filters) {
          renderPins(applyFilters(data, filters));
        });

        renderPins(data);
      }
    };

    var onErrorLoad = function (errorMessage) {
      window.message.errorMessage(errorMessage);
    };

    var onPinMainClick = function (evt) {
      if (isActive) {
        return;
      }

      if (evt.type === 'mousedown' && evt.button === 0 || evt.key === 'Enter') {
        evt.preventDefault();

        if (data.length === 0) {
          window.server.load(onSuccessLoad, onErrorLoad);
        } else {
          onSuccessLoad(data);
        }

        setMapActive(true);

        var activeAddress = {
          x: address.x,
          y: Math.floor(address.y + mapPinMain.offsetHeight / 2 + PIN_MAIN_OFFSET),
        };

        setAddress(activeAddress);

        onAddressChange();
      }
    };

    var onCardClose = function (dataItem) {
      var pin = pins.pinObj[dataItem.id];

      pin.setActive(false);

      activePin = null;
      activeCard = null;
    };

    var onPinClick = function (dataItem) {
      var pin = pins.pinObj[dataItem.id];

      if (activePin === pin) {
        return;
      }

      if (activePin) {
        activePin.setActive(false);
      }

      if (activeCard) {
        activeCard.remove();
      }

      activePin = pin;

      activeCard = window.card.renderCard(dataItem, onCardClose);

      map.insertBefore(activeCard.element, mapFiltersContainer);

      activePin.setActive(true);
    };

    var getAddress = function () {
      return {
        x: address.x,
        y: address.y
      };
    };

    var setAddress = function (newAddress) {
      address.x = newAddress.x;
      address.y = newAddress.y;
    };

    var renderPins = function (items) {
      clearPins();

      var amount = Math.min(items.length, 5);

      for (var i = 0; i < amount; i++) {
        var item = items[i];
        var pin = window.pin.renderPin(item, onPinClick);
        pins.fragment.appendChild(pin.element);
        pins.pinObj[item.id] = pin;
      }

      mapPins.appendChild(pins.fragment);
    };

    mapPinMain.addEventListener('mousedown', onPinMainClick);
    mapPinMain.addEventListener('keydown', onPinMainClick);

    window.move.initMove(mapPinMain, function (moveAddress) {
      setAddress(moveAddress);
      onAddressChange();
    });

    return {
      getAddress: getAddress,
      setMapActive: setMapActive
    };
  };

  window.map = {
    initMap: initMap,
  };
})();
