export interface DataPoint {
  value: number;
  time: number;
  time_scale: number;
}

export class SimpleLineGraph {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  title: string;
  max_value: number;
  max_time: number;
  line_color: string;
  private data: Array<DataPoint>;
  constructor(container: HTMLDivElement, title?: string, color?: string) {
    this.canvas = document.createElement("canvas");
    container.appendChild(this.canvas);

    if (!title) {
      title = "default title";
    }

    if (color) this.line_color = color;
    else this.line_color = "white";

    const el = document.createElement("span");
    el.innerHTML = title;
    container.appendChild(el);
    el.style.position = "absolute";
    el.style.padding = "0.3em";
    el.style.top = "0px";
    el.style.left = "0px";
    el.style.color = this.line_color;

    this.ctx = this.canvas.getContext("2d");
    this.data = [];

    this.max_value = 1000;

    this.max_time = 60000;
    // this.data = [0.0, 1.0, 0.3];
    this.update();
  }

  appendData(value, time, time_scale) {
    this.data.push({ value, time, time_scale });
    if (value > this.max_value) this.max_value = value;
    // this.max_time = max_time;
    this.update();

    // console.log(this.data);
  }
  update() {
    this.ctx.lineWidth = 2.0;
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    let w, h;
    w = this.canvas.width;
    h = this.canvas.height;

    // let max_value = Math.max(...this.data, this.max_value);

    if (this.data.length > 0) {
      let inc = 0;
      // let total_time = this.data.reduce((acc, value) => acc + value.time, inc);
      // console.log(total_time);
      this.ctx.beginPath();
      this.ctx.moveTo(0, (1 - this.data[0].value / this.max_value) * h);
      let time_offset = 0;
      this.data.forEach((data_point, index) => {
        let x = time_offset * (w / this.max_time);
        // console.log(time_offset);
        let y = (1 - data_point.value / this.max_value) * h;

        this.ctx.lineTo(x, y);
        time_offset += data_point.time * data_point.time_scale;
        //   this.ctx.ellipse(x, y, 10, 10, 0, 0, Math.PI * 2.0);
      });
      this.max_time = time_offset;
      this.ctx.strokeStyle = this.line_color;
      // this.ctx.closePath();
      this.ctx.stroke();
    }
  }
}
