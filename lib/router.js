'use strict';

var Route = require('../lib/route')

class Router {
  constructor(options) {
    this.name = 'router'
    this.options = options
    this.routes = [ ]
    this.routerContext = options && options.context || { }
  }
  
  create(options) {
    return new Router(options || {})
  }

  get(path, fn) { this.addRoute('GET', path, fn) }
  post(path, fn) { this.addRoute('POST', path, fn) }
  put(path, fn) { this.addRoute('PUT', path, fn) }
  delete(path, fn) { this.addRoute('DELETE', path, fn) }
  patch(path, fn) { this.addRoute('PATCH', path, fn) }
  options(path, fn) { this.addRoute('OPTIONS', path, fn) }
  any(path, fn) { this.all(path, fn) }
  all(path, fn) { this.addRoute('ALL', path, fn) }

  addRoute(method, path, fn) {
    var route = new Route(method, path, fn, this.options)
    this.routes.push(route)
  }
  
  handler(handlerContext) {
    handlerContext = handlerContext || { }
    var f = async (event, context, plugins) => {
      var method = getEventMethod(event) 
      if (!method) throw new Error('event.method must be provided')
      var mergedContext = Object.assign(this.routerContext, handlerContext, context)
      var path = getEventPath(event)
      return await this.dispatch(event, mergedContext, method, path, plugins)
    }
    return f.bind(this)
  }
  
  async dispatch(event, context, method, path, plugins) {
    plugins = plugins || { }
    for (var i=0; i<this.routes.length; i++) {
      var route = this.routes[i]
      var params = { }
      if (route.match(method, path, params)) {
        var params = route.getPathParams(path)
        // context[this.name] = { params }
        // context.getPathParam = (name) => {
        //   return context[this.name].params[name]
        // }
        // context.getPathParam.bind(this)
        plugins.params = params
        var res = null
        try {
          res = await route.invoke(event, context, plugins)
        } catch (err) {
          res = err
        }
        if (res === false || res === 'route') continue
        return res
      }
    }
    throw createNotFoundError(method, path)
  }
}

function getEventPath(event) {
  if (event.pathParameters && event.pathParameters.proxy) {
    var proxy = event.pathParameters.proxy
    if (proxy.startsWith('/')) {
      return proxy
    } else {
      return `/${event.pathParameters.proxy}`
    }
  }
  return '/'
}

function getEventMethod(event) {
  return event.httpMethod || event.method
}

function createNotFoundError(method, path) {
  // mimics http-errors npm package https://www.npmjs.com/package/http-errors
  var err = new Error(`No matching route: ${method} ${path}`)
  err.status = 404
  err.statusCode = 404
  err.expose = true
  return err
}

module.exports = new Router()