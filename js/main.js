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

var renderMapPin = function (elem) {
  var mapPinElement = mapPinTemplate.cloneNode(true);
  var pinImg = mapPinElement.querySelector('img');
  mapPinElement.style.left = elem.location.x + PIN_OFFSET_X + 'px';
  mapPinElement.style.top = elem.location.y + PIN_OFFSET_Y + 'px';
  pinImg.src = elem.author.avatar;
  pinImg.alt = elem.offer.title;

  return mapPinElement;
};

var renderMapPins = function (pins) {
  var fragment = document.createDocumentFragment();

  for (var i = 0; i < pins.length; i++) {
    fragment.appendChild(renderMapPin(pins[i]));
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

var validateForm = function () {
  var formData = new FormData(adForm);
  var rooms = parseInt(formData.get('rooms'), 10);
  var capacity = parseInt(formData.get('capacity'), 10);

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
};

/**
 * Можно передавать adForm, mapPinMain, mapPins, mapPinX, mapPinY, MOCK_AMOUNT параметрами, но не много ли их?
 * Может, лучше оставить без параметров?
 */

main();

/*
var setCardFeatures = function (elem, features) {
  var featuresList = elem.querySelectorAll('.popup__feature');

  for (var i = 0; i < featuresList.length; i++) {
    var isMatch = features.some(function (feature) {
      return featuresList[i].matches('.popup__feature--' + feature);
    });

    if (!isMatch) {
      featuresList[i].parentElement.removeChild(featuresList[i]);
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

var fillCard = function (card, elem) {
  var title = card.querySelector('.popup__title');
  var address = card.querySelector('.popup__text--address');
  var price = card.querySelector('.popup__text--price');
  var type = card.querySelector('.popup__type');
  var capacity = card.querySelector('.popup__text--capacity');
  var time = card.querySelector('.popup__text--time');
  var features = card.querySelector('.popup__features');
  var description = card.querySelector('.popup__description');
  var photos = card.querySelector('.popup__photos');
  var avatar = card.querySelector('.popup__avatar');

  if (elem.offer.title) {
    title.textContent = elem.offer.title;
  } else {
    title.parentElement.removeChild(title);
  }

  if (elem.offer.address) {
    address.textContent = elem.offer.address;
  } else {
    address.parentElement.removeChild(address);
  }

  if (elem.offer.price) {
    price.textContent = elem.offer.price + '₽/ночь';
  } else {
    price.parentElement.removeChild(price);
  }

  if (elem.offer.type) {
    type.textContent = TYPES[elem.offer.type];
  } else {
    type.parentElement.removeChild(type);
  }

  if (elem.offer.rooms && elem.offer.guests) {
    capacity.textContent = elem.offer.rooms + ' комнаты для ' + elem.offer.guests + ' гостей';
  } else {
    capacity.parentElement.removeChild(capacity);
  }

  if (elem.offer.checkin && elem.offer.checkout) {
    time.textContent = 'Заезд после ' + elem.offer.checkin + ', выезд до ' + elem.offer.checkout;
  } else {
    time.parentElement.removeChild(time);
  }

  if (elem.offer.description) {
    description.textContent = elem.offer.description;
  } else {
    description.parentElement.removeChild(description);
  }

  if (elem.author.avatar) {
    avatar.src = elem.author.avatar;
  } else {
    avatar.parentElement.removeChild(avatar);
  }

  if (elem.offer.features && elem.offer.features.length !== 0) {
    setCardFeatures(features, elem.offer.features);
  } else {
    features.parentElement.removeChild(features);
  }

  if (elem.offer.photos && elem.offer.photos.length !== 0) {
    setCardPhotos(photos, elem.offer.photos);
  } else {
    photos.parentElement.removeChild(photos);
  }
};

var cardTemplate = document.querySelector('#card').content.querySelector('.map__card');
var card = cardTemplate.cloneNode(true);

fillCard(card, getRandomMock(3));

map.insertBefore(card, map.querySelector('.map__filters-container'));
*/
