import getSearchValue from './getsearch';
import { Notify } from 'notiflix';
import { Loading } from 'notiflix/build/notiflix-loading-aio';
import SimpleLightbox from 'simplelightbox';

// ! 1. Не вірно працює пагінація
// ! 2. Не працює сімпллайтбокс(скоріше за все треба переробити розмітку)
// ! 3. Підключити infinite scroll
// ! 4. Рефакторинг коду(розділити по функціям, створити константи для значень які повторюються, зробити окремі файли JS)

const refs = {
  form: document.getElementById('search-form'),
  div: document.querySelector('.gallery'),
  loadMoreBtn: document.querySelector('.load-more'),
};

let inputValueTrim = '';

refs.form.addEventListener('submit', onSerchImages);
refs.loadMoreBtn.addEventListener('click', onLoadMore);

function onSerchImages(e) {
  e.preventDefault();
  refs.div.innerHTML = '';

  inputValueTrim = e.target.elements.searchQuery.value.trim();

  getSearchValue(inputValueTrim).then(({ data }) => {
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

    refs.loadMoreBtn.classList.toggle('see');
  });
}

const gallery = new SimpleLightbox('.gallery');

gallery.on();

function createMarkupForImage(arrayImg) {
  return arrayImg
    .map(({ previewURL, tags, likes, views, comments, downloads }) => {
      return `  <div class="photo-card">
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
    </div>`;
    })
    .join('');
}

function showMadrupOnPage(strMarup) {
  refs.div.insertAdjacentHTML('beforeend', strMarup);
}

function onLoadMore(e) {
  getSearchValue(inputValueTrim).then(({ data }) => {
    console.log(data);

    Loading.remove();
    const resultMarupStr = createMarkupForImage(data.hits);

    showMadrupOnPage(resultMarupStr);
  });
}
