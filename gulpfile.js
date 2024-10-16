const gulp = require('gulp');
const browserSync = require('browser-sync').create();
const sass = require('gulp-sass')(require('sass'));
const cleanCSS = require('gulp-clean-css');
const autoprefixer = require('gulp-autoprefixer');
const rename = require('gulp-rename');
const htmlmin = require('gulp-htmlmin');
const plumber = require('gulp-plumber');
const notify = require('gulp-notify');

// Пути к файлам
const paths = {
   html: {
      src: 'src/**/*.html',
      dest: 'dist/',
   },
   styles: {
      src: 'src/assets/sass/**/*.+(scss|sass)',
      dest: 'dist/assets/css',
   },
   scripts: {
      src: 'src/assets/js/**/*.js',
      dest: 'dist/assets/js',
   },
   icons: {
      src: 'src/assets/icons/**/*',
      dest: 'dist/assets/icons',
   },
   images: {
      src: 'src/assets/img/**/*',
      dest: 'dist/assets/img',
   },
};

// Обработка ошибок
function handleError(err) {
   notify.onError({
      title: 'Gulp error in ' + err.plugin,
      message: err.toString(),
   })(err);
   this.emit('end');
}

// Запуск сервера
function server() {
   browserSync.init({
      server: {
         baseDir: 'dist',
      },
   });

   gulp
      .watch(paths.html.src, gulp.series(html))
      .on('change', browserSync.reload);
}

// Компиляция и минификация стилей
function styles() {
   return gulp
      .src(paths.styles.src)
      .pipe(plumber({ errorHandler: handleError }))
      .pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError))
      .pipe(rename({ suffix: '.min', prefix: '' }))
      .pipe(autoprefixer())
      .pipe(cleanCSS({ compatibility: 'ie8' }))
      .pipe(gulp.dest(paths.styles.dest))
      .pipe(browserSync.stream());
}

// Минификация HTML
function html() {
   return gulp
      .src(paths.html.src)
      .pipe(plumber({ errorHandler: handleError }))
      .pipe(htmlmin({ collapseWhitespace: true }))
      .pipe(gulp.dest(paths.html.dest));
}

// Обработка и копирование скриптов
function scripts() {
   return gulp
      .src(paths.scripts.src)
      .pipe(plumber({ errorHandler: handleError }))
      .pipe(gulp.dest(paths.scripts.dest))
      .pipe(browserSync.stream());
}

// Копирование иконок
function icons() {
   return gulp
      .src(paths.icons.src)
      .pipe(plumber({ errorHandler: handleError }))
      .pipe(gulp.dest(paths.icons.dest))
      .pipe(browserSync.stream());
}

// Копирование изображений
function images() {
   return gulp
      .src(paths.images.src)
      .pipe(plumber({ errorHandler: handleError }))
      .pipe(gulp.dest(paths.images.dest))
      .pipe(browserSync.stream());
}

// Наблюдение за изменениями файлов
function watch() {
   gulp.watch(paths.html.src, html);
   gulp.watch(paths.styles.src, styles);
   gulp.watch(paths.scripts.src, scripts);
   gulp.watch(paths.icons.src, icons);
   gulp.watch(paths.images.src, images);
}

// Задачи
gulp.task('server', server);
gulp.task('styles', styles);
gulp.task('scripts', scripts);
gulp.task('html', html);
gulp.task('icons', icons);
gulp.task('images', images);
gulp.task('watch', watch);

gulp.task(
   'default',
   gulp.series(
      gulp.parallel('html', 'styles', 'scripts', 'icons', 'images'),
      gulp.parallel('watch', 'server')
   )
);
