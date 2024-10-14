import { gql } from "@apollo/client";

export const LOGIN_USER = gql`
    mutation login($email: String!, $password: String!){
        login(email: $email, password: $password){
            token
            user {
                _id
                username
                email
            }
        }
    }
`;

export const ADD_USER = gql`
    mutation Mutation($input: UserInput!){
        addUser(input: $input){
            user {
                email
                username
                _id

            }
            token
        }
    }
`;

export const SAVE_BOOK = gql`
    mutation saveBook($input: BookInput!){
        saveBook(input: $input){
            _id
            bookId
            title
            authors
            description
            image
            link
        }
    }
`;

export const DELETE_BOOK = gql`
    mutation deleteBook($bookId: String!){
        deleteBook(bookId: $bookId){
            _id
            bookId
            title
            authors
            description
            image
            link
        }
    }
`;