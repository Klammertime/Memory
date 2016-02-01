/*
 * Memory Game
 */
"use strict";

// Sources array contains images'file names with corresponding alt attribute.
var sources = {
    "birdFeathers": [
        {
            file: 'img/birdFeathers/bird152.svg',
            alt: 'bird152'
        }, {
            file: 'img/birdFeathers/bird153.svg',
            alt: 'bird153'
        }, {
            file: 'img/birdFeathers/bird154.svg',
            alt: 'bird154'
        }, {
            file: 'img/birdFeathers/bird155.svg',
            alt: 'bird155'
        }, {
            file: 'img/birdFeathers/bird156.svg',
            alt: 'bird156'
        }, {
            file: 'img/birdFeathers/bird157.svg',
            alt: 'bird157'
        }, {
            file: 'img/birdFeathers/bird158.svg',
            alt: 'bird158'
        }, {
            file: 'img/birdFeathers/bird159.svg',
            alt: 'bird159'
        }
    ],
    "robots": [
        {
            file: 'img/robots/robot29.svg',
            alt: 'robot29'
        }, {
            file: 'img/robots/robot30.svg',
            alt: 'robot30'
        }, {
            file: 'img/robots/robot26.svg',
            alt: 'robot26'
        }, {
            file: 'img/robots/robot25.svg',
            alt: 'robot25'
        }, {
            file: 'img/robots/robot22.svg',
            alt: 'robot22'
        }, {
            file: 'img/robots/robot17.svg',
            alt: 'robot17'
        }, {
            file: 'img/robots/robot21.svg',
            alt: 'robot21'
        }, {
            file: 'img/robots/rounded46.svg',
            alt: 'rounded46'
        }
    ],
    "movies": [
        {
            file: 'img/movies/movie80.svg',
            alt: 'movie80'
        }, {
            file: 'img/movies/movie81.svg',
            alt: 'movie81'
        }, {
            file: 'img/movies/movie82.svg',
            alt: 'movie82'
        }, {
            file: 'img/movies/movie83.svg',
            alt: 'movie83'
        }, {
            file: 'img/movies/movie84.svg',
            alt: 'movie84'
        }, {
            file: 'img/movies/movie85.svg',
            alt: 'movie85'
        }, {
            file: 'img/movies/movie86.svg',
            alt: 'movie86'
        }, {
            file: 'img/movies/movie87.svg',
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

var cardCategory = "robots";

function initGame() {
    // In deck: each image represented twice;
    // contains index of cooresponding image in sources array.
    for (var i = 0; i < sources[cardCategory].length; i++) {
        deck.push(i);
        deck.push(i);
    }
    // Shuffle deck array created above.
    deck.shuffle();
    // Assign an image (denoted by the index) to each card element.
    for (var j = 0; j < 2 * sources[cardCategory].length; j++) {
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
            event.target.src = sources[cardCategory][imageIndex].file;
            event.target.alt = sources[cardCategory][imageIndex].alt;
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
                    if (matched === sources[cardCategory].length) {
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



var handleDragStart = function(event) {
    cardCategory = event.target.id; // Grab character ID from event.target
    // document.body.className = event.target.id; // Set body class to class w/ same name as ID
};

var handleDragDrop = function(event) {
    if (event.preventDefault) event.preventDefault();
};

// Neccessary to make drop work, weird but necessary.
var handleDragOver = function(event) {
    if (event.preventDefault) event.preventDefault();
    return false;
};

/* Using characters element allows for event delegation and one event listeners
instead of 5. Characters declared at top of app.js with all global variables.
Event listener needs to be on dragstart for drag and drop to work. */
document.getElementById('cardCategories').addEventListener('dragstart', function(event) {
    handleDragStart(event);
}, false);


document.getElementById('board').addEventListener('dragover', handleDragOver, false);
document.getElementById('board').addEventListener('drop', handleDragDrop, false);



