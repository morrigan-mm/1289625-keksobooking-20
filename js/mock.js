'use strict';

(function () {
  var MOCK_CHECK = ['12:00', '13:00', '14:00'];
  var MOCK_FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
  var MOCK_PHOTOS = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];
  var MOCK_VOCABULARY = ['но', 'большинство', 'из', 'них', 'имеет', 'не', 'всегда', 'приемлемые', 'модификации', 'например', 'использовать', 'вычисление', 'получаемое'];

  var TYPES = {
    palace: 'дворец',
    flat: 'квартира',
    house: 'дом',
    bungalo: 'бунгало'
  };

  var map = document.querySelector('.map');
  var mapPins = map.querySelector('.map__pins');
  var mapPinsRect = mapPins.getBoundingClientRect();

  var createAuthorObj = function (num) {
    return {
      avatar: 'img/avatars/user0' + num + '.png'
    };
  };

  var createLocationObj = function () {
    return {
      x: window.random.getRandomInt(0, mapPinsRect.width),
      y: window.random.getRandomInt(130, 630)
    };
  };

  var createOfferObj = function (location) {
    return {
      title: window.random.getRandomString(MOCK_VOCABULARY),
      address: location.x + ', ' + location.y,
      price: window.random.getRandomInt(1, 500000),
      type: window.random.getRandomElement(Object.keys(TYPES)),
      rooms: window.random.getRandomInt(1, 3),
      guests: window.random.getRandomInt(0, 2),
      checkin: window.random.getRandomElement(MOCK_CHECK),
      checkout: window.random.getRandomElement(MOCK_CHECK),
      features: window.random.getRandomWidthArr(MOCK_FEATURES),
      description: window.random.getRandomString(MOCK_VOCABULARY),
      photos: window.random.getRandomWidthArr(MOCK_PHOTOS)
    };
  };

  var getDataItemMock = function (num) {
    var location = createLocationObj();

    return {
      location: location,
      author: createAuthorObj(num),
      offer: createOfferObj(location)
    };
  };

  var getDataItemMockArr = function (amount) {
    var mocks = [];

    for (var i = 0; i < amount; i++) {
      var mock = getDataItemMock(i + 1);
      mocks.push(mock);
    }

    return mocks;
  };

  window.mock = {
    getData: getDataItemMockArr
  };
})();
