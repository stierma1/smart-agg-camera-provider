var CameraProvider = require("./lib/camera");

module.exports = function(config){
  return new CameraProvider(config);
};
