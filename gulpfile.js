
const gulp = require('gulp')
const babel = require('gulp-babel')
const del = require('del')

gulp.task('default', function () {
  del.sync('lib')

  gulp.src([ 'src/**/*.js' ])
    .pipe(babel())
    .pipe(gulp.dest('lib/'))

  gulp.src([ 'src/.storybook/**/*.js' ])
    .pipe(babel())
    .pipe(gulp.dest('lib/.storybook'))

  gulp.src([ 'src/.storybook/*.html', 'src/.storybook/*.ejs', 'src/.storybook/*.json', 'src/http-mocker/**/*.har' ])
    .pipe(gulp.dest('lib/.storybook'))

    gulp.src([ 'src/**/*.ejs', 'src/**/*.json' ])
    .pipe(gulp.dest('lib/'))
})

gulp.task('watch', function () {
  gulp.watch([
    'src/**/*.js',
    'src/.storybook/**/*.js',
    'src/.storybook/*.html',
    'src/**/*.ejs',
    'src/.storybook/*.json'
  ],
  [ 'default' ])
})
