'use strict';

var MOCK_TYPE = ['palace', 'flat', 'house', 'bungalo'];
var MOCK_CHECK = ['12:00', '13:00', '14:00'];
var MOCK_FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
var MOCK_PHOTOS = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];
var MOCK_VOCABULARY = ['но', 'большинство', 'из', 'них', 'имеет', 'не', 'всегда', 'приемлемые', 'модификации', 'например', 'использовать', 'вычисление', 'получаемое'];

var PIN_OFFSET_WIDTH = 50;
var PIN_OFFSET_HEIGHT = 70;
var PIN_OFFSET_X = -PIN_OFFSET_WIDTH / 2;
var PIN_OFFSET_Y = -PIN_OFFSET_HEIGHT;

var map = document.querySelector('.map');
var mapPins = map.querySelector('.map__pins');
var mapPinsRect = mapPins.getBoundingClientRect();
var mapPinTemplate = document.querySelector('#pin').content.querySelector('.map__pin');

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
  var amount = getRandomInt(1, arr.length); // 1 - чтобы не было пустых строк, массивов
  var newArr = arr.slice();
  var result = [];

  for (var i = 0; i < amount; i++) {
    var index = getRandomInt(0, newArr.length - 1);
    var removed = newArr.splice(index, 1);
    var element = removed[0];
    result.push(element);
  }

  return result;
};

var getRandomString = function (arr) {
  var str = getRandomWidthArr(arr);

  return str.join(' ');
};

var createAuthorObj = function (num) {
  var obj = {};
  obj.avatar = 'img/avatars/user0' + num + '.png';

  return obj;
};

var createOfferObj = function (location) {
  var obj = {};
  obj.title = getRandomString(MOCK_VOCABULARY);
  obj.address = location.x + ', ' + location.y;
  obj.price = getRandomInt(1, 500000);
  obj.type = getRandomElement(MOCK_TYPE);
  obj.rooms = getRandomInt(1, 3);
  obj.guests = getRandomInt(0, 2);
  obj.checkin = getRandomElement(MOCK_CHECK);
  obj.checkout = getRandomElement(MOCK_CHECK);
  obj.features = getRandomWidthArr(MOCK_FEATURES);
  obj.description = getRandomString(MOCK_VOCABULARY);
  obj.photos = getRandomWidthArr(MOCK_PHOTOS);

  return obj;
};

var createLocationObj = function () {
  var obj = {};
  obj.x = getRandomInt(0, mapPinsRect.width);
  obj.y = getRandomInt(130, 630);

  return obj;
};

var getRandomMock = function (num) {
  var obj = {};
  obj.location = createLocationObj();
  obj.author = createAuthorObj(num);
  obj.offer = createOfferObj(obj.location);

  return obj;
};

var getPinMocks = function (amount) {
  var mocks = [];

  for (var i = 0; i < amount; i++) {
    var mock = getRandomMock(i + 1);
    mocks.push(mock);
  }

  return mocks;
};

var renderMapPin = function (elem) {
  var mapPinElement = mapPinTemplate.cloneNode(true);
  var pinImg = mapPinElement.querySelector('img');
  mapPinElement.style.left = elem.location.x + PIN_OFFSET_X + 'px';
  mapPinElement.style.top = elem.location.y + PIN_OFFSET_Y + 'px';
  pinImg.src = elem.author.avatar;
  pinImg.alt = elem.offer.title;

  return mapPinElement;
};

var renderMapPins = function (amount) {
  var mockArr = getPinMocks(amount);
  var fragment = document.createDocumentFragment();

  for (var i = 0; i < mockArr.length; i++) {
    fragment.appendChild(renderMapPin(mockArr[i]));
  }

  return fragment;
};

map.classList.remove('map--faded');

mapPins.appendChild(renderMapPins(8));


