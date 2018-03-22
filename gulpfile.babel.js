import autoprefixer from 'gulp-autoprefixer';
import babelify from 'babelify';
import browserify from 'browserify';
import browserSync from 'browser-sync';
import buffer from 'vinyl-buffer';
import eslint from 'gulp-eslint';
import gulp from 'gulp';
import gulpStylelint from 'gulp-stylelint';
import notify from 'gulp-notify';
import sass from 'gulp-sass';
import source from 'vinyl-source-stream';

const src = 'src/';
const dest = 'public/';

const spawn = require('child_process').spawn;
const bs = browserSync.create();
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
    ui: { port: 3002 },
    port: 3001,
    open: false
  });
});

gulp.task('js', () => {
  browserify(`${src}js/site.js`)
    .transform(babelify, { presets: ['env'] })
    .bundle()
    .pipe(source('site.js'))
    .pipe(buffer())
    .pipe(gulp.dest(`${dest}js`))
    .pipe(bs.stream())
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
    .pipe(bs.stream())
    .pipe(notify('styles task complete'))
);

gulp.task('imgs', () =>
  gulp.src([`${src}/imgs/*.png`, `${src}/imgs/*.jpg`, `${src}/imgs/*.svg`], { base: `${src}/imgs/` })
    .pipe(gulp.dest(`public/imgs`))
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

gulp.task('default', ['build', 'browser-sync', 'watch']);
gulp.task('build', ['lint', 'js', 'sass', 'imgs']);

// kill node on exit
process.on('exit', function () {
  if (node) node.kill();
});
