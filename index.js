import Dispatcher from './src/dispatcher.js';
import Controller from './src/controller.js';
import Display from './src/display.js';


async function main() {
  const dispatcher = new Dispatcher();
  const display = new Display();
  const controller = new Controller(dispatcher, display);

  await controller.setup();

  controller.listen();
}

window.onload = main;