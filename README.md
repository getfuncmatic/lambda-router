# lambda-router
**A lightweight Express-like HTTP request router for AWS Lambda functions triggered by API Gateway's Lambda Proxy Integration.**

## Key Features

* Route handlers are invoked with the AWS event and context objects rather than HTTP request/response
* Written for the new [Node.js 8.10 async-style handler](https://aws.amazon.com/blogs/compute/node-js-8-10-runtime-now-available-in-aws-lambda/)
* Uses the [path-to-regexp](https://github.com/pillarjs/path-to-regexp) module to support similar route matching as Express (e.g. '/:foo/:bar+')

## Getting Started
```
npm install @funcmatic/lambda-router
```
```
// lambda.js
'use strict'
exports.handler = async (event) => {
    return await lambda.getAccountSettings().promise() ;
};
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



## Example

```
module.exports.router = async ({app}) => {

}
```

## Why? 


Micro server-side URL router that can be used with AWS Lambda (NodeJS) and has Express-like routing syntax. Written in vanilla javascript that natively runs in Node v8.10 and does not depend on any other external packages or modules.

_Inspired and adapted from [visionmedia/page.js](https://github.com/visionmedia/page.js) &mdash; a simple express-like client-side router._

```
Test code
```
