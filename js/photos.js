/**
 * @fileoverview В модуле собраны фотографии для показа в галерее.
 * Они сохраняются в массив объектов Photo и добавляются в
 * созданный объект типа Gallery.
 * @author Irina Smirnova (smirnovapr@mail.ru)
 */

'use strict';

define([
  'photo',
  'gallery'
], function(Photo, Gallery) {
  /**
   * Коллекция, преобразованная в массив
   * @type {Array} photoData
   */
  var photoData = Array.prototype.slice.call(document.querySelectorAll('.photogallery img'), 0);
  var photos = [];
  var index = 0;

  /**
   * Для каждой фотки создаётся объект Photo; все они сохраняются в массив photos
   */
  photos = photos.concat(photoData.map(function() {
    /** @type {Photo} photoElement */
    var photoElement = new Photo();

    photoElement.setSrc(photoData[index].src);
    index++;
    return photoElement;
  }));

  /** @type {Gallery} */
  var gallery = new Gallery();
  gallery.setPictures(photos);

  /**
   * Добавляем фотогалерее слушатель событий:
   * при клике по любому из скриншотов определяется его индекс и
   * вызывается метод объекта Gallery для показа галереи
   * @param {Event} evt
   */
  var photogallery = document.querySelector('.photogallery');
  var elements = document.querySelectorAll('.photogallery img');

  photogallery.addEventListener('click', function(evt) {
    var clickedElement = evt.target;

    if (clickedElement.tagName === 'IMG') {
      evt.preventDefault();
      for (var i = 0; i < elements.length; i++) {
        if (clickedElement === elements[i]) {
          gallery.setCurrentPicture(i);
          window.location.hash = 'photo/' + (i + 1);
          break;
        }
      }
    }
  });

  /**
   * В зависимости от содержимого хэша показываем/прячем галерею.
   */
  var restoreFromHash = function() {
    var hash = window.location.hash.match(/#photo\/(\S+)/);
    if (hash !== null) {
      index = 'img/screenshots/' + parseInt(hash[1], 10) + '.png';
      gallery.setCurrentPicture(index);
      gallery.show();
    } else {
      gallery.hide();
    }
  };

  window.addEventListener('hashchange', restoreFromHash);
  restoreFromHash();
});
