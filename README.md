# lambda-router
A lightweight Express-like HTTP request router for AWS Lambda functions triggered by API Gateway's Lambda Proxy Integration.

### This might be helpful if ...

* You use API Gateway's [Lambda Proxy Integration](https://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-create-api-as-simple-proxy-for-lambda.html).
* Your Lambda function will execute different logic based on the AWS event's **httpMethod** and **path** parameters.
* Your Lambda function will use the Node.js 8.10 runtime with [new async-style handler](https://aws.amazon.com/blogs/compute/node-js-8-10-runtime-now-available-in-aws-lambda/).

_If these conditions DO NOT apply to you then see the bottom of this README for some alternative routing solutions._

## Key Features

* Route handlers are invoked with the AWS event and context objects rather than HTTP request/response
* Written for the new [Node.js 8.10 async-style handler]
* Uses the [path-to-regexp](https://github.com/pillarjs/path-to-regexp) module to support similar route matching as Express (e.g. '/:foo/:bar+')

## Getting Started
```
npm install @funcmatic/lambda-router
```
```
// function.js
'use strict'

const app = require('@funcmatic/lambda-router')

// define a route 
app.get('/user/:id', async ({ event, context }, params) => {
  var ret = { 'user': params.userid }
  return ret
})  

// This will be invoked by AWS Lambda and 
exports.handler = async (event, context) => {
  // You can pass any data into your route 
  var ctx = { event, context }  
  return await app.dispatch(ctx)
}
```
```

```

## How to Use

### Route methods

### Route paths

### Route parameters

### Route handlers

### Response methods


## Running the tests
Most existing Javascript routers require an HTTP request/response object. Here an example of route using [Express](https://expressjs.com/en/guide/routing.html):

```
// Router handler in Expresss is passed in a Node HTTP request and response object
app.get('/', function (req, res) {
  res.send('hello world')
})
```

You can define the equivalent route handler using **lambda-router** by:

```
// lambda-router uses similar syntax but passes in the AWS event and context 
// objects instead of request/response
app.get('/', async function ({event, context}) {
  
  return {
    statusCode: 200,
    headers: {
     "Content-Type": "text/plain"
    },
    body: 'hello world'
  }
})
```

## Alternative Routing Solutions

## Why? 


Micro server-side URL router that can be used with AWS Lambda (NodeJS) and has Express-like routing syntax. Written in vanilla javascript that natively runs in Node v8.10 and does not depend on any other external packages or modules.

_Inspired and adapted from [visionmedia/page.js](https://github.com/visionmedia/page.js) &mdash; a simple express-like client-side router._

```
Test code
```
