"use strict";

var gulp = require("gulp"), //подключаем Gulp
    pug = require('gulp-pug'), //шаблогизатор для разметки
    sass = require("gulp-sass"), //подключаем Sass-пакет
    plumber = require("gulp-plumber"), //подключаем Пламбер
    postcss = require("gulp-postcss"), //подключаем postcss
    autoprefixerR = require('gulp-autoprefixer'), //подключаем автопрефиксы
    autoprefixer = require("autoprefixer"), //postcss плагин
    gutil = require("gulp-util"), //различные утилиты для разработки
    csso = require("gulp-csso"), //сжимаем css-файлы
    uncss = require('gulp-uncss'), //удалямем не использованный css
    rename = require("gulp-rename"), //переименовываем файлы
    imagemin = require("gulp-imagemin"), //сжимаем картинки
    spritesmith = require('gulp.spritesmith'), //собираем png-спрайт
    svgstore = require("gulp-svgstore"), //собираем svg-спрайт
    svgmin = require("gulp-svgmin"), //сжимаем svg
    concat = require("gulp-concat"), //склеиваим файлы
    uglify = require("gulp-uglifyjs"), //сжимаем все js файлы
    mqpacker = require("css-mqpacker"),//склеиваем все медиазапросы
    run = require("run-sequence"), //последовательная работа тасков
    del = require("del"), //удаляем файлы
    sourcemaps = require('gulp-sourcemaps'), //добавление путей в файлы
    notify = require('gulp-notify'), //представление ошибок в удобном виде
    compass = require('gulp-compass'),
    useref = require('gulp-useref'), //объединение файлов в один по указанной разметке в комментариях.
    gulpif = require('gulp-if'), //выполение при условиях
    wiredep = require('gulp-wiredep'), //добавление ссылок на плагины bower.
    replace = require('gulp-replace'), //фиксинг некоторых багов
    cache = require('gulp-cache'), //кешируем
    cheerio = require('gulp-cheerio'), //вспомогательный плагин
    server = require("browser-sync"); //браузер-синк(слежение в браузере)


// var production = process.env.NODE_ENV === 'production';
// .pipe(_if(!production, sourcemaps.init())) // для сорсмепов в дев-режиме
// .pipe(_if(production, csso())) // в продакшене жмем
// .pipe(_if(!production, sourcemaps.write())) // пишем сормепы в дев-режиме
// .pipe(_if(production, gzip())) // если продакшен - жмем gzip


//pug
gulp.task('pug', function() {
	gulp.src("app/templates/pages/*.pug")
		.pipe(plumber())
		.pipe(pug({pretty:true}))
		.on('error', notify.onError(function(error) {
			return {
				title: 'Pug',
				message:  error.message
			}
		 }))
		.pipe(gulp.dest("app/pages"))
		.pipe(server.reload({stream: true}));
});


gulp.task("styles", function() {
  gulp.src("app/sass/style.scss")
    .pipe(plumber({ //Запрещаем ошибкам прерывать скрипт
      errorHandler: notify.onError(function(err) { // nofity - представление ошибок в удобном виде.
        return {
          title: 'Styles',
          message: err.message
        }
      })
    }))
    .pipe(sourcemaps.init()) //История изменения стилей, которая помогает нам при отладке в devTools.
    .pipe(sass({
      errLogToConsole: true,
      "sourcemap=none": true,
      noCache: true,
      outputStyle: 'expanded'
    }))
    .pipe(postcss([
      autoprefixer({browsers: ["last 3 versions", "> 2%"], cascade: false}),
      mqpacker({
        sort: true //соеденяем все медиазапросы
      })
    ]))
    .pipe(sourcemaps.write()) //записываем пути
    .pipe(gulp.dest("build/css"))
    .pipe(csso())  //минификация кода.
    .pipe(rename({suffix: '.min'})) //переименовываем файл style в style.min.css
    .pipe(gulp.dest("build/css")) //выгружаем в build/css
    .pipe(server.reload({stream: true})); //После сборки делаем перезагрузку страницы
});


gulp.task("JsChange", function () {
  return gulp.src([
    "app/js/**/*.js"
  ], {
    base: "app"
  })
    .pipe(gulp.dest("build"));
    // .pipe(server.reload({stream: true}));
});

gulp.task("serve", function() {
  server.init({
    server: "build",
    notify: false,
    open: true,
    ui: false
  });

  gulp.watch("app/templates/**/*.pug", ["pug"]);
  gulp.watch("app/sass/**/*.{scss,sass}", ["styles"]);
  gulp.watch("app/js/*.js", ["JsChange"]);
  gulp.watch("app/pages/*.html", ["useref"]);
  gulp.watch("build/**/*").on("change", server.reload);
});
// ====================================================
// ====================================================
// ================= Сборка проекта BUILD =============
// Чистка папки
gulp.task("clean", function() {
  return del("build");
});
// Копируем файлы из App в папку build
gulp.task("copy", function() {
  return gulp.src([
    "app/fonts/**/*.{woff,woff2}",
    "app/favicons/*.*",
    "app/img/**/*",
    "app/js/**",
    "app/php/**"
  ], {
    base: "app"
  })
    .pipe(gulp.dest("build"));
});
gulp.task('useref', function() {
	return gulp.src('app/pages/*.html')
		.pipe(useref()) //Выполняет объединение файлов в один по указанным в разметке html комментариев.
		.pipe(gulp.dest('build/'));
});

