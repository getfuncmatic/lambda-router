var Route = require('../lib/route')

//expect(houseForSale).toMatchObject(desiredHouse);
/*
app.get('/', function (req, res) {
  res.send('root')
})
This route path will match requests to /about.

app.get('/about', function (req, res) {
  res.send('about')
})
This route path will match requests to /random.text.

app.get('/random.text', function (req, res) {
  res.send('random.text')
})
Here are some examples of route paths based on string patterns.

This route path will match acd and abcd.

app.get('/ab?cd', function (req, res) {
  res.send('ab?cd')
})
This route path will match abcd, abbcd, abbbcd, and so on.

app.get('/ab+cd', function (req, res) {
  res.send('ab+cd')
})
This route path will match abcd, abxcd, abRANDOMcd, ab123cd, and so on.

app.get('/ab*cd', function (req, res) {
  res.send('ab*cd')
})
This route path will match /abe and /abcde.

app.get('/ab(cd)?e', function (req, res) {
  res.send('ab(cd)?e')
})
Examples of route paths based on regular expressions:

This route path will match anything with an “a” in it.

app.get(/a/, function (req, res) {
  res.send('/a/')
})
This route path will match butterfly and dragonfly, but not butterflyman, dragonflyman, and so on.

app.get(/.*fly$/, function (req, res) {
  res.send('/.*fly$/')
})
*/
describe('Route matching', () => {
  // Tests taken from Express documentation at:
  // https://expressjs.com/en/guide/routing.html
  it ('should match root route', () => {
    var route = new Route('GET', '/')
    expect(route.match('GET', '/')).toBeTruthy()
    expect(route.match('GET', '')).toBeFalsy()
    expect(route.match('GET', '/about')).toBeFalsy()
  })
  it ('should match path (case insensitive)', () => {
    var route = new Route('GET', '/about')
    expect(route.match('GET', '/about')).toBeTruthy()
    expect(route.match('GET', '/About')).toBeTruthy()
    expect(route.match('GET', '/hello')).toBeFalsy()
  })
  it ('should match path.extension (case insensitive)', () => {
    var route = new Route('GET', '/random.text')
    expect(route.match('GET', '/random.text')).toBeTruthy()
    expect(route.match('GET', '/random.TEXT')).toBeTruthy()
    expect(route.match('GET', '/random.png')).toBeFalsy()
  })
  // Tests taken from https://github.com/pillarjs/path-to-regexp
  it ('should NOT match using ? on non-params', () => {
    // this is no longer supported by path-to-regexp
    var route = new Route('GET', '/ab?cd')
    expect(route.match('GET', '/acd')).toBeFalsy()
    expect(route.match('GET', '/abcd')).toBeFalsy()
  })
  it ('should NOT match using + on non-params', () => {
    // this is no longer supported by path-to-regexp
    var route = new Route('GET', '/ab+cd')
    expect(route.match('GET', '/abcd')).toBeFalsy()
    expect(route.match('GET', '/abbcd')).toBeFalsy()
  })
  it ('should match using named parameters', () => {
    var route = new Route('GET', '/:foo/:bar')
    expect(route.match('GET', '/test/route')).toBeTruthy()
    expect(route.getPathParams('/test/route')).toMatchObject({
      foo: "test",
      bar: "route"
    })
    expect(route.match('GET', '/test')).toBeFalsy()
    expect(route.match('GET', '/test/route/hello')).toBeFalsy()
  })
  it ('should match ? path modifier', () => {
    var route = new Route('GET', '/:foo/:bar?')
    expect(route.match('GET', '/test/route')).toBeTruthy()
    expect(route.match('GET', '/test')).toBeTruthy()
    expect(route.getPathParams('/test/route')).toMatchObject({
      foo: "test",
      bar: "route"
    })
    expect(route.getPathParams('/test')).toMatchObject({
      foo: "test"
    })
    expect(route.match('GET', '/test/route/hello')).toBeFalsy()
  })
  it ('should match * path modifier', () => {
    var route = new Route('GET', '/:foo*')
    expect(route.match('GET', '/')).toBeTruthy()
    expect(route.match('GET', '/bar')).toBeTruthy()
    expect(route.getPathParams('/bar')).toMatchObject({
      foo: "bar"
    })
    expect(route.match('GET', '/bar/baz')).toBeTruthy()
    expect(route.getPathParams('/bar/baz')).toMatchObject({
      foo: "bar/baz"
    })
  })
  it ('should match + path modifier', () => {
    var route = new Route('GET', '/:foo+')
    expect(route.match('GET', '/')).toBeFalsy()
    expect(route.match('GET', '/bar')).toBeTruthy()
    expect(route.getPathParams('/bar')).toMatchObject({
      foo: "bar"
    })
    expect(route.match('GET', '/bar/baz')).toBeTruthy()
    expect(route.getPathParams('/bar/baz')).toMatchObject({
      foo: "bar/baz"
    })
  })
  it ('should match custom matching regex params', () => {
    var route = new Route('GET', '/icon-:foo(\\d+).png')
    expect(route.match('GET', '/icon-123.png')).toBeTruthy()
    expect(route.getPathParams('/icon-123.png')).toMatchObject({
      foo: "123"
    })
    expect(route.match('GET', '/icon-abc.png')).toBeFalsy()
  })
  it ('should match unnamed parameters', () => {
    var route = new Route('GET', '/:foo/(.*)')
    expect(route.match('GET', '/test/route')).toBeTruthy()
    expect(route.getPathParams('/test/route')).toMatchObject({
      foo: "test",
      0: "route"
    })
    expect(route.match('GET', '/test/route/hello')).toBeTruthy()
    expect(route.getPathParams('/test/route/hello')).toMatchObject({
      foo: "test",
      0: "route/hello"
    })
    expect(route.match('GET', '/test')).toBeFalsy()
  })
})

describe('Route handlers', () => {
  it ('should create a new route with multiple handlers', async () => {
    var route = new Route('GET', '/hello/:userid', () => {
      return false
    }, () => {
      return { "hello": "world" }
    })
    expect(route.handlers.length).toBe(2)
  })
})

describe('Route invocation', () => { 
  it ('should return from a single route', async () => {
    var route = new Route('GET', '/hello/:userid', () => {
      return { "hello": "world" }
    })
    var res = await route.invoke({ }, { })
    expect(res).toMatchObject({ "hello": "world" })
  })
  it ('should move on to next handler if false is returned', async () => {
    var route = new Route('GET', '/hello/:userid', () => {
      return false
    }, () => {
      return { "hello": "world" }
    })
    var res = await route.invoke({ }, { })
    expect(res).toMatchObject({ "hello": "world" })
  })
  it ('should terminate execution when route is returned', async () => {
    var route = new Route('GET', '/hello/:userid', () => {
      return 'route'
    }, () => {
      return { "hello": "world" }
    })
    var res = await route.invoke({ }, { })
    expect(res).toBe('route')
  })
  it ('should terminate execution when a value is returned', async () => {
    var route = new Route('GET', '/hello/:userid', () => {
      return { "hello": "world" }
    }, () => {
      return { "foo": "bar" }
    })
    var res = await route.invoke({ }, { })
    expect(res).toMatchObject({ "hello": "world" })
  })
}) 



