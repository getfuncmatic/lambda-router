var app = require('../lib/router')

//expect(houseForSale).toMatchObject(desiredHouse);
describe('Router', () => {
  it ('create a new router', async () => {
    var options = { }
    var router = app.create(options)
    router.get('/hello/:userid', (ctx) => {
      return { 
        'hello': 'world',
        'ctx': ctx
      }
    })
    router.get('')
    
    var ctx = { 'foo': 'bar' }
    var res = await router.dispatch('GET', '/hello/123', ctx)
    expect(res.ctx).toMatchObject({
      'foo': 'bar',
      'params': {
        'userid': '123'
      }
    })
  })
  it ('should return and unhandled error if no matching route', async () => {
    var options = { }
    var router = app.create(options)
    router.get('/hello/:userid', (ctx) => {
      return { 'hello': 'world' }
    })
    var res = await router.dispatch('GET', '/', { })
    expect(res instanceof Error).toBe(true)
  })
}) 



