import { createLogger } from '@nomisma/nomisma-logger';
import { app } from '../../environment';

const log = createLogger(parseInt(app.DEFAULT_LOG_LEVEL, 10));

export { log };
