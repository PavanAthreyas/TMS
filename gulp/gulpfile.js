// var ui5preload = require('gulp-ui5-preload');
// var uglify = require('gulp-uglify');
// var prettydata = require('gulp-pretty-data');
// var gulpif = require('gulp-if');
// var gulp = require('gulp');

// gulp.task('ui5preload', function(){
//   return gulp.src([
//                     '**/**.+(js|xml)'
//                   ])
//           .pipe(gulpif('/*.js',uglify()))    //only pass .js files to uglify
//           .pipe(gulpif('/*.xml',prettydata({type:'minify'}))) // only pass .xml to prettydata
//           .pipe(ui5preload({base:'src/ui',namespace:'TMS'}))
//           .pipe(gulp.dest('dist'));
//      })
