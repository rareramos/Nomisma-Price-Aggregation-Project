import { Task } from './task';

export class Cron {
  constructor(/* config here */) {
    this.tasks = [];
  }

  add(name, expression, job) {
    const task = new Task(name, expression, job);
    this.tasks.push(task);
  }

  start() {
    this.tasks.forEach((task) => {
      task.start();
    });
  }

  stop() {
    this.tasks.forEach((task) => {
      task.stop();
    });
  }

  remove(name) {
    const index = this.tasks.findIndex(instance => instance.name === name);
    if (index !== -1) {
      const task = this.tasks[index];
      task.destroy();
      this.tasks.splice(index, 1);
    }
  }
}
