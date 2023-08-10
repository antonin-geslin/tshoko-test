//import express and fs

const express = require('express');
const fs = require('fs');

//configuration express
const app = express()
const port = 3000

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
    if (!artists) {
      res.status(404).json('artists not found');
    }
    res.json(artists);
    res.status(200);
});

//get artists by id
app.get('/api/artists/:id', (req, res) => {
    const idArtist = parseInt(req.params.id); //convert string to int !!!!
    const artist = artists.find(artist => artist.id === idArtist);
    if (!artist) {
      res.status(404).json('artist not found');
    }
    res.json(artist);
    res.status(200);
});


//add artist
app.post('/api/artists', (req, res) => {
  const artist = req.body;


  if (!artist || !artist.image || !artist.name || !artist.albumsCount || !artist.id) {
    res.status(400).json({ error: 'bad request' });
    return;
  } 
  
  else {
    // ajout au tableau
    artists.push(artist);
    //mise à jour du json
    const updateArtists = JSON.stringify(artists); 
    fs.writeFile('./artists.json', updateArtists,'utf8', err => {
      if(err){
        res.status(500).json({ error: 'Internal server error' });
        return;
      }
  
    });
    res.status(200).json(artist);
  }
}
);

//delete artist
app.delete('/api/artists/:id', (req, res) => {
  const idArtist = parseInt(req.params.id);
  const artist = artists.find(artist => artist.id === idArtist);

  if (!artist) {
    res.status(404).json({ error: 'artist not found' });
    return;
  } 
  
  else {
    var index = artists.indexOf(artist);
    //mise à jour du tableau
    artists.splice(index, 1);
    //mise à jour du json
    const updateArtists = JSON.stringify(artists);
    fs.writeFile('./artists.json', updateArtists,'utf8', err => {
      if(err){
        console.error('Error writing JSON file:', err);
        res.status(500).json({ error: 'Internal server error' });
        return;
      }
    });
    res.status(200).json(artist);
  }
}
);

