import { ApolloServer } from "apollo-server-express";
import express from "express";
import cors from "cors";
import typeDefs from "./typeDefs";
import resolvers from "./resolvers";

// express server
const app = express();

app.use(cors());
app.use(express.json());

// routes

app.get("/", (req, res) => {
  res.status(200).json({
    hola: "Hello this is robert kiyosaki here.",
  });
});

// apollo graphql server
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

server.applyMiddleware({ app });

export { server, app };
