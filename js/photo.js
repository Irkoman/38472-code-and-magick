/**
 * @fileoverview Файл предназначен для описания конструктора Photo
 * @author Irina Smirnova (smirnovapr@mail.ru)
 */

'use strict';

define(function() {
  /**
   * Конструктор Photo
   * @constructor
   */
  var Photo = function() {
    this._src = '';
  };

  /**
   * Метод устанавливает адрес картинки
   * @param {string} src
   */
  Photo.prototype.setSrc = function(src) {
    this._src = src;
  };

  /**
   * Метод возвращает src
   * @return {string}
   */
  Photo.prototype.getSrc = function() {
    return this._src;
  };

  return Photo;
});
