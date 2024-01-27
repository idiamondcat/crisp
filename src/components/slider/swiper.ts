import {
  Manipulation,
  Navigation,
  Pagination,
  Scrollbar,
  Controller,
} from "swiper/modules";

export const productPageSwiperMainSetting = {
  modules: [Navigation, Pagination, Scrollbar, Manipulation, Controller],
  spaceBetween: 30,
  centeredSlides: true,
  observer: true,
  observeParents: true,
  observeSlideChildren: true,
  slidesPerView: 1,
  grabCursor: true,
  watchOverflow: true,
  pagination: {
    el: ".swiper-pagination",
    clickable: true,
    dynamicBullets: true,
  },
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },
  scrollbar: {
    el: ".swiper-scrollbar",
    draggable: true,
  },
};

export const productPageSwiperPopapSetting = {
  modules: [Navigation, Pagination, Scrollbar, Manipulation, Controller],
  initialSlide: 0,
  spaceBetween: 30,
  centeredSlides: true,
  observer: true,
  observeParents: true,
  observeSlideChildren: true,
  slidesPerView: 1,
  grabCursor: true,
  watchOverflow: true,
  pagination: {
    el: ".swiper-pagination",
    clickable: true,
    dynamicBullets: true,
  },
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },
};
