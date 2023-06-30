let page = 1;
class MovieService {
  async search(title, page = 1) {
    try {
      const response = await fetch(
        `${this.apiUrl}?apikey=${this.apiKey}&s=${encodeURIComponent(
          title
        )}&page=${page}`
      );
      const data = await response.json();
      return data.Search || [];
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

let searchButton = document.getElementById("search-btn");
let movieService = new MovieService();
searchButton.addEventListener("click", function () {
  let prompt = document.getElementById("prompt").value;
  movieService;
});
