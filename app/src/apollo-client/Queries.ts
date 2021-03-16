import {gql} from "@apollo/client";

const ADD_NODE = gql`
    mutation addNode($nodeInput: NodeInput!){
        addNode(input: $nodeInput){
            address
            length
            type
        }
    }
`

const REMOVE_NODE = gql`
    mutation removeNode($address: String!){
        removeNode(input: {address: $address}){
            address
            length
            type
        }
    }
`

export {REMOVE_NODE, ADD_NODE}