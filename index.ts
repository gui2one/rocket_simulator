import RocketSimulator from "./src/RocketSimulator";
import "./src/orbit_controls_fix.ts";
import RangeSlider from "./src/UI/RangeSlider";

let container = document.getElementById("sim_container");
const rocket_sim = new RocketSimulator();

rocket_sim.initSimulation();
rocket_sim.init3d(container);

let thrust_slider;
const rocket_controls = () => {
  const div = document.createElement("div");
  div.id = "controls";
  document.body.append(div);
  thrust_slider = new RangeSlider(div, "thrust", (value) => {
    rocket_sim.currentSpaceShip.engines[0].throttle = value / 100.0;
  });
};
const animate = () => {
  rocket_sim.updateSimulation();
  rocket_sim.update3d();
  requestAnimationFrame(animate);
};

rocket_controls();
animate();

window.addEventListener("keypress", (event) => {
  switch (event.key) {
    case "c":
      rocket_sim.changeCamera();
      break;
    case "f":
      // rocket_sim.currentSpaceShip.engines[0].throttle = 1;
      // console.log(rocket_sim.currentSpaceShip.engines[0].throttle);
      thrust_slider.value = 100;
      break;
    case "x":
      // rocket_sim.currentSpaceShip.engines[0].throttle = 0;
      thrust_slider.value = 0.0;
      break;
    default:
      break;
  }
});
