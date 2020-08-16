import apiService from './services/apiService';
import imageItem from '../handlebars/image-item.hbs';

const InfiniteScroll = require('infinite-scroll');
const PNotify = require('pnotify/dist/umd/PNotify');
const PNotifyStyleMaterial = require('pnotify/dist/umd/PNotifyStyleMaterial.js');
const _debounce = require('lodash.debounce');

PNotify.defaults.styling = 'material';
PNotify.defaults.icons = 'material';
PNotify.defaults.animateSpeed = 'fast';
PNotify.defaults.delay = 4000;

const gallery = document.querySelector('.gallery');
// const input = document.querySelector('input[type="text"]');
const input = document.querySelector('.form-input');
const button = document.querySelector('#load-more');

button.addEventListener('click', handleButtonClick);
input.addEventListener('input', _debounce(handleInputEvent, 500));

function handleInputEvent(e) {
  e.preventDefault();

  const input = e.target;

  clearImageList();

  apiService.resetPage();
  apiService.searchQuery = input.value;

  fetchImages();
}

function fetchImages() {
  button.style.visibility = 'visible';
  apiService
    .fetchImages()
    .then(images => {
      insertItems(images);
    })
    .catch(error => {
      console.warn(error);
    });
}

function handleButtonClick(e) {
  e.preventDefault();

  fetchImages();

  setTimeout(scrollToBottom, 800);
}

function scrollToBottom() {
  const scrollOptions = {
    top: gallery.scrollHeight + 150,
    behavior: 'smooth',
  };

  window.scrollTo(scrollOptions);
}

function insertItems(images) {
  const itemMarkup = imageItem(images);
  gallery.insertAdjacentHTML('beforeend', itemMarkup);
}

function clearImageList() {
  button.style.visibility = 'hidden';
  gallery.innerHTML = '';
}
