http = require 'http'
url = require 'url'

async = require 'async'

tessel = require 'tessel'

scenes = require "./scenes.js"

get = (targetURL, cb) ->
  urlParts = url.parse targetURL

  httpOptions =
    hostname: urlParts.hostname
    port: urlParts.port
    path: urlParts.pathname
    method: 'GET'

  http.get httpOptions, cb

put = (targetURL, jsonData, cb) ->
  urlParts = url.parse targetURL

  dataString = JSON.stringify jsonData

  headers =
    'Content-Type': 'application/json'
    'Content-Length': dataString.length

  httpOptions =
    hostname: urlParts.hostname
    port: urlParts.port
    path: urlParts.pathname
    method: 'PUT'
    headers: headers

  req = http.request httpOptions, (res) ->
    responseString = ''

    console.log 'got', res.statusCode

    res.setEncoding 'utf-8'
    res.on 'data', (data) ->
      console.log 'got data', data
      cb? null, data

  req.on 'error', (e) ->
    console.log 'ERROR:', e.message

  req.write dataString
  req.end()

username = '2d54e40c303bd94f33a687e4de028e7'
bridgeIP = '10.0.1.2'

setLightState = (id, state, cb) ->
  console.log 'setting', id, 'to', state
  setImmediate put "http://#{bridgeIP}/api/#{username}/lights/#{id}/state", state, cb

console.log 'Ready'

currentScene = 'relax'

tessel.button.on 'press', (time) ->
  console.log 'button was pressed', time
  tessel.led[1].write true

tessel.button.on 'release', (time) ->
  console.log 'button was released', time
  tessel.led[1].write false

  scenesToSet = []

  if currentScene is 'relax'
    console.log 'setting scene to bedtime'
    for id, state of scenes.bedtime
      do (id, state) ->
        scenesToSet.push (cb) ->
          setLightState id, state, cb
    currentScene = 'bedtime'
  else
    console.log 'setting scene to relax'
    for id, state of scenes.relax
      do (id, state) ->
        scenesToSet.push (cb) ->
          setLightState id, state, cb
    currentScene = 'relax'

  async.parallelLimit scenesToSet, 4, (err, res) ->
    console.log 'done setting lights, got'
    console.log '\terror:', err
    console.log '\tresults:', res
