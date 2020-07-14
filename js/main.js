'use strict';

(function () {
  var active = false;

  var map = window.map.initMap(function () {
    if (!active) {
      form.setFormActive(true);
      active = true;
    }

    form.setAddress(map.getAddress());
  });

  var form = window.form.initForm(map.getAddress());
})();


