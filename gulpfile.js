// for gulp>v.4. Don't forget to install all plugins

'use strict';
 
var gulp = require('gulp');
var sass = require('gulp-sass');
var browserSync = require('browser-sync').create();
var pug = require('gulp-pug');
var bulkSass = require('gulp-sass-bulk-import'); // let use the contents of the subfolders with * 
var del = require('del'); // to delete folder
var imagemin = require('gulp-imagemin'); // minification of images
var postcss = require('gulp-postcss'); // transforming styles with JS plugins:
var cssimport = require('postcss-import'); // changing file from @import links to its content 
var autoprefixer = require('autoprefixer'); // postcss autoprefixer

// Pug task
gulp.task('pug', function() { // declare task
  return gulp.src('src/pug/index.pug') // find .files in folder
    .pipe(pug({
      pretty:true
    }))
    .pipe(gulp.dest('./'));
});

// Sass task
gulp.task('sass', function(cb) {
  gulp.src('src/sass/main.scss')
    .pipe(bulkSass())
    .pipe(sass()) // using gulp-sass
    .pipe(postcss([ // everytime sass runs it requires postcss before creating a new .css
        require('postcss-import'),
        require('autoprefixer')
      ]))
    .pipe(gulp.dest('build/css'))
	cb(); // !Callback way to finish task
});

// Static Server + watching changes in html/css/sass files + reload
gulp.task('serve', function() {
	//starting a server and point folder to watch
    browserSync.init({
        server: './'
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
  gulp.watch('build/css/main.css', gulp.series('css'));
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
  gulp.parallel('watch', 'serve')
));

// Postcss task
gulp.task('css', function() {
  var plugin = [ 
    cssimport(),
    autoprefixer()
  ];
    gulp.src('build/css/main.css')
      .pipe(postcss(plugin))
      .pipe(gulp.dest('build/css/'))
});
