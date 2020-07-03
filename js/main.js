'use strict';

(function () {
  var MOCK_AMOUNT = 8;

  var data = window.mock.getData(MOCK_AMOUNT);

  var map = window.map.initMap(data, function onActivate() {
    form.setFormActive(true);
  });

  var form = window.form.initForm(map.address);
})();


