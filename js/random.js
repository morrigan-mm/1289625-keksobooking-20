'use strict';

(function () {
  var getRandomInt = function (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  var getRandomElement = function (arr) {
    if (!arr.length) {
      return undefined;
    }

    var index = getRandomInt(0, arr.length - 1);

    return arr[index];
  };

  var getRandomWidthArr = function (arr) {
    var amount = getRandomInt(0, arr.length); // 1 - чтобы не было пустых строк, массивов
    var shuffled = shuffleArray(arr.slice());
    shuffled.length = amount;
    return shuffled;
  };

  var shuffleArray = function (arr) {
    for (var i = 0; i < arr.length; i++) {
      var index = getRandomInt(i, arr.length - 1);
      var temp = arr[i];
      arr[i] = arr[index];
      arr[index] = temp;
    }

    return arr;
  };

  var getRandomString = function (arr) {
    var str = getRandomWidthArr(arr);

    return str.join(' ');
  };

  window.random = {
    getRandomInt: getRandomInt,
    getRandomElement: getRandomElement,
    getRandomWidthArr: getRandomWidthArr,
    getRandomString: getRandomString
  };
})();
