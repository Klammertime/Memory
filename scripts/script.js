/*
 * Memory Game
 */
"use strict";

// Sources array contains img'file names with corresponding alt attribute.

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
deck = [];
// Image object maps cards to an image in the sources array.
image = {};

Card.prototype.initGame = function() {
    // In deck: each image represented twice;
    // contains index of cooresponding image in sources array.
    for (var i = 0; i < sources.length; i++) {
        deck.push(i);
        deck.push(i);
    }
    // Shuffle deck array created above.
    deck.shuffle();
    // Assign an image (denoted by the index) to each card element.
    for (var j = 0; j < 2 * sources.length; j++) {
        image['card_' + j] = deck[j];
    }
};
flipped = null; // Last card flipped if still open.
matched = 0; // Number of pairs matched.
card.initGame();

Card.prototype.flipBack = function(elementId) {
    document.getElementById(elementId).alt = 'back';
    document.getElementById(elementId).src = 'img/circuit4.svg';
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
                    // Match found.
                    card.vanish(flipped);
                    card.vanish(event.target.id);
                    flipped = null;
                    matched++;
                    // If all cards have been matched, user wins.
                    if (matched === sources.length) {
                        document.getElementById('board').className = 'win';
                        document.getElementById('message').textContent = 'All matched!';
                    }
                } else {
                    // Disable flips for 1 second until cards flipped back.
                    document.getElementById('board').removeEventListener('click', this.flipCard, false);

                    // Turn both cards back after a 1 sec delay.
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



document.getElementById('board').addEventListener('click', card.flipCard, false);

Card.prototype.handleDragStart = function(event) {
    this.createSources(event.target.id);
};

Card.prototype.handleDragDrop = function(event) {
    if (event.preventDefault) event.preventDefault();
};

// Neccessary to make drop work, weird but necessary.
Card.prototype.handleDragOver = function(event) {
    if (event.preventDefault) event.preventDefault();
    return false;
};

/* Using cardCategories element allows for event delegation and one event listeners
instead of the card choice number. Event listener needs to be on dragstart for drag and drop to work. */
document.getElementById('cardCategories').addEventListener('dragstart', function(event) {
    card.handleDragStart(event);
}, false);


document.getElementById('board').addEventListener('dragover', card.handleDragOver, false);
document.getElementById('board').addEventListener('drop', card.handleDragDrop, false);



