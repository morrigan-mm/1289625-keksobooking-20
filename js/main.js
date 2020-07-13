'use strict';

(function () {
  // var MOCK_AMOUNT = 8;
  var active = false;


  var map = window.map.initMap(function onAddressChange() {
    if (!active) {
      form.setFormActive(true);
      active = true;
    }

    form.setAddress(map.getAddress());
  });

  var form = window.form.initForm(map.getAddress());
  // window.mock.getData(MOCK_AMOUNT);
})();


