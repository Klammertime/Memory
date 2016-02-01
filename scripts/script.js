/*
 * Memory Game
 */
"use strict";

// Sources array contains images'file names with corresponding alt attribute.
var sources = {
    "robots": [
        {
            file: 'img/robot29.svg',
            alt: 'robot29'
        }, {
            file: 'img/robot30.svg',
            alt: 'robot30'
        }, {
            file: 'img/robot26.svg',
            alt: 'robot26'
        }, {
            file: 'img/robot25.svg',
            alt: 'robot25'
        }, {
            file: 'img/robot22.svg',
            alt: 'robot22'
        }, {
            file: 'img/robot17.svg',
            alt: 'robot17'
        }, {
            file: 'img/robot21.svg',
            alt: 'robot21'
        }, {
            file: 'img/rounded46.svg',
            alt: 'rounded46'
        }
    ],
    "movies": [
        {
            file: 'img/movie80.svg',
            alt: 'movie80'
        }, {
            file: 'img/movie81.svg',
            alt: 'movie81'
        }, {
            file: 'img/movie82.svg',
            alt: 'movie82'
        }, {
            file: 'img/movie83.svg',
            alt: 'movie83'
        }, {
            file: 'img/movie84.svg',
            alt: 'movie84'
        }, {
            file: 'img/movie85.svg',
            alt: 'movie85'
        }, {
            file: 'img/movie86.svg',
            alt: 'movie86'
        }, {
            file: 'img/movie87.svg',
            alt: 'movie87'
        }
    ]
};

// Shuffle method called on any array to shuffle it in place.
Array.prototype.shuffle = function() {
    var i = this.length;
    var j;
    if (i === 0) return this;
    while (--i) {
        j = Math.floor(Math.random() * (i + 1));
        [this[i], this[j]] = [this[j], this[i]];
    }
    return this;
};

// Array deck represents cards.
var deck = [];
// Image object maps cards to an image in the sources array.
var image = {};

function initGame() {
    // In deck: each image represented twice;
    // contains index of cooresponding image in sources array.
    for (var i = 0; i < sources.movies.length; i++) {
        deck.push(i);
        deck.push(i);
    }
    // Shuffle deck array created above.
    deck.shuffle();
    // Assign an image (denoted by the index) to each card element.
    for (var j = 0; j < 2 * sources.movies.length; j++) {
        image['card_' + j] = deck[j];
    }
}
var flipped = null; // Last card flipped if still open.
var matched = 0; // Number of pairs matched.
initGame();

function flipCard(event) {
    if (event.target.className === 'card') {
        if (event.target.alt === 'back') {
            var imageIndex = image[event.target.id];
            event.target.src = sources.movies[imageIndex].file;
            event.target.alt = sources.movies[imageIndex].alt;
            if (!flipped) {
                flipped = event.target.id;
            } else {
                if (image[flipped] === image[event.target.id]) {
                    // Match found.
                    vanish(flipped);
                    vanish(event.target.id);
                    flipped = null;
                    matched++;
                    // If all cards have been matched, user wins.
                    if (matched === sources.movies.length) {
                        document.getElementById('board').className = 'win';
                        document.getElementById('message').textContent = 'All matched!';
                    }
                } else {
                    // Disable flips for 1 second until cards flipped back.
                    document.getElementById('board').removeEventListener('click', flipCard, false);
                    // Turn both cards back after a 1 sec delay.
                    setTimeout(function() {
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
    document.getElementById(elementId).src = 'img/circuit4.svg';
}

function vanish(elementId) {
    document.getElementById(elementId).className = 'matched';
}

// Register event handler.
document.getElementById('board').addEventListener('click', flipCard, false);