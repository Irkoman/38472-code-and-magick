'use strict';

(function() {
  var container = document.querySelector('.reviews-list');
  var filters = document.querySelector('.reviews-filter');
  var activeFilter = 'reviews-all';
  var reviews = [];
  var filteredReviews = [];
  var currentPage = 0;
  var PAGE_SIZE = 3;
  var IMAGE_TIMEOUT = 10000;
  var moreReviews = document.querySelector('.reviews-controls-more');

  filters.addEventListener('click', function(evt) {
    var clickedElement = evt.target;
    if (clickedElement.name === 'reviews') {
      setActiveFilter(clickedElement.id);
    }
  });

  filters.classList.add('invisible');

  moreReviews.onclick = function() {
    if (currentPage < Math.ceil(filteredReviews.length / PAGE_SIZE)) {
      renderReviews(filteredReviews, ++currentPage);
    }
  };

  getReviews();

  /**
   * Отрисовка списка отзывов
   * @param {Array.<Object>} reviewsToRender
   * @param {number} pageNumber
   * @param {boolean=} replace
   */
  function renderReviews(reviewsToRender, pageNumber, replace) {
    if (replace) {
      container.innerHTML = '';
    }

    var fragment = document.createDocumentFragment();
    var from = pageNumber * PAGE_SIZE;
    var to = from + PAGE_SIZE;
    var pageReviews = reviewsToRender.slice(from, to);

    if (reviews.length > 3) {
      moreReviews.classList.remove('invisible');
    }

    pageReviews.forEach(function(review) {
      var element = getElementFromTemplate(review);
      fragment.appendChild(element);
    });

    container.appendChild(fragment);
  }

  /**
   * Установка выбранного фильтра
   * @param {string} id
   * @param {boolean=} force Флаг, при котором игнорируется проверка
   *     на повторное присвоение фильтра.
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
  }

  /**
   * Загрузка списка отзывов
   */
  function getReviews() {
    var xhr = new XMLHttpRequest();
    document.querySelector('.reviews').classList.add('reviews-list-loading');
    xhr.open('GET', 'data/reviews.json');
    xhr.timeout = 10000;

    xhr.onload = function(evt) {
      var rawData = evt.target.response;
      var loadedReviews = JSON.parse(rawData);
      updateLoadedReviews(loadedReviews);
      renderReviews(loadedReviews, 0);
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

  function getElementFromTemplate(data) {
    var template = document.querySelector('#review-template');

    if ('content' in template) {
      var element = template.content.children[0].cloneNode(true);
    } else {
      element = template.children[0].cloneNode(true);
    }

    element.querySelector('.review-text').textContent = data.description;

    var reviewRating = element.querySelector('.review-rating');
    switch (data.rating) {
      case 1:
        reviewRating.classList.add('review-rating-one');
        break;
      case 2:
        reviewRating.classList.add('review-rating-two');
        break;
      case 3:
        reviewRating.classList.add('review-rating-three');
        break;
      case 4:
        reviewRating.classList.add('review-rating-four');
        break;
      case 5:
        reviewRating.classList.add('review-rating-five');
        break;
    }

    var authorPhoto = new Image(124, 124);

    var imageLoadTimeout = setTimeout(function() {
      authorPhoto.src = '';
      element.classList.add('review-load-failure');
    }, IMAGE_TIMEOUT);

    authorPhoto.onload = function() {
      clearTimeout(imageLoadTimeout);
      element.replaceChild(authorPhoto, element.querySelector('.review-author'));
    };

    authorPhoto.onerror = function() {
      clearTimeout(imageLoadTimeout);
      element.classList.add('review-load-failure');
    };

    authorPhoto.src = data.author.picture;
    authorPhoto.title = data.author.name;
    authorPhoto.classList.add('review-author');

    filters.classList.remove('invisible');

    return element;
  }

   /**
   * Сохранение списка отзывов в переменную reviews, обновление счётчика отзывов
   * и вызов фильтрации и отрисовки.
   * @param {Array.<Object>} loadedReviews
   */
  function updateLoadedReviews(loadedReviews) {
    reviews = loadedReviews;
    setActiveFilter(activeFilter, true);
  }
})();
