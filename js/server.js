'use strict';

(function () {
  var URL_TO_GET = 'https://javascript.pages.academy/keksobooking/data';
  var URL_TO_POST = 'https://javascript.pages.academy/keksobooking';
  var TIMEOUT_IN_MS = 10000;

  var request = function (url, method, onSuccess, onError, data) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';

    xhr.addEventListener('load', function () {
      if (xhr.status < 400) {
        onSuccess(xhr.response);
      } else {
        onError('Статус ответа: ' + xhr.status + ' ' + xhr.statusText);
      }
    });

    xhr.addEventListener('error', function () {
      onError('Произошла ошибка соединения');
    });

    xhr.addEventListener('timeout', function () {
      onError('Запрос не успел выполниться за ' + xhr.timeout + 'мс');
    });

    xhr.timeout = TIMEOUT_IN_MS;

    xhr.open(method, url);
    xhr.send(data);
  };

  var load = function (onSuccess, onError) {
    request(URL_TO_GET, 'GET', onSuccess, onError);
  };

  var save = function (data, onSuccess, onError) {
    request(URL_TO_POST, 'POST', onSuccess, onError, data);
  };

  window.server = {
    load: load,
    save: save
  };
})();
