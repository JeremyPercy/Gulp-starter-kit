const gulp = require('gulp'),
    browserSync = require('browser-sync').create(),
    sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    sourcemaps = require('gulp-sourcemaps'),
    imagemin = require('gulp-imagemin'),
    babel = require("gulp-babel"),
    minify = require("gulp-babel-minify"),
    concat = require('gulp-concat'),
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
function images() {
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
}

// Compile sass into CSS & auto-inject into browsers

function css() {
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
}

// Compile JS files from dependencies bootstrap, jquery etc.

function scripts() {
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
}

// Custom js script file.

function customScripts() {
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
}


// Static Server + watching scss/html files
gulp.task('default', gulp.series(css, scripts, customScripts, images, () => {

    if (!config.options.localURL) {
        browserSync.init({
            server: {
                baseDir: config.options.dir,
            },
        });
    } else {
        browserSync.init({
            proxy: config.options.localURL,
            noOpen: false,
        });
    }

    gulp.watch(config.styles.watch, css);
    gulp.watch(config.js.watch, customScripts);
    gulp.watch(config.images.src, images);
    gulp.watch(config.templates).on('change', browserSync.reload);
}));