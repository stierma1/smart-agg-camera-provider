var childProcess = require("child_process");
var exec = childProcess.exec;
var Bluebird = require("bluebird");


function CameraProvider(config){
  this.id = config.id;
  this.devicePath = config.devicePath || "/dev/video0";
  this.resolution = config.resolution || "160x120";
  this.banner = config.banner || false;
  this.intervalTime = config.interval || 1000;
  this.client = null;
  this.interval = null;
}

CameraProvider.prototype.addTo = function(app){
  var self = this;
  this.client = app.createClient(this.id);
  this.client.updatePredicate("initialized(Type)", ["CameraProvider"], this.id);
  this.performTakePhoto();
  this.interval = setInterval(function(){
    self.performTakePhoto();
  }, this.intervalTime)
}

CameraProvider.prototype.performTakePhoto = function(){
  var self = this;
  this.takePhoto()
    .then(function(data){
      self.client.updatePredicate("action(ActionId, TimeStamp)", ["TakePhoto", Date.now()], data);
    })
    .catch(function(err){
      self.client.updatePredicate("error(ActionId, TimeStamp)", ["TakePhoto", Date.now()], err);
    });
}

CameraProvider.prototype.takePhoto = function(){
    var defer = Bluebird.defer();
    exec("fswebcam -d " + this.devicePath + " -r " + this.resolution + " --no-banner --save '-'", function(err, stdout, stderr) {
        if(err){
          defer.reject(err);
          return;
        }
        var imageBase64 = new Buffer(stdout).toString('base64');
        defer.resolve(imageBase64);
    });

    return defer.promise;
}

module.exports = CameraProvider;
