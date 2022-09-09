require('dotenv').config();

const express = require('express');
const hbs = require('hbs');
const SpotifyWebApi = require('spotify-web-api-node');

// require spotify-web-api-node package here:

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
});

// Retrieve an access token
spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error));

// Our routes go here:--------------------------

// index route
app.get('/', (req, res) => {

    res.render('index')
})

// artist search

app.get('/artist-search', (req, res, next) => {
    let myParam = req.params
    let myQuery = req.query
    console.log(myParam)
    console.log(myQuery)
    spotifyApi
        .searchArtists(req.query.artist)
        .then(data => {
            console.log('The received data from the API: ', data.body.artists.items);
            // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'

            res.render('artist-search-results')
        
        })
        .catch(err => console.log('The error while searching artists occurred: ', err));

    })
    
    
// albums route
app.get('/albums/:artistId', (req, res, next) => {
    // Get albums by a certain artist
    spotifyApi.getArtistAlbums('43ZHCT0cAZBISjO8DG9PnE')
        .then(function (data) {
            console.log('Artist albums', data.body);
        }, function (err) {
            console.error(err);
        });
})

// Album tracks
app.get('/albums/:albumId', (req, res, next) => {
    spotifyApi.getAlbumTracks('41MnTivkwTO3UUJ8DrqEJJ', {
            limit: 5,
            offset: 1
        })
        .then(function (data) {
            console.log(data.body);
        }, function (err) {
            console.log('Something went wrong!', err);
        });
    res.render('')
})



app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));