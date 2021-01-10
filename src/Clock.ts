export default class Clock {
  started: boolean;
  auto_start: boolean;

  time_scale: number;
  start_time: number = 0;
  millis: number = 0;
  old_millis: number = 0;
  delta_millis: number = 0;

  constructor(auto_start: boolean = true) {
    this.auto_start = auto_start;
    this.time_scale = 1.0;
    if (this.auto_start) {
      this.start();
    }
  }

  start() {
    if (!this.started) {
      this.started = true;

      this.start_time = performance.now();
      this.millis = 0;
      //   console.log("clock start time : ", this.start_time);
    }
  }

  update() {
    // if (!this.started) {
    //   this.start();
    // }

    if (this.started) {
      this.old_millis = this.millis;
      this.millis = performance.now() - this.start_time;

      this.delta_millis = (this.millis - this.old_millis) * this.time_scale;
    }
    // console.log(this.millis);
  }

  getDeltaMillis(): number {
    return this.delta_millis;
  }

  getDeltaTime(): number {
    return this.delta_millis / 1000.0;
  }
}
