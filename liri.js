require("dotenv").config();

//Node Dependencies
var axios = require("axios");
var Spotify = require("node-spotify-api");
var keys = require("./keys.js");
var spotify = new Spotify(keys.spotify);

var fs = require("fs");
var moment = require("moment");
moment().format();

// USER INPUT
// Take two arguments.
// The first will be the action (i.e. "concert-this", etc.)
// The second will be the user query

var action = process.argv[2];
var value = process.argv.slice(3).join(" ");

// We will then create a switch-case statement (if-else would also work).
// The switch-case will direct which function gets run.
function runLiri() {
    if(value.length === 0 && action !== "do-what-it-says"){
        console.log ("You didn't enter a value");
        return;
}
  switch (action) {
    case "concert-this":
      getEvent(value);
      break;

    case "spotify-this-song":
      getSong(value);
      break;

    case "movie-this":
      getMovie(value);
      break;

    case "do-what-it-says":
      doIt();
      break;

    default:
        console.log("You didn't type enough info")
  }
}

// SPOTIFY FUNCTION
function getSong(value) {
  spotify.search({ type: "track", query: value, limit: 20 }, function(
    err,
    data
  ) {
    if (err) {
      return console.log("Error occurred: " + err);
    }
    // console logs the album - works
    console.log(data.tracks.items[0].album.name);
    // console logs the track name - works
    console.log(data.tracks.items[0].name);
    // console logs the preview link - works
    console.log(data.tracks.items[0].preview_url);
    // console logs the preview link - works
    console.log(data.tracks.items[0].album.artists[0].name);
  });
}
// If no song is provided then your program will default to "The Sign" by Ace of Base.

// BANDS IN TOWN FUNCTION

function getEvent(value) {
  // We then run the request with axios module on a URL with a JSON
  axios
    .get(
      "https://rest.bandsintown.com/artists/" +
        value +
        "/events?app_id=82903670-0296-4442-8d00-9bee2e833665"
    )
    .then(function(response) {
      console.log("The venue location is: " + response.data[0].venue.name);
      console.log(
        "The date is: " + moment(response.data[0].datetime).format("MM/DD/YY")
      );
    }).catch(function (err) {
       console.log("Error occurred: " + err);
    })
}

// OMDB FUNCTION

function getMovie(value) {
  // We then run the request with axios module on a URL with a JSON
  axios
    .get(
      "http://www.omdbapi.com/?t=" +
        value +
        "&y=&plot=short&tomatoes=true&apikey=d4a1f9c8"
    )
    .then(function(response) {
      // console log the ttile - WORKING
      console.log("The movie title is: " + response.data.Title);
      // Console log imdbRating - WORKING
      console.log("This movie came out: " + response.data.Year);
      // Console log imdbRating - WORKING
      console.log("The movie's rating is: " + response.data.imdbRating);
      // Console log rating - WORKING
      console.log("The movie's Rotten Tomatoes rating is: " + response.data.tomatoRating);
      console.log("The movie was produced in: " + response.data.Country);
      console.log("The movie language is: " + response.data.Language);
      console.log("The movie plot is: " + response.data.Plot);
      console.log("The actors in the movie are: " + response.data.Actors);
      //console.log(JSON.stringify(response.data, null, 2));
    });
}

// READ.TXT SECTION
function doIt() {
  // This block of code will read from the "random.txt" file.
  // The code will store the contents of the reading inside the variable "data"
  fs.readFile("random.txt", "utf8", function(error, data) {
    // If the code experiences any errors it will log the error to the console.
    if (error) {
      return console.log("Sorry theres a problem");
    }

    // We will then print the contents of data
    // console.log(data);

    var Arr = data.split(",");
    // console.log(Arr);

    value = Arr[1];
    action = Arr[0]
    // console.log(value);

    getSong(value);
  });
}

runLiri();

