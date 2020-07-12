'use strict';

(function () {
  var MOCK_AMOUNT = 8;

  var data = window.mock.getData(MOCK_AMOUNT);
  var active = false;

  var map = window.map.initMap(data, function onAddressChange() {
    if (!active) {
      form.setFormActive(true);
      active = true;
    }

    form.setAddress(map.getAddress());
  });

  var form = window.form.initForm(map.getAddress());
})();


