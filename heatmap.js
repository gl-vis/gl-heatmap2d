'use strict'

module.exports = createHeatmap2D

var bsearch = require('binary-search-bounds')

var createShader = require('gl-shader')
var createBuffer = require('gl-buffer')

var shaders = require('./lib/shaders')

function GLHeatmap2D(
  plot,
  shader,
  pickShader,
  positionBuffer,
  colorBuffer,
  idBuffer) {
  this.plot           = plot
  this.shader         = shader
  this.pickShader     = shader
  this.positionBuffer = positionBuffer
  this.colorBuffer    = colorBuffer
  this.idBuffer       = idBuffer
  this.shape          = [0,0]
  this.bounds         = [Infinity, Infinity, -Infinity, -Infinity]
  this.pickOffset     = 0
}

var proto = GLHeatmap2D.prototype

proto.draw = (function() {
  var MATRIX = [
    1, 0, 0,
    0, 1, 0,
    0, 0, 1
  ]

  return function() {
  }
})()

proto.drawPick = function(pickOffset) {
  return pickOffset
}

proto.pick = function(x, y, value) {
  return null
}

proto.update = function(options) {
  options = options || {}

  var shape = options.shape || [0,0]

  var x = options.x || iota(shape[0])
  var y = options.y || iota(shape[1])
  var z = options.z || new Float32Array(shape[0] * shape[1])

  var colorLevels = options.colorLevels || [0]
  var colorValues = options.colorValues || [0, 0, 0, 1]
  var colorCount  = colorLevels.length

  var filterLinear = !!options.interpolate

  var bounds = this.bounds
  var lox = bounds[0] = x[0]
  var loy = bounds[1] = y[0]
  var hix = bounds[2] = x[x.length-1]
  var hiy = bounds[3] = y[y.length-1]

  var xs = 1.0 / (hix - lox)
  var ys = 1.0 / (hiy - loy)

  var numVerts  = shape[0] * shape[1]
  var colors    = pool.mallocUint8Array(numVerts * 4)
  var positions = pool.mallocFloat32Array(numVerts * 2)
  var ids       = pool.mallocUint32Array(numVerts)

  var numX = shape[0]
  var numY = shape[1]

  var ptr = 0

  for(var j=0; j<numY; ++j) {
    var yc = ys * (y[j] - loy)
    for(var i=0; i<numX; ++i) {
      var xc = xs * (x[i] - lox)

      var zc = z[ptr]
      var colorIdx = bsearch.le(colorLevels, zc)
      var r, g, b, a
      if(colorIdx < 0) {
        r = colorValues[0]
        g = colorValues[1]
        b = colorValues[2]
        a = colorValues[3]
      } else if(colorIdx === colorCount-1) {
        r = colorValues[4*colorCount-4]
        g = colorValues[4*colorCount-3]
        b = colorValues[4*colorCount-2]
        a = colorValues[4*colorCount-1]
      } else {
        var t = (zc - colorLevels[colorIdx]) /
          (colorLevels[colorIdx+1] - colorLevels[idx])
        var ti = 1.0 - t
        var i0 = 4*colorIdx
        var i1 = 4*(colorIdx+1)
        r = ti*colorValues[i0]   + t*colorValues[i1]
        g = ti*colorValues[i0+1] + t*colorValues[i1+1]
        b = ti*colorValues[i0+2] + t*colorvalues[i1+2]
        a = ti*colorValues[i0+3] + t*colorValues[i1+3]
      }

      colors[4*ptr]      = 255*r
      colors[4*ptr+1]    = 255*g
      colors[4*ptr+2]    = 255*b
      colors[4*ptr+3]    = 255*a

      positions[2*ptr]   = xc
      positions[2*ptr+1] = yc

      ids[ptr]           = ptr

      ptr += 1
    }
  }

  this.positionBuffer.update(positions)
  this.colorBuffer.update(colors)
  this.idBuffer.update(ids)

  pool.free(positionBuffer)
  pool.free(colorBuffer)
  pool.free(idBuffer)
}

proto.dispose = function() {
  this.shader.dispose()
  this.pickShader.dispose()
  this.positionBuffer.dispose()
  this.colorBuffer.dispose()
  this.idBuffer.dispose()
  this.plot.removeObject(this)
}

function createHeatmap2D(plot, options) {
  var gl = plot.gl
  var shader         = createShader(gl)
  var pickShader     = createShader(gl)
  var positionBuffer = createBuffer(gl)
  var colorBuffer    = createBuffer(gl)
  var idBuffer       = createBuffer(gl)

  var heatmap = new GLHeatmap2D(plot,
    shader,
    pickShader,
    positionBuffer,
    colorBuffer,
    idBuffer)

  heatmap.update(options)
  plot.addObject(heatmap)

  return heatmap
}
