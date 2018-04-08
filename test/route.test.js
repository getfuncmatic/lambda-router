var Route = require('../lib/route')

//expect(houseForSale).toMatchObject(desiredHouse);
describe('Route initialization and matching', () => {
  it ('should match path parameters', done => {
    var route = new Route('GET', '/hello/:userid')
    expect(route.match('GET', '/hello/123')).toBeTruthy()
    expect(route.getPathParams('/hello/123')).toMatchObject({ 'userid': '123' })
    expect(route.match('GET', '/world/123')).toBeFalsy()
    done()
  })
  it ('should create a new route with multiple handlers', done => {
    var route = new Route('GET', '/hello/:userid', () => {
      return false
    }, () => {
      return { "hello": "world" }
    })
    expect(route.handlers.length).toBe(2)
    done()
  })
})

describe('Route invocation', () => { 
  it ('should return from a single route', async (done) => {
    var route = new Route('GET', '/hello/:userid', () => {
      return { "hello": "world" }
    })
    var res = await route.invoke({ }, { })
    expect(res).toMatchObject({ "hello": "world" })
    done()
  })
  it ('should move on to next handler if false is returned', async (done) => {
    var route = new Route('GET', '/hello/:userid', () => {
      return false
    }, () => {
      return { "hello": "world" }
    })
    var res = await route.invoke({ }, { })
    expect(res).toMatchObject({ "hello": "world" })
    done()
  })
  it ('should terminate execution when route is returned', async (done) => {
    var route = new Route('GET', '/hello/:userid', () => {
      return 'route'
    }, () => {
      return { "hello": "world" }
    })
    var res = await route.invoke({ }, { })
    expect(res).toBe('route')
    done()
  })
  it ('should terminate execution when a value is returned', async (done) => {
    var route = new Route('GET', '/hello/:userid', () => {
      return { "hello": "world" }
    }, () => {
      return { "foo": "bar" }
    })
    var res = await route.invoke({ }, { })
    expect(res).toMatchObject({ "hello": "world" })
    done()
  })
}) 



