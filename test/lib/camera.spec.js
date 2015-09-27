
var CameraProvider = require("../../lib/camera");
var chai = require("chai");
chai.should();

describe("#camera", function(){
  var upData = null;
  var app = {
    createClient: function(id){
      return {
        updatePredicate: function(pred, groundings, data){
          upData = {pred:pred, groundings:groundings, data:data};
        }
      }
    }
  };

  afterEach(function(){
    upData = null;
  });

  it("should create CameraProvider", function(){
    var camera = new CameraProvider({id:"test"});
    camera.id.should.equal("test");
  });

  it("should addTo application", function(){
    var camera = new CameraProvider({id:"test"});
    camera.addTo(app);
    upData.pred.should.equal("initialized(Type)");
  });

  it("should takePhoto", function(done){
    var camera = new CameraProvider({id:"test"});
    camera.addTo(app);
    setTimeout(function(){
      console.log(upData);
      done();
    }, 1000)

  });
})
