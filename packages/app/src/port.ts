import dotenv from "dotenv";
import tcpPortUsed from "tcp-port-used";

dotenv.config();

const getPort = async (): Promise<string> => {
  let port = process.env.PORT || "4000";
  let portValid = false;

  while (!portValid) {
    // eslint-disable-next-line no-await-in-loop
    const inUse = await tcpPortUsed.check(parseInt(port, 10));

    if (!inUse) {
      portValid = true;
      break;
    }

    port = (parseInt(port, 10) + 1).toString();
  }

  return port;
};

export default getPort;
