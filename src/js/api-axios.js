import axios from 'axios';
import { Notify } from 'notiflix';
import { Loading } from 'notiflix/build/notiflix-loading-aio';

const axios = require('axios');

export default class ApiServise {
  constructor() {
    this.searchValue = '';
    this.URL = 'https://pixabay.com/api/';
    //   ! якось треба винести ключ
    this.API_KEY = '33022988-27197d7be627ee112ee97c311';
    this.page = 1;
  }

  async getSearchValue() {
    Loading.pulse('Loading');

    try {
      const response = await axios(
        `${this.URL}?key=${this.API_KEY}&q=${this.searchValue}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${this.page}`
      );
      this.page += 1;
      return response;
    } catch (error) {
      console.error(error);
      Notify.failure(error);
    }
  }

  get value() {
    return this.searchValue;
  }

  set value(newValue) {
    this.searchValue = newValue;
  }

  resetPage() {
    this.page = 1;
  }
}
