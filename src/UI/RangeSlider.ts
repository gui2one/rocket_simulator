export default class RangeSlider {
  onChange: Event;
  container: HTMLDivElement;
  input: HTMLInputElement;
  label: HTMLLabelElement;
  name: string;
  value_span: HTMLSpanElement;

  callback: Function;

  constructor(parentNode: HTMLElement, name: string, callback: Function) {
    this.name = name;
    this.callback = callback;

    this.container = document.createElement("div");

    parentNode.appendChild(this.container);
    this.input = document.createElement("input");
    this.input.type = "range";
    this.input.id = `range-${name}`;
    this.input.style.width = "90%";
    this.input.style.maxWidth = "90%";
    this.input.value = "0";
    this.input.dataset.bind = "name";

    this.label = document.createElement("label");
    this.label.innerHTML = `${this.name}:<br> `;
    this.label.classList.add("range-label");
    this.label.setAttribute("for", this.input.id);

    this.container.appendChild(this.label);
    this.container.appendChild(this.input);
    this.container.classList.add("range-slider");

    this.value_span = document.createElement("span");
    // this.value_span.innerHTML = this.input.value;
    this.value_span.classList.add("range-value");
    this.container.appendChild(this.value_span);
    this.input.addEventListener("input", (e) => {
      let val = (<HTMLInputElement>e.target).value;
      e.preventDefault();
      e.stopPropagation();

      this.value_span.innerHTML = ` ${val}`;
      // let onChangeEvent = new CustomEvent("onSliderChange", { detail: { name: this.name, value: val } });

      this.callback(val);
    });

    const trigger = new Event("input");
    this.input.dispatchEvent(trigger);
  }
  getValue() {
    return this.input.value;
  }

  setValue(val) {
    this.input.value = val;
    this.input.dispatchEvent(new Event("input"));
  }
}
