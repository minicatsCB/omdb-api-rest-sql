const core = require("./core");
const database = require("./database");

const baseUrl = "https://www.omdbapi.com/?apikey=";
const apiKey = "yourApiKey";

let controller = {
    getAllMovies: database.getAllMovies,
    saveMovie: function(movieTitle) {
        let url = baseUrl + apiKey + "&t=" + movieTitle;
        return new Promise((resolve, reject) => {
            core.requestData(url).then(database.saveMovie).then(resolve);
        })
    },
    getMovieById: database.getMovieById,
    deleteMovie: database.deleteMovie,
    updateMovie: database.updateMovie
}

module.exports = controller;
