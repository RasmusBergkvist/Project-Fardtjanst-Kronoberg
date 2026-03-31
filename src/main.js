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



/*Bokningsfomulär*/
const bookingForm = document.querySelector('#booking-form');
const trips = document.querySelector('#trips');


let bookings = [];

bookingForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const ticketId = Date.now();  //skapar biljett-id efter ms 


    //Hämtar värde från formuläret   
    const tripTypeInput = bookingForm.trip.value;
    const fromInput = bookingForm.from.value;
    const toInput = bookingForm.to.value;
    const departureInput = bookingForm.departure.value;
    const returnInput = bookingForm.returning.value;



    //Rensar felmeddelande
    document.getElementById('from-error').innerHTML = "";
    document.getElementById('to-error').innerHTML = "";
    document.getElementById('departure-error').innerHTML = "";
    document.getElementById('returning-error').innerHTML = "";

    let error = false;

//Kontrollerar att adress är ifylld
    if (fromInput === "") {
        document.getElementById('from-error').innerHTML = '<span class="material-symbols-outlined">error</span> Fyll i adress för avresan';
        error = true;
    }

    if (toInput === "") {
        document.getElementById('to-error').innerHTML = '<span class="material-symbols-outlined">error</span> Fyll i adress för återresan';
        error = true;
    }
//Kontrollerar val av datum och tid för avresan
    if (departureInput === "") {
        document.getElementById('departure-error').innerHTML = '<span class="material-symbols-outlined">error</span> Datum och tid för avresan saknas';
        error = true;

    } else if (new Date() > (new Date(departureInput))) {
        document.getElementById('departure-error').innerHTML = '<span class="material-symbols-outlined">error</span> Resans datum eller tid har redan passerat';
        error = true;

    }

//Kontrollerar val av datum och tid för återresan
    if (tripTypeInput === 'return') {
        if (returnInput === "") {
            document.getElementById('returning-error').innerHTML = '<span class="material-symbols-outlined">error</span>  Datum och tid för återresan saknas';
            error = true;
        }
        else if (new Date(returnInput) <= (new Date(departureInput))) {
            document.getElementById('returning-error').innerHTML = '<span class="material-symbols-outlined">error</span>  Återresan får inte vara tidigare än avresan';
            error = true;

        }
    }

    if (error) {
        return;
    }


    const wheelchair = bookingForm.wheelchair.checked;
    const walker = bookingForm.walker.checked;
    const assistant = bookingForm.assistant.checked;
    const otherAidMessage = bookingForm.otherAidMessage.value;

    const companions = bookingForm.companion.value;
    const pet = bookingForm.pet.checked;
    const baggage = bookingForm.baggage.checked;
    const recurring = bookingForm.recurring.value;


    bookingForm.submit();
});















