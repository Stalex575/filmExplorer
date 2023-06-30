let loader = document.getElementById("loading");
let resultsDiv = document.getElementById("results");
let totalResults;
class MovieService {
  async search(title, page = 1) {
    try {
      loader.style.display = "flex";
      const response = await fetch(
        `http://www.omdbapi.com/?apikey=c95a886e&s=${title}&page=${page}`
      );
      const data = await response.json();
      totalResults = data.totalResults;
      loader.style.display = "none";
      return data.Search || noMoviesFound();
    } catch (error) {
      console.error("Error searching for movies:", error);
      return [];
    }
  }
  getMovie(movieId) {
    fetch(`https://www.omdbapi.com/?i=${movieId}&apikey=c95a886e`)
      .then((response) => response.json())
      .then((data) => {
        if (data.response === "True") {
          return data;
        }
      })
      .catch((error) => {
        fetchError(error);
      });
  }
}
function noMoviesFound() {
  let text = document.createElement("h1");
  text.id = "no-found";
  text.innerText = "No movies found.";
  text.style.cssText = "text-align: center; color: #fff; width: 100%";
  resultsDiv.append(text);
}

let searchButton = document.getElementById("search-btn");
let movieService = new MovieService();
let resultsTitle = document.getElementById("results-title");

searchButton.addEventListener("click", function () {
  resultsTitle.style.display = "none";
  let promptElem = document.getElementById("prompt");
  promptElem.classList.remove("prompt-error");
  let prompt = promptElem.value;
  if (!prompt) {
    promptElem.classList.add("prompt-error");
    return;
  }
  if (document.getElementById("no-found")) {
    document.getElementById("no-found").remove();
  }
  resultsDiv.innerHTML = "";
  movieService
    .search(prompt)
    .then((result) => {
      resultsTitle.style.display = "block";
      extractMovies(result);
    })
    .catch((error) => {
      console.error("Error extracting movies:", error);
    });
});

function extractMovies(movies) {
  for (let movie of movies) {
    let movieDiv = document.createElement("div");
    movieDiv.classList.add("movie-card");
    let poster = document.createElement("img");
    if (movie.Poster == "N/A") {
      poster.src = "../noposter.png";
    } else {
      poster.src = movie.Poster;
    }
    let title = document.createElement("h3");
    title.innerText = movie.Title + ", " + movie.Year;
    resultsDiv.append(movieDiv);
    movieDiv.append(poster);
    movieDiv.append(title);
  }
}
