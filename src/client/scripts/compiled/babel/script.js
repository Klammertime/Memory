'use strict';

/*
 * Memory Game
 */
(function () {
    'use strict';

    // Sources array contains img'file names with corresponding alt attribute.

    var sources = [],
        deck = [],
        image = {},
        Card,
        card,
        flipped,
        matched;

    Card = function Card(category, file, alt) {
        this.category = category;
        this.file = file;
        this.alt = alt;
    };

    card = new Card('robots', 'img/robots/robots2.svg', 'robot2');

    Card.prototype.createSources = function (category) {
        var imgLocation, imgAlt;
        sources = [];
        for (var i = 1; i < 9; i++) {
            imgLocation = 'img/' + category + '/' + category + i + '.svg';
            imgAlt = category + i;
            sources.push(new Card(category, imgLocation, imgAlt));
        }
    };

    card.createSources('robots');

    // Shuffle method called on any array to shuffle it in place.
    Array.prototype.shuffle = function () {
        var j,
            i = this.length;

        if (i === 0) {
            return this;
        } else {
            while (--i) {
                j = Math.floor(Math.random() * (i + 1));
                var _ref = [this[j], this[i]];
                this[i] = _ref[0];
                this[j] = _ref[1];
            }
            return this;
        }
    };

    // Array deck represents cards.
    deck = [];
    // Image object maps cards to an image in the sources array.
    image = {};

    Card.prototype.initGame = function () {
        // In deck: each image represented twice; contains index of corresponding image in sources array.
        for (var i = 0, s = sources.length; i < s; i++) {
            deck.push(i);
            deck.push(i);
        }
        deck.shuffle();
        // Assign an image (denoted by the index) to each card element.
        for (var j = 0, l = 2 * sources.length; j < l; j++) {
            image['card_' + j] = deck[j];
        }
    };
    flipped = null; // Last card flipped if still open.
    matched = 0; // Number of pairs matched.
    card.initGame();

    Card.prototype.flipBack = function (elementId) {
        document.getElementById(elementId).alt = 'back';
        document.getElementById(elementId).src = 'img/electronicons/electronicons1.svg';
    };

    Card.prototype.vanish = function (elementId) {
        document.getElementById(elementId).className = 'matched';
    };

    Card.prototype.flipCard = function (event) {
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
                        document.getElementById('board').removeEventListener('click', card.flipCard, false);

                        // Turn both cards back after a 1 sec delay.
                        setTimeout(function () {
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

    Card.prototype.changeCardBack = function (category) {
        var imgBackLocation, imgList, imgListArray;

        imgBackLocation = 'img/' + category + '/' + category + '1.svg';
        imgList = document.querySelectorAll('img.card');
        imgListArray = Array.prototype.slice.call(imgList);
        imgListArray.forEach(function (val, ind, arr) {
            val.src = imgBackLocation;
        });
    };

    document.getElementById('board').addEventListener('click', card.flipCard, false);

    Card.prototype.handleDragStart = function (event) {
        this.createSources(event.target.id);
    };

    Card.prototype.handleDragDrop = function (event) {
        if (event.preventDefault) {
            event.preventDefault();
        }
    };

    // Neccessary to make drop work, weird but necessary.
    Card.prototype.handleDragOver = function (event) {
        if (event.preventDefault) {
            event.preventDefault();
        }
        return false;
    };

    /* Using cardCategories element allows for event delegation and one event listeners
    instead of the card choice number. Event listener needs to be on dragstart for drag and drop to work. */
    document.getElementById('cardCategories').addEventListener('dragstart', function (event) {
        card.handleDragStart(event);
    }, false);

    document.getElementById('board').addEventListener('dragover', card.handleDragOver, false);
    document.getElementById('board').addEventListener('drop', card.handleDragDrop, false);
})();