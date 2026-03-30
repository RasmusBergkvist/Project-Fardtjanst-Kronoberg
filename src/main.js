"use strict";

import './scss/main.scss'

document.addEventListener('DOMContentLoaded', () => {


    const menuButton = document.getElementById('mobile-menu');
    const menu = document.getElementById('menu');


    menuButton.addEventListener('click', () => {
        menu.classList.toggle('active')

        const isOpen = menu.classList.contains('active');

        if (isOpen) {
            menuButton.innerHTML = '✕';
            menuButton.setAttribute('aria-label', 'Stäng menyn');
        } else {
            menuButton.innerHTML = '&#9776;';
            menuButton.setAttribute('aria-label', 'Öppna menyn');
        }

    });


});

/** Toogla vid returresa */
const radioButtons = document.querySelectorAll('input[name="trip"]');
const returningTrip = document.querySelector('#returning-trip');

radioButtons.forEach(radioButton => {
    radioButton.addEventListener('change', () => {
        if (radioButton.value === 'return') {
            returningTrip.classList.remove('hidden');
        } else if (radioButton.value === 'oneway') {
            returningTrip.classList.add('hidden');
        }
    });
});


/* Knapp avboka resa */
const cancelButtons = document.querySelectorAll('.cancel-booking');

cancelButtons.forEach(cancelButton => {
    cancelButton.addEventListener('click', (event) => {
        if (!confirm('Är du säker på att du vill avboka resan?')) {
            event.preventDefault();

        } else {
            window.location.href = '/avbokad-resa';
        }
    });
});