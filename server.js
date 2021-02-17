const express = require('express');
const { animals } = require('./data/animals');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3001;
const app = express();

//note the USE function below is a method executed by Express.js server that mounts a function to the server that our requests will pass through before getting to the intended end point
//the functions we can mount to our server are referred to as middleware

// this intructs the server to have all the files readily available and to not "gate it behind a server endpoint"
//ex all js and css file the html is calling
app.use(express.static('public'));

//parse incoming string or array data
//this method takes incoming POST data and cnoverts it to key/value pairings that can be accessed in the req.body object
//the extended: true option inside the method call informs our server that there may be sub-array data nested in it as well, so it needs to look deep into the POST data as possible to parse all of the data correctly
app.use(express.urlencoded({ extended: true}));

//parse incoming JSON data
//the below method takes incoming POST data in the form of JSON and parses it inot the req.body Javascript object.
app.use(express.json())

//the above 2 methods all ways need to be setup everytiume you create a server that's looking to accept POST data


//this function will take in req.query as an argument and filter through the animals accordingly, returning the new filtered array
function filterByQuery(query, animalsArray) {
    let personalityTraitsArray = [];
    // Note that we save the animalsArray as filteredResults here:
    let filteredResults = animalsArray;
    if (query.personalityTraits) {
      // Save personalityTraits as a dedicated array.
      // If personalityTraits is a string, place it into a new array and save.
      if (typeof query.personalityTraits === 'string') {
        personalityTraitsArray = [query.personalityTraits];
      } else {
        personalityTraitsArray = query.personalityTraits;
      }
      // Loop through each trait in the personalityTraits array:
      personalityTraitsArray.forEach(trait => {
        // Check the trait against each animal in the filteredResults array.
        // Remember, it is initially a copy of the animalsArray,
        // but here we're updating it for each trait in the .forEach() loop.
        // For each trait being targeted by the filter, the filteredResults
        // array will then contain only the entries that contain the trait,
        // so at the end we'll have an array of animals that have every one 
        // of the traits when the .forEach() loop is finished.
        filteredResults = filteredResults.filter(
          animal => animal.personalityTraits.indexOf(trait) !== -1
        );
      });
    }
    if (query.diet) {
      filteredResults = filteredResults.filter(animal => animal.diet === query.diet);
    }
    if (query.species) {
      filteredResults = filteredResults.filter(animal => animal.species === query.species);
    }
    if (query.name) {
      filteredResults = filteredResults.filter(animal => animal.name === query.name);
    }
    // return the filtered results:
    return filteredResults;
}

function findById(id, animalsArray){
    const result = animalsArray.filter(animal =>animal.id === id)[0];
    return result
}


//this function will accept the POST route's req.body value and the array we want to add the data to
//in this case the array will be animalsArray because the function is for adding a new animal to the catalog
function createNewAnimal(body, animalsArray) {
    const animal = body;
    animalsArray.push(animal);
    fs.writeFileSync(
      path.join(__dirname, './data/animals.json'),
      JSON.stringify({ animals: animalsArray }, null, 2)
    );
    return animal;
}
// the above writeFilesync writes to our animals.json in the data subdirectory by using the method path.join() to join the value of _dirname which represnets the file we execute the code in. with the path to the animals.json file.
//next we need to save the javascript array data as JSON, so we use JSON.Stringify() to convert it.
  
//Validation
//In the POST route callback before we create the data and add it to the catalog, data will be passed through here first
function validateAnimal(animal) {
    if (!animal.name || typeof animal.name !== 'string') {
      return false;
    }
    if (!animal.species || typeof animal.species !== 'string') {
      return false;
    }
    if (!animal.diet || typeof animal.diet !== 'string') {
      return false;
    }
    if (!animal.personalityTraits || !Array.isArray(animal.personalityTraits)) {
      return false;
    }
    return true;
  }



//note on GET and POST requests
//1. Express.js will take the URL we made a request to and check to see if it's one of the of the URL endpoints we have defined
//2. once it finds a match , it then checks to see the method of the request and detemrines which callback function to execute

//this get() requires 2 arguments
//string of file path
//using res(short for repsonse) to send the string Hello!
//fyi we make a GET request everytime we enter a URL in the the browser
app.get('/api/animals', (req,res) => {
    let results = animals;
    if(req.query){
        results = filterByQuery(req.query, results);
    }
    res.json(results);
});

app.get('/api/animals/:id', (req, res) => {
    const result = findById(req.params.id, animals);
    if(result){
        res.json(result);
    } else {
        res.send(404);
    }
});

//this is like the GET method
//this method listens for the POST request, not GET requests
//POST requests differ in that they represent the action of a client requesting the server to accept data rather than vice versa
app.post('/api/animals', (req, res) => {
  // set id based on what the next index of the array will be
  req.body.id = animals.length.toString();

  // if any data in req.body is incorrect, send 400 error back
  if (!validateAnimal(req.body)) {
     //this is a response method to relay a message to the client making the request
    res.status(400).send('The animal is not properly formatted.');
  } else {
    // add animal to json file and animals array in this function
    const animal = createNewAnimal(req.body, animals);
    res.json(animal);
  }
});

//the "/" bring us to the root route of the server, this is the rout used to create a homepage for a server.
// this GET route only needs to respond with an HTML page to display in the browser hence the .sendFile() as opposed to the .json()
// notice again that we are using the path module to ensure we are finding the correct location for the HTML code we want displayed
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, './public/index.html'));
});

//this route will take us to animals
//notice the endpoint is just animals, when we create routes we need to stay organized an dset expectations of what type of data is being transferred at that endpoint.
app.get('/animals', (req, res) => {
  res.sendFile(path.join(__dirname, './public/animals.html'));
});

app.get('/zookeepers', (req, res) => {
  res.sendFile(path.join(__dirname, './public/zookeepers.html'));
});

app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`);
  });

    // add animal to json file and animals array in this function