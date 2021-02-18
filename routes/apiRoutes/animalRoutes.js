const { filterByQuery, findById, createNewAnimal, validateAnimal } = require('../../lib/animals');
const { animals } = require('../../data/animals');
const router = require('express').Router();

//note on GET and POST requests
//1. Express.js will take the URL we made a request to and check to see if it's one of the of the URL endpoints we have defined
//2. once it finds a match , it then checks to see the method of the request and detemrines which callback function to execute

//this get() requires 2 arguments
//string of file path
//using res(short for repsonse) to send the string Hello!
//fyi we make a GET request everytime we enter a URL in the the browser
router.get("/animals", (req, res) => {
    let results = animals;
    if (req.query) {
      results = filterByQuery(req.query, results);
    }
    res.json(results);
  });
  
  router.get("/animals/:id", (req, res) => {
    const result = findById(req.params.id, animals);
    if (result) {
      res.json(result);
    } else {
      res.send(404);
    }
  });

//this is like the GET method
//this method listens for the POST request, not GET requests
//POST requests differ in that they represent the action of a client requesting the server to accept data rather than vice versa
router.post("/animals", (req, res) => {
    // set id based on what the next index of the array will be
    req.body.id = animals.length.toString();
  
    // if any data in req.body is incorrect, send 400 error back
    if (!validateAnimal(req.body)) {
      res.status(400).send("The animal is not properly formatted.");
    } else {
      const animal = createNewAnimal(req.body, animals);
      res.json(animal);
    }
  });

  module.exports  = router;