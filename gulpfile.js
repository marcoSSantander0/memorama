const { src, dest, watch, parallel } = require('gulp');
const gulpSass = require('gulp-sass')(require('sass'));
const autoprefixer = require('autoprefixer');
const postcss = require('gulp-postcss');
const sourcemaps = require('gulp-sourcemaps');
const cssnano = require('cssnano');
const concat = require('gulp-concat');
const terser = require('gulp-terser');
const rename = require('gulp-rename');
const notify = require('gulp-notify');
const cache = require('gulp-cache');

// Definir rutas
const paths = {
    scss: 'src/scss/**/*.scss',
    js: 'src/js/**/*.js',
    imagenes: 'src/img/**/*'
};

function css() {
    return src(paths.scss)
        .pipe(sourcemaps.init())
        .pipe(gulpSass())
        .pipe(postcss([autoprefixer(), cssnano()]))
        .pipe(sourcemaps.write('.'))
        .pipe(dest('./src/build/css'));
}

// Usamos import dinámico para gulp-imagemin
async function imagenes() {
    const imagemin = (await import('gulp-imagemin')).default;
    return src(paths.imagenes)
        .pipe(cache(imagemin({ optimizationLevel: 3 })))
        .pipe(dest('./src/build/img'))
        .pipe(notify({ message: 'Imagen Completada' }));
}

// Usamos import dinámico para gulp-webp
async function versionWebp() {
    const webp = (await import('gulp-webp')).default;
    return src(paths.imagenes)
        .pipe(webp())
        .pipe(dest('./src/build/img'))
        .pipe(notify({ message: 'Imagen WebP Completada' }));
}



function watchArchivos() {
    watch(paths.scss, css);
    watch(paths.imagenes, imagenes);
    watch(paths.imagenes, versionWebp);
}

// Tarea por defecto
exports.default = parallel(css, imagenes, versionWebp, watchArchivos);
