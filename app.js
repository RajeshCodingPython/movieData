const express = require("express");
const app = express();
const sqlite3 = require("sqlite3");
const { open } = require("sqlite");
const path = require("path");
const dbPath = path.join(__dirname, "moviesData.db");
app.use(express.json());
let db = null;

const instalization = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("http://sarver is runnig");
    });
  } catch (e) {
    console.log(`db error ${e.message}`);
  }
};

instalization();
const changeStyle = (resultAllMovie) => {
  return {
    movieName: resultAllMovie.movie_name,
  };
};
const allobjt = (Eachob) => {
  return {
    directorId: Eachob.director_id,
    directorName: Eachob.director_name,
  };
};
app.get("/movies/", async (request, response) => {
  const getAllMovies = `
    select * from movie`;
  const resultAllMovie = await db.all(getAllMovies);
  const pasical = resultAllMovie.map((eachobiect) => {
    return changeStyle(eachobiect);
  });

  response.send(pasical);
});

app.post("/movies/", async (request, response) => {
  const { directorId, movieName, leadActor } = request.body;

  const addNewMove = `
       INSERT INTO movie(director_id,movie_name,lead_actor)
       VALUES(${directorId},'${movieName}','${leadActor}')`;
  await db.run(addNewMove);
  response.send("Movie Successfully Added");
});
app.get("/movies/:movieId/", async (request, response) => {
  const { movieId } = request.params;
  const getMovieWithID = `
    select * from movie
    where movie_id = ${movieId}`;

  const resultMovie = await db.get(getMovieWithID);
  response.send({
    movieId: resultMovie.movie_id,
    directorId: resultMovie.director_id,
    movieName: resultMovie.movie_name,
    leadActor: resultMovie.lead_actor,
  });
});
app.put("/movies/:movieId/", async (request, response) => {
  const { directorId, movieName, leadActor } = request.body;
  const { movieId } = request.params;
  const updaeMovie = `
  UPDATE movie
  SET 
  director_id = ${directorId},
  movie_name = '${movieName}',
  lead_actor = '${leadActor}'
  where movie_id = ${movieId}
  `;
  await db.run(updaeMovie);
  response.send("Movie Details Updated");
});

app.delete("/movies/:movieId/", async (request, response) => {
  const { movieId } = request.params;
  const deleteMove = `
    delete from movie where movie_id = ${movieId}`;
  await db.run(deleteMove);
  response.send("Movie Removed");
});

app.get("/directors/", async (request, response) => {
  const getAllDirectorNames = `
    select * from Director`;
  const directorNamesAndID = await db.all(getAllDirectorNames);
  const result = directorNamesAndID.map((eachob) => {
    return allobjt(eachob);
  });

  response.send(result);
});

app.get("/directors/:directorId/movies/", async (request, response) => {
  const { directorId } = request.params;
  const getwithad = `
    select * from Director
    where director_id = ${directorId}`;
  const alldb = await db.get(getwithad);
  response.send({
    directorId: alldb.director_id,
    directorName: alldb.director_name,
  });
});

module.exports = app;
