'use strict';

(function () {
  var templates = {
    error: document.querySelector('#error').content.querySelector('.error'),
    success: document.querySelector('#success').content.querySelector('.success')
  };

  var createMessage = function (type, message) {
    var template = templates[type];

    if (!template) {
      return;
    }

    var node = template.cloneNode(true);

    if (message) {
      node.querySelector('.' + type + '__message').textContent = message;
    }

    var onMessageClose = function (evt) {
      if (evt.type === 'click' || evt.key === 'Escape') {
        evt.preventDefault();
        window.utils.removeElement(node);
        document.removeEventListener('keydown', onMessageClose);
        document.removeEventListener('click', onMessageClose);
      }
    };

    document.addEventListener('click', onMessageClose);
    document.addEventListener('keydown', onMessageClose);

    document.body.firstElementChild.insertAdjacentElement('afterbegin', node);
  };

  var createErrorMessage = function (message) {
    createMessage('error', message);
  };

  var createSuccessMessage = function (message) {
    createMessage('success', message);
  };

  window.message = {
    errorMessage: createErrorMessage,
    successMessage: createSuccessMessage
  };
})();
