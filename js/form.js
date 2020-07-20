'use strict';

(function () {
  var FormStatus = {
    ERROR: 'error',
    RESET: 'reset',
    SENDING: 'sending',
    SUCCESS: 'success',
  };

  var adForm = document.querySelector('.ad-form');
  var isActive;

  var setFormActive = function (active) {
    if (isActive === active) {
      return;
    }

    window.utils.setElementsActive(adForm.children, active);

    adForm.classList.toggle('ad-form--disabled', !active);

    isActive = active;
  };

  var getCapacityValidity = function (capacity, rooms) {
    var capacityMessage = '';

    if (rooms === 1 && capacity !== 1) {
      capacityMessage = '1 комната подходит только для 1 гостя';
    } else if (rooms === 2 && (capacity < 1 || capacity > 2)) {
      capacityMessage = '2 комнаты подходят только для 1-2 гостей';
    } else if (rooms === 3 && (capacity < 1 || capacity > 3)) {
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
    var accomodationType = adForm.type.value;
    var rooms = parseInt(adForm.rooms.value, 10);
    var capacity = parseInt(adForm.capacity.value, 10);

    setTimeValues(document.activeElement, adForm.timein, adForm.timeout);
    setMinPriceValue(adForm.price, accomodationType);
    adForm.capacity.setCustomValidity(getCapacityValidity(capacity, rooms));
  };

  var setAddress = function (address) {
    adForm.address.value = address.x + 'px, ' + address.y + 'px';
  };

  var initForm = function (address, onStatusChange) {
    var defaultPlaceholder = adForm.price.placeholder;

    setAddress(address);

    var resetForm = function () {
      adForm.reset();
      adForm.price.placeholder = defaultPlaceholder;
    };

    var onSuccessSave = function () {
      window.message.success();
      resetForm();
      onStatusChange(FormStatus.SUCCESS);
    };

    var onErrorSave = function () {
      window.message.error();
      onStatusChange(FormStatus.ERROR);
    };

    adForm.addEventListener('change', function () {
      validateForm();
    });

    adForm.addEventListener('reset', function () {
      resetForm();

      // сброс формы не сработает пока обработчик не закончит выполнение (даже если вызывать form.reset() вручную),
      // поэтому мы откладываем вызов колбэка onStatusChange, чтобы форма успела сброситься
      setTimeout(function () {
        onStatusChange(FormStatus.RESET);
      });
    });

    adForm.addEventListener('submit', function (evt) {
      evt.preventDefault();
      validateForm();

      if (!adForm.checkValidity()) {
        evt.preventDefault();
      }

      window.server.save(new FormData(adForm), onSuccessSave, onErrorSave);

      onStatusChange(FormStatus.SENDING);
    });

    return {
      setActive: setFormActive,
      setAddress: setAddress
    };
  };

  window.form = {
    Status: FormStatus,
    init: initForm,
  };
})();
