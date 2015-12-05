'use strict';
/* global reviews: true */
(function() {
  var container = document.querySelector('.reviews-list');
  var IMAGE_TIMEOUT = 10000;

  document.querySelector('.reviews-filter').classList.add('invisible');

  reviews.forEach(function(review) {
    var element = getElementFromTemplate(review);
    container.appendChild(element);
  });

  function getElementFromTemplate(data) {
    var template = document.querySelector('#review-template');

    if ('content' in template) {
      var element = template.content.children[0].cloneNode(true);
    } else {
      element = template.children[0].cloneNode(true);
    }

    element.querySelector('.review-text').textContent = data.description;
    element.querySelector('.review-rating').style.display = 'none';

    var authorPhoto = new Image(124, 124);

    var imageLoadTimeout = setTimeout(function() {
      authorPhoto.src = '';
      element.classList.add('review-load-failure');
    }, IMAGE_TIMEOUT);

    authorPhoto.onload = function() {
      clearTimeout(imageLoadTimeout);
      element.replaceChild(authorPhoto, element.querySelector('.review-author'));
      authorPhoto.classList.add('review-author');
    };

    authorPhoto.onerror = function() {
      element.classList.add('review-load-failure');
    };

    authorPhoto.src = '/' + data.author.picture;

    return element;
  }

  document.querySelector('.reviews-filter').classList.remove('invisible');
})();
