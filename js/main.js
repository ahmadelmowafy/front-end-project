"use strict";
const $form = document.getElementById('form');
const $input = document.getElementById('search-bar');
const $results = document.getElementById('search-results');
const $favorites = document.getElementById('favs-link');
const $favoritesPage = document.getElementById('favs-page');
const $homeButton = document.querySelector('h1');
async function fetchCharacters() {
    try {
        const response = await fetch('https://hp-api.herokuapp.com/api/characters');
        if (!response.ok) {
            throw new Error('Error fetching data');
        }
        const data = await response.json();
        const characters = data.map((character) => ({
            id: character.id,
            name: character.name,
            house: character.house,
            altNames: character.alternate_names,
            image: character.image,
        }));
        const searchTerm = $input.value;
        const resultMatches = characters.filter((character) => character.name.toLowerCase().includes(searchTerm.toLowerCase()));
        return resultMatches;
    }
    catch (error) {
        console.error('An error occurred:', error);
        return [];
    }
}
function addToFavorites(characterId, characters) {
    const character = characters.find((c) => c.id === characterId);
    data.favorites.push(character);
    const characterCard = createCharacterCard(character, characters);
    const delButtonContainer = document.createElement('a');
    delButtonContainer.className = 'del-button-link';
    const deleteButton = document.createElement('i');
    deleteButton.className = 'fa-solid fa-trash';
    $favoritesPage?.appendChild(characterCard);
    characterCard.appendChild(delButtonContainer);
    delButtonContainer.appendChild(deleteButton);
    saveToLocalStorage();
    deleteButton.addEventListener('click', () => {
        data.favorites = data.favorites.filter((fav) => fav.id !== characterId);
        saveToLocalStorage();
        characterCard.remove();
    });
}
$favorites.addEventListener('click', () => {
    viewSwap('favorites-page');
});
$homeButton?.addEventListener('click', () => {
    viewSwap('home-page');
    $results.textContent = '';
});
function createCharacterCard(character, characters) {
    const card = document.createElement('div');
    card.className = 'character-card';
    const img = document.createElement('img');
    if (!character.image) {
        img.setAttribute('src', 'https://upload.wikimedia.org/wikipedia/en/thumb/b/b1/Portrait_placeholder.png/320px-Portrait_placeholder.png');
    }
    else {
        img.setAttribute('src', character.image);
    }
    const charInfo = document.createElement('div');
    charInfo.className = 'character-info';
    const name = document.createElement('h3');
    name.textContent = character.name;
    name.className = 'character-name';
    const house = document.createElement('p');
    house.textContent = character.house;
    house.className = 'character-house';
    const altNames = document.createElement('p');
    altNames.textContent =
        character.altNames.length > 0
            ? `Also known as: ${String(character.altNames)}`
            : '';
    altNames.className = 'alternate-names';
    const moreActions = document.createElement('div');
    moreActions.className = 'more-actions';
    const viewInfo = document.createElement('a');
    viewInfo.textContent = 'View more info...';
    const addToFavs = document.createElement('a');
    addToFavs.textContent = 'Add to Favorites';
    // viewInfo.addEventListener('click', () => { view swap function to character info });
    addToFavs.addEventListener('click', () => addToFavorites(character.id, characters));
    card.appendChild(img);
    card.appendChild(charInfo);
    charInfo.appendChild(name);
    charInfo.appendChild(house);
    charInfo.appendChild(altNames);
    charInfo.appendChild(moreActions);
    moreActions.appendChild(viewInfo);
    moreActions.appendChild(addToFavs);
    return card;
}
function renderCharacters(characters) {
    characters.forEach((character) => {
        const card = createCharacterCard(character, characters);
        $results.appendChild(card);
    });
}
document.addEventListener('DOMContentLoaded', () => {
    viewSwap(data.view);
    for (let i = 0; i < data.favorites.length; i++) {
        $favoritesPage?.appendChild(createCharacterCard(data.favorites[i], data.favorites));
    }
});
async function handleSubmit(event) {
    event.preventDefault();
    $results.textContent = '';
    const characters = await fetchCharacters();
    renderCharacters(characters);
}
$form.addEventListener('submit', handleSubmit);
function viewSwap(viewName) {
    const homeView = document.querySelector('[data-view="home-page"]');
    const favsPage = document.querySelector('[data-view="favorites-page"]');
    if (!homeView || !favsPage) {
        throw new Error('`homeView` or `favsPage` query failed');
    }
    if (viewName === 'home-page') {
        homeView.classList.remove('hidden');
        favsPage.classList.add('hidden');
    }
    else if (viewName === 'favorites-page') {
        homeView.classList.add('hidden');
        homeView.classList.remove('visible');
        favsPage.classList.remove('hidden');
    }
    data.view = viewName;
}
loadFromLocalStorage();
