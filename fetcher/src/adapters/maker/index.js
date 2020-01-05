import fetch from './fetch';
import process from './process';
import commonClean from '../common-clean';

const clean = () => commonClean('maker');

export {
  fetch,
  process,
  clean,
};
