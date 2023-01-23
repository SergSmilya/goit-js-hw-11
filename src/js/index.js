import getSearchValue from './getsearch';
import { Notify } from 'notiflix';
import { Loading } from 'notiflix/build/notiflix-loading-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import InfiniteScroll from 'infinite-scroll';

// ! 1. Підключити infinite scroll
// ! 2. Рефакторинг коду(розділити по функціям, створити константи для значень які повторюються, зробити окремі файли JS)

const refs = {
  form: document.getElementById('search-form'),
  div: document.querySelector('.gallery'),
  loadMoreBtn: document.querySelector('.load-more'),
};

let inputValueTrim = '';
let page = 1;

let gallery = new SimpleLightbox('.photo-card a');

refs.form.addEventListener('submit', onSerchImages);
refs.loadMoreBtn.addEventListener('click', onLoadMore);

function onSerchImages(e) {
  e.preventDefault();
  refs.div.innerHTML = '';
  page = 1;

  inputValueTrim = e.target.elements.searchQuery.value.trim();

  getSearchValue(inputValueTrim, page).then(({ data }) => {
    page += 1;
    console.log(data);
    Notify.success(`Hooray! We found ${data.totalHits} images.`);

    if (data.hits.length === 0) {
      Notify.warning(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      return;
    }
    Loading.remove();
    const resultMarupStr = createMarkupForImage(data.hits);

    showMadrupOnPage(resultMarupStr);

    refs.loadMoreBtn.classList.add('see');
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

  // Infinite scroll
  // let infScroll = new InfiniteScroll(refs.div, {
  //   // options
  // });
  // infScroll.loadNextPage();

  // Плавне прокручування сторінки
  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}

function onLoadMore(e) {
  getSearchValue(inputValueTrim, page).then(({ data }) => {
    page += 1;
    console.log(data);

    Loading.remove();
    const resultMarupStr = createMarkupForImage(data.hits);

    showMadrupOnPage(resultMarupStr);
  });
}
