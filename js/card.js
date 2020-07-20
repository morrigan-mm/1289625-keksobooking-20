'use strict';

(function () {
  var cardTemplate = document.querySelector('#card').content.querySelector('.map__card');

  var setCardFeatures = function (elem, features) {
    var featuresList = elem.querySelectorAll('.popup__feature');

    for (var i = 0; i < featuresList.length; i++) {
      var isMatch = features.some(function (feature) {
        return featuresList[i].matches('.popup__feature--' + feature);
      });

      if (!isMatch) {
        window.utils.removeElement(featuresList[i]);
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
      window.utils.removeElement(elem);
    }
  };

  var renderCard = function (dataItem, onClose) {
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

    setCardField(title, dataItem.offer.title);
    setCardField(address, dataItem.offer.address);
    setCardField(price, dataItem.offer.price, dataItem.offer.price + '₽/ночь');
    setCardField(type, dataItem.offer.type, window.data.TYPES[dataItem.offer.type]);
    setCardField(capacity, dataItem.offer.rooms && dataItem.offer.guests, dataItem.offer.rooms + ' комнаты для ' + dataItem.offer.guests + ' гостей');
    setCardField(time, dataItem.offer.checkin && dataItem.offer.checkout, 'Заезд после ' + dataItem.offer.checkin + ', выезд до ' + dataItem.offer.checkout);
    setCardField(description, dataItem.offer.description);
    setCardField(avatar, dataItem.author.avatar, null, 'src');
    setCardField(features, dataItem.offer.features && dataItem.offer.features.length !== 0, dataItem.offer.features, setCardFeatures);
    setCardField(photos, dataItem.offer.photos && dataItem.offer.photos.length !== 0, dataItem.offer.photos, setCardPhotos);

    var closeButton = element.querySelector('.popup__close');

    var remove = function () {
      window.utils.removeElement(element);
      document.removeEventListener('keydown', onCardClose);
      closeButton.removeEventListener('click', onCardClose);
    };

    var onCardClose = function (evt) {
      if (evt.type === 'click' || evt.key === 'Escape') {
        evt.preventDefault();
        onClose(dataItem);
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

  window.card = {
    render: renderCard
  };
})();
