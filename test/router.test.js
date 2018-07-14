var app = require('../lib/router')

//expect(houseForSale).toMatchObject(desiredHouse);
describe('Router', () => {
  it ('create a new router', async () => {
    var options = { }
    var router = app.create(options)
    router.get('/hello/:userid', (event, context) => {
      return { 
        'hello': 'world',
        event, 
        context
      }
    })
    var event = {
       method: 'GET', 
       path: '/hello/123'
    }
    var context = { 'foo': 'bar' }
    var handler = router.handler()
    var res = await handler(event, context)
    expect(res.context).toMatchObject({
      'foo': 'bar',
      'router': { 
        'params': {
          'userid': '123'
        }
      }
    })
  })
  it ('should throw a no matching route error if no matching route', async () => {
    var options = { }
    var router = app.create(options)
    router.get('/hello/:userid', (event, context) => {
      return { 'hello': 'world' }
    })
    var event = {
      method: 'GET',
      path: '/'
    }
    var handler = router.handler()
    var thrownError = null
    try {
      var res = await handler(event, { })
    } catch (err) {
      thrownError = err
    }
    expect(thrownError).toBeTruthy()
    expect(thrownError.message).toMatch(/^No matching route/)
    expect(thrownError.statusCode).toBe(404)
  })
  it ('should merge route, handler, and invocation level contexts', async () => {
    var options = {
      context: { 
        a: 'router', 
        b: 'router',
        c: 'router'
      }
    }
    var router = app.create(options)
    router.get('/', (event, context) => {
      return context
    })
    var event = {
      method: 'GET',
      path: '/'
    }
    var handlerContext = {
      a: 'handler',
      b: 'handler'
    }
    var handler = router.handler(handlerContext)
    var invokeContext = {
      a: 'invoke'
    }
    var res = await handler(event, invokeContext)
    expect(res).toMatchObject({
      a: 'invoke',
      b: 'handler',
      c: 'router'
    })
  })
}) 



