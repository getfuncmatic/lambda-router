'use strict';

//var pathToRegexp = require('../lib/path').pathToRegexp
var pathToRegexp = require('path-to-regexp')

var decodeURLComponents = true;
var strict = false;
  
class Route {
  
  constructor(method, path, ...fn) {
    var options = {}
    options.strict = options.strict || strict
    this.path = (path === '*') ? '(.*)' : path
    this.method = method
    this.keys = []
    this.regexp = pathToRegexp(this.path, this.keys)
    this.handlers = Route.getHandlers(fn)
  }
  
  static getHandlers(fn) {
    var handlers = [ ]
    for (var i=0; i<fn.length; i++) {
      if ('function' === typeof fn[i]) {
        handlers.push(fn[i])
      }
    }
    return handlers
  }
  
  match(method, path) {
    return this.matchMethod(method) && this.matchPath(path)
  }
  
  matchMethod(method) {
    return (this.method == "ALL") || (this.method == method)
  }
  
  matchPath(path) {
    var qsIndex = path.indexOf('?'),
      pathname = ~qsIndex ? path.slice(0, qsIndex) : path
      
    return this.regexp.exec(decodeURIComponent(pathname));
  }
  
  getPathParams(path) {
    var keys = this.keys
    
    var params = { }
    var m = this.matchPath(path)
    if (!m) return params
    
    for (var i = 1, len = m.length; i < len; ++i) {
      var key = keys[i - 1];
      var val = decodeURLEncodedURIComponent(m[i]);
      if (val !== undefined || !(hasOwnProperty.call(params, key.name))) {
        params[key.name] = val;
      }
    }
    return params
  }

  async invoke(event, context, plugins) {
    for (var i=0; i<this.handlers.length; i++) {
      var res = await this.handlers[i](event, context, plugins)
      if (res === false) continue
      return res
    }
    return false
  }
}


  
function decodeURLEncodedURIComponent(val) {
  if (typeof val !== 'string') { return val; }
  return decodeURLComponents ? decodeURIComponent(val.replace(/\+/g, ' ')) : val;
}

module.exports = Route