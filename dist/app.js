(function() {
  var async, bridgeIP, currentScene, get, http, put, scenes, setLightState, tessel, url, username;

  http = require('http');

  url = require('url');

  async = require('async');

  tessel = require('tessel');

  scenes = require("./scenes.js");

  get = function(targetURL, cb) {
    var httpOptions, urlParts;
    urlParts = url.parse(targetURL);
    httpOptions = {
      hostname: urlParts.hostname,
      port: urlParts.port,
      path: urlParts.pathname,
      method: 'GET'
    };
    return http.get(httpOptions, cb);
  };

  put = function(targetURL, jsonData, cb) {
    var dataString, headers, httpOptions, req, urlParts;
    urlParts = url.parse(targetURL);
    dataString = JSON.stringify(jsonData);
    headers = {
      'Content-Type': 'application/json',
      'Content-Length': dataString.length
    };
    httpOptions = {
      hostname: urlParts.hostname,
      port: urlParts.port,
      path: urlParts.pathname,
      method: 'PUT',
      headers: headers
    };
    req = http.request(httpOptions, function(res) {
      var responseString;
      responseString = '';
      console.log('got', res.statusCode);
      res.setEncoding('utf-8');
      return res.on('data', function(data) {
        console.log('got data', data);
        return typeof cb === "function" ? cb(null, data) : void 0;
      });
    });
    req.on('error', function(e) {
      return console.log('ERROR:', e.message);
    });
    req.write(dataString);
    return req.end();
  };

  username = '2d54e40c303bd94f33a687e4de028e7';

  bridgeIP = '10.0.1.2';

  setLightState = function(id, state, cb) {
    console.log('setting', id, 'to', state);
    return setImmediate(put("http://" + bridgeIP + "/api/" + username + "/lights/" + id + "/state", state, cb));
  };

  console.log('Ready');

  currentScene = 'relax';

  tessel.button.on('press', function(time) {
    console.log('button was pressed', time);
    return tessel.led[1].write(true);
  });

  tessel.button.on('release', function(time) {
    var id, scenesToSet, state, _fn, _fn1, _ref, _ref1;
    console.log('button was released', time);
    tessel.led[1].write(false);
    scenesToSet = [];
    if (currentScene === 'relax') {
      console.log('setting scene to bedtime');
      _ref = scenes.bedtime;
      _fn = function(id, state) {
        return scenesToSet.push(function(cb) {
          return setLightState(id, state, cb);
        });
      };
      for (id in _ref) {
        state = _ref[id];
        _fn(id, state);
      }
      currentScene = 'bedtime';
    } else {
      console.log('setting scene to relax');
      _ref1 = scenes.relax;
      _fn1 = function(id, state) {
        return scenesToSet.push(function(cb) {
          return setLightState(id, state, cb);
        });
      };
      for (id in _ref1) {
        state = _ref1[id];
        _fn1(id, state);
      }
      currentScene = 'relax';
    }
    return async.parallelLimit(scenesToSet, 4, function(err, res) {
      console.log('done setting lights, got');
      console.log('\terror:', err);
      return console.log('\tresults:', res);
    });
  });

}).call(this);
