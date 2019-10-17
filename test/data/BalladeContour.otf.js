module.exports = require('./base642bytes')(
    require('fs').readFileSync(__dirname + '/BalladeContour.otf')
);
