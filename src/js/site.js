import module from './modules/module';

const PROJECT = {};
PROJECT.module = module;

window.PROJECT = PROJECT;

Object.keys(PROJECT).forEach(function (key) {
  if (PROJECT[key].hasOwnProperty('init')) {
    PROJECT[key].init();
  }
});
