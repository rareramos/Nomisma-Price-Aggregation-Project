import { CronJob } from 'cron';

import { ICronJob } from '../../types';

export class Task {
  name : string;
  executionCompleted : boolean;
  running : boolean;
  _timer : ICronJob;
  constructor(name : string, expression : string, job : (task : Task) => Promise<void>) {
    this.name = name;
    this.executionCompleted = true;
    this.running = false;
    this._timer = new CronJob(
      expression,
      async () => {
        if (this.executionCompleted) {
          this.executionCompleted = false;
          await job(this);
          this.executionCompleted = true;
        }
      },
      '',
      false,
      'UTC',
    );
  }

  start() : void {
    if (this._timer && !this.running) {
      this.executionCompleted = true;
      this.running = true;
      this._timer.start();
    }
  }

  stop() : void {
    if (this._timer) {
      this.executionCompleted = true;
      this._timer.stop();
    }
  }

  destroy() : void {
    if (this._timer) {
      this.executionCompleted = true;
    if(this._timer.destroy)
      this._timer.destroy();
    }
  }
}
