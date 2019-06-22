const express = require("express");
const app = express();
const port = 3000;

const controller = require("./lib/controller.js");

app.use(express.urlencoded({
    extended: false
}));

app.get("/", (req, res) => {
    let movies = controller.getAllMovies().then(movies => {
        res.send(movies);
    });
});

app.get("/movie/:id", (req, res) => {
    controller.getMovieById(req.params.id).then(movie => {
        res.send(movie);
    });
});

app.post("/movies", (req, res) => {
    controller.saveMovie(req.body.title).then(movie => {
        if (movie) {
            res.status(200).send(movie);
        } else {
            res.status(510).send({
                error: "Cannot add the movie. The movie already exists in the database."
            });
        }
    });
});

app.delete("/movies", (req, res) => {
    controller.deleteMovie(req.body.id).then(() => {
        res.status(200).send({
            message: "Movie deleted succesfully"
        });
    });
});

app.put("/movies", (req, res) => {
    controller.updateMovie(req.body.id, req.body.title).then(updateMovie => {
        res.status(200).send(updateMovie);
    });
});

app.listen(port, () => console.log("Listening on port " + port));
