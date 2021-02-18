const path = require('path');
const router = require('express').Router();

//the "/" bring us to the root route of the server, this is the rout used to create a homepage for a server.
// this GET route only needs to respond with an HTML page to display in the browser hence the .sendFile() as opposed to the .json()
// notice again that we are using the path module to ensure we are finding the correct location for the HTML code we want displayed
router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../../public/index.html'));
});

//this route will take us to animals
//notice the endpoint is just animals, when we create routes we need to stay organized an dset expectations of what type of data is being transferred at that endpoint.
router.get("/animals", (req, res) => {
  res.sendFile(path.join(__dirname, "../../public/animals.html"));
});

router.get("/zookeepers", (req, res) => {
  res.sendFile(path.join(__dirname, "../../public/zookeepers.html"));
});

module.exports = router;