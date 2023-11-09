const baseURL =
  "https://fsa-puppy-bowl.herokuapp.com/api/2310-FSA-ET-WEB-FT-SF/";

const main = document.querySelector("main");

const state = {
  allPlayers: [],
};

const getPlayersFromAPI = async () => {
  try {
    const getPlayersEndpoint = await fetch(`${baseURL}players`);
    const getPlayersJson = await getPlayersEndpoint.json();
    const getPlayersObject = getPlayersJson.data;

    console.log("Success:", getPlayersObject);
    updateState(getPlayersObject);
    render();
  } catch (err) {
    console.error("Error:", err);
  }
};

const updateState = (data) => {
  state.allPlayers = data.players;
};

const render = () => {
  state.allPlayers.map((v) => {
    console.log(v);
    generateCard(v);
  });
};

const generateCard = (data) => {
  const article = document.createElement("article");
  generateImg(article, data);
  generateHeading(article, data);
  main.appendChild(article);
};

const generateHeading = (article, data) => {
  const h2 = document.createElement("h2");
  h2.innerHTML = data.name;
  article.appendChild(h2);
};

generateImg = (article, data) => {
  const img = document.createElement("img");
  img.src = data.imageUrl;
  article.appendChild(img);
};

getPlayersFromAPI();
// render the local state to the browser
// allow for their to be a form for adding puppies
// add option to remove puppies when you click one
