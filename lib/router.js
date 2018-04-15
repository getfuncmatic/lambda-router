'use strict';

var Route = require('../lib/route')


class Router {
  constructor(options) {
    this.options = options
    this.routes = [ ]
  }
  
  create(options) {
    return new Router()
  }
  
  get(path, fn) { this.addRoute('GET', path, fn) }
  post(path, fn) { this.addRoute('POST', path, fn) }
  put(path, fn) { this.addRoute('PUT', path, fn) }
  delete(path, fn) { this.addRoute('DELETE', path, fn) }
  
  addRoute(method, path, fn) {
    var route = new Route(method, path, fn, this.options)
    this.routes.push(route)
  }
  
  async dispatch(method, path, ctx) {
    for (var i=0; i<this.routes.length; i++) {
      var route = this.routes[i]
      var params = { }
      if (route.match(method, path, params)) {
        var params = route.getPathParams(path)
        ctx['params'] = params
        var res = null
        try {
          res = await route.invoke(ctx, params)
        } catch (err) {
          res = err
        }
        if (res === false || res === 'route') continue
        return res
      }
    }
    return createNotFoundError(method, path)
  }
}

function createNotFoundError(method, path) {
  // mimics http-errors npm package https://www.npmjs.com/package/http-errors
  var err = new Error(`Not Found: ${method} ${path}`)
  err.status = 404
  err.statusCode = 404
  err.expose = true
  return err
}

module.exports = new Router()