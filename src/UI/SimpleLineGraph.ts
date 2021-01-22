export interface DataPoint {
  value: number;
  time: number;
  time_scale: number;
}

export class SimpleLineGraph {
  max_samples: number = 1000;
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  title: string;
  max_value: number;
  min_value: number;
  max_value_span: HTMLElement;
  min_value_span: HTMLElement;

  max_time: number;
  line_color: string;
  private data: Array<DataPoint>;
  constructor(container: HTMLDivElement, title?: string, color?: string) {
    this.min_value = Infinity;

    this.canvas = document.createElement("canvas");
    container.appendChild(this.canvas);

    if (!title) {
      title = "default title";
    }

    if (color) this.line_color = color;
    else this.line_color = "white";

    const title_element = document.createElement("span");
    title_element.innerHTML = title;
    container.appendChild(title_element);
    title_element.style.position = "absolute";
    title_element.style.padding = "0.3em";
    title_element.style.top = "0px";
    title_element.style.left = "0px";
    title_element.style.color = this.line_color;

    this.max_value_span = document.createElement("span");
    this.min_value_span = document.createElement("span");

    this.max_value_span.style.position = "absolute";
    this.max_value_span.style.padding = "0.3em";
    this.max_value_span.style.top = "0px";
    this.max_value_span.style.right = "0px";

    this.min_value_span.style.position = "absolute";
    this.min_value_span.style.padding = "0.3em";
    this.min_value_span.style.bottom = "0px";
    this.min_value_span.style.right = "0px";
    // this.max_value_span.style.color = this.line_color;
    container.appendChild(this.max_value_span);
    container.appendChild(this.min_value_span);
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

    if (this.data.length > this.max_samples) {
      this.data.splice(0, 1);
    }
    const values_temp = this.data.map((item) => item.value);
    this.min_value = Math.min(...values_temp);
    this.update();

    // console.log(this.data);
  }
  update() {
    this.ctx.lineWidth = 2.0;
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.lineJoin = "bevel";
    this.max_value_span.innerHTML = this.max_value.toFixed(2);
    this.min_value_span.innerHTML = this.min_value.toFixed(2);
    let w, h;
    w = this.canvas.width;
    h = this.canvas.height;

    if (this.data.length > 0) {
      let inc = 0;
      // let total_time = this.data.reduce((acc, value) => acc + value.time, inc);
      // console.log(total_time);
      this.ctx.beginPath();
      this.ctx.moveTo(0, (1 - this.data[0].value / this.max_value) * h);
      let time_offset = 0;
      this.data.forEach((data_point, index) => {
        let x = time_offset * (w / this.max_time);

        const val = data_point.value / this.max_value;
        let y = (1 - val) * h;

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
