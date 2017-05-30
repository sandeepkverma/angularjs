// var gulp = require('gulp');
// var pug = require('gulp-pug');
// var less = require('gulp-less');
// var minifyCSS = require('gulp-csso');

// gulp.task('html', function(){
//   return gulp.src('client/templates/*.pug')
//     .pipe(pug())
//     .pipe(gulp.dest('build/html'))
// });

// gulp.task('css', function(){
//   return gulp.src('client/templates/*.less')
//     .pipe(less())
//     .pipe(minifyCSS())
//     .pipe(gulp.dest('build/css'))
// });

// gulp.task('default', [ 'html', 'css' ]);



var gulp = require('gulp');
var autoprefix = require('gulp-autoprefixer');
var minifyCSS = require('gulp-minify-css');
var concat = require('gulp-concat');
var imagemin = require('gulp-imagemin');
var changed = require('gulp-changed');
var browserSync = require('browser-sync').create();
var uglify = require('gulp-uglify');
var htmlmin = require('gulp-html-minifier');

gulp.task('styles', function() {
   gulp.src(['assests/css/*.css'])
   .pipe(concat('styles.css'))
   .pipe(autoprefix('last 2 versions'))
   .pipe(minifyCSS())
   .pipe(gulp.dest('build/styles/'));
});

gulp.task('imagemin', function() {
   var img_src = 'assests/img/**/*', img_dest = 'build/images';
   
   gulp.src(img_src)
   .pipe(changed(img_dest))
   .pipe(imagemin())
   .pipe(gulp.dest(img_dest));
});

// gulp.task('default', ['styles'], function() {
//    // watch for CSS changes
//    gulp.watch('assests/css/*.css', function() {
//       // run styles upon changes
//       gulp.run('styles');
//    });
// });

gulp.task('js', function(){
   gulp.src('assests/js/*.js')
   .pipe(concat('script.js'))
   .pipe(uglify())
   .pipe(gulp.dest('build/scripts/'));
});

gulp.task('browserSync', function() {
   browserSync.init({
      server: {
         baseDir: 'build'
      }
   })
})

 
gulp.task('htmlmifify', function() {
  gulp.src('build/*.html')
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest('./build'))
});

gulp.task('default', ['browserSync', 'styles','js','htmlmifify'], function (){
   gulp.watch(['assests/css/*.css','assests/js/*.js','build/*.html'], ['styles','js']).on('change', browserSync.reload);
});  