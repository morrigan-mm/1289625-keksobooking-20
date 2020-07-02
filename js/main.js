'use strict';

var MOCK_CHECK = ['12:00', '13:00', '14:00'];
var MOCK_FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
var MOCK_PHOTOS = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];
var MOCK_VOCABULARY = ['но', 'большинство', 'из', 'них', 'имеет', 'не', 'всегда', 'приемлемые', 'модификации', 'например', 'использовать', 'вычисление', 'получаемое'];

var PIN_OFFSET_WIDTH = 50;
var PIN_OFFSET_HEIGHT = 70;
var PIN_OFFSET_X = -PIN_OFFSET_WIDTH / 2;
var PIN_OFFSET_Y = -PIN_OFFSET_HEIGHT;

var TYPES = {
  palace: 'дворец',
  flat: 'квартира',
  house: 'дом',
  bungalo: 'бунгало'
};

var MOCK_AMOUNT = 8;

var map = document.querySelector('.map');
var mapPins = map.querySelector('.map__pins');
var mapPinsRect = mapPins.getBoundingClientRect();
var mapPinTemplate = document.querySelector('#pin').content.querySelector('.map__pin');
var mapPinMain = map.querySelector('.map__pin--main');
var mapPinX = Math.round(parseInt(mapPinMain.style.left, 10) - mapPinMain.offsetWidth / 2);
var mapPinY = Math.round(parseInt(mapPinMain.style.top, 10) - mapPinMain.offsetHeight);
var mapFilters = map.querySelector('.map__filters');
var adForm = document.querySelector('.ad-form');

// Моки.

