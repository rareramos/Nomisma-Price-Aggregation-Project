import { createLogger } from '@nomisma/nomisma-logger';
import environment from '../../environment';

const log = createLogger(parseInt(environment.DEFAULT_LOG_LEVEL, 2));
/* eslint-disable-next-line import/prefer-default-export */
export { log };
