'use strict';

(function () {
  var PIN_MAIN_OFFSET = 18;
  var PIN_MAIN_MIN_X = 0;
  var PIN_MAIN_MIN_Y = 130;
  var PIN_MAIN_MAX_Y = 630;

  var map = document.querySelector('.map');
  var mapPinMain = map.querySelector('.map__pin--main');
  var mapPins = map.querySelector('.map__pins');
  var mapFilters = map.querySelector('.map__filters');
  var mapFiltersContainer = map.querySelector('.map__filters-container');

  var setMapActive = function (active) {
    window.utils.setElementsActive(mapFilters.children, active);

    map.classList.toggle('map--faded', !active);
  };

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

  var initMap = function (data, onAddressChange) {
    var address = getInitialAddress();

    var activeCard;
    var activePin;
    var pins;

    var onPinMainClick = function (evt) {
      if (evt.type === 'mousedown' && evt.button === 0 || evt.key === 'Enter') {
        evt.preventDefault();

        mapPinMain.removeEventListener('mousedown', onPinMainClick);
        mapPinMain.removeEventListener('keydown', onPinMainClick);

        pins = renderPins();

        mapPins.appendChild(pins.fragment);

        setMapActive(true);

        var activeAddress = {
          x: address.x,
          y: Math.floor(address.y + mapPinMain.offsetHeight / 2 + PIN_MAIN_OFFSET),
        };

        setAddress(activeAddress.x, activeAddress.y);

        onAddressChange();
      }
    };

    var onCardClose = function (index) {
      var pin = pins.pinArray[index];

      pin.setActive(false);

      activePin = null;
      activeCard = null;
    };

    var onPinClick = function (index) {
      var dataItem = data[index];
      var pin = pins.pinArray[index];

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

      activeCard = window.card.renderCard(dataItem, index, onCardClose);

      map.insertBefore(activeCard.element, mapFiltersContainer);

      activePin.setActive(true);
    };

    var getAddress = function () {
      return {
        x: address.x,
        y: address.y
      };
    };

    var setAddress = function (x, y) {
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

      address.x = x;
      address.y = y;

      var top = y - mapPinMain.offsetHeight - PIN_MAIN_OFFSET;
      var left = x - mapPinMain.offsetWidth / 2;

      mapPinMain.style.top = top + 'px';
      mapPinMain.style.left = left + 'px';
    };

    var renderPins = function () {
      var result = {
        fragment: document.createDocumentFragment(),
        pinArray: [],
      };

      for (var i = 0; i < data.length; i++) {
        var pin = window.pin.renderPin(data[i], i, onPinClick);
        result.fragment.appendChild(pin.element);
        result.pinArray.push(pin);
      }

      return result;
    };

    setMapActive(false);

    mapPinMain.addEventListener('mousedown', onPinMainClick);
    mapPinMain.addEventListener('keydown', onPinMainClick);

    var moveStartAddress;

    window.move.initMove(mapPinMain, function (stage, shift) {
      if (stage === 'movestart') {
        moveStartAddress = getAddress();
      }
      if (stage === 'move') {
        var x = moveStartAddress.x + shift.x;
        var y = moveStartAddress.y + shift.y;
        setAddress(x, y);
        onAddressChange();
      }
      if (stage === 'moveend') {
        return;
      }
    });

    return {
      getAddress: getAddress
    };
  };

  setMapActive(false);

  window.map = {
    initMap: initMap,
  };
})();
