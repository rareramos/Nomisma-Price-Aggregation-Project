import { CronJob } from 'cron';

export class Task {
  constructor(name, expression, job) {
    this.name = name;
    this.executionCompleted = true;
    this.running = false;
    this.timer = new CronJob(
      expression,
      async () => {
        if (this.executionCompleted) {
          this.executionCompleted = false;
          await job(this);
          this.executionCompleted = true;
        }
      },
      null,
      false,
      'UTC',
    );
  }

  start() {
    if (this.timer && !this.running) {
      this.executionCompleted = true;
      this.running = true;
      this.timer.start();
    }
  }

  stop() {
    if (this.timer) {
      this.executionCompleted = true;
      this.timer.stop();
    }
  }

  destroy() {
    if (this.timer) {
      this.executionCompleted = true;
      this.timer.destroy();
    }
  }
}
