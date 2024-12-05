/* exported data */
const data = {
  favorites: [] as Character[],
  view: 'home-page',
};

function saveToLocalStorage(): void {
  const storedCharacter = JSON.stringify(data.favorites);
  localStorage.setItem('stored-character', storedCharacter);
}

function loadFromLocalStorage(): void {
  const storedCharacter = localStorage.getItem('stored-character');
  if (storedCharacter) {
    data.favorites = JSON.parse(storedCharacter);
  }
}
