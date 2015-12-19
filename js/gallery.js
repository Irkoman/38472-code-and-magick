/**
 * @fileoverview Файл предназначен для описания конструктора Gallery
 * и основных методов, которыми обладает прототип (показ и сокрытие галереи).
 * @author Irina Smirnova (smirnovapr@mail.ru)
 */

'use strict';

(function() {
  /**
   * Конструктор объекта Gallery
   * @constructor
   */
  var Gallery = function() {
    this.element = document.querySelector('.overlay-gallery');
    this._leftButton = this.element.querySelector('.overlay-gallery-control-left');
    this._rightButton = this.element.querySelector('.overlay-gallery-control-right');
    this._closeButton = this.element.querySelector('.overlay-gallery-close');
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
    previewContainer.appendChild(image);
    image.src = this._photos[index].getSrc();
    currentNumber.innerHTML = '' + (index + 1);
    totalNumber.innerHTML = '' + this._photos.length;
  };

  /**
   * Сокрытие галереи. Убираем подписки на события
   * (нет необходимости их прослушивать, когда галерея закрыта)
   */
  Gallery.prototype.hide = function() {
    this.element.classList.add('invisible');
    this._leftButton.removeEventListener('click', this._onLeftButtonClick);
    this._rightButton.removeEventListener('click', this._onRightButtonClick);
    this._closeButton.removeEventListener('click', this._onCloseClick);
    document.removeEventListener('keydown', this._onEscapeButtonClick);
  };

  /**
   * Обработчики событий по клику на кнопки ("влево", "вправо", "закрыть"),
   * а также по нажатию на клавишу Escape.
   * @param {Event} evt
   */
  Gallery.prototype._onLeftButtonClick = function() {

  };

  Gallery.prototype._onRightButtonClick = function() {

  };

  Gallery.prototype._onCloseClick = function() {
    this.hide();
  };

  Gallery.prototype._onEscapeButtonClick = function(evt) {
    if (evt.keyCode === 27) {
      this.hide();
    }
  };

  window.Gallery = Gallery;
})();
