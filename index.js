const baseURL =
  "https://fsa-puppy-bowl.herokuapp.com/api/2310-FSA-ET-WEB-FT-SF/";

const main = document.querySelector("main");

const state = {
  allPlayers: [],
};

// retrieve data from API
const getPlayersFromAPI = async () => {
  try {
    const response = await fetch(`${baseURL}players`);
    const jsonData = await response.json();
    const playersObject = jsonData.data;

    console.log("Success:", playersObject);
    updateState(playersObject);
    render();
  } catch (error) {
    console.error("Error:", error);
  }
};

// set our state object to equal
const updateState = (data) => {
  state.allPlayers = data.players;
};
// strictly the HTML for the form
const generateFormHTML = () => {
  main.innerHTML = `
  <article>
    <section id="add-player">
    <form>
    <h2>Add Player</h2>
      <label for="name">Name:</label>
      <input name="name" id="name" type="text" />
      
      <label for="image">ImageURL</label>
      <input name="image" id="image" type="text" />
      
      <label for="breed">Breed</label>
      <input name="breed" id="breed" type="text" />

      <input id="field" name="status" type="radio" value="field" />
      <label for="field">Field</label>      

      <input id="bench" name="status" type="radio" value="bench" />
      <label for="bench">Bench</label>
      <button>submit</button>
    </form>
    </section>                  
  </article>
  `;
};

// generate the full card by invoing functions that populate the card
const generateCard = (data) => {
  main.style.flexWrap = "wrap";

  const article = document.createElement("article");
  generateImg(article, data);
  generateHeading(article, data);
  turnIntoLink(article, data);
  main.appendChild(article);
};

// creates h2 and appends it to card
const generateHeading = (article, data) => {
  const h2 = document.createElement("h2");
  h2.innerHTML = data.name;
  article.appendChild(h2);
};
// creates Image and appends it to card
const generateImg = (article, data) => {
  const img = document.createElement("img");
  img.src = data.imageUrl;
  article.appendChild(img);
};
// turns the card into clickable link
const turnIntoLink = (article, data) => {
  article.addEventListener("click", () => {
    main.style.flexWrap = "nowrap";
    main.style.alignItems = "center";
    const html = `
      <div>
      <img id="selected" src="${data.imageUrl}">
      </div>
      <div>
      <h2>Name: ${data.name}</h2>
      <p>Breed: ${data.breed}</p>
      <p>Status: ${data.status}</p>
      <button onClick="render()">Back to roster</button>
      <button id="deletePlayer" style="background-color: red;">Delete Player</button>
      </div>
    `;
    main.innerHTML = html;
    const deleteButton = document.querySelector("#deletePlayer");
    deleteButton.addEventListener("click", () => {
      deletePlayer(data);
    });
  });
};

// give form a listener to update database when submitted
const getFormData = () => {
  const form = document.querySelector("form");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = form.querySelector('input[name="name"]').value;
    const image = form.querySelector('input[name="image"]').value;
    const breed = form.querySelector('input[name="breed"]').value;
    const status = form.querySelector('input[name="status"]:checked').value;

    const newPlayer = {
      name: name,
      imageUrl: image,
      breed: breed,
      status: status,
    };
    state.allPlayers.unshift(newPlayer);
    pushPlayerDataToAPI(newPlayer);

    form.reset();
    render();
  });
};

// push the new created player from the form into the API
const pushPlayerDataToAPI = async (player) => {
  try {
    const response = await fetch(`${baseURL}players`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(player),
    });
  } catch (error) {
    console.error("Error:", error);
  }
};

// Delete the player from our local state object
const deletePlayer = (data) => {
  const playerObjIndex = state.allPlayers.findIndex((v) => v.id === data.id);
  state.allPlayers.splice(playerObjIndex, 1);
  removeFromAPI(data);
  render();
};

// delete the player from the API we are using
const removeFromAPI = async (playerObj) => {
  try {
    const response = await fetch(`${baseURL}players/${playerObj.id}`, {
      method: "DELETE",
    });
    console.log("Success:", response);
  } catch (error) {
    console.error("Error:", error);
  }
};

// refresh the HTML, see if form data has been submitted, and populate cards based off data
const render = () => {
  generateFormHTML(); // Refreshes the HTML and creates the first card on the web page
  getFormData(); // retreivs the form data to create the new player
  state.allPlayers.map((v) => {
    generateCard(v); // map over every player in our state object and generate a card for each one in our state
  });
};

getPlayersFromAPI(); // start the program by fetching the api
