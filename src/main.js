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
    //Hämtar innehållet för alla bokningar i diven med id trips
    const cancelTrip = document.querySelector('#trips');
    //Om det inte finns något i trips görs ingenting.
    if (!cancelTrip) {
        return
    }
    //Lyssnar på klick i diven
    cancelTrip.addEventListener('click', (event) => {

        //Kontroll att klickat element har klassen cancel-booking
        if (event.target.classList.contains('cancel-booking')) {


            //Hämtar ticketId från knappen för resan
            const ticketId = event.target.getAttribute('data-id');

            cancelBooking(ticketId);

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




let bookings;
const bookedTrips = localStorage.getItem('bookings');
if (bookedTrips) {
    bookings = JSON.parse(bookedTrips)
} else {
    bookings = [{
        ticketId: 1115,
        tripType: 'return',
        from: 'Ljungbyvägen 11, Älmhult',
        to: 'Allbogatan 5, Liatorp',
        departure: '2026-03-06T18:00',
        returning: '2026-03-06T21:00',
        wheelchair: 'true',
        companions: 1
    },
    {
        ticketId: 1102,
        tripType: 'oneway',
        from: 'Ljungbyvägen 11, Älmhult',
        to: 'Storgatan 9, Ljungby',
        departure: '2026-03-04T08:00',
        wheelchair: 'true'
    }

    ];
}

//Sotera bokningarna i fallande ordning
bookings.sort((a, b) => b.ticketId - a.ticketId);





/*Bokningsfomulär*/
const bookingForm = document.querySelector('#booking-form');
const trips = document.querySelector('#trips');
if (bookingForm) {
    bookingForm.addEventListener('submit', (event) => {
        event.preventDefault();


        //Hämtar värde från formuläret   
        const tripTypeInput = bookingForm.trip.value;
        const fromInput = bookingForm.from.value;
        const toInput = bookingForm.to.value;
        const departureInput = bookingForm.departure.value;
        const returnInput = bookingForm.returning.value;

        const wheelchair = bookingForm.wheelchair.checked;
        const walker = bookingForm.walker.checked;
        const assistant = bookingForm.assistant.checked;
        const otherAidMessage = bookingForm.otherAidMessage.value;

        const companions = bookingForm.companion.value;
        const pet = bookingForm.pet.checked;
        const baggage = bookingForm.baggage.checked;
        const recurring = bookingForm.recurring.value;



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

        //Om fel finns, avbryt
        if (error) {
            return;
        }


        //Skapar nytt objekt med värden från bokningen
        const newBooking = {
            ticketId: Date.now(),
            tripType: tripTypeInput,
            from: fromInput,
            to: toInput,
            departure: departureInput,
            returning: returnInput,
            wheelchair: wheelchair,
            walker: walker,
            assistant: assistant,
            otherAidMessage: otherAidMessage,
            companions: companions,
            pet: pet,
            baggage: baggage,
            recurring: recurring

        };

        //Lägger till nya bokningen i bokningsarrayen.
        bookings.push(newBooking);

        //Spara till local storage
        localStorage.setItem('bookings', JSON.stringify(bookings));


        bookingForm.submit();

    });
}
/* Avboka resan */
function cancelBooking(ticketId) {
    //Om ticketId inte finns, avbryt funktionen
    if (!ticketId) {
        return
    }

    if (confirm('Är du säker på att du vill avboka resan?')) {
        //Filtrear bort övriga ticketId
        bookings = bookings.filter(trip => trip.ticketId != ticketId);

        //Uppadaterar till Local storage
        localStorage.setItem('bookings', JSON.stringify(bookings));

        // Skickar användaren till sidan avbokad-resa
        window.location.href = '/avbokad-resa';

    }

}

function printTicket() {
    //Kontroll att diven trips finns
    if (trips) {

        //Rensar tidigare innehåll innan ny bokning läggs till
        trips.innerHTML = "";

        bookings.forEach((trip) => {

            let tripTypeText;

            //Skriver ut enkel resa eller tur och retur med rätt ikon beroende på val.
            if (trip.tripType === "return") {
                tripTypeText = '<span class="material-symbols-outlined">sync_alt</span> Tur och retur';
            } else {
                tripTypeText = '<span class="material-symbols-outlined">trending_flat</span> Enkel resa';
            }

            //Formatering av datum och tid

            let departureTime = formattedDateTime(trip.departure);
            let returningTime = formattedDateTime(trip.returning);

            //Om återresa väljs skrivs skrivs formaterat tid och datum ut.
            let returnText = "";

            if (trip.returning) {
                returnText = `<p><strong>Återresa:</strong> ${returningTime}</p>`;
            }
            //Om hjälpmedel väljs skrivs respektive val ut.
            let helpContent = "";
            if (trip.wheelchair) {
                helpContent += `<p>Rullstol</p>`;
            }

            if (trip.walker) {
                helpContent += `<p>Rullator</p>`;
            }

            if (trip.assistant) {
                helpContent += `<p>Ledsagare</p>`;
            }

            if (trip.otherAidMessage) {
                helpContent += `<p>Meddelande: ${trip.otherAidMessage}</p>`;
            }

            let helpHeading = "";
            if (helpContent !== "") {
                helpHeading = `<h4>Hjälpmedel: </h4>`;
            }

            //Om övriga önskemål eller behov väljs, skrivs respektive val ut
            let otherRequestContent = "";
            if (trip.companions > 0) {
                otherRequestContent += `<p>Medresenär: ${trip.companions}</p>`;
            }

            if (trip.pet) {
                otherRequestContent += `<p>Ta med husdjur</p>`;
            }

            if (trip.baggage) {
                otherRequestContent += `<p>Extra bagage</p>`;
            }

            let otherRequestHeading = "";
            if (otherRequestContent !== "") {
                otherRequestHeading = `<h4>Övriga behov eller önskemål: </h4>`;
            }

            //Om återkommande resor väljs, skrivs valt alternativ ut
            let recurringTrips = "";
            if (trip.recurring === "daily") {
                recurringTrips = `<p>Varje dag</p>`;
            } else if (trip.recurring === "weekdays") {
                recurringTrips = `<p>Vardagar (måndag - fredag)</p>`;
            } else if (trip.recurring === "weekends") {
                recurringTrips = `<p>Helger (lördag - söndag)</p>`;
            } else if (trip.recurring === "weeklys") {
                recurringTrips = `<p>Samma datum och tid varje vecka</p>`;
            } else if (trip.recurring === "monthly") {
                recurringTrips = `<p>Samma datum och tid varje månad</p>`;
            }

            let recurringTripsHeading = "";
            if (recurringTrips !== "") {
                recurringTripsHeading = `<h4>Återkommande resor:</h4>`;
            }

            //Skaper HTML-element och skriver ut till DOM
            const tripDetails = `
                <article class="booking-details">
                    <h3>Biljett: #${trip.ticketId}</h3>
                    <p><strong>Typ av resa:</strong> ${tripTypeText}</p>
                    <p><strong>Från:</strong> ${trip.from}</p>
                    <p><strong>Till:</strong> ${trip.to}</p>
                    <p><strong>Avresa:</strong> ${departureTime}</p>
                    ${returnText}

                    ${helpHeading}
                    ${helpContent}
                    ${otherRequestHeading}
                    ${otherRequestContent}
                    ${recurringTripsHeading}
                    ${recurringTrips}

                    <div class="buttons-change-cancel">
                    <button class="change-booking" name="changeButton" value="Omboka resa"
                    aria-label="Omboka resa" aria-label="Boka resa"> <span
                    class="material-symbols-outlined">change_circle</span>Omboka resa</button>

                    <button class="cancel-booking" name="cancelButton" value="Avboka resa"
                    aria-label="Avboka resa" aria-label="Boka resa" data-id="${trip.ticketId}"> <span
                    class="material-symbols-outlined">cancel</span>Avboka resa</button>
                </article>`;

            //Lägger till bokningen i trips.
            trips.innerHTML += tripDetails;
        });




    }

}
printTicket();





//Funktion för att omvanlda datum och tid till rätt format.
function formattedDateTime(dateTimeInput) {
    const dateAndTime = new Date(dateTimeInput);

    //hämtar dag och månad
    let days = dateAndTime.getDate();
    let months = dateAndTime.getMonth();
    let dayOfWeek = dateAndTime.getDay();
    let hours = dateAndTime.getHours();
    let minutes = dateAndTime.getMinutes();

    //Lägg till nolla om värdet < 10
    if (hours < 10) hours = "0" + hours;
    if (minutes < 10) minutes = "0" + minutes;


    //Skapar lista med namn på månader och dagar
    const weekdays = ["Söndag", "Måndag", "Tisdag", "Onsdag", "Torsdag", "Fredag", "Lördag"]; // 0 = söndag
    const monthsName = ["januari", "februari", "mars", "april", "maj", "juni", "juli", "augusti", "september", "oktober", "november", "december"];

    const weekday = weekdays[dayOfWeek];
    const month = monthsName[months];

    const date = ` ${weekday} ${days} ${month} klockan ${hours}.${minutes}`;

    return date;
}







