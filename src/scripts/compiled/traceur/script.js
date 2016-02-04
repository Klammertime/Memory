"use strict";
var sources = [],
    deck = [],
    image = {},
    Card,
    card,
    flipped,
    matched;
Card = function(category, file, alt) {
  this.category = category;
  this.file = file;
  this.alt = alt;
};
card = new Card('feather', 'img/feather/feather2.svg', 'feather2');
Card.prototype.createSources = function(category) {
  var imgLocation,
      imgAlt;
  sources = [];
  for (var i = 1; i < 9; i++) {
    imgLocation = 'img/' + category + '/' + category + i + '.svg';
    imgAlt = category + i;
    sources.push(new Card(category, imgLocation, imgAlt));
  }
};
card.createSources('feather');
Array.prototype.shuffle = function() {
  var $__1,
      $__2,
      $__3;
  var i = this.length;
  var j;
  if (i === 0)
    return this;
  while (--i) {
    j = Math.floor(Math.random() * (i + 1));
    ($__1 = [this[j], this[i]], this[i] = ($__2 = $__1[Symbol.iterator](), ($__3 = $__2.next()).done ? void 0 : $__3.value), this[j] = ($__3 = $__2.next()).done ? void 0 : $__3.value, $__1);
  }
  return this;
};
deck = [];
image = {};
Card.prototype.initGame = function() {
  for (var i = 0; i < sources.length; i++) {
    deck.push(i);
    deck.push(i);
  }
  deck.shuffle();
  for (var j = 0; j < 2 * sources.length; j++) {
    image['card_' + j] = deck[j];
  }
};
flipped = null;
matched = 0;
card.initGame();
Card.prototype.flipBack = function(elementId) {
  document.getElementById(elementId).alt = 'back';
  document.getElementById(elementId).src = 'img/electronicons/electronicons1.svg';
};
Card.prototype.vanish = function(elementId) {
  document.getElementById(elementId).className = 'matched';
};
Card.prototype.flipCard = function(event) {
  if (event.target.className === 'card') {
    if (event.target.alt === 'back') {
      var imageIndex = image[event.target.id];
      event.target.src = sources[imageIndex].file;
      event.target.alt = sources[imageIndex].alt;
      if (!flipped) {
        flipped = event.target.id;
      } else {
        if (image[flipped] === image[event.target.id]) {
          card.vanish(flipped);
          card.vanish(event.target.id);
          flipped = null;
          matched++;
          if (matched === sources.length) {
            document.getElementById('board').className = 'win';
            document.getElementById('message').textContent = 'All matched!';
          }
        } else {
          document.getElementById('board').removeEventListener('click', card.flipCard, false);
          setTimeout(function() {
            card.flipBack(flipped);
            flipped = null;
            card.flipBack(event.target.id);
            document.getElementById('board').addEventListener('click', card.flipCard, false);
          }, 1000);
        }
      }
    }
  }
};
Card.prototype.changeCardBack = function(category) {
  var imgBackLocation = 'img/' + category + '/' + category + '1.svg';
  var imgList = document.querySelectorAll('img.card');
  var imgListArray = Array.prototype.slice.call(imgList);
  console.log(imgListArray);
  imgListArray.forEach(function(val, ind, arr) {
    val.src = imgBackLocation;
  });
};
document.getElementById('board').addEventListener('click', card.flipCard, false);
Card.prototype.handleDragStart = function(event) {
  this.createSources(event.target.id);
};
Card.prototype.handleDragDrop = function(event) {
  if (event.preventDefault)
    event.preventDefault();
};
Card.prototype.handleDragOver = function(event) {
  if (event.preventDefault)
    event.preventDefault();
  return false;
};
document.getElementById('cardCategories').addEventListener('dragstart', function(event) {
  card.handleDragStart(event);
}, false);
document.getElementById('board').addEventListener('dragover', card.handleDragOver, false);
document.getElementById('board').addEventListener('drop', card.handleDragDrop, false);
var Car = function() {
  function Car(engine) {
    this.engine = engine;
  }
  return ($traceurRuntime.createClass)(Car, {}, {});
}();
