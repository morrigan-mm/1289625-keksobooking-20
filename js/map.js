'use strict';

(function () {
  var PIN_MAIN_OFFSET = 18;

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

  var initMap = function (onAddressChange) {
    var address = getInitialAddress();

    var activeCard;
    var activePin;
    var pins;

    var data = [];

    var onSuccessLoad = function (serverData) {
      data = serverData;
      pins = renderPins();
      mapPins.appendChild(pins.fragment);
    };

    var onErrorLoad = function (errorMessage) {
      window.message.errorMessage(errorMessage);
    };

    var onPinMainClick = function (evt) {
      if (evt.type === 'mousedown' && evt.button === 0 || evt.key === 'Enter') {
        evt.preventDefault();

        mapPinMain.removeEventListener('mousedown', onPinMainClick);
        mapPinMain.removeEventListener('keydown', onPinMainClick);

        window.load(onSuccessLoad, onErrorLoad);

        setMapActive(true);

        var activeAddress = {
          x: address.x,
          y: Math.floor(address.y + mapPinMain.offsetHeight / 2 + PIN_MAIN_OFFSET),
        };

        setAddress(activeAddress);

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

    var setAddress = function (newAddress) {
      address.x = newAddress.x;
      address.y = newAddress.y;
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

    window.move.initMove(mapPinMain, function (moveAddress) {
      setAddress(moveAddress);
      onAddressChange();
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
