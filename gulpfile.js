const config = require('./gulp_config.js');
const gulp = require('gulp');
const sass = require('gulp-sass');
const browserSync = require('browser-sync').create();
const plumber = require('gulp-plumber');
const notify = require('gulp-notify');
const gutil = require('gulp-util');
const babel = require('gulp-babel');
const minify = require('gulp-babel-minify');

const reload = browserSync.reload;
const path = {
    src: {
        sass: 'assets/src/sass',
        script: 'assets/src/js',
    },
    dist: {
        script: 'assets/dist/js',
        style: 'assets/dist/css',
    },
    theme: 'wp-content/themes/' + config.theme
};

gulp.task('browser-sync', function () {
    browserSync.init({
        proxy: 'http://' + config.host + '/' + config.dir + '/' + config.site
    });
});

gulp.task('process_sass', () => {
    gulp.src(path.src.sass + '/styles.scss')
        .pipe(plumber({
            errorHandler: function (err) {
                notify.onError({
                    title: "Gulp error in " + err.plugin,
                    message: err.toString()
                })(err);
                gutil.beep();
            }
        }))
        .pipe(sass({
            outputStyle: 'compressed'
        }))
        .pipe(gulp.dest(path.dist.style));

    gulp.src(path.src.sass + '/admin_styles.scss')
        .pipe(plumber({
            errorHandler: function (err) {
                notify.onError({
                    title: "Gulp error in " + err.plugin,
                    message: err.toString()
                })(err);
                gutil.beep();
            }
        }))
        .pipe(sass({
            outputStyle: 'compressed'
        }))
        .pipe(gulp.dest(path.dist.style));
});

gulp.task('scripts_compile', () => {
    gulp.src(path.src.script + '/scripts.js')
        .pipe(babel({
            presets: ['@babel/env'],
        }))
        .pipe(minify({
            mangle: {
                keepClassName: true
            }
        }))
        .pipe(gulp.dest(path.dist.script))
});

gulp.task('styles', function () {
    gulp.src(path.dist.style + '/**/*.css')
        .pipe(browserSync.stream());
});

gulp.task('scripts', function () {
    gulp.src(path.src.script + '/**/*.js')
        .pipe(browserSync.stream());
});

gulp.task('php', function () {
    gulp.src('./**/*.php')
        .pipe(browserSync.stream());
});

gulp.task('watch', ['browser-sync', 'styles', 'php'], function () {
    gulp.watch(path.src.script + '/**/*.js', ['scripts']);
    gulp.watch(path.dist.style + '/**/*.css', ['styles']);
    gulp.watch(path.src.sass + '/**/*.scss', ['process_sass']);
    gulp.watch(path.src.script + '/**/*.js', ['scripts_compile']);
    gulp.watch('./**/*.php', ['php']);
});

gulp.task('default', ['browser-sync', 'scripts', 'styles', 'php', 'process_sass', 'scripts_compile', 'watch']);