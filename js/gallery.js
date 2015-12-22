/**
 * @fileoverview Файл предназначен для описания конструктора Gallery
 * и основных методов, которыми обладает прототип (показ и сокрытие галереи).
 * @author Irina Smirnova (smirnovapr@mail.ru)
 */

'use strict';

define(function() {
  /**
   * Конструктор объекта Gallery
   * @constructor
   */
  var Gallery = function() {
    this.element = document.querySelector('.overlay-gallery');
    this._leftButton = this.element.querySelector('.overlay-gallery-control-left');
    this._rightButton = this.element.querySelector('.overlay-gallery-control-right');
    this._closeButton = this.element.querySelector('.overlay-gallery-close');
    this._currentIndex = 0;
    this._onLeftButtonClick = this._onLeftButtonClick.bind(this);
    this._onRightButtonClick = this._onRightButtonClick.bind(this);
    this._onCloseClick = this._onCloseClick.bind(this);
    this._onEscapeButtonClick = this._onEscapeButtonClick.bind(this);
  };

  /**
   * Показ галереи. Добавляем в метод
   * подписки на события, которые отслеживает галерея
   */
  Gallery.prototype.show = function() {
    this.element.classList.remove('invisible');
    this._leftButton.addEventListener('click', this._onLeftButtonClick);
    this._rightButton.addEventListener('click', this._onRightButtonClick);
    this._closeButton.addEventListener('click', this._onCloseClick);
    document.addEventListener('keydown', this._onEscapeButtonClick);
  };

  /**
   * Метод, который принимает на вход массив объектов Photo и сохраняет его.
   * @param {Array} photos
   */
  Gallery.prototype.setPictures = function(photos) {
    this._photos = photos;
  };

  /**
   * Метод, который берёт фотографию с переданным индексом из массива photos
   * и отрисовывает её в галерее
   * @param {number} index
   */
  Gallery.prototype.setCurrentPicture = function(index) {
    var currentImage = this.element.querySelector('.overlay-gallery-preview img');
    var previewContainer = this.element.querySelector('.overlay-gallery-preview');
    var currentNumber = this.element.querySelector('.preview-number-current');
    var totalNumber = this.element.querySelector('.preview-number-total');

    /**
     * Перед отрисовкой изображения освобождаем место от предыдущего.
     */
    if (currentImage) {
      previewContainer.removeChild(currentImage);
    }

    /** @type {Image} */
    var image = new Image();

    /**
     * Если в качестве индекса передана строка,
     * галерея ищет фотографию, путь к которой равен этой строке.
     */
    if (!this._photos) {
      return;
    }

    if (typeof index === 'string') {
      for (var i = 0; i < this._photos.length; i++) {
        if (this._photos[i]._src.indexOf(index) !== -1) {
          image.src = index;
          this._currentIndex = i + 1;
          currentNumber.innerHTML = '' + (i + 1);
        }
      }
    } else {
      this._currentIndex = index;
      image.src = this._photos[index].getSrc();
      currentNumber.innerHTML = '' + (index + 1);
    }

    previewContainer.appendChild(image);
    totalNumber.innerHTML = '' + this._photos.length;
  };

  /**
   * Сокрытие галереи. Убираем подписки на события
   * (нет необходимости их прослушивать, когда галерея закрыта)
   */
  Gallery.prototype.hide = function() {
    window.location.hash = '';
    this.element.classList.add('invisible');
    this._leftButton.removeEventListener('click', this._onLeftButtonClick);
    this._rightButton.removeEventListener('click', this._onRightButtonClick);
    this._closeButton.removeEventListener('click', this._onCloseClick);
    document.removeEventListener('keydown', this._onEscapeButtonClick);
  };

  /**
   * По клику на кнопку "влево" переключаемся на предыдущую картинку, если она есть.
   */
  Gallery.prototype._onLeftButtonClick = function() {
    if ((this._currentIndex - 1) > 0) {
      this._currentIndex--;
      window.location.hash = 'photo/' + this._currentIndex;
    }
  };

  /**
   * По клику на кнопку "вправо" - на следующую по порядку (если это возможно).
   */
  Gallery.prototype._onRightButtonClick = function() {
    if ((this._currentIndex) < this._photos.length) {
      this._currentIndex++;
      window.location.hash = 'photo/' + this._currentIndex;
    }
  };

  /**
   * По клику на кнопку "закрыть" - сокрытие галереи.
   */
  Gallery.prototype._onCloseClick = function() {
    this.hide();
  };

  /**
   * Обработчик события по нажатию на Escape.
   * @param {Event} evt
   */
  Gallery.prototype._onEscapeButtonClick = function(evt) {
    if (evt.keyCode === 27) {
      this._onCloseClick();
    }
    if (event.keyCode === 37) {
      this._onLeftButtonClick();
    }
    if (event.keyCode === 39) {
      this._onRightButtonClick();
    }
  };

  return Gallery;
});
