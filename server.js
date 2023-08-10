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
    res.status(200).json(artists);
});

//get artists by id
app.get('/api/artists/:id', (req, res) => {
    const idArtist = parseInt(req.params.id); //convert string to int !!!!
    const artist = artists.find(artist => artist.id === idArtist);
    if (!artist) {
      res.status(404).json('artist not found');
    }
    res.status(200).json(artist);
});


//search artist 
app.get('/api/artists/search/:name', (req, res) => {
  const nameArtist = req.params.name.toUpperCase();
  console.log(nameArtist)
  const artist = artists.find(artist => artist.name.toUpperCase() === nameArtist);
  console.log(artist);
  if (!artist) {
    res.status(404).json('artist not found');
  }
  res.json(artist);
});

//add artist
app.post('/api/artists', (req, res) => {
  const artist = req.body;


  if (!artist || !artist.image || !artist.name || !artist.albumsCount || !artist.id) {
    res.status(400).json({ error: 'bad request' });
    return;
  } 
  
  else {
    // add to tab
    artists.push(artist);
    //update json
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
    //update tableau
    artists.splice(index, 1);
    //update json
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

app.put('/api/artists/:id', (req, res) => {
  //check artist exist
  const idArtist = parseInt(req.params.id);
  const artist = artists.find(artist => artist.id === idArtist);

  if (!artist) {
    res.status(404).json({ error: 'artist not found' });
    return;
  }

  //catch entry data
  else {
    const artistUpdate = req.body;
    if (!artistUpdate || !artistUpdate.image || !artistUpdate.name || !artistUpdate.albumsCount || !artistUpdate.id) {
      res.status(400).json({ error: 'bad request' });
      return;
    }
    else {
      var index = artists.indexOf(artist);
      //update tab data
      artists.splice(index, 1, artistUpdate);
      //update json
      const updateArtists = JSON.stringify(artists);
      fs.writeFile('./artists.json', updateArtists,'utf8', err => {
        if(err){
          res.status(500).json({ error: 'Internal server error' });
          return;
        }
        res.status(200).json(artistUpdate);
      });
    }
  }
}
);






/*
- Que faire si on a 1 000 000 d’artistes ? Utiliser une vraie db (mongoDB)
- Comment modifier un artiste existant ? Avec une route PUT
- Comment améliorerez vous votre api ? (sécurité, architecture, qualité de code, maintenabilité etc…)

- a chaque modification le fichier json est rééecrit entièrement à partir du tableau ce qui n'est pas très optimal pour de grandes données
-authentification de l'utilisateur qui utilise l'api
-chiffrement des données entre client et serveur
-modèle de données dans un autre fichier pour vérif des données entrantes (mongoDB)
-protection injection SQL

*/
