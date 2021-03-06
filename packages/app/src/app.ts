import dotenv from "dotenv";
import publicIp from "public-ip";
import seedNodeClient from "./apollo-client/seedNodeClient";
import { REMOVE_NODE } from "./apollo-client/Queries";
import getPort from "./port";
import fullNode from "./fullNode";

// initialize environment variables
dotenv.config();

const main = async (): Promise<void> => {
  const port = await getPort();

  // start the server
  fullNode.start(parseInt(port, 10), process.env.MONGODB_URL || "");

  // clean-up
  process.stdin.resume(); // so the program will not close instantly

  async function exitHandler(options: any, exitCode: any) {
    // clean here

    const externalIp = // eslint-disable-next-line eqeqeq
      process.env.NODE_PRODUCTION == "true" ? await publicIp.v4() : "localhost";
    const externalUrl = new URL(`http://${externalIp}:${parseInt(port, 10)}`);

    try {
      await seedNodeClient.mutate({
        mutation: REMOVE_NODE,
        variables: {
          address: externalUrl.origin,
        },
      });
      console.log("successfully-exited");
    } catch (e) {
      console.log(
        "can't exit successfully. Unable to disconnect from seed node",
        e,
      );
    }
    if (exitCode || exitCode === 0) console.log(exitCode);
    if (options.exit) process.exit();
  }

  // do something when app is closing
  process.on("exit", exitHandler.bind(null, { cleanup: true }));

  // catches ctrl+c event
  process.on("SIGINT", exitHandler.bind(null, { exit: true }));

  // catches "kill pid" (for example: nodemon restart)
  process.on("SIGUSR1", exitHandler.bind(null, { exit: true }));
  process.on("SIGUSR2", exitHandler.bind(null, { exit: true }));

  // catches uncaught exceptions
  process.on("uncaughtException", exitHandler.bind(null, { exit: true }));
};

main();
