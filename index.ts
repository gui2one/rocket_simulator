import RocketSimulator from "./src/RocketSimulator";
import "./src/orbit_controls_fix.ts";
import RangeSlider from "./src/UI/RangeSlider";

import { SimpleLineGraph } from "./src/UI/SimpleLineGraph";
let container = document.getElementById("sim_container");
const rocket_sim = new RocketSimulator();

rocket_sim.init3d(container);

const ship = rocket_sim.currentMission.ships[0];
let altitude = ship.position.y;

const altitude_graph_canvas = document.getElementById("altitude-graph");
const altitude_graph = new SimpleLineGraph(altitude_graph_canvas as HTMLDivElement, "altitude", "red");

const speed_graph_canvas = document.getElementById("speed-graph");
const speed_graph = new SimpleLineGraph(speed_graph_canvas as HTMLDivElement, "speed", "green");

setInterval(() => {
  altitude_graph.appendData(ship.position.y);
  speed_graph.appendData(ship.velocity.length());
  // console.log(rocket_sim.currentMission.gravityAcceleration);
}, 500);
let thrust_slider;
const controls_div = document.getElementById("controls");
const rocket_controls = () => {
  const div = document.createElement("div");
  div.id = "ship-controls";
  controls_div.appendChild(div);
  thrust_slider = new RangeSlider(div, "thrust", (value) => {
    ship.engines[0].throttle = value / 100.0;
  });
};

const init_time_controls = () => {
  const div = document.createElement("div");
  div.id = "time-controls";
  controls_div.appendChild(div);

  let btn_minus = document.createElement("button");
  let btn_plus = document.createElement("button");
  btn_minus.innerHTML = "/2";
  btn_plus.innerHTML = "x2";
  div.appendChild(btn_minus);
  div.appendChild(btn_plus);

  let span = document.createElement("span");
  span.id = "time_scale_span";
  span.innerHTML = rocket_sim.clock.time_scale.toString();
  div.appendChild(span);

  btn_plus.addEventListener("click", () => {
    console.log("rocket_sim");
    rocket_sim.clock.time_scale *= 2.0;
  });
  btn_minus.addEventListener("click", () => {
    if (rocket_sim.clock.time_scale >= 2.0) {
      rocket_sim.clock.time_scale /= 2.0;
    } else {
      rocket_sim.clock.time_scale = 1.0;
    }
  });
};

const update_time_controls = () => {
  let span = document.getElementById("time_scale_span");
  span.innerHTML = rocket_sim.clock.time_scale.toString();
};

const init_flight_infos = () => {
  const div = document.createElement("div");
  document.body.appendChild(div);
  div.id = "flight-infos";
};

const update_flight_infos = () => {
  let div = document.getElementById("flight-infos");
  altitude = ship.position.y;
  let altitude_postfix = "m";
  if (altitude > 1000) {
    altitude_postfix = "Km";
    altitude /= 1000;
  }

  let speed = ship.velocity.length();
  let speed_postfix = "m/s";
  if (speed > 1000) {
    speed_postfix = "Km/s";
    speed /= 1000;
  }

  let g_accel = rocket_sim.currentMission.gravityAcceleration;
  div.innerHTML = `Altitude : ${altitude.toFixed(2)} ${altitude_postfix}`;
  div.innerHTML += `<br>Speed : ${speed.toFixed(2)} ${speed_postfix}`;
  div.innerHTML += `<br>G Accel : ${g_accel.toFixed(2)} m/s`;
};

const init_render_infos = () => {
  const div = document.createElement("div");
  document.body.appendChild(div);
  div.id = "render-infos";
};

const update_render_infos = () => {
  const div = document.getElementById("render-infos");
  let infos = rocket_sim.renderInfos();

  const geometries = infos.memory.geometries;
  const textures = infos.memory.textures;

  div.innerHTML = `<u>Memory</u> : <br>`;
  div.innerHTML += `Geometries : ${geometries}<br>`;
  div.innerHTML += `Textures : ${textures}<br>`;
  div.innerHTML += `<br>`;

  div.innerHTML += `<u>Render</u> : <br>`;
  div.innerHTML += `Calls : ${infos.render.calls}<br>`;
  div.innerHTML += `Triangles : ${infos.render.triangles}<br>`;
  div.innerHTML += `Points : ${infos.render.points}<br>`;
  div.innerHTML += `Lines : ${infos.render.lines}<br>`;
  div.innerHTML += `Frame : ${infos.render.frame}<br>`;
};
const animate = () => {
  rocket_sim.updateSimulation();
  rocket_sim.update3d();
  update_flight_infos();
  update_render_infos();
  update_time_controls();

  requestAnimationFrame(animate);
};

rocket_controls();
init_time_controls();
init_flight_infos();
init_render_infos();
animate();

window.addEventListener("keypress", (event) => {
  switch (event.key) {
    case "c":
      rocket_sim.changeCamera();
      break;
    case "f":
      // ship.engines[0].throttle = 1;
      // console.log(ship.engines[0].throttle);
      thrust_slider.value = 100;
      break;
    case "x":
      // ship.engines[0].throttle = 0;
      thrust_slider.value = 0.0;
      break;
    default:
      break;
  }
});

let resize_event = new Event("resize");
window.dispatchEvent(resize_event);
window.addEventListener("resize", () => {});
