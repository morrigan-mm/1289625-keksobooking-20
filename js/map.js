'use strict';

(function () {
  var map = document.querySelector('.map');
  var mapPinMain = map.querySelector('.map__pin--main');
  var mapPins = map.querySelector('.map__pins');
  var mapFilters = map.querySelector('.map__filters');
  var mapFiltersContainer = map.querySelector('.map__filters-container');

  var setMapActive = function (active) {
    window.utils.setElementsActive(mapFilters.children, active);

    map.classList.toggle('map--faded', !active);
  };

  var initMap = function (data, onActivate) {
    var mapPinX = Math.round(parseInt(mapPinMain.style.left, 10) - mapPinMain.offsetWidth / 2);
    var mapPinY = Math.round(parseInt(mapPinMain.style.top, 10) - mapPinMain.offsetHeight);

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

        onActivate();
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

    return {
      address: {
        x: mapPinX,
        y: mapPinY
      }
    };
  };

  setMapActive(false);

  window.map = {
    initMap: initMap,
  };
})();
