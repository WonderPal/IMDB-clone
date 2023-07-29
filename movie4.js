
const movieSearchBox = document.getElementById('search-box');
const searchList = document.getElementById('list');
const resultGrid = document.getElementById('result');
const favoriteList = document.getElementById('favorite-list');
var container = document.getElementById('movies');


let favoriteMovies = [];

async function DisplayMovies(searchTerm){
    const URL = `https://www.omdbapi.com/?s=${searchTerm}&page=1&apikey=bfd6b563`;
    const res = await fetch(`${URL}`);
    const data = await res.json();
    // console.log(data.Search);load
    if(data.Response == "True") displayMovieList(data.Search);
}

function findMovies(){
    let searchTerm = (movieSearchBox.value).trim();
    if(searchTerm.length > 0){
        searchList.classList.remove('hide-search-list');
        DisplayMovies(searchTerm);
    } else {
        searchList.classList.add('hide-search-list');
    }
}







function displayMovieList(movies) {
    searchList.innerHTML = '';

    movies.forEach(movie => {
        const movieListItem = document.createElement('div');
        movieListItem.dataset.id = movie.imdbID;
        movieListItem.classList.add('search-list-item');

        const moviePoster = movie.Poster !== 'N/A' ? movie.Poster : 'image_not_found.png';

        movieListItem.innerHTML = `<div  id ="list"class="search-item-thumbnail">
                                       <img src="${moviePoster}" alt="">
                                    </div>
                                   <div class="search-item-info">
                                      <h3>${movie.Title}</h3>
                                      <p>${movie.Type}, ${movie.Year}</p>
                                      </div>

                                  <div class="add-fav-btn">
                                        <button class="favorite-btn">Add to Favorites</button>

                                       </div>
                                       </div> `;

        const favoriteBtn = movieListItem.querySelector('.favorite-btn'); // button for add the favorate movi into movi list 
        favoriteBtn.addEventListener('click', () => addToFavorites(movie));

        searchList.appendChild(movieListItem); // adding child element into the search list 
    });
    loadMovieDetails();
}



function loadMovieDetails(){
    const searchListMovies = searchList.querySelectorAll('.search-list-item');
    searchListMovies.forEach(movie => {
        movie.addEventListener('click', async () => {
            // console.log(movie.dataset.id);
            searchList.classList.add('hide-search-list');
            movieSearchBox.value = "";
            const result = await fetch(`https://www.omdbapi.com/?i=${movie.dataset.id}&apikey=bfd6b563`);
            const movieDetails = await result.json();
            // console.log(movieDetails);
            displayMovieDetails(movieDetails);
        });
    });
}

function displayMovieDetails(details){
    resultGrid.innerHTML = `
    <div class = "movie-poster">
        <img src = "${(details.Poster != "N/A") ? details.Poster : "image_not_found.png"}" alt = "movie poster">
    </div>
    <div class = "movie-info">
        <h3 class = "movie-title">${details.Title}</h3>
        <ul class = "movie-misc-info">
            <li class = "year">Year: ${details.Year}</li>
            <li class = "rated">Ratings: ${details.Rated}</li>
            <li class = "released">Released: ${details.Released}</li>
        </ul>
        <p class = "genre"><b>Genre:</b> ${details.Genre}</p>
        <p class = "writer"><b>Writer:</b> ${details.Writer}</p>
        <p class = "actors"><b>Actors: </b>${details.Actors}</p>
        <p class = "plot"><b>Plot:</b> ${details.Plot}</p>
        <p class = "language"><b>Language:</b> ${details.Language}</p>
        <p class = "awards"><b><i class = "fas fa-award"></i></b> ${details.Awards}</p>
    </div>
    `;
}


window.addEventListener('click', (event) => {
    if(event.target.className != "form-control"){
        searchList.classList.add('hide-search-list');
    }
});


if (localStorage.getItem('favoriteMovies')) {
    favoriteMovies = JSON.parse(localStorage.getItem('favoriteMovies'));
    updateFavoriteList();
}

// function for add the fevorite movi in to list
function addToFavorites(movie) {
    favoriteMovies.push(movie);
    updateFavoriteList(); // after addting movi into fav movi list  current list upadate
    updateLocalStorage();// upadting persistant movi list into local storage
}

// function for removing the movi form local storage and fav movi list 
function removeFromFavorites(movieId) {
    favoriteMovies = favoriteMovies.filter(movie => movie.imdbID !== movieId);
    updateFavoriteList(); // after  removing  movi form fav movi list  current list upadate
    updateLocalStorage();  // remvoing movi for form local storage 
}


  // function which update and perform opration of addding movi to fav lis 
function updateFavoriteList() {
    favoriteList.innerHTML = '';

    favoriteMovies.forEach(movie => {
        const favoriteListItem = document.createElement('div');
        favoriteListItem.classList.add('favorite-list-item');
        favoriteListItem.innerHTML = `
      <div class="favorite-item-thumbnail">
        <img src="${movie.Poster}" alt="">
      </div>
      <div class="favorite-item-info">
        <h3>${movie.Title}</h3>
        <p>${movie.Type}, ${movie.Year}, <span>IMDB</span><i class="bi bi-star-fill"></i> ${movie.imdbRating}</p>
        <div class="fav-btn">
          <button class="remove-btn">Remove </button>
        </div>
      </div>`;

        const removeBtn = favoriteListItem.querySelector('.remove-btn');
        removeBtn.addEventListener('click', () => removeFromFavorites(movie.imdbID));

        favoriteList.appendChild(favoriteListItem);
    });
}

//function for upading local storge 
function updateLocalStorage() {
    localStorage.setItem('favoriteMovies', JSON.stringify(favoriteMovies));
}