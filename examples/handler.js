'use strict'

// Example of an AWS Node.js 8.10 Lambda function that 
// uses the lambda-router

// First install the package in your project: 
// $> npm install --save @funcmatic/router

// Reqiure the router in your project which creates
// an instance of the router
const app = require('@funcmatic/lambda-router')

// Example of defining a route which matches HTTP GET requests such as
// * GET /hello/1234
// * GET /hello/danieljyoo
// but NOT
// * GET /hello/
// * POST /hello/1234
app.get('/hello/:userid', async (event, context) => {
  // the router will place any path parameters (e.g. userid) 
  // in the context.router.params 
  // If there are no path params, 
  // context.router.params will be null.
  // In this case, of the GET /hello/123 
  // context.router.params will have the value:
  // { 
  //   userid: "123"
  // }
  // Note that "123" is of type string
  var pathParams = context.router.params
  
  // return using API Gateway's Lamba Proxy Integration 
  // JSON response format. 
  return { 
    statusCode: 200,
    headers: {
      'content-type': 'application/json'
    },
    body: JSON.stringify(pathParams),
    isBase64Encoded: false
  }
})  

// app.handler() returns a function with structure:
// async (event, context) => { ... } 
// which will be invoked by AWS Lambda
module.exports.handler = app.handler()
