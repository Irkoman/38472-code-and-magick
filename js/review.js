'use strict';

(function() {
  /*
   *  @param {Object} data
   *  @constructor
   */
  function Review(data) {
    this._data = data;

    Review.prototype.render = function() {
      var template = document.querySelector('#review-template');
      var filters = document.querySelector('.reviews-filter');
      var IMAGE_TIMEOUT = 10000;

      if ('content' in template) {
        this.element = template.content.children[0].cloneNode(true);
      } else {
        this.element = template.children[0].cloneNode(true);
      }

      this.element.querySelector('.review-text').textContent = this._data.description;

      var reviewRating = this.element.querySelector('.review-rating');
      switch (this._data.rating) {
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
        this.element.classList.add('review-load-failure');
      }, IMAGE_TIMEOUT);

      authorPhoto.onload = function() {
        clearTimeout(imageLoadTimeout);
        this.element.replaceChild(authorPhoto, element.querySelector('.review-author'));
      }.bind(this);

      authorPhoto.onerror = function() {
        clearTimeout(imageLoadTimeout);
        this.element.classList.add('review-load-failure');
      }.bind(this);

      authorPhoto.src = this._data.author.picture;
      authorPhoto.title = this._data.author.name;
      authorPhoto.classList.add('review-author');

      filters.classList.remove('invisible');
    }
  }

  window.Review = Review;
})();
