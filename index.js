const partiesURL = "http://localhost:3000/parties";
const commentsURL = "http://localhost:3000/comments";

const newPartyButton = document.getElementById('new-party')
const allParties = document.getElementById('list-panel')
const partyContainer = document.getElementById('list')
const showPartyElement = document.getElementById('show-panel') 


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

// Showing a party
partyContainer.addEventListener('click', event => {
    const partyId = event.target.dataset.id
    fetchParty(partyId)
})

function fetchParty(partyId){
    fetch(`${partiesURL}/${partyId}`)
        .then(resp => resp.json())
        .then(party => {
            showPartyElement.innerHTML =  renderPartyDetails(party) 
        })
}

function renderPartyDetails(party) {
    return `
    <h1>${party.title}</h1>
    <button data-id="${party.id}" id="party-like">❤️ Like : ${party.likes}</button>
    <h3>Venue: ${party.venue}</h3>
    <h6>Date: ${party.date}</h6>
    <p>Info: ${party.description}</p>
    <h4>Comments:</h4>
    <ul class="comment-info">${party.comments ? renderComments(party) : drawCommentBox(party)}
    </ul>
    `
}

function renderComments (party) {
    return party.comments.map(comment => { 
             return renderSingleComment(comment)
     }).join('') + `<br><p>` + drawCommentBox(party)
}

function renderSingleComment(comment) {
    return  `<p>👽: ${comment.body}</p>
    <button data-id="${comment.id}", id="comment-like" >❤️ Like : ${comment.likes}</button>
    `
}

function drawCommentBox(party) {
    return `<textarea name="comment"></textarea><button id = "comment-button" data-party-id="${party.id}">Add Comment</button>`
}

//Updating Comment and Party Like
showPartyElement.addEventListener("click", event =>{

    //Comment like
    if (event.target.id === 'comment-like') {
      
        const commentId = event.target.dataset.id
      const splittedTextcontent = event.target.textContent.split(' ')

        fetch(`${commentsURL}/${commentId}`, {
            method: "PATCH",
            headers: {
                "Content-type": 'application/json',
                "Accept": 'application/json'
            },
            body: JSON.stringify({
                likes: parseInt(splittedTextcontent[3]) + 1
            })
        })
        .then(resp => resp.json())
        .then(comment => {
           const buttonElement = document.querySelector('#comment-like')
           const splitted = buttonElement.textContent.split(' ')
           splitted[3] = `${comment.likes}`
           buttonElement.textContent = splitted.join(' ')
        })
    }

    //Party Like
    if (event.target.id === 'party-like') {

        const partyId = event.target.dataset.id
        const splittedTextcontent = event.target.textContent.split(' ')
        
        fetch(`${partiesURL}/${partyId}`, {
            method: "PATCH",
            headers: {
                "Content-type": 'application/json',
                "Accept": 'application/json'
            },
            body: JSON.stringify({
                likes: parseInt(splittedTextcontent[3]) + 1
            })
        })
        .then(resp => resp.json())
        .then(party => {
           const buttonElement = document.querySelector('#party-like')
           const splitted = buttonElement.textContent.split(' ')
           splitted[3] = `${party.likes}`
           buttonElement.textContent = splitted.join(' ')
        })
    }
})

//Creating a new Party - Form
newPartyButton.addEventListener('click', event => {

    showPartyElement.innerHTML = `
        <form id="form">
            <input type="text" name="title" placeholder="Party Name"><br>
            <input type="text" name="description" placeholder="Description">
            <input type="text" name="venue" placeholder="VENUE!">
            <input type="datetime-local" name="date" placeholder="DATE!" value="2019-11-12T19:30">
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
                if (party.message){
                    showPartyElement.innerHTML = `<p class="error">${party.message}</p>`
                } else{
                    partyContainer.innerHTML += renderParty(party)
                    showPartyElement.innerHTML = renderPartyDetails(party)
                }
                
            })
        }
    })
})

//Adding a new comment
showPartyElement.addEventListener('click', event =>{
    if(event.target.textContent === 'Add Comment'){
        event.preventDefault()
        const partyId = event.target.dataset.partyId
        const commentBody = event.target.previousSibling.value

        fetch(commentsURL, {
            method: "POST",
            headers: {
                "Content-type": 'application/json',
                "Accept": 'application/json'
            },
            body: JSON.stringify({
                party_id: parseInt(partyId),
                body: commentBody,
                likes: 0
            })
        })
        .then(resp => resp.json())
        .then(comment => {
            const commentContainer = document.querySelector('.comment-info')
            if (comment.message){
                fetchParty(partyId)
                showPartyElement.innerHTML += `<p class="error">${comment.message}</p>`
                // showPartyElement.innerText=`${comment.message}`
                // debugger
                // + drawCommentBox(comment.party)
            } else{
                
                fetchParty(partyId)
            }
        })


    }


})
