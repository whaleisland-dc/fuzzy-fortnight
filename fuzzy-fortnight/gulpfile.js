/// <binding AfterBuild='default' Clean='clean' /> 

const { dest, src, series, parallel } = require('gulp');
const autoprefixer = require('autoprefixer');
const browserify = require('browserify');
const cssnano = require('cssnano');
const del = require('del');
const notify = require('gulp-notify');
const postcss = require('gulp-postcss');
const rename = require('gulp-rename');
const sass = require('gulp-sass')(require('sass'));
const source = require('vinyl-source-stream');
const tsify = require('tsify');

function clean() {
    return del([
        'wwwroot/**/*.css',
        'wwwroot/**/*.js',
        'wwwroot/**/*.map',
        'wwwroot/**/*.woff',
        'wwwroot/**/*.woff2',
        'wwwroot/**/*.svg',
    ]);
};

function tsTranspile() {
    return browserify({
        basedir: ".",
        debug = true,
        entries: ["Scripts/site.ts"],
        cache: {},
        packageCache: {}
    })
        .plugins(tsify)
        .bundle()
        .pipe(source('site.js'))
        .pipe(dest('wwwroot/js'))
};

function scssTranspile() {
    const plugins = [
        autoprefixer(),
        cssnano()
    ];

    return src('Styles/**/*.scss')
        .pipe(sass({
            outputStyle: 'expanded'
        }).on('error', function (err) {
            sass.logError;
            return notify().write(err);
        }))
        .pipe(postcss(plugins))
        .pipe(dest('wwwroot/css'))
};

function copyNpmModules() {
    const npmFiles = [
        './node_modules/bootstrap/dist/**/*.js',
        './node_modules/bootstrap/dist/**/*.css',
        './node_modules/bootstrap/dist/**/*.map',
        './node_modules/bootstrap-icons/font/**/*.css',
        './node_modules/bootstrap-icons/font/fonts/**/*.woff',
        './node_modules/bootstrap-icons/font/fonts/**/*.woff2',
        './node_modules/bootstrap-icons/icons/**/*.svg',
        './node_modules/bootswatch/dist/spacelab/**/*.css'
    ];

    return src(npmFiles, { base: './' })
        .pipe(rename(path => path.dirname = path.dirname.replace('node_modules', '')))
        .pipe(dest('wwwroot/lib/'));
};

exports.default = series(
    clean,
    parallel(tsTranspile, scssTranspile, copyNpmModules)
);

exports.clean = series(
    clean
);