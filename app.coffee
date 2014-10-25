fs = require 'fs'

_ = require 'underscore'
hue = require "node-hue-api"
q = require "q"

tessel = require 'tessel'

getUsernameForBridge = (id) ->
  if fs.existsSync('usernames')
    JSON.parse(fs.readFileSync('usernames', {'encoding': 'utf8'}))[id]

getBridge = ->
  hue.locateBridges().then (bridges) ->
    unless bridges.length > 0
      throw new Error('No bridges detected.')
    else if bridges.length == 1
      bridges[0]
    else
      for bridge, i in bridges
        console.log i, JSON.stringify bridge
      q.nfcall(prompt.get, ['bridge id']).then (result) ->
        bridges[result]

getUser = (bridge) ->
  # Get the username associated with this bridge
  username = getUsernameForBridge bridge.id

  if username
    console.log 'Found existing user:', username
    q username
  else
    (new hue.HueApi()).registerUser(bridge.ipaddress).then (username) ->
      bridgeToUsername = if fs.existsSync('usernames') then JSON.parse(fs.readFileSync('usernames', {'encoding': 'utf8'})) else {}
      bridgeToUsername[bridge.id] = username
      fs.writeFileSync('usernames', JSON.stringify(bridgeToUsername))

      console.log 'Registered new user:', username
      username

hslLights = _.throttle (api, lights, h, s, l) ->
  for light in lights
    console.log 'Setting', light.name, 'to', h, s, l
    api.setLightState light.id, hue.lightState.create().hsl(h, s, l).transition(0.2).on()
, 200



getBridge().then (bridge) ->
  getUser(bridge).then (username) ->
    api = new hue.HueApi bridge.ipaddress, username
    api.searchForNewLights().then ->
      api.lights().then (lights) ->
        console.log 'Found lights', lights

.done()
