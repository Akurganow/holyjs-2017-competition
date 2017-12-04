'use strict';

class Letter {
    constructor(element, index) {
        this.element = element;
        this.index = index;
        this.height = Math.ceil(this.element.offsetHeight);
        this.width = Math.ceil(this.element.offsetWidth);
        this.top = this.element.offsetTop;
        this.left = this.element.offsetLeft;
    }

    displaceToStart(isInverted) {
        this.top = 0;
        this.left = 0;

        this.removeClass('displaced');
        this.draw(isInverted);
    }

    displaceToRand(top, left, isInverted) {
        this.top = top;
        this.left = left;

        this.addClass('displaced');
        this.draw(isInverted);
    }

    draw(isInverted) {
        this.element.style.top = this.top + 'px';
        this.element.style.left = this.left + 'px';

        if (isInverted) {
            this.addClass('inverted');
        } else {
            this.removeClass('inverted');
        }
    }

    addClass(className) {
        this.element.classList.add(className);
    }

    removeClass(className) {
        this.element.classList.remove(className);
    }
}

function ready() {
    var opts;

    let displaceTimeoutId;
    let body = document.body;
    let logo = body.getElementsByClassName('logo')[0];
    let letters = [];

    initOpts();

    for (let i = 0; i < logo.getElementsByClassName('letter').length; i++) {
        letters.push(new Letter(logo.getElementsByClassName('letter')[i], i));
    }

    logo.onmousemove = function () {
        clearTimeout(displaceTimeoutId);
        displaceLetters(false);

        displaceTimeoutId = setTimeout(function () {
            displaceLetters(true);
        }, 5000)
    };

    function displaceLetters(toStartPosition) {
        letters.forEach(function (letter) {
            if (toStartPosition) {
                letter.displaceToStart(isInverted(0, letter.height));
            } else {
                let top = letterTopPosition(letter);

                letter.displaceToRand(
                    top,
                    letterLeftPosition(letter),
                    isInverted(top, letter.height)
                );
            }
        });
    }

    function letterTopPosition(letter) {
        return randomValue(opts.minTop, opts.maxTop - letter.height);
    }

    function letterLeftPosition(letter) {
        let index = letter.index;
        let minLeft;
        let maxLeft = opts.maxLeft - letter.width;

        if (index !== 0) {
            let prevElem = letters[index - 1];
            minLeft = prevElem.left + prevElem.width;
        } else {
            minLeft = opts.minLeft;
        }

        for (let i = index + 1; i < letters.length; i++) {
            maxLeft -= letters[i].width;
        }

        return randomValue(minLeft, maxLeft);
    }

    function isInverted(top, height) {
        return (top > (opts.invertedTop - height / 2));
    }

    function initOpts() {
        opts = {
            minTop: 0,
            maxTop: body.offsetHeight,
            minLeft: 0,
            maxLeft: body.offsetWidth,
            invertedTop: body.getElementsByClassName('navbar')[0].offsetHeight
        };
    }

    body.onresize = function () {
        initOpts();
        displaceLetters(true);
    }
}

function randomValue(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

document.addEventListener("DOMContentLoaded", ready);