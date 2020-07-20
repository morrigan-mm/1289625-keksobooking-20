'use strict';

(function () {

  // init map

  var onAddressChange = function () {
    form.setActive(true);
    form.setAddress(map.getAddress());
  };

  var map = window.map.init(onAddressChange);

  map.setMapActive(false);

  // init form

  var onStatusChange = function (stage) {
    switch (stage) {
      case window.form.Status.SENDING:
        form.setActive(false);
        break;
      case window.form.Status.RESET:
      case window.form.Status.SUCCESS:
        form.setActive(false);
        map.setMapActive(false);
        break;
      case window.form.Status.ERROR:
        form.setActive(true);
        return;
    }

    form.setAddress(map.getAddress());
  };

  var form = window.form.init(map.getAddress(), onStatusChange);

  form.setActive(false);
})();


