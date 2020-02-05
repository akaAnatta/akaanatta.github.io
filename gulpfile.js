// for gulp>v.4

'use strict';
 
var gulp = require('gulp');
var sass = require('gulp-sass');
var browserSync = require('browser-sync').create();
var pug = require('gulp-pug');
var bulkSass = require('gulp-sass-bulk-import'); // let use the subfolders when @import in .scss file
var del = require('del'); // to delete folder
var imagemin = require('gulp-imagemin'); //minification of images

// Pug task
gulp.task('pug', function() {
  return gulp.src('src/pug/index.pug')
    .pipe(pug({
      pretty:true
    }))
    .pipe(gulp.dest('./'));
});

// Sass task
gulp.task('sass', function(cb) {
  gulp.src('src/sass/main.scss')
    .pipe(bulkSass())
    .pipe(sass()) // Using gulp-sass
    .pipe(gulp.dest('build/css'))
	cb();
});

// Static Server + watching changes in html/css/sass files + reload
gulp.task('serve', function() {
	//starting a server and point folder to watch
    browserSync.init({
        server: "./"
    });
	//start page reloading after changes in html/css/sass
    gulp.watch('*.html').on('change', browserSync.reload);
    gulp.watch('build/css/*.css').on('change', browserSync.reload);
});

//Watch task
gulp.task('watch', function() {
  gulp.watch('src/sass/**/*', gulp.series('sass'));
  gulp.watch('src/blocks/**/*.scss', gulp.series('sass'));
  gulp.watch('src/pug/**/*.pug', gulp.series('pug'));
  gulp.watch('src/blocks/**/*.pug', gulp.series('pug'));
  gulp.watch('src/img/*', gulp.series('compress'));
});

// Cleaning folder before compress
gulp.task('clean', function(){
  return del('build/img'); // where files need to be deleted
});

// Comress img
gulp.task('compress', function(cb) {
  gulp.src('src/img/*')
  .pipe(imagemin({
    progressive: true
  }))
  .pipe(gulp.dest('build/img'))
    cb();
});

// Default Task
gulp.task('default', gulp.series(
  'sass', 'pug', 'clean', 'compress',
  gulp.parallel('serve', 'watch')
));