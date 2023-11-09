const baseURL =
  "https://fsa-puppy-bowl.herokuapp.com/api/2310-FSA-ET-WEB-FT-SF/";

const main = document.querySelector("main");

const state = {
  allPlayers: [],
};

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

const updateState = (data) => {
  state.allPlayers = data.players;
};

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

const render = () => {
  generateFormHTML();
  getFormData();
  state.allPlayers.map((v) => {
    generateCard(v);
  });
};

const generateCard = (data) => {
  main.style.flexWrap = "wrap";

  const article = document.createElement("article");
  generateImg(article, data);
  generateHeading(article, data);
  turnIntoLink(article, data);
  main.appendChild(article);
};

const generateHeading = (article, data) => {
  const h2 = document.createElement("h2");
  h2.innerHTML = data.name;
  article.appendChild(h2);
};

const generateImg = (article, data) => {
  const img = document.createElement("img");
  img.src = data.imageUrl;
  article.appendChild(img);
};

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
      <button id="deletePlayer">Delete Player</button>
      </div>
    `;
    main.innerHTML = html;
    const deleteButton = document.querySelector("#deletePlayer");
    deleteButton.addEventListener("click", () => {
      deletePlayer(data);
    });
  });
};

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
    render();
  });
};

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

const deletePlayer = (data) => {
  const playerIndex = state.allPlayers.findIndex((v) => v.id === data.id);
  state.allPlayers.splice(playerIndex, 1);
  console.log(playerIndex);
  render();
};

getPlayersFromAPI();
// allow for their to be a form for adding puppies
// add option to remove puppies when you click one
