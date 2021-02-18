const express = require('express');
const { animals } = require('./data/animals');
const fs = require('fs');
const path = require('path');
const apiRoutes = require('./routes/apiRoutes');
const htmlRoutes = require('./routes/htmlRoutes');

const PORT = process.env.PORT || 3001;
const app = express();
app.use('/api', apiRoutes);
app.use('/', htmlRoutes);



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


app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`);
  });

    // add animal to json file and animals array in this function