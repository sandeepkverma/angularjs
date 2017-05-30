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
var merge = require('merge-stream');

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

// gulp.task('commonjs', function(){
//    gulp.src('*.js')
//    .pipe(concat('script.js'))
//    .pipe(uglify())
//    .pipe(gulp.dest('build/scripts'));
// });

// gulp.task('sharedjs', function(){
//    gulp.src('shared/sidebar/*.js')
//    .pipe(concat('script.js'))
//    .pipe(uglify())
//    .pipe(gulp.dest('build/scripts/'));
// });

gulp.task('js', function(){
	var srcs = [];
	srcs.push('libs/angular.js');
	srcs.push('libs/angular-route.js');
    srcs.push('shared/sidebar/sidebar.directive.js');
	srcs.push('app.module.js');
	srcs.push('app.routes.js');
	srcs.push('components/dashboard/dashboard.controller.js');
	srcs.push('components/dashboard/dashboard.service.js');
	srcs.push('components/live/live.controller.js');
	srcs.push('components/live/live.service.js');
	srcs.push('app.constant.js');


   gulp.src(srcs)
   .pipe(concat('script.js'))
   .pipe(uglify())
   .pipe(gulp.dest('build/scripts/'));
});

// gulp.task('js', function(){
	

//    var angular = gulp.src('libs/angular.js')
//    .pipe(concat('angular.js'))
//    .pipe(uglify())
//    .pipe(gulp.dest('build/libs/'));

//       var angularRoute = gulp.src('libs/angular-route.js')
//       .pipe(concat('angular-route.js'))
//    .pipe(uglify())
//    .pipe(gulp.dest('build/libs/'));

//   var sidebarDirective =  gulp.src('shared/sidebar/sidebar.directive.js')
//    .pipe(concat('sidebar.directive.js'))
//    .pipe(uglify())
//    .pipe(gulp.dest('build/shared/sidebar/'));

//    var appModule = gulp.src('app.module.js')
//    .pipe(concat('app.module.js'))
//    .pipe(uglify())
//    .pipe(gulp.dest('build/'));

//    var appRoutes = gulp.src('app.routes.js')
//    .pipe(concat('app.routes.js'))
//    .pipe(uglify())
//    .pipe(gulp.dest('build/'));

//    var dashboardCtrl = gulp.src('components/dashboard/dashboard.controller.js')
//    .pipe(concat('dashboard.controller.js'))
//    .pipe(uglify())
//    .pipe(gulp.dest('build/components/dashboard/'));

//    var dashboardService = gulp.src('components/dashboard/dashboard.service.js')
//    .pipe(concat('dashboard.service.js'))
//    .pipe(uglify())
//    .pipe(gulp.dest('build/components/dashboard/'));

//    var liveCtrl = gulp.src('components/live/live.controller.js')
//    .pipe(concat('live.controller.js'))
//    .pipe(uglify())
//    .pipe(gulp.dest('build/components/live/'));

//    var liveService = gulp.src('components/live/live.service.js')
//    .pipe(concat('live.service.js'))
//    .pipe(uglify())
//    .pipe(gulp.dest('build/components/live/'));

//    var constants = gulp.src('app.constant.js')
//    .pipe(concat('app.constant.js'))
//    .pipe(uglify())
//    .pipe(gulp.dest('build/'));

//    return merge(angular, angularRoute,sidebarDirective,appModule,appRoutes,dashboardCtrl,dashboardService,liveCtrl,liveService,constants);


// });



gulp.task('browserSync', function() {
   browserSync.init({
      server: {
         baseDir: 'build'
      }
   })
})

 
gulp.task('htmlmifify', function() {
  gulp.src('*.html')
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest('./build'))
});

gulp.task('livehtml', function() {
  gulp.src('components/live/*.html')
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest('./build/components/live'))
});

gulp.task('dashboardhtml', function() {
  gulp.src('components/dashboard/*.html')
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest('./build/components/dashboard'))
});

gulp.task('sidebarhtml', function() {
  gulp.src('shared/sidebar/*.html')
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest('./build/shared/sidebar'))
});

gulp.task('default', ['browserSync', 'js','htmlmifify','livehtml','dashboardhtml','sidebarhtml'], function (){
   gulp.watch(['assests/css/*.css','assests/js/*.js','build/*.html'], ['styles','js']).on('change', browserSync.reload);
});  