const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
const cors = require("cors");
require("dotenv").config();
const POKEDEX = require("./pokedex.json");
const app = express();

const morgansetting = process.env.NODE_ENV === "production" ? "tiny" : "common";

app.use(morgan(morgansetting));
app.use(helmet());
app.use(cors());

app.use(function validateBearerToken(req, res, next) {
  const authToken = req.get("Authorization"); //Note that in postman or making request with code you need Bearer in front of the code for it to work correctly
  const apiToken = process.env.API_TOKEN;
  //Checking the Authorization code from the user matches the code that is in the .env file
  if (!authToken || authToken.split(" ")[1] !== apiToken) {
    return res.status(401).json({ error: "Unauthorized request" });
  } else {
    // move to the next middleware
    next();
  }
});

app.use((error, req, res, next) => {
  let response;
  if (process.env.NODE_ENV === "production") {
    response = { error: { message: "server error" } };
  } else {
    response = { error };
  }
  res.status(500).json(response);
});

const PORT = process.env.PORT || 8000; //Heroku assigns. Heroku sets an environmental variable called PORT to the number it's assigned for your application instance. Setting an environmental variable called PORT is a convention for many cloud hosting providers.Your application will need to check if the PORT variable is set and use that value when appropriate.If the environmental variable isn't set, your application can fall back to the number you would like as a default.

app.listen(PORT);

const validTypes = [
  `Bug`,
  `Dark`,
  `Dragon`,
  `Electric`,
  `Fairy`,
  `Fighting`,
  `Fire`,
  `Flying`,
  `Ghost`,
  `Grass`,
  `Ground`,
  `Ice`,
  `Normal`,
  `Poison`,
  `Psychic`,
  `Rock`,
  `Steel`,
  `Water`,
];

app.get("/pokemon", function handleGetPokemon(req, res) {
  let response = POKEDEX.pokemon;
  let name = req.query.name;
  let type = req.query.type;

  // filter our pokemon by name if name query param is present
  if (name) {
    response = response.filter((pokemon) =>
      // case insensitive searching
      pokemon.name.toLowerCase().includes(name.toLowerCase())
    );
  }

  // filter our pokemon by type if type query param is present
  if (type) {
    response = response.filter((pokemon) => pokemon.type.includes(type));
  }

  res.json(response);
});

// app.get("/pokemon", handleGetPokemon);
