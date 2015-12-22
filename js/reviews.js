/**
 * @fileoverview Основной файл, отвечающий за отрисовку и фильтрацию отзывов.
 * "Управляет" также конструкторами Review (review.js) и Gallery (gallery.js).
 * @author Irina Smirnova (smirnovapr@mail.ru)
 */

/* global requirejs: true */

'use strict';

requirejs.config({
  baseUrl: 'js'
});

define([
  'review',
  'photos',
  'gallery',
  'form',
  'game'
], function(Review) {
  var container = document.querySelector('.reviews-list');
  var filters = document.querySelector('.reviews-filter');
  var activeFilter = localStorage.getItem('activeFilter') || 'reviews-all';
  var moreReviews = document.querySelector('.reviews-controls-more');
  var reviews = [];
  var filteredReviews = [];
  var renderedElements = [];
  var currentPage = 0;

  /** @const {number} */
  var PAGE_SIZE = 3;

  /**
   * Слушаем события по клику на фильтры,
   * чтобы установить нужный activeFilter.
   * @param {Event} evt
   */
  filters.addEventListener('click', function(evt) {
    var clickedElement = evt.target;
    if (clickedElement.name === 'reviews') {
      setActiveFilter(clickedElement.id);
    }
  });

  filters.classList.add('invisible');

  /**
   * Обработчик событий для кнопки "Ещё отзывы":
   * при клике по ней отображаем следующую
   * страницу отзывов (если она имеется).
   */
  moreReviews.addEventListener('click', function() {
    if (currentPage <= Math.ceil(filteredReviews.length / PAGE_SIZE)) {
      renderReviews(filteredReviews, ++currentPage);
    }
  });

  getReviews();

  /**
   * Отрисовка списка отзывов
   * @param {Array.<Object>} reviewsToRender
   * @param {number} pageNumber
   * @param {boolean=} replace
   */
  function renderReviews(reviewsToRender, pageNumber, replace) {
    /**
     * При фильтрации (replace === true) удаляем компоненты,
     * которые были предварительно сохранены в массиве renderedElements
     */
    if (replace) {
      var el;
      while ((el = renderedElements.shift())) {
        container.removeChild(el.element);
      }
    }

    var fragment = document.createDocumentFragment();
    var from = pageNumber * PAGE_SIZE;
    var to = from + PAGE_SIZE;
    var pageReviews = reviewsToRender.slice(from, to);

    /**
     * Создание компонентов с помощью конструктора Review
     * и сохранение их в массив renderedElements
     */
    renderedElements = renderedElements.concat(pageReviews.map(function(review, index) {
      /** @type {Review} reviewElement */
      var reviewElement = new Review(review);
      reviewElement.render();
      fragment.appendChild(reviewElement.element);
      if (index === pageReviews.length - 1) {
        moreReviews.classList.remove('invisible');
      }
      return reviewElement;
    }));

    container.appendChild(fragment);
  }

  /**
   * Установка выбранного фильтра
   * @param {string} id
   */
  function setActiveFilter(id) {

    /** Копирование массива */
    filteredReviews = reviews.slice(0);

    switch (id) {
      case 'reviews-all':
        break;
      case 'reviews-recent':
        filteredReviews = filteredReviews.filter(function(a) {
          var date = new Date(a.date);
          var recentDate = new Date(Date.now() - 60 * 60 * 24 * 183 * 1000);
          return date >= recentDate;
        });
        filteredReviews = filteredReviews.sort(function(a, b) {
          var aDate = new Date(a.date);
          var bDate = new Date(b.date);
          return bDate - aDate;
        });
        break;
      case 'reviews-good':
        filteredReviews = filteredReviews.filter(function(a) {
          return a.rating >= 3;
        });
        filteredReviews = filteredReviews.sort(function(a, b) {
          return b.rating - a.rating;
        });
        break;
      case 'reviews-bad':
        filteredReviews = filteredReviews.filter(function(a) {
          return a.rating <= 2;
        });
        filteredReviews = filteredReviews.sort(function(a, b) {
          return a.rating - b.rating;
        });
        break;
      case 'reviews-popular':
        filteredReviews = filteredReviews.sort(function(a, b) {
          return b['review-rating'] - a['review-rating'];
        });
        break;
    }

    currentPage = 0;
    renderReviews(filteredReviews, 0, true);
    activeFilter = id;
    document.querySelector('#' + id).checked = true;
    localStorage.setItem('activeFilter', id);
  }

  /**
   * Загрузка списка отзывов
   */
  function getReviews() {
    /** @type {XMLHttpRequest} xhr */
    var xhr = new XMLHttpRequest();
    document.querySelector('.reviews').classList.add('reviews-list-loading');
    xhr.open('GET', 'data/reviews.json');

    /**
     * Обработчик события onload (данные успешно загружены)
     * @param {Event} evt
     */
    xhr.onload = function(evt) {
      var rawData = evt.target.response;
      reviews = JSON.parse(rawData);
      filteredReviews = reviews;
      setActiveFilter(activeFilter);
      document.querySelector('.reviews').classList.remove('reviews-list-loading');
    };

    /** Обработчик события onerror */
    xhr.onerror = function() {
      document.querySelector('.reviews').classList.remove('reviews-list-loading');
      document.querySelector('.reviews').classList.add('reviews-load-failure');
    };

    /** Обработчик события ontimeout */
    xhr.ontimeout = function() {
      document.querySelector('.reviews').classList.remove('reviews-list-loading');
      document.querySelector('.reviews').classList.add('reviews-load-failure');
    };

    xhr.send();
  }
});
