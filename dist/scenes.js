(function() {
  var bedtime, home, relax;

  home = {
    1: {
      on: true,
      bri: 254,
      ct: 343
    },
    2: {
      on: true,
      bri: 254,
      ct: 343
    },
    3: {
      on: true,
      bri: 254,
      ct: 343
    },
    4: {
      on: false
    },
    5: {
      on: false
    },
    6: {
      on: false
    }
  };

  relax = {
    1: {
      on: false
    },
    2: {
      on: true,
      ct: 467,
      bri: 254
    },
    3: {
      on: false
    },
    4: {
      on: true,
      ct: 369,
      bri: 254
    },
    5: {
      on: false
    },
    6: {
      on: true,
      xy: [0.6130, 0.3771],
      bri: 254
    }
  };

  bedtime = {
    1: {
      on: false
    },
    2: {
      on: false
    },
    3: {
      on: false
    },
    4: {
      on: true,
      bri: 141,
      ct: 400
    },
    5: {
      on: false
    },
    6: {
      on: false
    }
  };

  module.exports.home = home;

  module.exports.relax = relax;

  module.exports.bedtime = bedtime;

}).call(this);
