import dotenv from "dotenv";
import { randomInt } from "crypto";
import publicIp from "public-ip";
import { NodeTypes } from "./libs/nodes/node";
import typeDefs from "./server/typeDefs";
import resolvers from "./server/resolvers";
import FullNode from "./libs/nodes/full-node";
import seedNodeClient from "./apollo-client/seedNodeClient";
import { REMOVE_NODE } from "./apollo-client/Queries";

// initialize environment variables
dotenv.config();

// start server on port 4000
const port = process.env.PORT || "4000";
const node = new FullNode(NodeTypes.FULL, typeDefs, resolvers);

const randomNumber = 0; // randomInt(0, 50);

node.start(parseInt(port, 10) + randomNumber, process.env.MONGODB_URL || "");

// clean-up
process.stdin.resume(); // so the program will not close instantly

async function exitHandler(options: any, exitCode: any) {
  // clean here
  const externalIp = await publicIp.v4();
  const externalUrl = new URL(
    `http://${externalIp}:${parseInt(port, 10) + randomNumber}`,
  );

  try {
    await seedNodeClient.mutate({
      mutation: REMOVE_NODE,
      variables: {
        address: externalUrl.origin,
      },
    });
    console.log("successfully-exited");
  } catch (e) {
    console.log("can't exit successfully. Unable to disconnect from seed node");
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
