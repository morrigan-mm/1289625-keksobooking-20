'use strict';

(function () {
  var FILE_TYPES = ['jpg', 'jpeg', 'png'];

  var avatarInput = document.querySelector('.ad-form__field input[type=file]');
  var avatarImage = document.querySelector('.ad-form-header__preview img');
  var avatarImageInitial = avatarImage.src;

  var photoInput = document.querySelector('.ad-form__upload input[type=file]');
  var photoImageContainer = document.querySelector('.ad-form__photo');
  var photoImage = document.createElement('img');
  photoImage.style.width = '100%';
  photoImage.style.height = '100%';
  photoImage.style.objectFit = 'contain';

  var onFormReset = function () {
    avatarImage.src = avatarImageInitial;
    photoImageContainer.innerHTML = '';
  };

  var setImageResult = function (input, result) {
    switch (input) {
      case avatarInput:
        avatarImage.src = result;
        break;
      case photoInput:
        photoImage.src = result;
        photoImageContainer.appendChild(photoImage);
        break;
    }
  };

  var onFileChange = function (evt) {
    var file = evt.target.files[0];
    var fileName = file.name.toLowerCase();

    var matches = FILE_TYPES.some(function (it) {
      return fileName.endsWith(it);
    });

    if (matches) {
      var reader = new FileReader();

      reader.addEventListener('load', function () {
        setImageResult(evt.target, reader.result);
      });

      reader.readAsDataURL(file);
    }
  };

  avatarInput.addEventListener('change', onFileChange);
  photoInput.addEventListener('change', onFileChange);
  photoInput.form.addEventListener('reset', onFormReset);

})();
