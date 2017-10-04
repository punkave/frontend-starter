import autoprefixer from 'gulp-autoprefixer';
import babelify from 'babelify';
import browserify from 'browserify';
import browserSync from 'browser-sync';
import buffer from 'vinyl-buffer';
import eslint from 'gulp-eslint';
import gulp from 'gulp';
import gulpStylelint from 'gulp-stylelint';
import notify from 'gulp-notify';
import path from 'path';
import sass from 'gulp-sass';
import source from 'vinyl-source-stream';
import svgstore from 'gulp-svgstore';
import svgmin from 'gulp-svgmin';

const src = './src/';
const dest = './dist/';

const spawn = require('child_process').spawn;
const reload = browserSync.reload;
const bs = browserSync.create('proxy');
let travis = process.env.TRAVIS || false;

let node;

gulp.task('server', function () {
  if (node) node.kill();
  node = spawn('node', ['app.js'], {stdio: 'inherit'});
  node.on('close', function (code) {
    if (code === 8) {
      gulp.log('Error detected, waiting for changes...');
    }
  });
});

gulp.task('browser-sync', ['server'], function () {
  bs.init({
    proxy: 'localhost:3000',
    port: 3001,
    open: false
  });
});

gulp.task('js', () => {
  browserify(`${src}js/site.js`)
    .transform(babelify, { presets: ['es2015'] })
    .bundle()
    .pipe(source('site.js'))
    .pipe(buffer())
    .pipe(gulp.dest(`${dest}js`))
    .pipe(gulp.dest(`${dest}js`))
    .pipe(notify('scripts task complete'));
});

gulp.task('sass', () =>
  gulp.src(`${src}sass/**/*.scss`)
    .pipe(gulpStylelint({
      failAfterError: travis,
      reporters: [
        { formatter: 'string', console: true }
      ]
    }))
    .pipe(sass())
    .pipe(autoprefixer({
      browsers: ['last 3 versions'],
      cascade: false
    }))
    .pipe(gulp.dest(`${dest}css`))
    .pipe(notify('styles task complete'))
);

gulp.task('imgs', () =>
  gulp.src([`${src}/imgs/*.png`, `${src}/imgs/*.jpg`, `${src}/imgs/*.svg`], { base: `${src}/imgs/` })
    .pipe(gulp.dest(`public/imgs`))
);

gulp.task('svgstore', () =>
  gulp.src(`${src}svgs/*.svg`)
    .pipe(svgmin(function (file) {
      const prefix = path.basename(file.relative, path.extname(file.relative));
      return {
        plugins: [{
          cleanupIDs: {
            prefix: prefix + '-',
            minify: true
          }
        }]
      };
    }))
    .pipe(svgstore())
    .pipe(gulp.dest('public/svgs'))
);

gulp.task('lint', () =>
  gulp.src([`${src}js/**/*.js`, `!node_modules/**`])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError())
);

gulp.task('watch', () => {
  gulp.watch(`${src}sass/**/*.scss`, ['sass']);
  gulp.watch(`${src}js/**/*.js`, ['js', 'lint']);
});

gulp.task('default', ['build', 'browser-sync', 'watch'], reload);
gulp.task('build', ['lint', 'js', 'sass', 'imgs', 'svgstore']);

// kill node on exit
process.on('exit', function () {
  if (node) node.kill();
});
