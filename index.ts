import RocketSimulator from "./src/RocketSimulator";
import "./src/orbit_controls_fix.ts";

import RangeSlider from "./src/UI/RangeSlider";
import TankGauge from "./src/UI/TankGauge";

import { SimpleLineGraph } from "./src/UI/SimpleLineGraph";
import * as Utils from "./src/Utils";
let thrust_slider;
let fuel_amount_slider;
let start_fuel_amount = 1.0;
let gauge_1;
let container = document.getElementById("sim_container");
const rocket_sim = new RocketSimulator();

rocket_sim.init3d(container);

const ship = rocket_sim.currentMission.ships[0];
let altitude = ship.position.y;

const altitude_graph_canvas = document.getElementById("altitude-graph");
const altitude_graph = new SimpleLineGraph(altitude_graph_canvas as HTMLDivElement, "altitude", "red");

const speed_graph_canvas = document.getElementById("speed-graph");
const speed_graph = new SimpleLineGraph(speed_graph_canvas as HTMLDivElement, "speed", "green");

const acceleration_graph_canvas = document.getElementById("acceleration-graph");
const acceleration_graph = new SimpleLineGraph(acceleration_graph_canvas as HTMLDivElement, "G accel", "white");
acceleration_graph.max_value = 9.8;
let old_time = 0.0;
let new_time = 0.0;

setInterval(() => {
  old_time = new_time;
  new_time = rocket_sim.clock.millis;

  let local_delta = new_time - old_time;
  altitude_graph.appendData(
    //
    rocket_sim.currentMission.shipAltitude,
    local_delta,
    rocket_sim.clock.time_scale
  );
  speed_graph.appendData(
    //
    ship.velocity.length(),
    local_delta,
    rocket_sim.clock.time_scale
  );
  acceleration_graph.appendData(
    rocket_sim.currentMission.gravityAcceleration,
    local_delta,
    rocket_sim.clock.time_scale
  );
}, 200);

const controls_div = document.getElementById("controls");
const rocket_controls = () => {
  const div = document.createElement("div");
  div.id = "ship-controls";
  controls_div.appendChild(div);
  thrust_slider = new RangeSlider(div, "thrust", (value) => {
    ship.engines[0].throttle = value / 100.0;
  });

  fuel_amount_slider = new RangeSlider(div, "Fuel Amount", (value) => {
    // console.log(ship.fuelTanks[0].fuelAmount);
    start_fuel_amount = parseFloat(value) / 100.0;
    ship.fuelTanks[0].fuelAmount = start_fuel_amount;
  });

  fuel_amount_slider.setValue(100);

  let gauge_div = document.createElement("div");
  gauge_div.id = "gauge_1";
  gauge_1 = new TankGauge(gauge_div, ship.fuelTanks[0]);
  gauge_div.style.position = "relative";
  gauge_div.style.width = "100%";
  gauge_div.style.height = "50px";
  gauge_div.style.outline = "1px solid white";

  div.appendChild(gauge_div);
};

const init_time_controls = () => {
  const div = document.createElement("div");
  div.id = "time-controls";
  controls_div.appendChild(div);

  let btn_minus = document.createElement("button");
  let btn_plus = document.createElement("button");
  btn_minus.innerHTML = "2<<";
  btn_plus.innerHTML = ">>2";
  div.appendChild(btn_minus);
  div.appendChild(btn_plus);

  let span = document.createElement("span");
  span.id = "time_scale_span";
  let time_scale = rocket_sim.clock.time_scale.toString();
  span.innerHTML = `Time Scale : ${time_scale}`;
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
  let time_scale = rocket_sim.clock.time_scale.toString();
  span.innerHTML = ` Time Scale : ${time_scale}`;
};

const init_flight_infos = () => {
  const div = document.createElement("div");
  document.body.appendChild(div);
  div.id = "flight-infos";
};

const update_flight_infos = () => {
  let div = document.getElementById("flight-infos");

  altitude = rocket_sim.currentMission.shipAltitude;
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

  // console.log(ship);
  let ship_mass = ship.computeShipMass();
  let engine_thrust = ship.engines[0].thrust;
  let TWR = (engine_thrust * g_accel) / ship_mass;

  div.innerHTML = `Altitude : ${altitude.toFixed(2)} ${altitude_postfix}`;
  div.innerHTML += `<br>Speed : ${speed.toFixed(2)} ${speed_postfix}`;
  div.innerHTML += `<br>G Accel : ${g_accel.toFixed(12)} m/s`;
  div.innerHTML += `<br>`;
  div.innerHTML += `<br>Ship Mass : ${ship_mass.toFixed(2)}`;
  div.innerHTML += `<br>Engine 1 thrust : ${Utils.KNToKg(engine_thrust)}`;
  div.innerHTML += `<br>TWR : ${TWR.toFixed(5)}`;
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
const computeOrbitSpeed = (radius: number): number => {
  // v = Math.sqrt((G * M)/ radius)
  const G = 6.67e-11;

  let v = Math.sqrt((rocket_sim.currentPlanet.mass * G) / radius);
  return v;
};
const init_make_orbit = () => {
  const div = document.createElement("div");
  document.body.appendChild(div);
  div.id = "make-orbit";

  const button = document.createElement("button");
  button.innerHTML = "press me";
  div.appendChild(button);

  const altitude_input = document.createElement("input");
  altitude_input.value = "600";
  div.appendChild(altitude_input);

  button.addEventListener("click", () => {
    let rad = (rocket_sim.currentPlanet.radius + parseFloat(altitude_input.value)) * 1000;
    let speed = computeOrbitSpeed(rad);
    console.log("altidue", parseFloat(altitude_input.value));
    console.log("desired speed : ", speed);
    ship.isOnPad = false;
    ship.position.x = 0;
    ship.position.y = parseFloat(altitude_input.value) * 1000;
    ship.position.z = 0;

    ship.velocity.x = 0;
    ship.velocity.y = 0;
    ship.velocity.z = speed;
  });
};
const animate = () => {
  rocket_sim.updateSimulation();
  rocket_sim.update3d();
  update_flight_infos();
  update_render_infos();
  update_time_controls();

  gauge_1.update();
  // console.log(ship.fuelTanks[0].fuelAmount);
  requestAnimationFrame(animate);
};

rocket_controls();
init_time_controls();
init_flight_infos();
init_render_infos();
init_make_orbit();
animate();

window.addEventListener("keypress", (event) => {
  // console.log(event.key);

  switch (event.key) {
    case "c":
      rocket_sim.changeCamera();
      break;
    case "f":
      // ship.engines[0].throttle = 1;
      // console.log(ship.engines[0].throttle);
      thrust_slider.setValue(100);
      break;
    case "x":
      // ship.engines[0].throttle = 0;
      thrust_slider.setValue(0.0);
      break;
    case "a":
      ship.rotation.x -= 1.0 * rocket_sim.clock.getDeltaTime();

      break;
    case "e":
      ship.rotation.x += 1.0 * rocket_sim.clock.getDeltaTime();

      break;
    case " ": // space bar
      // ship.engines[0].throttle = 0;
      ship.engines[0].activate(start_fuel_amount);
      ship.isOnPad = false;
      break;
    default:
      break;
  }
});

let resize_event = new Event("resize");
window.dispatchEvent(resize_event);
window.addEventListener("resize", () => {});
