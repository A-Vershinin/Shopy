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
    //слайдер продукта
    itemInnerSlider();
    function itemInnerSlider() {
      $(".product__slider").bxSlider({
        pagerCustom: ".product__colors",
        controls: false
      });
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
