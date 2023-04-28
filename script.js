/*const tmdb_key = 'f055d36c3cea9f2832248232b1db1fc1'
const tmdb_endpoint = "https://api.themoviedb.org/3/search/"*/

const imdb_key = "k_ye838jhg";
const imdb_endpoint = "https://imdb-api.com/en/API/";
const imdb_movie_endpoint = "https://imdb-api.com/en/API/Title/"

const yt_key = "AIzaSyAyIWssJnsc6YtDiDq9M1uOn_QCWKKajkM"
const yt_endpoint = "https://www.googleapis.com/youtube/v3/search"
const yt_research = "https://www.youtube.com/watch?v="

let movieResults;

function closeFocus(){  
    document.querySelector('#focus').classList.add('hidden');
    document.getElementById('media').innerHTML = '';
    document.getElementById('description').innerHTML = '';

    const toHide = document.querySelectorAll('#view div');
    for(let element of toHide)
        element.classList.remove('hidden');
    document.getElementById('header').classList.remove('hidden');
    document.querySelector('form').classList.remove('hidden');
}

function onJsonTrailer(json){
    console.log(json);

    const media = document.getElementById('media');
    
    const trailerCanvas = document.createElement('iframe');
    trailerCanvas.src = "https://www.youtube.com/embed/" + json.items[0].id.videoId;

    media.appendChild(trailerCanvas);
}

function onResponseTrailer(response){
    return response.json();
}

function onJsonReport(json){
    console.log(json);

    const media = document.getElementById('media');

    const desc = document.createElement('div');
    desc.textContent = json.plot;
    desc.classList.add('description');

    const director = document.createElement('h1');
    director.textContent = 'Director: ' +json.directorList[0].name;

    desc.appendChild(director);
    media.appendChild(desc);

    const details = document.getElementById('description');
    const cast = json.actorList;

    for(let actor of cast){
        const element = document.createElement('div');
        const img = document.createElement('img');
        img.src = actor.image;
        const quote = document.createElement('span');
        quote.textContent = actor.name + ' as ' + actor.asCharacter,

        element.appendChild(img);
        element.appendChild(quote);

        element.classList.add('figure');

        details.appendChild(element);
    }
}

function onResponseReport(response){
    return response.json();
}

function onClick(event){
    const toHide = document.querySelectorAll('#view div');
    for(let element of toHide)
        element.classList.add('hidden');
    document.getElementById('header').classList.add('hidden');
    document.querySelector('form').classList.add('hidden');

    document.querySelector('#focus').classList.remove('hidden');

    const media = document.querySelector('#media');

    let selected;

    for(let i = 0; i < movieResults.length; i++){
        if(movieResults[i].id === event.currentTarget.dataset.id){
            selected = movieResults[i];
            break;
        }
    }

    console.log(selected);

    const img = document.createElement('img');
    img.src = selected.image;

    const title = document.createElement('h1');
    title.textContent = selected.title;

    const tmp = document.createElement('div');
    tmp.appendChild(img);
    tmp.appendChild(title);
    tmp.classList.add('content');

    media.appendChild(tmp);
    fetch(yt_endpoint + '?key=' + yt_key + '&q=' + selected.title + '-trailer' +'&part=snippet&type=video').then(onResponseTrailer).then(onJsonTrailer);
    fetch(imdb_movie_endpoint + imdb_key + '/' + selected.id).then(onResponseReport).then(onJsonReport);


}

function onResponse(response){
    return response.json();
}

function onJson(json){

    console.log(json);

    movieResults = json.results;

    console.log(movieResults);

    const album = document.getElementById('view');
    album.innerHTML = '';

    for(let i = 0; i < movieResults.length; i++){
        if(movieResults[i].image !== ''){
            const poster = document.createElement('img');
        poster.src = movieResults[i].image;

        const title = document.createElement('h1');
        title.textContent = movieResults[i].title;

        const element = document.createElement('div');
        element.appendChild(poster);
        element.appendChild(title);
        element.dataset.id = movieResults[i].id;
        element.classList.add('content');

        element.addEventListener('click', onClick);

        album.appendChild(element);
        }
    }
}

function search(event){
    event.preventDefault();

    const type = document.querySelector('#tipo');
    const content = document.querySelector('#content');

    const content_value = encodeURIComponent(content.value);
    const type_value = encodeURIComponent(type.value);

    if(type_value === 'movie'){
        fetch(imdb_endpoint + "SearchMovie/"+ imdb_key+"/"+ content_value).then(onResponse).then(onJson);
    }
}

const form = document.querySelector('form');
form.addEventListener('submit', search);

document.getElementById('goBack').addEventListener('click', closeFocus);