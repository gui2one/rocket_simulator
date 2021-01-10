export class SimpleLineGraph {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  title: string;
  max_value: number;
  line_color: string;
  private data: Array<number>;
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
    // this.data = [0.0, 1.0, 0.3];
    this.update();
  }

  appendData(num: number) {
    this.data.push(num);
    if (num > this.max_value) this.max_value = num;
    this.update();
  }
  update() {
    this.ctx.lineWidth = 2.0;
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    let w, h;
    w = this.canvas.width;
    h = this.canvas.height;

    // let max_value = Math.max(...this.data, this.max_value);

    this.ctx.beginPath();
    this.ctx.moveTo(0, h);
    this.data.forEach((value, index) => {
      let x = index * (w / (this.data.length - 1));
      let y = (1 - value / this.max_value) * h;

      this.ctx.lineTo(x, y);
      //   this.ctx.ellipse(x, y, 10, 10, 0, 0, Math.PI * 2.0);
    });
    this.ctx.strokeStyle = this.line_color;
    // this.ctx.closePath();
    this.ctx.stroke();
  }
}
