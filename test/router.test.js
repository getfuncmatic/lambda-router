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
    var res = await router.handler(event, context)
    expect(res.context).toMatchObject({
      'foo': 'bar',
      'router': { 
        'params': {
          'userid': '123'
        }
      }
    })
  })
  it ('should return and unhandled error if no matching route', async () => {
    var options = { }
    var router = app.create(options)
    router.get('/hello/:userid', (event, context) => {
      return { 'hello': 'world' }
    })
    var event = {
      method: 'GET',
      path: '/'
    }
    var res = await router.handler(event, { })
    expect(res instanceof Error).toBe(true)
  })
}) 



