const mysql = require("mysql");
const _ = require("lodash");

let connection = mysql.createConnection({
    host: "localhost",
    user: "test",
    password: "1234",
    database: "omdb"
});

connection.connect(function(err) {
    if (err) {
        console.error("An error occurred while connecting:", err);
        return;
    }

    console.log("Connection successful as ID:", connection.threadId);
});

connection.query("CREATE DATABASE IF NOT EXISTS omdb", function(error, results, fields) {
    if (error) throw error;
    console.log(results);
});

let createTableStatement = `CREATE TABLE IF NOT EXISTS movies (
   id int NOT NULL PRIMARY KEY AUTO_INCREMENT,
   actors varchar(255),
   awards varchar(255),
   country varchar(255),
   director varchar(255),
   genre varchar(255),
   imdbRating varchar(255),
   language varchar(255),
   plot varchar(255),
   poster varchar(255),
   rated varchar(255),
   released varchar(255),
   runtime varchar(255),
   title varchar(255)
) AUTO_INCREMENT=1000;`;

connection.query(createTableStatement, function(error, results, fields) {
    if (error) throw error;
    console.log(results);
});

let database = {
    getAllMovies: function() {
        return new Promise((resolve, reject) => {
            connection.query("SELECT * FROM movies", function(error, results, fields) {
                if (error) reject(error);
                resolve(results);
            });
        });
    },
    saveMovie: function(movie) {
        return database.checkMovieExists(movie.Title).then(movieExists => {
            if(!movieExists){
                let data = {
                    "actors": "",
                    "awards": "",
                    "country": "",
                    "director": "",
                    "genre": "",
                    "imdbRating": "",
                    "language": "",
                    "plot": "",
                    "poster": "",
                    "rated": "",
                    "released": "",
                    "runtime": "",
                    "title": "",
                };

                // Convert movie attributes names to camelCase. Note: it is not recursive.
                let normalizedData = _.mapKeys(movie, (value, key) => _.camelCase(key));
                for (prop in data) {
                    data[prop] = normalizedData[prop];
                }

                return new Promise((resolve, reject) => {
                    connection.query({
                            sql: "INSERT INTO movies(actors, awards, country, director, genre, imdbRating, language, plot, poster, rated, released, runtime, title) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
                            timeout: 40000,
                            values: [data.actors, data.awards, data.country,
                                   data.director, data.genre, data.imdbRating,
                                   data.language, data.plot, data.poster,
                                   data.rated, data.released, data.runtime,
                                   data.title]
                        },
                        function(error, results, fields) {
                            if (error) reject(error);
                            // Add missing ID attribute in the returned data (but the ID is successfully saved in the database)
                            data["id"] = results.insertId;
                            resolve(data);
                        });
                    });
            } else {
                console.log("Cannot add the movie. The movie already exists in the database.");
            }
        })
    },
    checkMovieExists: function(title) {
        return new Promise((resolve, reject) => {
            connection.query({
                    sql: "SELECT EXISTS(SELECT 1 FROM movies WHERE title=?)",
                    timeout: 40000,
                    values: [title]
                },
                function(error, results, fields) {
                    if (error) reject(error);
                    let movieExists = _.values(results[0])[0];
                    resolve(movieExists);
                });
        });
    },
    getMovieById: function(movieKey) {
        return new Promise((resolve, reject) => {
            connection.query({
                    sql: "SELECT * FROM movies WHERE id=?",
                    timeout: 40000,
                    values: [movieKey]
                },
                function(error, results, fields) {
                    if (error) reject(error);
                    resolve(results[0]);
                });
        });
    },
    deleteMovie: function(movieKey) {
        return new Promise((resolve, reject) => {
            connection.query({
                    sql: "DELETE FROM movies WHERE id = ?",
                    timeout: 40000,
                    values: movieKey
                },
                function(error, results, fields) {
                    if (error) reject(error);
                    resolve();
                });
        });
    },
    updateMovie: function(movieKey, changedData){
        return new Promise((resolve, reject) => {
            connection.query({
                    sql: "UPDATE movies SET title = ? WHERE id = ?",
                    timeout: 40000,
                    values: [changedData, movieKey]
                },
                function(error, results, fields) {
                    if (error) reject(error);
                    resolve();
                });
        });
    }
};

module.exports = database;
