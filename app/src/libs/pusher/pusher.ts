import Pusher from "pusher-js";
import * as PusherTypes from "pusher-js";

Pusher.logToConsole = process.env.NODE_PRODUCTION === "true";

const pusher = new Pusher("e49da90633404e899d6d", {
  cluster: "us3",
  enableStats: false,
});

export default pusher;
export type { PusherTypes as Pusher };
