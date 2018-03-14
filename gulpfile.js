var gulp = require('gulp'),
    browserSync = require('browser-sync').create(),
    sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    sourcemaps = require('gulp-sourcemaps'),
    imagemin = require('gulp-imagemin'),
    pngquant = require('imagemin-pngquant'),
    babel = require("gulp-babel"),
    minify = require("gulp-babel-minify"),
    concat = require('gulp-concat'),
    kss = require('kss'),
    plumber = require('gulp-plumber'),
    notify = require("gulp-notify");

// Error message
var onError = function (err) {
    notify({
        title: 'Gulp Task Error on ' + err.plugin,
        message: '<%= error.message %>',
        sound: 'Beep'
    }).write(err);

    console.log(err.toString());

    this.emit('end');
}

// task Imagemin, Compile images

gulp.task('imagemin', function () {
    return gulp.src('src/images/*')
        .pipe(imagemin({
            progressive: true,
            svgPlugins: [{removeViewBox: false}],
            use: [pngquant()]
        }))
        .pipe(gulp.dest('dist/assets/images'));
});

// Compile sass into CSS & auto-inject into browsers

gulp.task('sass', function () {
    return gulp.src(['src/scss/**/*.scss'])
        .pipe(plumber({errorHandle: onError}))
        .pipe(sourcemaps.init())
        .pipe(sass({outputStyle: 'compressed'})
            .on('error', onError))
        .pipe(autoprefixer('last 2 version'))
        .pipe(concat('styles.css'))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest("dist/assets/css"))
        .pipe(notify({
            title: 'Gulp Task Complete SASS',
            message: 'Styles have been compiled'
        }))
        .pipe(browserSync.stream());
});


// Compile JS files from dependencies bootstrap, jquery etc.

gulp.task('bundle-scripts', function () {
    return gulp.src([
        'src/js/libs/fontawesome-all.min.js',
        'node_modules/jquery/jquery.js',
        'node_modules/bootstrap/dist/js/bootstrap.bundle.js'
    ])
        .pipe(sourcemaps.init())
        .pipe(babel({
            presets: ['@babel/env']
        }))
        .pipe(concat('all.js'))
        .pipe(minify({
            mangle: {
                keepClassName: true
            }
        }))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('dist/assets/js'))
        .pipe(browserSync.stream());
});

// Custom js script file.

gulp.task('custom-scripts', function () {
    return gulp.src(['src/js/**/*.js'])
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
        .pipe(gulp.dest('dist/assets/js'))
        .pipe(notify({
            title: 'Gulp Task Complete Javascript',
            message: 'JavaScripts have been compiled'
        }))
        .pipe(browserSync.stream());
});

// Styleguide script.

gulp.task('styleguide', function () {
    return kss({
        source: 'src/scss/',
        destination: 'styleguide/',
        css: '../dist/assets/css/style.css',
        js: '../dist/assets/js/custom.js',
        builder: "node_modules/michelangelo/kss_styleguide/custom-template/",
        title: 'Your website title'
    });
});

// Static Server + watching scss/html files

gulp.task('default', ['sass', 'bundle-scripts', 'custom-scripts', 'imagemin', 'styleguide'], function () {

    browserSync.init({
        server: 'dist'
    });

    gulp.watch('src/scss/**/*.scss', ['sass', 'styleguide']);
    gulp.watch('src/js/*.js', ['bundle-scripts']);
    gulp.watch('src/js/*.js', ['custom-scripts']);
    gulp.watch('src/images/*', ['imagemin']);
    gulp.watch('dist/**/*.html').on('change', browserSync.reload);
});