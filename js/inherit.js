/**
 * @fileoverview В файле описывается функция наследования
 * дочерним конструктором методов и свойств родительского конструктора
 * @author Irina Smirnova (smirnovapr@mail.ru)
 */

'use strict';

(function() {
  /**
   * Функция записывает в прототип дочернего конструктора child
   * методы и свойства родительского через пустой конструктор.
   * @param {Function} child
   * @param {Function} parent
   */
  function inherit(child, parent) {
    /**
     * "Пустой" конструктор
     * @constructor
     */
    var EmptyConstructor = function() {};
    EmptyConstructor.prototype = parent.prototype;
    /** @type {EmptyConstructor} */
    child.prototype = new EmptyConstructor();
  }

  /**
   * Объявляем функцию в глобальной области видимости
   * @global
   */
  window.inherit = inherit;
})();
