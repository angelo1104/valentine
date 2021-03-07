import dotenv from "dotenv";
import { Block } from "./libs/block";
import { server, app } from "./server/server";
import hash from "./utils/hash";

// initialize environment variables
dotenv.config();

const block = new Block(
  {
    data: "hola",
    hash: "ho",
    index: 2,
    nonce: 3,
    prevHash: "4",
    timestamp: 5,
  },
  4,
);

console.log(block.mine(), hash(JSON.parse(block.getBlock())));

// start server on port 4000
const port = process.env.PORT || 4000;
app.listen({ port }, () => {
  console.log(`Server ready at http://localhost:${port}${server.graphqlPath}`);
});
