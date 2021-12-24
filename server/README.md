# Server

## This is the api the CMS uses for interfacing with mongodb through express

## Technology

The api runs off of express.

The default port to run on is 5678, but this can be changed with the PORT environment variable in .env

## Security

This app is protected with a firewall, helmet, and most importantly, the authentication layer.

## Authentication

The authentication for if a user is logged in or has admin privileges is handled by JWT, or json web tokens.

For example, to access any database information (through an api route, you must pass in a valid JWT (JSONWEBTOKEN) auth-token from a user in the auth-token request header.

## Data

Every mongoose "model" is stored in the models folder.

There are 3 collections, one for storing users, one for storing articles,and one for drafts

Every draft is tied to the user that drafted it, through a field called uid (user id).

## _.env specifications_

MONGODB_URI is the connection uri to mongodb

PORT is the port to run the server on

ACCESS_TOKEN_SECRET is the encryption private used to create and verify json web tokens.

## **EXAMPLE .env**

```
DB_CONNECT=mongodb+srv://url_location/db_name?retryWrites=true&w=majority
PORT=4201
ACCESS_TOKEN_SECRET=EncryptionPrivateKey
```
