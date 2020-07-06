'use strict';

(function () {
  var adForm = document.querySelector('.ad-form');

  var setFormActive = function (active) {
    window.utils.setElementsActive(adForm.children, active);

    adForm.classList.toggle('ad-form--disabled', !active);
  };

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

  var setMinPriceValue = function (input, accommodationType) {
    if (accommodationType in window.data.MIN_PRICES) {
      var value = window.data.MIN_PRICES[accommodationType];
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

  var initForm = function (address) {
    setFormActive(false);

    adForm.address.value = address.x + 'px, ' + address.y + 'px';

    adForm.addEventListener('change', function () {
      validateForm();
    });

    adForm.addEventListener('submit', function (evt) {
      validateForm();

      if (!adForm.checkValidity()) {
        evt.preventDefault();
      }
    });

    return {
      setFormActive: setFormActive,
    };
  };

  window.form = {
    initForm: initForm
  };
})();
