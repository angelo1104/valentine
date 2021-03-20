import { gql } from "@apollo/client";

const ADD_NODE = gql`
  mutation addNode($nodeInput: NodeInput!) {
    addNode(input: $nodeInput) {
      address
      length
      type
    }
  }
`;

const REMOVE_NODE = gql`
  mutation removeNode($address: String!) {
    removeNode(input: { address: $address }) {
      address
      length
      type
    }
  }
`;

const GET_TOP_NODES = gql`
  query GetTopNodes($type: NodeType!) {
    topNodes: getTopNodes(input: { type: $type }) {
      address
      length
      type
      lastConnected
    }
  }
`;

const PAGINATE_NODES = gql`
  query paginateNodes($paginateInput: PaginateInput!) {
    paginateNodes(input: $paginateInput) {
      address
      type
      length
      lastConnected
    }
    nodesLength
  }
`;

export { ADD_NODE, REMOVE_NODE, GET_TOP_NODES, PAGINATE_NODES };
