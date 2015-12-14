/**
 * @fileoverview Основной файл, отвечающий за отрисовку и фильтрацию отзывов.
 * "Управляет" также конструкторами Review (review.js) и Gallery (gallery.js).
 * @author Irina Smirnova (smirnovapr@mail.ru)
 */

/* global Review: true, Gallery: true */

'use strict';

(function() {
  var container = document.querySelector('.reviews-list');
  var filters = document.querySelector('.reviews-filter');
  var activeFilter = 'reviews-all';
  var moreReviews = document.querySelector('.reviews-controls-more');
  var photogallery = document.querySelector('.photogallery');
  var reviews = [];
  var filteredReviews = [];
  var currentPage = 0;

  /** @const {number} */
  var PAGE_SIZE = 3;

  /** @type {Gallery} */
  var gallery = new Gallery();

  /**
   * Добавляем фотогалерее слушатель событий:
   * при клике по любому из "скриншотов игры"
   * вызывается метод объекта Gallery для показа галереи.
   * @param {Event} evt
   */
  photogallery.addEventListener('click', function(evt) {
    var clickedElement = evt.target;
    if (clickedElement.tagName === 'IMG') {
      evt.preventDefault();
      gallery.show();
    }
  });

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
    if (replace) {
      var renderedElements = container.querySelectorAll('.review');
      [].forEach.call(renderedElements, function(el) {
        container.removeChild(el);
      });
    }

    var fragment = document.createDocumentFragment();
    var from = pageNumber * PAGE_SIZE;
    var to = from + PAGE_SIZE;
    var pageReviews = reviewsToRender.slice(from, to);

    pageReviews.forEach(function(review, index) {

      /** @type {Review} */
      var reviewElement = new Review(review);
      reviewElement.render();
      fragment.appendChild(reviewElement.element);
      if (index === pageReviews.length - 1) {
        moreReviews.classList.remove('invisible');
      }
    });

    container.appendChild(fragment);
  }

  /**
   * Установка выбранного фильтра
   * @param {string} id
   */
  function setActiveFilter(id) {
    if (activeFilter === id) {
      return;
    }

    filteredReviews = reviews.slice(0); // Копирование массива

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

    renderReviews(filteredReviews, 0, true);
    activeFilter = id;
    currentPage = 0;
  }

  /**
   * Загрузка списка отзывов
   */
  function getReviews() {
    var xhr = new XMLHttpRequest();
    document.querySelector('.reviews').classList.add('reviews-list-loading');
    xhr.open('GET', 'data/reviews.json');

    xhr.onload = function(evt) {
      var rawData = evt.target.response;
      reviews = JSON.parse(rawData);
      filteredReviews = reviews.slice(0);
      renderReviews(reviews, 0);
      document.querySelector('.reviews').classList.remove('reviews-list-loading');
    };

    xhr.onerror = function() {
      document.querySelector('.reviews').classList.remove('reviews-list-loading');
      document.querySelector('.reviews').classList.add('reviews-load-failure');
    };

    xhr.ontimeout = function() {
      document.querySelector('.reviews').classList.remove('reviews-list-loading');
      document.querySelector('.reviews').classList.add('reviews-load-failure');
    };

    xhr.send();
  }
})();
