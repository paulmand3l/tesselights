(function() {
  var fs, getBridge, getUser, getUsernameForBridge, hslLights, hue, q, tessel, _;

  fs = require('fs');

  _ = require('underscore');

  hue = require("node-hue-api");

  q = require("q");

  tessel = require('tessel');

  getUsernameForBridge = function(id) {
    if (fs.existsSync('usernames')) {
      return JSON.parse(fs.readFileSync('usernames', {
        'encoding': 'utf8'
      }))[id];
    }
  };

  getBridge = function() {
    return hue.locateBridges().then(function(bridges) {
      var bridge, i, _i, _len;
      if (!(bridges.length > 0)) {
        throw new Error('No bridges detected.');
      } else if (bridges.length === 1) {
        return bridges[0];
      } else {
        for (i = _i = 0, _len = bridges.length; _i < _len; i = ++_i) {
          bridge = bridges[i];
          console.log(i, JSON.stringify(bridge));
        }
        return q.nfcall(prompt.get, ['bridge id']).then(function(result) {
          return bridges[result];
        });
      }
    });
  };

  getUser = function(bridge) {
    var username;
    username = getUsernameForBridge(bridge.id);
    if (username) {
      console.log('Found existing user:', username);
      return q(username);
    } else {
      return (new hue.HueApi()).registerUser(bridge.ipaddress).then(function(username) {
        var bridgeToUsername;
        bridgeToUsername = fs.existsSync('usernames') ? JSON.parse(fs.readFileSync('usernames', {
          'encoding': 'utf8'
        })) : {};
        bridgeToUsername[bridge.id] = username;
        fs.writeFileSync('usernames', JSON.stringify(bridgeToUsername));
        console.log('Registered new user:', username);
        return username;
      });
    }
  };

  hslLights = _.throttle(function(api, lights, h, s, l) {
    var light, _i, _len, _results;
    _results = [];
    for (_i = 0, _len = lights.length; _i < _len; _i++) {
      light = lights[_i];
      console.log('Setting', light.name, 'to', h, s, l);
      _results.push(api.setLightState(light.id, hue.lightState.create().hsl(h, s, l).transition(0.2).on()));
    }
    return _results;
  }, 200);

  getBridge().then(function(bridge) {
    return getUser(bridge).then(function(username) {
      var api;
      api = new hue.HueApi(bridge.ipaddress, username);
      return api.searchForNewLights().then(function() {
        return api.lights().then(function(lights) {
          return console.log('Found lights', lights);
        });
      });
    });
  }).done();

}).call(this);
