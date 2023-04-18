import './css/styles.css';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { fetchCountries } from './fetchCountries.js';

const inputCountry = document.querySelector('input#search-box');
const countriesList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');
const infoMessage =
  'Too many matches found. Please enter a more specific name.';
const failureMessage = 'Oops, there is no country with that name';
const failureType = 'failure';
const infoType = 'info';

const DEBOUNCE_DELAY = 300;
inputCountry.addEventListener(
  'input',
  debounce(searchCountries, DEBOUNCE_DELAY)
);

function searchCountries(evt) {
  evt.preventDefault();
  const countryName = inputCountry.value.trim();

  if (!countryName) {
    clearPage();
    return;
  }

  fetchCountries(countryName).then(showCountryList).catch(someError);
}

function showCountryList(countriesArray) {
  if (countriesArray.length > 10) {
    clearPage();
    showMessage(infoType, infoMessage);
    return;
  }
  if (countriesArray.length >= 2) {
    clearPage();
    countriesMarkup(countriesArray);
    return;
  }
  clearPage();
  countryMarkup(countriesArray);
}

// function showCountryList(countriesArray) {
//   if (countriesArray.length > 10) {
//     clearPage();
//     showMessage(infoType, infoMessage);
//   } else if (countriesArray.length >= 2) {
//     clearPage();
//     countriesMarkup(countriesArray);
//   } else if (countriesArray.length === 1) {
//     clearPage();
//     countryMarkup(countriesArray);
//   }
// }

function someError() {
  showMessage(failureType, failureMessage);
  clearPage();
}

function clearPage() {
  countryInfo.innerHTML = '';
  countriesList.innerHTML = '';
}

function countriesMarkup(countriesArray) {
  const countriesMarkup = countriesArray.reduce((acc, { name, flags }) => {
    return (
      acc +
      `
  <li><p><img src='${flags.svg}' alt='${name}' height='40'> <b>${name.official}</b></p>
  </li>
  `
    );
  }, '');
  countriesList.innerHTML = countriesMarkup;
}

function countryMarkup(countriesArray) {
  const countryCard = countriesArray.reduce(
    (acc, { flags, name, capital, population, languages }) => {
      languages = Object.values(languages).join(', ');
      return `<img src="${flags.svg}" alt="${name}" width="240"/>
  <p><b>${name.official}</b></p>
  <p>Capital: <span> ${capital}</span></p>
  <p>Population: <span> ${population} </span></p>
  <p>Languages: <span> ${languages}</span></p>`;
    },
    ''
  );
  countryInfo.innerHTML = countryCard;
}

function showMessage(type, message) {
  Notify[type](message);
}
