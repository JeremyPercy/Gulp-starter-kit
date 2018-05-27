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

// config referring to the proper maps edit if needed.
const config = require('./gulp-config');

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
    return gulp.src(config.images.src)
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
        .pipe(gulp.dest(config.images.dist));
});

// Compile sass into CSS & auto-inject into browsers

gulp.task('sass', () => {
    return gulp.src(config.styles.src)
        .pipe(plumber({errorHandle: onError}))
        .pipe(sourcemaps.init())
        .pipe(sass({outputStyle: 'compressed'})
            .on('error', onError))
        .pipe(autoprefixer('last 2 version'))
        .pipe(concat('styles.css'))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(config.styles.dist))
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
        .pipe(gulp.dest(config.js.dist))
        .pipe(browserSync.stream());
});

// Custom js script file.

gulp.task('custom-scripts', () => {
    return gulp.src(config.js.src)
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
        .pipe(gulp.dest(config.js.dist))
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

    if (!config.options.localURL) {
        browserSync.init({
            server: {
                baseDir: config.options.dir,
            },
        });
    }
    else {
        browserSync.init({
            proxy: config.options.localURL,
            noOpen: false,
        });
    }

    gulp.watch('dist/styleguide/**/*', ['styleguide']);
    gulp.watch(config.styles.watch, ['sass']);
    gulp.watch(config.js.watch, ['custom-scripts']);
    gulp.watch(config.images.src, ['imagemin']);
    gulp.watch(config.templates).on('change', browserSync.reload);
});