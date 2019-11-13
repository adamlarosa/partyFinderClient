const partiesURL = "http://localhost:3000/parties";

const newPartyButton = document.getElementById('new-party')
const allParties = document.getElementById('list-panel')
const partyContainer = document.getElementById('list')
const showPartyElement = document.getElementById('show-panel')   

newPartyButton.addEventListener('click', event => {

    showPartyElement.innerHTML = `
        <form id="form">
            <input type="text" name="title" placeholder="Party Name"><br>
            <input type="text" name="description" placeholder="Description">
            <input type="text" name="venue" placeholder="VENUE!">
            <input type="datetime" name="date" placeholder="DATE!">
            <input type="submit">
        </form>
    `
    document.getElementById('form').addEventListener('click', event => { 
        event.preventDefault()
        const formElement = event.target.parentElement
        if (event.target.type == 'submit') {
            fetch(partiesURL, {
                method: "POST",
                headers: {
                    "Content-type": 'application/json',
                    "Accept": 'application/json'
                },
                body: JSON.stringify({
                    'title': formElement.title.value,
                    'description': formElement.description.value,
                    'venue': formElement.venue.value,
                    'date': formElement.date.value,
                    'likes': 0
                })
            })
            .then(resp => resp.json())
            .then(party => {

                partyContainer.innerHTML += renderParty(party)
                showPartyElement.innerHTML = renderPartyDetails(party) // PROBLEM
            //     debugger
            })
        }
    })
})



function renderParty(party) {
return `
<li data-id="${party.id}">${party.title}</li>`
}

//fetching all party names
fetch(partiesURL)
    .then(resp => resp.json())
    .then(json => {
        json.map(party => {
            partyContainer.innerHTML += renderParty(party)
        })
    })

function renderParty(party) {
    return `
    <li data-id="${party.id}">${party.title}</li>`
}

// draw parties when clicked on
partyContainer.addEventListener('click', event => {
    const partyId = event.target.dataset.id
    fetch(`${partiesURL}/${partyId}`)
        .then(resp => resp.json())
        .then(party => {
            showPartyElement.innerHTML =  renderPartyDetails(party) 

        })
})

function renderPartyDetails(party) {
    return `
    <h1>${party.title}</h1>
    <h7>Likes: ${party.likes}</h7>
    <h3>Venue: ${party.venue}</h3>
    <h6>Date: ${party.date}</h6>
    <p>Info: ${party.description}</p>
    <h4>Comments:</h4>
    <ul>${party.comments ? renderSingleComment(party) : "No Comment." }
    </ul>
    `
}

function renderSingleComment (party) {
    party.comments.map(comment => {
        return  `<p>${comment.body}  |  Likes:${comment.likes}</p>`
     })
}

