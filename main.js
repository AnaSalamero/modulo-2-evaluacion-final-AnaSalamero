'use strict';

// CONST AND GLOBAL VARIABLES

const showUlList = document.querySelector('.js-showlist');
const showUlListFavourites = document.querySelector('.js-favouriteshowlist');
const buttonElement = document.querySelector('.js-btn');
const inputElement = document.querySelector('.js-input');
const formElement = document.querySelector('.js-form');
const resetButtonSpan = document.querySelector('.js-btnwrap');

let allShowsData = []; // Data received from API
let selectedShowsArray = []; // Array for favourite shows

// FUNCTIONS

formElement.addEventListener('submit', (ev) => ev.preventDefault());

function addListenerToIcon() {
  const iconElements = document.querySelectorAll('i');

  for (const iconElement of iconElements) {
    iconElement.addEventListener('click', handleUnClickFavourite);
  }
}

function handleUnClickFavourite(event) {
  const selectedIcon = event.currentTarget;
  const nextSiblingID = selectedIcon.nextSibling.nextSibling.id;
  const newArray = selectedShowsArray.filter(
    (showitem) => showitem.id === nextSiblingID
  ); //filters favs shows array; looking for matches between ID show and the icon selected
  let difference = selectedShowsArray.filter((x) => !newArray.includes(x)); //difference variable will output the elements from selectedShowsArray that are not in the newArray (newArray = fav shows that user deletes)
  selectedShowsArray = difference;
  renderShowFavourites(selectedShowsArray);
  saveToLocalStorage();
}

function findShows() {
  showUlList.innerHTML = '';
  getInfo();
}

function getInfo() {
  const inputValue = inputElement.value;
  fetch(`//api.tvmaze.com/search/shows?q=${inputValue}`)
    .then((response) => response.json())
    .then((data) => {
      allShowsData = data;
      renderShowList();
      addListenersToLi();
    });
}

function addListenersToLi() {
  const liShowsAll = document.querySelectorAll('.js-li');

  for (const liShow of liShowsAll) {
    liShow.addEventListener('click', handleClickFavourite);
  }
}

function handleClickFavourite(event) {
  let selectedShow;
  selectedShow = event.currentTarget;
  selectedShow.classList.toggle('favourite');

  let selectedObject = {}; //making a new object for every selected show
  selectedObject.name = selectedShow.innerText;
  selectedObject.id = selectedShow.id;
  selectedObject.image = selectedShow.lastElementChild.currentSrc;

  if (selectedShow.classList.contains('favourite')) {
    selectedShowsArray.push(selectedObject);
  }
  saveToLocalStorage();
  renderShowFavourites();
}

function saveToLocalStorage() {
  localStorage.setItem('favourites', JSON.stringify(selectedShowsArray));
}

function renderHTMLShow(show) {
  let imageUrl = `https://via.placeholder.com/210x295/ffffff/666666/?text=TV`;
  //value when image is null
  if (show.image) {
    //value when image is defined
    imageUrl = show.image;
  }
  return `<i class="far fa-times-circle"></i>
<li id="${show.id}" class="show_list-item favourite_list-item js-li">
<h2 class="show_title">${show.name}</h2> <img class="image" src="${imageUrl}"/> </li>`;
}

function resetArray() {
  selectedShowsArray.length = 0;
  localStorage.removeItem('favourites');
  showUlListFavourites.innerHTML = '';
  resetButtonSpan.innerHTML = '';
}

function renderShowFavourites() {
  showUlListFavourites.innerHTML = '<h2 class="titlefav">Favourites</h2>';

  for (let i = 0; i < selectedShowsArray.length; i++) {
    showUlListFavourites.innerHTML += renderHTMLShow(selectedShowsArray[i]);
  }

  resetButtonSpan.innerHTML = `<button class="js-resetbutton resetbutton">Reset</button>`;

  const resetButton = document.querySelector('.js-resetbutton');

  resetButton.addEventListener('click', resetArray);

  addListenerToIcon();
}

function renderShowList() {
  //used an object for each show in order to have only one function that renders html

  for (let i = 0; i < allShowsData.length; i++) {
    const dataShow = allShowsData[i].show;
    let myShow = {};
    myShow.name = dataShow.name;
    myShow.id = dataShow.id;
    if (dataShow.image) {
      //some shows come without pic from API
      myShow.image = dataShow.image.medium;
    }
    showUlList.innerHTML += renderHTMLShow(myShow);
  }
}

function showLocalStorage() {
  if (localStorage.getItem('favourites')) {
    selectedShowsArray = JSON.parse(localStorage.getItem('favourites'));
    renderShowFavourites(selectedShowsArray);
    addListenerToIcon();
  }
}

buttonElement.addEventListener('click', findShows); //2.- Searching for a show

showLocalStorage(); //1.- Prints LS if there is any
