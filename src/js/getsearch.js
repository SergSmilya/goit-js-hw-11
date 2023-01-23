import axios from 'axios';
import { Notify } from 'notiflix';
import { Loading } from 'notiflix/build/notiflix-loading-aio';

const axios = require('axios');
// URL & API_KEY
const URL = 'https://pixabay.com/api/';
const API_KEY = '33022988-27197d7be627ee112ee97c311';
// const params
const image_type = 'photo';
const orientation = 'horizontal';
const safesearch = 'true';
const per_page = 40;

export default async function getSearchValue(value, page) {
  Loading.pulse('Loading');

  try {
    const response = await axios.get(
      `${URL}?key=${API_KEY}&q=${value}&image_type=${image_type}&orientation=${orientation}&safesearch=${safesearch}&per_page=${per_page}&page=${page}`
    );

    return response;
  } catch (error) {
    console.error(error);
    Notify.failure(error);
  }
}
