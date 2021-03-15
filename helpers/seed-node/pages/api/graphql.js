import { ApolloServer, gql } from 'apollo-server-micro'

const typeDefs = gql`
    type Query {
        me: String!
    }
`;

const resolvers = {
  Query: {
    me: ()=> "Hello hello hello seed node kiyosaki here."
  }
}

const apolloServer = new ApolloServer({
  typeDefs,
  resolvers
})

export default apolloServer.createHandler({ path: '/api/graphql' })

export const config = {
  api: {
    bodyParser: false,
  },
}