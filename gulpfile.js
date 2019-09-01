var config      = require('./gulp_config.js');
var gulp        = require('gulp');
var sass		= require('gulp-sass');
var browserSync = require('browser-sync').create();
var plumber     = require('gulp-plumber');
var notify      = require('gulp-notify');
var gutil       = require('gulp-util');

var reload      = browserSync.reload;
var siteName    = config.site;
var themeName   = config.theme;
var themePath   = 'wp-content/themes/' + themeName;
var sassPath    = themePath + '/assets/sass';
var scriptsPath = themePath + '/assets/js';
var stylesPath  = themePath + '/assets/css';

// Start browserSync
gulp.task('browser-sync', function () {
    browserSync.init({
        proxy: 'http://' + config.host + '/' + config.dir + '/' + siteName
    });
});

gulp.task('process_sass', function(){
	gulp.src(sassPath + '/styles.scss')
    .pipe(plumber({errorHandler: function (err) {
        notify.onError({
            title: "Gulp error in " + err.plugin,
            message: err.toString()
        })(err);
        gutil.beep();
    }}))
	.pipe(sass({
        outputStyle: 'nested'
    }))
	.pipe(gulp.dest(stylesPath));
});

gulp.task('sass_compress', function(){
	gulp.src(sassPath + '/styles.scss')
    .pipe(plumber({errorHandler: function (err) {
        notify.onError({
            title: "Gulp error in " + err.plugin,
            message: err.toString()
        })(err);
        gutil.beep();
    }}))
	.pipe(sass({
        outputStyle: 'compressed'
    }))
	.pipe(gulp.dest(stylesPath));
});

gulp.task('sass_compress_admin', function(){
	gulp.src(sassPath + '/admin_styles.scss')
    .pipe(plumber({errorHandler: function (err) {
        notify.onError({
            title: "Gulp error in " + err.plugin,
            message: err.toString()
        })(err);
        gutil.beep();
    }}))
	.pipe(sass({
        outputStyle: 'compressed'
    }))
	.pipe(gulp.dest(stylesPath));
});

gulp.task('styles', function () {
    gulp.src(stylesPath + '/**/*.css')
    .pipe(browserSync.stream());
});

gulp.task('scripts', function () {
    gulp.src(scriptsPath + '/**/*.js')
    .pipe(browserSync.stream());
});

gulp.task('php', function () {
    gulp.src(themePath + '/**/*.php')
    .pipe(browserSync.stream());
});

gulp.task('watch', ['browser-sync', 'styles', 'php'], function () {
    gulp.watch(scriptsPath + '/**/*.js', ['scripts']);
    gulp.watch(stylesPath + '/**/*.css', ['styles']);
    gulp.watch(sassPath + '/**/*.scss', ['sass_compress']);
    // gulp.watch(sassPath + '/**/*.scss', ['sass_compress_admin']);
    gulp.watch(themePath + '/**/*.php', ['php']);
});

gulp.task('default', ['browser-sync', 'scripts', 'styles', 'php', 'sass_compress', 'watch']);