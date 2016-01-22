/*
 * Memory
 */
'use strict';

// The array below contains the images'file names
// with the corresponding alt attribute

var sources = [{
  file: 'robot29.svg',
  alt: 'robot29'
}, {
  file: 'robot30.svg',
  alt: 'robot30'
}, {
  file: 'robot26.svg',
  alt: 'robot26'
}, {
  file: 'robot25.svg',
  alt: 'robot25'
}, {
  file: 'robot22.svg',
  alt: 'robot22'
}, {
  file: 'robot17.svg',
  alt: 'robot17'
}, {
  file: 'robot21.svg',
  alt: 'robot21'
}, {
  file: 'rounded46.svg',
  alt: 'rounded46'
}];
// The method below may be called on any array
// to shuffle it in place.
Array.prototype.shuffle = function () {
  var i = this.length;
  var j;
  if (i === 0) return this;
  while (--i) {
    j = Math.floor(Math.random() * (i + 1));
    var _ref = [this[j], this[i]];
    this[i] = _ref[0];
    this[j] = _ref[1];
  }
  return this;
};

// The array deck represents the cards.
var deck = [];
// the image object maps the cards in the game to an image in the sources array
var image = {};

function initGame() {
  // deck where each image is represented twice
  // deck contains the index of the image in the sources array
  for (var i = 0; i < sources.length; i++) {
    deck.push(i);
    deck.push(i);
  }
  // shuffle that deck
  deck.shuffle();
  // Assign an image (denoted by the index) to each card element
  for (var j = 0; j < 2 * sources.length; j++) {
    image['card_' + j] = deck[j];
  }
}
var flipped = null; // the last card flipped if still open
var matched = 0; // number of pairs matched
initGame();
function flipCard(event) {
  if (event.target.className === 'card') {
    if (event.target.alt === 'back') {
      var imageIndex = image[event.target.id];
      event.target.src = sources[imageIndex].file;
      event.target.alt = sources[imageIndex].alt;
      if (!flipped) {
        flipped = event.target.id;
      } else {
        if (image[flipped] === image[event.target.id]) {
          // there is a match
          vanish(flipped);
          vanish(event.target.id);
          flipped = null;
          matched++;
          // if all cards have been matched
          if (matched === sources.length) {
            document.getElementById('board').className = 'win';
            document.getElementById('message').textContent = 'All matched!';
          }
        } else {
          // disable flips for a second until cards are flipped back
          document.getElementById('board').removeEventListener('click', flipCard, false);
          // turn both cards back after a 1 sec delay
          setTimeout(function () {
            flipBack(flipped);
            flipped = null;
            flipBack(event.target.id);
            document.getElementById('board').addEventListener('click', flipCard, false);
          }, 1000);
        }
      }
    }
  }
}
function flipBack(elementId) {
  document.getElementById(elementId).alt = 'back';
  document.getElementById(elementId).src = 'circuit4.svg';
}
function vanish(elementId) {
  document.getElementById(elementId).className = 'matched';
}
// Register event handler

document.getElementById('board').addEventListener('click', flipCard, false);
