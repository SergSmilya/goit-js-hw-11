import { Notify } from 'notiflix';
import { Loading } from 'notiflix/build/notiflix-loading-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import throttle from 'lodash.throttle';
import ApiServise from './api-axios';

const refs = {
  form: document.getElementById('search-form'),
  div: document.querySelector('.gallery'),
};

let gallery = new SimpleLightbox('.photo-card a');

const apiServiseInstance = new ApiServise();

refs.form.addEventListener('submit', onSerchImages);

function onSerchImages(e) {
  e.preventDefault();
  refs.div.innerHTML = '';

  apiServiseInstance.value = e.target.elements.searchQuery.value.trim();
  apiServiseInstance.resetPage();

  apiServiseInstance.getSearchValue().then(({ data }) => {
    if (data.hits.length === 0) {
      Notify.warning(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      Loading.remove();
      return;
    }
    Notify.success(`Hooray! We found ${data.totalHits} images.`);
    removeLoadAndShowMarkup({ data });
  });
}

function createMarkupForImage(arrayImg) {
  return arrayImg
    .map(
      ({
        previewURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => {
        return `  <div class="photo-card">
      <a href=${largeImageURL}>
      <img src=${previewURL} alt=${tags} loading="lazy" />
      <div class="info">
        <p class="info-item">
          <b>Likes: ${likes}</b>
        </p>
        <p class="info-item">
          <b>Views: ${views}</b>
        </p>
        <p class="info-item">
          <b>Comments: ${comments}</b>
        </p>
        <p class="info-item">
          <b>Downloads: ${downloads}</b>
        </p>
      </div>
      </a>
    </div>`;
      }
    )
    .join('');
}

function showMadrupOnPage(strMarup) {
  refs.div.insertAdjacentHTML('beforeend', strMarup);
  gallery.refresh();

  // Плавне прокручування сторінки
  const { height: cardHeight } = document
    .querySelector('.photo-card')
    .getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}

window.addEventListener(
  'scroll',
  throttle(() => {
    let rect = document.documentElement.getBoundingClientRect();

    if (rect.bottom <= document.documentElement.clientHeight + 200) {
      apiServiseInstance.getSearchValue().then(({ data }) => {
        removeLoadAndShowMarkup({ data });
      });
    }
  }, 200)
);

function removeLoadAndShowMarkup({ data }) {
  Loading.remove();

  const resultMarupStr = createMarkupForImage(data.hits);

  showMadrupOnPage(resultMarupStr);
}
