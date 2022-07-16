/*
 * Copyright (c) 2022 Adina Pavel <adina@linuxconsulting.ro>
 */



const API_ROOT_URL = 'https://api.themoviedb.org/3';
const PLACEHOLDER_SRC_URL = 'https://via.placeholder.com/200x300.png/0000FF/FFFFFF?text=Missing%20Movie%20Poster';
const MOVIE_IMG_URL = 'https://image.tmdb.org/t/p/original/';

// For bots not smart humans
function getKey() {
    const part1 = 'c467bc9ce7f403';
    const part2 = 'ba4d65815a023bdc2a';

    return `${part1}${part2}`;
}

function setupApp() {
    const elActor = document.getElementById("nameOfActor");
    console.log(elActor);
    elActor.addEventListener("keydown", setupKeys)

    function setupKeys(e) {
        if (e.key === "Enter") {
            getMovies()
        }
        if (e.key === "Escape") {
            clearSearch(true);
        }
    };
}



async function getMovies() {
    clearSearch(false);
    let genre = document.getElementById("genres").value;
    console.log(genre);

    let personName = document.getElementById("nameOfActor").value;
    console.log(personName);

    let url = `${API_ROOT_URL}/discover/movie?api_key=${getKey()}`;
    let getCastID, jsonCast, castID, moviesSearched, jsonMoviesList;

    if (genre != 0) {
        url += "&with_genres=" + genre;
    }
    if (personName.trim()) {
        try {
            getCastID = await fetch(`${API_ROOT_URL}/search/person?api_key=${getKey()}&query=` + personName);
            jsonCast = await getCastID.json();
            castID = jsonCast.results[0].id;
            console.log(castID);
        } catch (e) {
            console.error(e);
            let errorLog = document.getElementById('paragraphOverview');
            errorLog.textContent = `No movies for ${personName}`;
            document.getElementById("overView").style.display = "inline";
            return;
        }
    }

    if (castID) {
        url += `&with_cast=${castID}&sort_by=release_date.desc`;
    }

    try {
        console.log(url);
        moviesSearched = await fetch(url);
        console.log(moviesSearched);
        jsonMoviesList = await moviesSearched.json();
    } catch (e) {
        console.error(e);
    }
    let moviesDetails = [];

    let blocksContainer = document.getElementById("blocksContainer");
    console.log(blocksContainer);

    for (let i = 0; i < jsonMoviesList.results.length; i++) {
        let box = document.createElement("div");
        box.className = "box";
        box.description = jsonMoviesList.results[i].overview;
        box.addEventListener('click', viewDescription);

        let img = document.createElement("img");
        if (jsonMoviesList.results[i].poster_path) {
            img.src = MOVIE_IMG_URL + jsonMoviesList.results[i].poster_path;
        } else {
            img.src = PLACEHOLDER_SRC_URL;
        }

        let boxTitle = document.createElement("div");
        boxTitle.textContent = jsonMoviesList.results[i].title;
        boxTitle.className = "boxTitle";

        let boxYear = document.createElement("div");
        boxYear.textContent = jsonMoviesList.results[i].release_date.slice(0, 4);
        boxYear.className = "boxYear";

        box.appendChild(img);
        box.appendChild(boxTitle);
        box.appendChild(boxYear);
        blocksContainer.appendChild(box);
    }
}
function viewDescriptionWithDetails(e) {    
    let details = document.getElementById("paragraphOverview");
    details.textContent = this.details;
    document.getElementById("overView").style.display = "inline";
}

function viewDescriptionWithContext(e, context) {
    console.log(context);
    console.log(e);
    let details = document.getElementById("paragraphOverview");
    details.textContent = context.description;
    document.getElementById("overView").style.display = "inline";
}

function viewDescription(e) {
    console.log(this);
    console.log(e);
    let details = document.getElementById("paragraphOverview");
    details.textContent = this.description;
    document.getElementById("overView").style.display = "inline";
}

function clearDescription() {
    let noDetails = document.getElementById("overView");
    noDetails.style.display = "none";
}

function clearSearch(withInput) {
    document.getElementById("blocksContainer").innerHTML = "";
    if (withInput) {
        document.getElementById("nameOfActor").value = "";
        document.getElementById("genres").selectedIndex = 0;
    }
    clearDescription();
}





