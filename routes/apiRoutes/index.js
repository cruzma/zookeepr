const router = require('express').Router();
const animalRoutes = require('../apiRoutes/animalRoutes');

router.use(require('./zookeeperRoutes'));
router.use(animalRoutes);

module.exports = router;

//here we are employingrouter as before but this time we are having it use the module exported from animalRoutes.js(js is imnplied when supplying files names in require)

//this way we are using apiRoutes/index.js as a central hub for all routing functions we may want to add to the application.
//as our application grows it w ill become a very effiecient mechanism for managing your routing code and keeping it modularized