var getRandomInt = function (min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

var getRandomElement = function (arr) {
  if (!arr.length) {
    return undefined;
  }

  var index = getRandomInt(0, arr.length - 1);

  return arr[index];
};

var getRandomWidthArr = function (arr) {
  var amount = getRandomInt(0, arr.length); // 1 - чтобы не было пустых строк, массивов
  var shuffled = shuffleArray(arr.slice());
  shuffled.length = amount;
  return shuffled;
};

var shuffleArray = function (arr) {
  for (var i = 0; i < arr.length; i++) {
    var index = getRandomInt(i, arr.length - 1);
    var temp = arr[i];
    arr[i] = arr[index];
    arr[index] = temp;
  }

  return arr;
};

var getRandomString = function (arr) {
  var str = getRandomWidthArr(arr);

  return str.join(' ');
};

var createAuthorObj = function (num) {
  return {
    avatar: 'img/avatars/user0' + num + '.png'
  };
};

var createOfferObj = function (location) {
  return {
    title: getRandomString(MOCK_VOCABULARY),
    address: location.x + ', ' + location.y,
    price: getRandomInt(1, 500000),
    type: getRandomElement(Object.keys(TYPES)),
    rooms: getRandomInt(1, 3),
    guests: getRandomInt(0, 2),
    checkin: getRandomElement(MOCK_CHECK),
    checkout: getRandomElement(MOCK_CHECK),
    features: getRandomWidthArr(MOCK_FEATURES),
    description: getRandomString(MOCK_VOCABULARY),
    photos: getRandomWidthArr(MOCK_PHOTOS)
  };
};

var createLocationObj = function () {
  return {
    x: getRandomInt(0, mapPinsRect.width),
    y: getRandomInt(130, 630)
  };
};

var getRandomMock = function (num) {
  var location = createLocationObj();

  return {
    location: location,
    author: createAuthorObj(num),
    offer: createOfferObj(location)
  };
};

var getPinMocks = function (amount) {
  var mocks = [];

  for (var i = 0; i < amount; i++) {
    var mock = getRandomMock(i + 1);
    mocks.push(mock);
  }

  return mocks;
};

// Рендеринг.

var renderMapPin = function (elem, i) {
  var mapPinElement = mapPinTemplate.cloneNode(true);
  var pinImg = mapPinElement.querySelector('img');
  mapPinElement.style.left = elem.location.x + PIN_OFFSET_X + 'px';
  mapPinElement.style.top = elem.location.y + PIN_OFFSET_Y + 'px';
  mapPinElement.dataset.pin = i;
  pinImg.src = elem.author.avatar;
  pinImg.alt = elem.offer.title;

  return mapPinElement;
};

var renderMapPins = function (pins) {
  var fragment = document.createDocumentFragment();

  for (var i = 0; i < pins.length; i++) {
    fragment.appendChild(renderMapPin(pins[i], i));
  }

  return fragment;
};

// Валидация.

var getCapacityValidity = function (capacity, rooms) {
  var capacityMessage = '';

  if (rooms === 1 && capacity !== 1) {
    capacityMessage = '1 комната подходит только для 1 гостя';
  } else if (rooms === 2 && capacity < 1 || capacity > 2) {
    capacityMessage = '2 комнаты подходят только для 1-2 гостей';
  } else if (rooms === 3 && capacity < 1 || capacity > 3) {
    capacityMessage = '3 комнаты подходят только для 1-3 гостей';
  } else if (rooms === 100 && capacity !== 0) {
    capacityMessage = '100 комнат не подходят для гостей';
  }

  return capacityMessage;
};

var minPrices = {
  'bungalo': 0,
  'flat': 1000,
  'house': 5000,
  'palace': 10000
};

var setMinPriceValue = function (input, accommodationType) {
  if (accommodationType in minPrices) {
    var value = minPrices[accommodationType];
    input.min = value;
    input.placeholder = value;
  }
};

var setTimeValues = function (input, timeIn, timeOut) {
  switch (input) {
    case timeIn:
      timeOut.value = input.value;
      break;
    case timeOut:
      timeIn.value = input.value;
      break;
  }
};

var validateForm = function () {
  var formData = new FormData(adForm);
  var accomodationType = formData.get('type');
  var rooms = parseInt(formData.get('rooms'), 10);
  var capacity = parseInt(formData.get('capacity'), 10);

  setTimeValues(document.activeElement, adForm.timein, adForm.timeout);
  setMinPriceValue(adForm.price, accomodationType);
  adForm.capacity.setCustomValidity(getCapacityValidity(capacity, rooms));
};

// Активация.

var setElementsActive = function (elementsList, active) {
  for (var i = 0; i < elementsList.length; i++) {
    if (active) {
      elementsList[i].removeAttribute('disabled');
    } else {
      elementsList[i].setAttribute('disabled', true);
    }
  }
};

var setFormsActive = function (active) {
  setElementsActive(mapFilters.children, active);
  setElementsActive(adForm.children, active);

  map.classList.toggle('map--faded', !active);
  adForm.classList.toggle('ad-form--disabled', !active);
};

var removeElement = function (element) {
  if (element.parentElement) {
    element.parentElement.removeChild(element);
  }
};

// Определяем поля карточки объявления и рендерим его

var setCardFeatures = function (elem, features) {
  var featuresList = elem.querySelectorAll('.popup__feature');

  for (var i = 0; i < featuresList.length; i++) {
    var isMatch = features.some(function (feature) {
      return featuresList[i].matches('.popup__feature--' + feature);
    });

    if (!isMatch) {
      removeElement(featuresList[i]);
    }
  }
};

var setCardPhotos = function (elem, photos) {
  var photo = elem.querySelector('.popup__photo');

  for (var i = 0; i < photos.length; i++) {
    photo.src = photos[i];
    elem.appendChild(photo);
    photo = photo.cloneNode();
  }
};

var setCardField = function (elem, checkValue, writeValue, setAttr) {
  writeValue = writeValue || checkValue;
  setAttr = setAttr || 'textContent';

  if (checkValue) {
    if (typeof setAttr === 'string') {
      elem[setAttr] = writeValue;
    } else {
      setAttr(elem, writeValue);
    }
  } else {
    removeElement(elem);
  }
};

var renderCard = function (pin) {
  var element = cardTemplate.cloneNode(true);
  var title = element.querySelector('.popup__title');
  var address = element.querySelector('.popup__text--address');
  var price = element.querySelector('.popup__text--price');
  var type = element.querySelector('.popup__type');
  var capacity = element.querySelector('.popup__text--capacity');
  var time = element.querySelector('.popup__text--time');
  var description = element.querySelector('.popup__description');
  var avatar = element.querySelector('.popup__avatar');
  var features = element.querySelector('.popup__features');
  var photos = element.querySelector('.popup__photos');

  setCardField(title, pin.offer.title);
  setCardField(address, pin.offer.address);
  setCardField(price, pin.offer.price, pin.offer.price + '₽/ночь');
  setCardField(type, pin.offer.type, TYPES[pin.offer.type]);
  setCardField(capacity, pin.offer.rooms && pin.offer.guests, pin.offer.rooms + ' комнаты для ' + pin.offer.guests + ' гостей');
  setCardField(time, pin.offer.checkin && pin.offer.checkout, 'Заезд после ' + pin.offer.checkin + ', выезд до ' + pin.offer.checkout);
  setCardField(description, pin.offer.description);
  setCardField(avatar, pin.author.avatar, null, 'src');
  setCardField(features, pin.offer.features && pin.offer.features.length !== 0, pin.offer.features, setCardFeatures);
  setCardField(photos, pin.offer.photos && pin.offer.photos.length !== 0, pin.offer.photos, setCardPhotos);

  var closeButton = element.querySelector('.popup__close');

  var remove = function () {
    removeElement(element);
    document.removeEventListener('keydown', onCardClose);
    closeButton.removeEventListener('click', onCardClose);
  };

  var onCardClose = function (evt) {
    if (evt.type === 'click' || evt.key === 'Escape') {
      evt.preventDefault();
      remove();
    }
  };

  document.addEventListener('keydown', onCardClose);
  closeButton.addEventListener('click', onCardClose);

  return {
    element: element,
    remove: remove
  };
};

var cardTemplate = document.querySelector('#card').content.querySelector('.map__card');

var main = function () {

  // Блочим все формы на старте.

  setFormsActive(false);

  // Устанавливаем начальные значения в форме и вешаем на нее обработчики.

  adForm.address.value = mapPinX + 'px, ' + mapPinY + 'px';

  adForm.addEventListener('change', function () {
    validateForm();
  });

  adForm.addEventListener('submit', function (evt) {
    validateForm();

    if (!adForm.checkValidity()) {
      evt.preventDefault();
    }
  });

  // Вешаем обработчик на активацию.

  var pinMocks = getPinMocks(MOCK_AMOUNT);

  var onInteract = function (evt) {
    if (evt.type === 'mousedown' && evt.button === 0 || evt.key === 'Enter') {
      evt.preventDefault();
      setFormsActive(true);
      mapPins.appendChild(renderMapPins(pinMocks));

      mapPinMain.removeEventListener('mousedown', onInteract);
      mapPinMain.removeEventListener('keydown', onInteract);
    }
  };

  mapPinMain.addEventListener('mousedown', onInteract);
  mapPinMain.addEventListener('keydown', onInteract);

  // Показ инфо-карточки.

  var card;
  var prevElement;

  map.addEventListener('click', function (evt) {
    var element = evt.target.closest('.map__pin:not(.map__pin--main)');

    if (element) {
      evt.preventDefault();
      if (prevElement && prevElement !== element) {
        prevElement.classList.remove('map__pin--active');
      }

      element.classList.add('map__pin--active');
      prevElement = element;

      if (card) {
        card.remove();
      }

      var pin = pinMocks[element.dataset.pin];
      card = renderCard(pin);
      map.insertBefore(card.element, map.querySelector('.map__filters-container'));
    }
  });

};

main();

