'use strict'

const app = require('@funcmatic/lambda-router')
//const app = new Router()

app.get('/hello/:userid', async ({ event, context, func }, params) => {
  func.log.info("pino logger!")
  var res = (await func.request.get('danieljyoo/funcmatic-helloworld')).data
  var ret = { 'hello': 'world', params: params }
  return ret
})  

module.exports.handler = async (event, context) => {  
  await app.dispatch(event.event.method, event.event.path, { 
      event: event.event, 
      context: event.context,
      func: { log, request, error }
    })
}
  
