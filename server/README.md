# Server

## This is the api the CMS uses for interfacing with mongodb through express

## Technology

The api runs off of express.

The default port to run on is 5678, but this can be changed with the PORT environment variable in .env

## Running this api with docker

Build the app with docker.

```bash
docker build -t cmsrewritebackend .
```

Next, run the built container.

```bash
docker run -p 127.0.0.1:5678:5678 cmsrewritebackend
```

## Security

This app is protected with a firewall, helmet, and most importantly, the authentication layer.

## Authentication

The authentication for if a user is logged in or has admin privileges is handled by JWT, or json web tokens.

For example, to access any database information (through an api route, you must pass in a valid JWT (JSONWEBTOKEN) auth-token from a **APPROVED** user in the auth-token request header.

Anyone can create an account, but for ANY (even basic) permissions, the user must be approved by an admin.

## Data

Every mongoose "model" is stored in the models folder.

There are 3 collections, one for storing users, one for storing articles, and one for drafts

Every draft is tied to the user that drafted it, through a field called drafter_id (the creator's uid or \_id).

## _.env_ specifications

`MONGODB_URI` is the connection uri to mongodb

`PORT` is the port to run the server on

`ACCESS_TOKEN_SECRET` is the encryption private key used to create and verify json web tokens.

`AWS_ACCESS_ID` is the access id for the s3 bucket used

`AWS_ACCESS_SECRET` is the accompanying secret for the `AWS_ACCESS_ID`

`BUCKET_NAME` is the name of the s3 bucket

`MEDIA_DIR` is the subfolder of the s3 bucket to use for storage

## **EXAMPLE .env**

```
DB_CONNECT=mongodb+srv://url_location/db_name?retryWrites=true&w=majority
PORT=4201
ACCESS_TOKEN_SECRET=EncryptionPrivateKey
AWS_ACCESS_ID=AnIDcreatedByAuserTiedToAuser
AWS_ACCESS_SECRET=theSecret
BUCKET_NAME=MyMedia
MEDIA_DIR=media_images
```
