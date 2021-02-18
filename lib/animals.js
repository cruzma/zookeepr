const fs = require("fs");
const path = require("path");

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
};

function findById(id, animalsArray){
    const result = animalsArray.filter(animal =>animal.id === id)[0];
    return result
};

//this function will accept the POST route's req.body value and the array we want to add the data to
//in this case the array will be animalsArray because the function is for adding a new animal to the catalog
function createNewAnimal(body, animalsArray) {
    const animal = body;
    animalsArray.push(animal);
    fs.writeFileSync(
      path.join(__dirname, '../data/animals.json'),
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
};

//functions being exported
module.exports = {
    filterByQuery,
    findById,
    createNewAnimal,
    validateAnimal
  };