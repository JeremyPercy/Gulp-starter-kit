const gulp = require('gulp'),
    browserSync = require('browser-sync').create(),
    sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    sourcemaps = require('gulp-sourcemaps'),
    imagemin = require('gulp-imagemin'),
    babel = require("gulp-babel"),
    minify = require("gulp-babel-minify"),
    concat = require('gulp-concat'),
    kss = require('kss'),
    path = require('path'),
    plumber = require('gulp-plumber'),
    notify = require("gulp-notify");

// Paths referring to the proper maps edit if needed.
const paths = {
    templates: 'dist/**/*.html'
};

paths.styles = {
    src: 'src/scss/**/*.scss',
    dist: 'dist/assets/css',
    watch: 'src/scss/styles.scss'
};

paths.js = {
    src: 'src/js/**/*.js',
    dist: 'dist/assets/js',
    watch: 'src/js/custom.js'
};

paths.images ={
    src: 'src/images/**/*',
    dist: 'dist/assets/images'
};

const options = {};

// Set the URL used to access the website under development. If you have a server els leave blank. This will
// allow Browser Sync to serve the website and update CSS changes on the fly.
options.localURL = '';
options.dir = 'dist/';
// options.localURL = 'http://localhost';

// Error message
const onError = function (err) {
    notify.onError({
        title: 'Gulp Task Error on ' + err.plugin,
        message: '<%= error.message %>',
        sound: 'Beep'
    })(err);
    this.emit('end');
};

// task Imagemin, Compile images

gulp.task('imagemin', () => {
    return gulp.src(paths.images.src)
        .pipe(imagemin([
            imagemin.gifsicle({interlaced: true}),
            imagemin.jpegtran({progressive: true}),
            imagemin.optipng({optimizationLevel: 5}),
            imagemin.svgo({
                plugins: [
                    {removeViewBox: true},
                    {cleanupIDs: false}
                ]
            })
        ]))
        .pipe(gulp.dest(paths.images.dist));
});

// Compile sass into CSS & auto-inject into browsers

gulp.task('sass', () => {
    return gulp.src(paths.styles.src)
        .pipe(plumber({errorHandle: onError}))
        .pipe(sourcemaps.init())
        .pipe(sass({outputStyle: 'compressed'})
            .on('error', onError))
        .pipe(autoprefixer('last 2 version'))
        .pipe(concat('styles.css'))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(paths.styles.dist))
        .pipe(notify({
            title: 'Gulp Task Complete SASS',
            message: 'Styles have been compiled'
        }))
        .pipe(browserSync.stream());
});


// Compile JS files from dependencies bootstrap, jquery etc.

gulp.task('bundle-scripts', () => {
    return gulp.src([
        'node_modules/jquery/dist/jquery.js',
        'node_modules/bootstrap/dist/js/bootstrap.bundle.js'
    ])
        .pipe(sourcemaps.init())
        .pipe(concat('all.js'))
        .pipe(minify({
            mangle: {
                keepClassName: true
            }
        }))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(paths.js.dist))
        .pipe(browserSync.stream());
});

// Custom js script file.

gulp.task('custom-scripts', () => {
    return gulp.src(paths.js.src)
        .pipe(plumber({errorHandle: onError}))
        .pipe(sourcemaps.init())
        .pipe(babel({
            presets: ['@babel/env']
        })
        .on('error', onError))
        .pipe(concat('custom.js'))
        .pipe(minify({
            mangle: {
                keepClassName: true
            }
        }))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(paths.js.dist))
        .pipe(notify({
            title: 'Gulp Task Complete Javascript',
            message: 'JavaScripts have been compiled'
        }))
        .pipe(browserSync.stream());
});

// Styleguide script.

gulp.task('styleguide', () => {
    return kss({
        source: 'src/scss/',
        destination: 'dist/styleguide/',
        css: '../assets/css/style.css',
        js: '../assets/js/custom.js',
        builder: "node_modules/michelangelo/kss_styleguide/custom-template/",
        title: 'Your website title'
    });
});

// Static Server + watching scss/html files

gulp.task('default', ['sass', 'bundle-scripts', 'custom-scripts', 'imagemin', 'styleguide'], () => {

    if (!options.localURL) {
        browserSync.init({
            server: {
                baseDir: options.dir,
            },
        });
    }
    else {
        browserSync.init({
            proxy: options.localURL,
            noOpen: false,
        });
    }

    gulp.watch(paths.styles.watch, ['sass']);
    gulp.watch('dist/styleguide/**/*', ['styleguide']);
    gulp.watch(paths.js.watch, ['custom-scripts']);
    gulp.watch(paths.images.src, ['imagemin']);
    gulp.watch(paths.templates).on('change', browserSync.reload);
});