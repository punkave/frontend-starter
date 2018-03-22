import svg4everybody from 'svg4everybody';
import module from './modules/module';

svg4everybody();

// TODO: Rename PROJECT to desired namespace
const PROJECT = {};
PROJECT.module = module;

if (!window.namespace) {
  window.PROJECT = PROJECT;
}

Object.keys(PROJECT).forEach(function (key) {
  if (PROJECT[key].hasOwnProperty('init')) {
    PROJECT[key].init();
  }
});
