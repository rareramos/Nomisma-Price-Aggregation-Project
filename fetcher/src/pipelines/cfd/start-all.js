import { fork } from 'child_process';
import path from 'path';
import { log } from '../../utils/logger';

const launcherPath = './launcher.js';

const processes = [
  'bitmex',
  'ig',
  // 'okex',
  // 'fxcm',
  'kraken',
  'deribit',
];

const runningProcesses = [];

const exitHandler = (evType, pr) => (m) => {
  log.info({
    message: `Received ${evType} with code ${m}`,
  });

  runningProcesses.forEach((proc) => {
    if (proc.channel) {
      proc.send('STOP');
    }
  });
  pr.exit(0);
};

const setupExit = (pr) => {
  ['exit', 'SIGINT', 'SIGUSR1', 'SIGUSR2', 'uncaughtException', 'SIGTERM'].forEach((eventType) => {
    pr.on(eventType, exitHandler(eventType, pr));
  });
};

const boot = () => {
  process.stdin.resume();
  setupExit(process);
  const fullPath = path.join(__dirname, launcherPath);
  processes.forEach((proc) => {
    log.info({
      message: `Launching process ${proc}`,
    });

    const forkedProc = fork(fullPath, [proc], {
      stdio: 'inherit',
      cwd: process.cwd(),
    });
    runningProcesses.push(forkedProc);
  });
  return new Promise(() => {});
};

export default boot;
