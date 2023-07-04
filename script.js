let loader = document.getElementById("loading");
let resultsDiv = document.getElementById("results");
let searchButton = document.getElementById("search-btn");
let resultsTitle = document.getElementById("results-title");
let resultsWrapper = document.getElementById("results-wrapper");
let modal = document.getElementById("modal");
let modalLoader = document.getElementById("loading-modal");
let posterCol = document.getElementById("poster-col");
let infoCol = document.getElementById("info-col");
let defaultContent = document.getElementById("default-content");
let pageNum = 1;
let prompt;
let promptElem;
let totalResults;
let remainingResults;
let btnContainer; // container for "See more" button. It is declared here to be able to remove the button when it is not supposed to be there.

class MovieService {
  // class, which provides interactions with API
  async search(title, page = 1) {
    // method for movie search
    try {
      loader.style.display = "flex";
      const response = await fetch(
        `http://www.omdbapi.com/?apikey=c95a886e&s=${title}&page=${page}`
      );
      const data = await response.json();
      totalResults = data.totalResults;
      remainingResults = totalResults;
      loader.style.display = "none";
      return data.Search || noMoviesFound();
    } catch (error) {
      console.error("Error searching for movies:", error);
      return [];
    }
  }
  getMovie(movieId) {
    return new Promise((resolve, reject) => {
      fetch(`https://www.omdbapi.com/?apikey=c95a886e&i=${movieId}`)
        .then((response) => response.json())
        .then((data) => {
          if (data.Response === "True") {
            resolve(data);
          } else {
            reject("Movie not found");
          }
        })
        .catch((error) => {
          reject(error);
        });
    });
  }
}

let movieService = new MovieService();

function noMoviesFound() {
  // function for inserting "No movies found" text into DOM
  let text = document.createElement("h1");
  text.id = "no-found";
  text.innerText = "No movies found.";
  text.style.cssText = "text-align: center; color: #fff; width: 100%";
  resultsDiv.append(text);
}

searchButton.addEventListener("click", function () {
  // event listener for Search button
  if (btnContainer) {
    btnContainer.remove();
  }
  defaultContent.style.display = "none";
  pageNum = 1;
  promptElem = document.getElementById("prompt");
  promptElem.classList.remove("prompt-error");
  prompt = promptElem.value;
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
  // function, which extracts movies and inserts them into DOM
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
    let titleContainer = document.createElement("div");
    titleContainer.style.cssText =
      "display: flex; align-items: center; flex-grow: 1; justify-content: center;";
    resultsDiv.append(movieDiv);
    movieDiv.append(poster);
    movieDiv.append(titleContainer);
    titleContainer.append(title);
    movieDiv.setAttribute("data-movie-id", movie.imdbID);
    movieDiv.addEventListener("click", movieInfoShow);
  }
  if (remainingResults > 10) {
    pageNum++;
    remainingResults - 10;
    addBtn();
  }
}
function movieInfoShow() {
  // function to show a modal window with more information about a movie
  let tdArr = [];
  posterCol.innerHTML = "";
  for (let td of tdArr) {
    td.innerText = "";
  }
  modal.showModal();

  modalLoader.style.display = "flex";
  movieService.getMovie(this.dataset.movieId).then((result) => {
    modalLoader.style.display = "none";
    let poster = document.createElement("img");
    if (result.Poster == "N/A") {
      poster.src = "../noposter.png";
    } else {
      poster.src = result.Poster;
    }
    posterCol.style.display = "flex";
    posterCol.append(poster);

    let titleTd = document.getElementById("movie-title-td");
    titleTd.innerText = result.Title;
    tdArr.push(titleTd);
    let releaseTd = document.getElementById("movie-release-td");
    releaseTd.innerText = result.Released;
    tdArr.push(releaseTd);
    let genreTd = document.getElementById("movie-genre-td");
    genreTd.innerText = result.Genre;
    tdArr.push(genreTd);
    let countryTd = document.getElementById("movie-country-td");
    countryTd.innerText = result.Country;
    tdArr.push(countryTd);
    let directorTd = document.getElementById("movie-director-td");
    directorTd.innerText = result.Director;
    tdArr.push(directorTd);
    let writerTd = document.getElementById("movie-writer-td");
    writerTd.innerText = result.Writer;
    tdArr.push(writerTd);
    let actorsTd = document.getElementById("movie-actors-td");
    actorsTd.innerText = result.Actors;
    tdArr.push(actorsTd);
    let timeTd = document.getElementById("movie-time-td");
    timeTd.innerText = result.Runtime;
    tdArr.push(timeTd);
    let plotTd = document.getElementById("movie-plot-td");
    plotTd.innerText = result.Plot;
    tdArr.push(plotTd);
    infoCol.style.display = "block";
  });
}
function addBtn() {
  // function which adds "See more" button
  btnContainer = document.createElement("div");
  btnContainer.style.cssText =
    "width: 100%; display: flex; justify-content: center;";
  let moreBtn = document.createElement("a");
  moreBtn.innerText = "See more...";
  moreBtn.classList.add("search-btn");
  moreBtn.style.cssText = "width: 200px";
  moreBtn.addEventListener("click", function () {
    movieService
      .search(prompt, pageNum)
      .then((result) => {
        extractMovies(result);
      })
      .catch((error) => {
        console.error("Error extracting movies:", error);
      });
    moreBtn.remove();
  });
  resultsWrapper.append(btnContainer);
  btnContainer.append(moreBtn);
}
function closeModal() {
  modal.close();
}
