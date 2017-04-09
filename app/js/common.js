"use strict";

document.addEventListener("DOMContentLoaded", function() {
  (function() { //область видимости

    //js-status
    nojsreplace();
    function nojsreplace() {
      // if (document.documentElement.html.className == "no-js") {
      //   document.body.classList.remove("no-js");
      // }
      // console.log(document.documentElement);
    }

    toggleMenu();
    function toggleMenu() {
      var menuHam = $(".menu__hamburger");
      var menu = $(".menu__list");
      var action = $(".header__action");
      menuHam.on("click", function(e) {
        menuHam.toggleClass("is-active");
        menu.toggleClass("menu__list--mobile");
        action.toggleClass("header__action--mobile");
      });
    }

    // btn Up
    scrollUp();
    function scrollUp() {
      var winHeight = $(document).height(),
          step = 4,
          timeToScroll = winHeight/step,
          scrollUp = $(".scrollup");
      $(window).scroll(function () {
        if ($(this).scrollTop() > 400) {
          scrollUp.fadeIn();
        } else {
          scrollUp.fadeOut();
        }
      });
      scrollUp.on("click", function() {
        $("html, body").animate({scrollTop: 0}, timeToScroll);
      });
    }

    // слайдер на главной
    slider();
    function slider() {
      $(".slider__list").bxSlider({
        pagerCustom: ".slider__dots",
        controls: false
      });
    }
    // слайдер на странице товара
    sliderProductItem();
    function sliderProductItem() {
      $(".product-view__gallary-list").bxSlider({
        pagerCustom: ".product-view__gallary-pager",
        controls: false
      });
    }
    //слайдер продукта
    itemInnerSlider();
    function itemInnerSlider() {
      $(".product__slider").bxSlider({
        pagerCustom: ".product__colors",
        controls: false
      });
    }
    filterSlider();
    function filterSlider() {
      var rangeControls = document.getElementById('filterRange');
      // var rangeControls = document.getElementsByClassName('fliter-item__scale');
      var minPrice = document.getElementsByClassName('fliter-item__toggle--min');
      var maxPrice = document.getElementsByClassName('fliter-item__toggle--max');
      var minPriceWrap = document.getElementById('minPriceFieled');
      var maxPriceWrap = document.getElementById('maxPriceField');

      // if (rangeControls) {
        noUiSlider.create(rangeControls, {
          start: [0, 2000],
          connect: true,
          range: {
            'min': 0,
            'max': 2000
          },
          // lower: [
          //   new Link({
          //     target: minPriceWrap
          //   })
          // ],
          // upper: [
          //   new Link({
          //     target: maxPriceWrap
          //   })
          // ]
        });

        // Updating input value on slider handle
        // rangeControls.noUiSlider.on('update', function ( values, handle ) {
        //   if ( handle == 0 ) {
        //     minPrice.value = parseInt(values[handle], 10);
        //   } else if ( handle == 1 ) {
        //     maxPrice.value = parseInt(values[handle], 10);
        //   }
        // });
        //
        // // Updating handle position on input value changing
        // minPrice.addEventListener('change', function ( ) {
        //   rangeControls.noUiSlider.set([this.value, null]);
        // });
        //
        // maxPrice.addEventListener('change', function ( ) {
        //   rangeControls.noUiSlider.set([null, this.value]);
        // });
      // }


    }

    chengeColor();
    function chengeColor() {
      var item = $(".product__sizes-item");
      item.click(function() {
        $(this).toggleClass("active");
        $(this).siblings().removeClass("active");
      });
    }


  })();
});
