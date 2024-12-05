"use strict";
/* exported data */
const data = {
    favorites: [],
    view: 'home-page',
};
function saveToLocalStorage() {
    const storedCharacter = JSON.stringify(data.favorites);
    localStorage.setItem('stored-character', storedCharacter);
}
function loadFromLocalStorage() {
    const storedCharacter = localStorage.getItem('stored-character');
    if (storedCharacter) {
        data.favorites = JSON.parse(storedCharacter);
    }
}
