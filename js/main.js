'use strict';

(function () {

  // init map

  var onAddressChange = function () {
    form.setFormActive(true);
    form.setAddress(map.getAddress());
  };

  var map = window.map.initMap(onAddressChange);

  map.setMapActive(false);

  // init form

  var onStatusChange = function (stage) {
    switch (stage) {
      case 'sending':
        form.setFormActive(false);
        break;
      case 'reset':
      case 'success':
        form.setFormActive(false);
        map.setMapActive(false);
        break;
      case 'error':
        form.setFormActive(true);
        return;
    }

    form.setAddress(map.getAddress());
  };

  var form = window.form.initForm(map.getAddress(), onStatusChange);

  form.setFormActive(false);
})();


