/// <binding AfterBuild='default' Clean='clean' /> 

const { dest, src, series } = require('gulp');
const rename = require('gulp-rename');
const del = require('del');

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

function copyNpmModules() {
    const npmFiles = [
        './node_modules/bootstrap/dist/**/*.js',
        './node_modules/bootstrap/dist/**/*.css',
        './node_modules/bootstrap/dist/**/*.map',
        './node_modules/bootstrap-icons/font/**/*.css',
        './node_modules/bootstrap-icons/font/fonts/**/*.woff',
        './node_modules/bootstrap-icons/font/fonts/**/*.woff2',
        './node_modules/bootstrap-icons/icons/**/*.svg'
    ];

    return src(npmFiles, { base: './' })
        .pipe(rename(path => path.dirname = path.dirname.replace('node_modules', '')))
        .pipe(dest('wwwroot/lib/'));
};

exports.default = series(
    clean,
    copyNpmModules
);

exports.clean = series(
    clean
);