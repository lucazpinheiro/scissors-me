import { ScissorsMe } from "./lib/ScissorsMe";
import { EventEmitter } from 'events';

const emitter = new EventEmitter();

emitter.on('notification', (data) => {
  console.log(data)
})

const options = {
  url: "https://www.youtube.com/watch?v=OaeVieQRHRs",
  alias: "banido",
  start: 12,
  end: 13,
}

new ScissorsMe(emitter, options);