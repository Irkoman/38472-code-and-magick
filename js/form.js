'use strict';

define(function() {
  var formContainer = document.querySelector('.overlay-container');
  var formOpenButton = document.querySelector('.reviews-controls-new');
  var formCloseButton = document.querySelector('.review-form-close');

  /**
   * Обработчик события клика по кнопке, открывающей форму
   * @param {Event} evt
   */
  formOpenButton.onclick = function(evt) {
    evt.preventDefault();
    formContainer.classList.remove('invisible');
  };

  /**
   * Обработчик события клика по кнопке, закрывающей форму
   * @param {Event} evt
   */
  formCloseButton.onclick = function(evt) {
    evt.preventDefault();
    formContainer.classList.add('invisible');
  };

  var formElement = document.querySelector('.review-form');
  var reviewName = document.querySelector('#review-name');
  var reviewText = document.querySelector('#review-text');
  var reviewSubmitButton = document.querySelector('.review-submit');
  var reviewMark = document.querySelectorAll('input[name="review-mark"]');
  var needWriteName = document.querySelector('.review-fields-name');
  var needWriteText = document.querySelector('.review-fields-text');

  /**
   * Проверка на наличие cookies: если есть, подставляем их в форму
   */
  if (docCookies.getItem('user') && docCookies.getItem('mark')) {
    var num = docCookies.getItem('mark');
    document.querySelector('#review-mark-' + num).checked = true;
    reviewName.value = docCookies.getItem('user');
  }

  /**
   * Валидация формы
   * @function
   */
  function formValid() {
    reviewSubmitButton.disabled = true;
    var reviewMarkChecked = document.querySelector('input[name="review-mark"]:checked');

    if (parseInt(reviewMarkChecked.value, 10) < 3) {
      reviewText.required = true;
      if (reviewText.value.length < 1) {
        document.querySelector('.review-fields').style.display = 'inline-block';
        needWriteText.style.display = 'inline-block';
        return true;
      }
    } else {
      reviewText.required = false;
      needWriteText.style.display = 'none';
    }

    if (reviewName.value.length < 1) {
      needWriteName.style.display = 'inline-block';
      return true;
    } else {
      reviewName.required = false;
      needWriteName.style.display = 'none';
    }

    reviewSubmitButton.disabled = false;
    document.querySelector('.review-fields').style.display = 'none';
  }

  /**
   * Вызываем проверку на валидность в случае любых изменений в форме,
   * будь то выбор пользователем другой оценки
   * или ввод данных в поля "Имя" и "Отзыв".
   */
  for (var i = 0; i < reviewMark.length; i++) {
    reviewMark[i].onclick = formValid;
  }

  /**
   * Обработчик события onchange: отслеживаем изменения в поле "Имя"
   */
  reviewName.onchange = function() {
    if (reviewName.value.length > 1) {
      needWriteName.style.display = 'none';
    } else {
      needWriteName.style.display = 'inline-block';
      document.querySelector('.review-fields').style.display = 'inline-block';
    }
    formValid();
  };

  /**
   * Обработчик события onchange: отслеживаем изменения в поле "Отзыв"
   */
  reviewText.onchange = function() {
    formValid();
    if (reviewText.value.length > 1) {
      needWriteText.style.display = 'none';
    } else {
      needWriteText.style.display = 'inline-block';
      document.querySelector('.review-fields').style.display = 'inline-block';
    }
  };
  formValid();

  /**
   * Обработчик события отправки формы: перед отправкой сохраняем
   * введённые пользователем данные (оценка и имя) в cookies.
   * @param {Event} evt
   */
  formElement.onsubmit = function(evt) {
    var reviewMarkChecked = document.querySelector('input[name="review-mark"]:checked');
    evt.preventDefault();
    var dateToExpire = +Date.now() + 225 * 24 * 60 * 60 * 1000;

    /** @type {Date} formattedDate */
    var formattedDate = new Date(dateToExpire).toUTCString();

    document.cookie = 'user =' + reviewName.value + '; expires =' + formattedDate;
    document.cookie = 'mark =' + reviewMarkChecked.value + '; expires =' + formattedDate;
    formElement.submit();
  };
});