// Оптимизация картинок
gulp.task("images", function() {
  return gulp.src("build/img/**/*.{png,jpg,gif}")
    .pipe(imagemin([
      imagemin.optipng({optimizationLevel: 3}),
      imagemin.jpegtran({progressive: true})
    ]))
    // .pipe(imagemin({ optimizationLevel: 5, progressive: true, interlaced: true }))
    // используем кеширование для избежания пересжатия уже сжатых изображений каждый раз при запусске задач.
    // нужнен плагин gulp-cahce
    // .pipe(cache(imagemin({ optimizationLevel: 5, progressive: true, interlaced: true })))
    .pipe(gulp.dest("build/img"));
});
//svg спрайт
gulp.task("svg:sprite", function() {
  return gulp.src("build/img/icons/*.svg")
    .pipe(svgmin({
      js2svg: {
        pretty: true
      }
    }))
    .pipe(cheerio({
      run: function ($) {
        $('[fill]').removeAttr('fill');
        $('[stroke]').removeAttr('stroke');
        $('[style]').removeAttr('style');
      },
      parserOptions: { xmlMode: true }
    }))
    .pipe(replace('&gt;', '>'))
    .pipe(svgstore({
      mode: {
        symbol: {
          sprite: "../svg-sprite.svg"
        }
      }
    }))
    .pipe(rename("svg-sprite.svg"))
    .pipe(gulp.dest("build/img"));
});

//png-sprite
gulp.task('png:sprite', function() {
  var spriteData = gulp.src("app/img/icons/*.png")
		.pipe(spritesmith({
    imgName: 'png-sprite.png',
    cssName: 'png-sprite.scss',
		cssFormat: "css",
		imgPath: "../img/png-sprite.png",
		padding: 70
  }));
  spriteData.css.pipe(gulp.dest("app/sass/sprites"));
  spriteData.img.pipe(gulp.dest("build/img"));
});

// Остальные файлы и пр.
gulp.task("extras", function() {
  return gulp.src([
    "app/*.*",
    "!app/*.html"
  ])
  .pipe(gulp.dest("build"));
});
//css-библиотеки
gulp.task("css:vendor", function() {
  return gulp.src("build/css/vendor.css")
  // .pipe(uncss({ //чистим файл от неиспользованного css
  //   html: ['build/*.html']
  // }))
  .pipe(csso())
  .pipe(rename({suffix: '.min'}))
  .pipe(gulp.dest("build/css"));
});
//js-common
gulp.task("js:common", function() {
  return gulp.src("app/js/common.js")
  .pipe(sourcemaps.init())
  .pipe(gulp.dest("build/js"))
  .pipe(sourcemaps.write())
  .pipe(uglify())
  .pipe(rename({suffix: '.min'}))
  .pipe(gulp.dest("build/js"))
});
//js-библиотеки
gulp.task("js:vendor", function() {
  return gulp.src("build/js/vendor.min.js")
  .pipe(uglify())
  // .pipe(rename({suffix: '.min'}))
  .pipe(gulp.dest("build/js"));
});
//js-polyfills
gulp.task("js:polyfills", function() {
  return gulp.src("build/js/polyfills.min.js")
  .pipe(uglify())
  // .pipe(rename({suffix: '.min'}))
  .pipe(gulp.dest("build/js"));
});

//php
gulp.task("php", function() {
  return gulp.src("app/**/*.php")
  .pipe(sourcemaps.init())
  .pipe(gulp.dest("build/php"));
});
//Иконочные шрифты
gulp.task("icon-fonts", function() {
  // return gulp.src("app/bower/**/fonts/*.{woff,woff2}")
  return gulp.src("app/bower/font-awesome/fonts/*.*")
  .pipe(gulp.dest("app/fonts/FontAwesome"))
});

// Собираем папку BUILD
gulp.task("build", function(fn) {
  run(
    "clean",
    "pug",
    "copy",
    "useref",
    "styles",
    "css:vendor",
    "js:common",
    // "images",
    "png:sprite",
    "svg:sprite",
    "js:vendor",
    "js:polyfills",
    "icon-fonts",
    "extras",
    fn
  );
});
// ====================================================
// ====================================================
// ===================== Функции ======================

// Более наглядный вывод ошибок
var log = function (error) {
  console.log([
    '',
    "----------ERROR MESSAGE START----------",
    ("[" + error.name + " in " + error.plugin + "]"),
    error.message,
    "----------ERROR MESSAGE END----------",
    ''
  ].join('\n'));
  this.end();
}
gulp.task("watch", function(){
  gulp.watch ([
    "app/*.*"
  ]).on("change", server.reload);
});

gulp.task("default", ["serve", "watch"]);


//todo сделать таски : линтинг стилей, JSlint, ES6 синтаксис, gh-pages в гит,
//тесты, wc3 таск проверки
