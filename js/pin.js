'use strict';

(function () {
  var PIN_OFFSET_WIDTH = 50;
  var PIN_OFFSET_HEIGHT = 70;
  var PIN_OFFSET_X = -PIN_OFFSET_WIDTH / 2;
  var PIN_OFFSET_Y = -PIN_OFFSET_HEIGHT;
  var mapPinTemplate = document.querySelector('#pin').content.querySelector('.map__pin');

  var renderPin = function (dataItem, onClick) {
    var element = mapPinTemplate.cloneNode(true);
    var pinImg = element.querySelector('img');
    element.style.left = dataItem.location.x + PIN_OFFSET_X + 'px';
    element.style.top = dataItem.location.y + PIN_OFFSET_Y + 'px';
    element.dataset.pin = dataItem.id;
    pinImg.src = dataItem.author.avatar;
    pinImg.alt = dataItem.offer.title;

    var setActive = function (active) {
      element.classList.toggle('map__pin--active', active);
    };

    element.addEventListener('click', function (evt) {
      evt.preventDefault();
      onClick(dataItem);
    });

    return {
      element: element,
      setActive: setActive,
    };
  };

  window.pin = {
    renderPin: renderPin
  };
})();

