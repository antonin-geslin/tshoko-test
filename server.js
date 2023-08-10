const express = require('express');
const fs = require('fs');

//configuration express
const app = express()
const port = 3000
const data = require('./artists.json')

//middleware for json
app.use(express.json());

//check server up
app.listen(port, () => {
  console.log(`Le serveur écoute sur le port ${port}`);
});


//load data

let artists = [];

fs.readFile('./artists.json', 'utf8', (err, data) => {
    if(err){
      console.error('error reading file', err);
      return;
    }

    try {
      artists = JSON.parse(data);
      console.log('artists data loaded');
    } catch (error) {
      console.error('error parsing data', error);
    }

});


//get all artists
app.get('/api/artists', (req, res) => {
    res.json(artists);
});

//get artists by id
app.get('/api/artists/:id', (req, res) => {
    const idArtist = parseInt(req.params.id); //convert string to int !!!!
    console.log(idArtist);
    const artist = artists.find(artist => artist.id === idArtist);
    if (!artist) {
      console.log('artist not found');
    }
    res.json(artist);
});

