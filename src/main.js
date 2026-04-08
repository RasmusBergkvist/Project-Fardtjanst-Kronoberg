"use strict";

import './scss/main.scss'

document.addEventListener('DOMContentLoaded', () => {

/* Mobilmeny */
    const menuButton = document.getElementById('mobile-menu');
    const menu = document.getElementById('menu');


    menuButton.addEventListener('click', () => {
        menu.classList.toggle('active')

        const isOpen = menu.classList.contains('active');
        //*Ändrar symbol om beroende på om menyn är öppen eller stängd.
        if (isOpen) {
            menuButton.innerHTML = '✕';
            menuButton.setAttribute('aria-label', 'Stäng menyn');
        } else {
            menuButton.innerHTML = '&#9776;';
            menuButton.setAttribute('aria-label', 'Öppna menyn');
        }

    });


    //Anropar funktionerna för att skriva ut biljetterna till sidan
    printTicket();
    printTicketIndex();



    //Hämtar innehållet för alla bokningar i diven med id trips
    const allTrips = document.querySelector('#trips');
    //Kontroll att div:en trips finns
    if (allTrips) {


        //Lyssnar på klick i diven
        allTrips.addEventListener('click', (event) => {

            //Kontroll att klickat element har klassen cancel-booking
            if (event.target.classList.contains('cancel-booking')) {


                //Hämtar ticketId från knappen för resan
                let ticketId = event.target.getAttribute('data-id');

                cancelBooking(ticketId);

                //Kontroll att klickat element har klassen change-booking
            } else if (event.target.classList.contains('change-booking')) {
                //Hämtar ticketId från knappen för resan
                let ticketId = event.target.getAttribute('data-id');

                changeBooking(ticketId)


            }
        });

    }


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
//Hämtar bokningar från local storage
const bookedTrips = localStorage.getItem('bookings');
if (bookedTrips) {
    bookings = JSON.parse(bookedTrips)
} else {
    bookings = [{
        ticketId: 1115,
        tripType: 'return',
        from: 'Ljungbyvägen 11, Älmhult',
        to: 'Allbogatan 5, Liatorp',
        departure: '2026-04-16T18:00',
        returning: '2026-04-16T21:00',
        wheelchair: 'true',
        companions: 1
    },
    {
        ticketId: 1102,
        tripType: 'oneway',
        from: 'Ljungbyvägen 11, Älmhult',
        to: 'Storgatan 9, Ljungby',
        departure: '2026-04-13T08:00',
        wheelchair: 'true'
    }

    ];
}

//Sotera bokningarna i fallande ordning
bookings.sort((a, b) => b.ticketId - a.ticketId);

/*Omboka resa */
function changeBooking(ticketId) {
    //Sparar id för bokning som ska ändras
    localStorage.setItem('rebookTrip', ticketId)

    window.location.href = '/omboka-resa';
}

// Hämtar uppgifter som ska ändras
const editId = localStorage.getItem('rebookTrip');

//Letar upp matchade id som ska ändras 
const editTrip = bookings.find(trip => trip.ticketId == editId);

//Om resan finns hämtas uppgifer och ladda till sidan Omboka resa
if (editTrip) {
    const bookingForm = document.querySelector('#booking-form');

    //Fyller i uppgifter i bokningsformuläret från ordinare bokning.
    if (bookingForm) {
        if (editTrip.tripType === 'return') {
            bookingForm.trip[1].checked = true;
            returningTrip.classList.remove('hidden');

        } else {
            bookingForm.trip[0].checked = true;
            returningTrip.classList.add('hidden');
        }

        bookingForm.from.value = editTrip.from;
        bookingForm.to.value = editTrip.to;
        bookingForm.departure.value = editTrip.departure;

        if (editTrip.returning) {
            bookingForm.returning.value = editTrip.returning;
        } else {
            bookingForm.returning.value = "";
        }

        if (editTrip.wheelchair) {
            bookingForm.wheelchair.checked = true;
        } else {
            bookingForm.wheelchair.checked = false;
        }

        if (editTrip.walker) {
            bookingForm.walker.checked = true;
        } else {
            bookingForm.walker.checked = false;
        }

        if (editTrip.assistant) {
            bookingForm.assistant.checked = true;
        } else {
            bookingForm.assistant.checked = false;
        }

        if (editTrip.otherAidMessage) {
            bookingForm.otherAidMessage.value = editTrip.otherAidMessage;
        } else {
            bookingForm.otherAidMessage.value = "";
        }

        if (editTrip.companions) {
            bookingForm.companions.value = editTrip.companions;
        } else {
            bookingForm.companions.value = "";
        }

        if (editTrip.pet) {
            bookingForm.pet.checked = true;
        } else {
            bookingForm.pet.checked = false;
        }

        if (editTrip.baggage) {
            bookingForm.baggage.checked = true;
        } else {
            bookingForm.baggage.checked = false;
        }

        if (editTrip.recurring === 'daily') {
            bookingForm.recurring.value = 'daily';
        } else if (editTrip.recurring === 'weekdays') {
            bookingForm.recurring.value = 'weekdays';
        } else if (editTrip.recurring === 'weekends') {
            bookingForm.recurring.value = 'weekends';
        } else if (editTrip.recurring === 'weekly') {
            bookingForm.recurring.value = 'weekly';
        } else if (editTrip.recurring === 'monthly') {
            bookingForm.recurring.value = 'monthly';
        } else {
            bookingForm.recurring.value = "";
        }
    }




}



/*Bokningsfomulär*/
const bookingForm = document.querySelector('#booking-form');

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

        const companions = bookingForm.companions.value;
        const pet = bookingForm.pet.checked;
        const baggage = bookingForm.baggage.checked;
        const recurring = bookingForm.recurring.value;



        //Felmeddelande
        const fromError = document.getElementById('from-error');
        const toError = document.getElementById('to-error')
        const departureError = document.getElementById('departure-error');
        const returningError = document.getElementById('returning-error');

        //Rensar felmeddelande
        fromError.innerHTML = "";
        toError.innerHTML = "";
        departureError.innerHTML = "";
        returningError.innerHTML = "";

        let error = false;

        //Kontrollerar att adress är ifylld
        if (fromInput === "") {
            fromError.innerHTML = '<span class="material-symbols-outlined">error</span> Fyll i adress för avresan';
            error = true;
        }

        if (toInput === "") {
            toError.innerHTML = '<span class="material-symbols-outlined">error</span> Fyll i adress för återresan';
            error = true;
        }
        //Kontrollerar val av datum och tid för avresan
        if (departureInput === "") {
            departureError.innerHTML = '<span class="material-symbols-outlined">error</span> Datum och tid för avresan saknas';
            error = true;

        } else if (new Date() > (new Date(departureInput))) {
            departureError.innerHTML = '<span class="material-symbols-outlined">error</span> Resans datum eller tid har redan passerat';
            error = true;

        }

        //Kontrollerar val av datum och tid för återresan
        if (tripTypeInput === 'return') {
            if (returnInput === "") {
                returningError.innerHTML = '<span class="material-symbols-outlined">error</span>  Datum och tid för återresan saknas';
                error = true;
            }
            else if (new Date(returnInput) <= (new Date(departureInput))) {
                returningError.innerHTML = '<span class="material-symbols-outlined">error</span>  Återresan får inte vara tidigare än avresan';
                error = true;

            }
        }

        //Om fel finns, avbryt
        if (error) {
            return;
        }

        //Vilket id som ska användas nytt eller befintligt(vid ombokning)
        let bookingId = "";

        if (editId) {
            //Id sätts till ombokningsid
            bookingId = Number(editId);

            //Letar upp och tar bort den gamla uppgifterna på från arrayen
            bookings = bookings.filter(trip => trip.ticketId !== Number(editId));

            //Rensar local storage innan nya bokningen görs
            localStorage.removeItem('rebookTrip');
        } else {
            //Om ny bokning ska göras sätts ett nytt bokningsnummer
            bookingId = Date.now()
        }

        //Skapar nytt objekt med värden från bokningen
        const newBooking = {
            ticketId: bookingId,
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

        //Lägger till bokningen/uppdatera bokningen
        bookings.push(newBooking);
        localStorage.setItem('bookings', JSON.stringify(bookings));

        //Kontrollerar och skickar användaren till rätt bekräftelsesidan
        if (editId) {
            window.location.href = '/ombokad-resa.html';

        } else {
            window.location.href = '/bokad-resa.html';

        }
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
    const trips = document.querySelector('.my-bookings #trips');


    //Kontroll att div:en trips finns
    if (trips) {

        //Rensar tidigare innehåll innan ny bokning läggs till
        trips.innerHTML = "";

        if (bookings.length === 0) {
            trips.innerHTML = '<p class ="ingress">Inga resor bokade.</p>';
        }

        bookings.forEach(trip => {

            let tripTypeText;

            //Skriver ut enkel resa eller tur och retur med rätt ikon beroende på val.
            if (trip.tripType === "return") {
                tripTypeText = '<span class="material-symbols-outlined" aria-hidden="true">sync_alt</span> Tur och retur';
            } else {
                tripTypeText = '<span class="material-symbols-outlined" aria-hidden="true">trending_flat</span> Enkel resa';
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
            } else if (trip.recurring === "weekly") {
                recurringTrips = `<p>Samma datum och tid varje vecka</p>`;
            } else if (trip.recurring === "monthly") {
                recurringTrips = `<p>Samma datum och tid varje månad</p>`;
            }

            let recurringTripsHeading = "";
            if (recurringTrips !== "") {
                recurringTripsHeading = `<h4>Återkommande resor:</h4>`;
            }

            //Skapar HTML-element och skriver ut till DOM
            const tripDetails = `
                <article class="booking-details" id="${trip.ticketId}">
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
                    <button class="change-booking" name="changeButton" data-id="${trip.ticketId}"> <span
                    class="material-symbols-outlined" aria-hidden="true">change_circle</span>Omboka resa</button>

                    <button class="cancel-booking" name="cancelButton"data-id="${trip.ticketId}"> <span
                    class="material-symbols-outlined" aria-hidden="true">cancel</span>Avboka resa</button>
                </article>`;

            //Lägger till bokningen i trips.
            trips.innerHTML += tripDetails;
        });

    }

}

/*Biljettinformation på startsidan */
function printTicketIndex() {
    const trips = document.querySelector('.index-booking #trips');
    //Kontroll att div:en trips finns
    if (trips) {

        //Rensar tidigare innehåll innan ny bokning läggs till
        trips.innerHTML = "";

        if (bookings.length === 0) {
            trips.innerHTML = '<p class ="ingress">Inga resor bokade.</p>';
        }

        bookings.forEach((trip) => {
            let tripTypeText;

            //Skriver ut enkel resa eller tur och retur med rätt ikon beroende på val.
            if (trip.tripType === "return") {
                tripTypeText = '<span class="material-symbols-outlined" aria-hidden="true">sync_alt</span> Tur och retur';
            } else {
                tripTypeText = '<span class="material-symbols-outlined" aria-hidden="true">trending_flat</span> Enkel resa';
            }

            let departureTime = formattedDateTime(trip.departure);
            let returningTime = formattedDateTime(trip.returning);


            let returnText = "";
            if (trip.returning) {
                returnText = `<p><strong>Återresa:</strong> ${returningTime}</p>`;
            }


            //Skapar HTML-element och skriver ut till DOM
            const tripDetailsIndex = `
            <article class="trip-item">
                    <h3>Biljett: #${trip.ticketId}</h3>
                    <p><strong>Typ av resa:</strong> ${tripTypeText}</p>
                    <br>
                    <p><strong>Från:</strong> ${trip.from}</p>
                    <p><strong>Till:</strong> ${trip.to}</p>
                    <br>
                    <p><strong>Avresa:</strong> ${departureTime}</p>
                    ${returnText}
                    <br>
                    <a href="/mina-bokade-resor#${trip.ticketId}"><img src="./icons/link.svg" alt="ikon med en länkkedja">Bokningsinformation</a>
        </article>
        
        `
            trips.innerHTML += tripDetailsIndex;



        });
    }

}



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


/* Tillgänglighetsformulär */
const a11yForm = document.querySelector('.form-a11y');

if (a11yForm) {
    a11yForm.addEventListener('submit', (event) => {
        event.preventDefault();

        //Hämtar inpurvärde och element från felmeddelande.
        const fullname = document.getElementById('fullname').value;
        const fullnameError = document.getElementById('fullname-error');

        const url = document.getElementById('url').value;
        const urlError = document.getElementById('url-error');

        const message = document.getElementById('message').value;
        const messageError = document.getElementById('message-error');

        //Rensar felmeddelande 
        fullnameError.innerHTML = "";
        urlError.innerHTML = "";
        messageError.innerHTML = "";


        let a11yError = false;


        //Kontroll att namn är ifyllt.
        if (fullname.length <= 4) {
            fullnameError.innerHTML = '<span class="material-symbols-outlined">error</span> Fyll i för- och efternamn';
            a11yError = true;
        }
        //Kontroll att url är  ifyllt.
        if (url === "") {
            urlError.innerHTML = '<span class="material-symbols-outlined">error</span> Fyll i länkadress';
            a11yError = true;
        }
        //Kontroll att meddelande är  ifyllt.
        if (message === "") {
            messageError.innerHTML = '<span class="material-symbols-outlined">error</span> Fyll i meddelanderutan';
            a11yError = true;
        }

        //Om fel, avbryt.
        if (a11yError) {
            return;
        }
        //Om allt är rätt ifyllt, skicka till bekräftelsesidan
        window.location.href = './synpunkter-tillganglighet.html';
    });

}