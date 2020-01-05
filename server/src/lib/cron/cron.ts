import { Task } from './task';

export class Cron {
  _tasks : Array<Task>;
  constructor(/* config here */) {
    this._tasks = [];
  }

  add(name : string, expression : string, job : (task : Task) => Promise<void>) : void {
    const task = new Task(name, expression, job);
    this._tasks.push(task);
  }

  start() : void {
    for (const task of this._tasks) {
      task.start();
    }
  }

  stop() : void {
    for (const task of this._tasks) {
      task.stop();
    }
  }

  remove(name : string) : void {
    const index = this._tasks.findIndex(instance => instance.name === name);
    if (index !== -1) {
      const task = this._tasks[index];
      task.destroy();
      this._tasks.splice(index, 1);
    }
  }
}
