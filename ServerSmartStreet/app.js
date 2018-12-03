
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , mongo = require('./routes/mongo.js')
  , mongoURL = "mongodb://shraddha:shraddha1@ds163226.mlab.com:63226/smartstreet"
  , cors = require('cors')
  , dateFormat= require('dateformat')
  , path = require('path');

var app = express();

// all environments
var corsOptions = {
    origin: 'http://localhost:3000',
    credentials: true,
     optionsSuccessStatus: 200
}
app.use(cors(corsOptions))
app.set('port', process.env.PORT || 4000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/users', user.list);

app.get('/kaipn',function(req,res){
  res.status(200).send({"Msg":"Ek tari API jamla"});
});

app.get('/getAll',function(req,res){
  mongo.connect(mongoURL,function(){
    var coll = mongo.collection('clusterNode');
    var obj={};
    coll.find({}).toArray(function(err, result) {
        if(err){
          res.status(400).send({});
        }
        obj["clusterNode"]=result;
        coll= mongo.collection('smartNode');
        coll.find({}).toArray(function(err1, result1) {
            if(err1){
              res.status(400).send({});
            }
            obj["smartNode"]=result1;
            coll=mongo.collection('sensorNode');
            coll.find({}).toArray(function(err2, result2) {
                if(err2){
                  res.status(400).send({});
                }
                obj["sensorNode"]=result2;
                res.status(200).send(obj);
            });
          });
      });
    });
});
//sensorNode

app.post('/add/sensorNode',function(req,res){
  mongo.connect(mongoURL, function () {
              console.log('Connected to mongo at: ' + mongoURL);
              var coll = mongo.collection('sensorNode');
              var id=1;
              var latitude="";
              var longitude="";
              var numOfNodes="";
              var withinCluster="";
              var commNode="";
              var type="";
              var status="";
              var now=new Date();
              var dateStr=dateFormat(now, "fullDate").split(",").join("");
              dateStr=dateStr+" "+dateFormat("longTime");
              console.log(dateStr);
              var timestamp=dateStr;
              timestamp=dateFormat(now, "fullDate");

              if(req.body){
                if(req.body.latitude){
                  latitude=req.body.latitude;
                }

                if(req.body.longitude){
                  longitude=req.body.longitude;
                }

                if(req.body.numOfNodes){
                  numOfNodes=req.body.numOfNodes;
                }

                if(req.body.status){
                  status=req.body.status;
                }

                if(req.body.withinCluster){
                  withinCluster=req.body.withinCluster;
                }

                if(req.body.commNode){
                  commNode=req.body.commNode;
                }

                if(req.body.type){
                  type=req.body.type;
                }
              }
              coll.find({}).toArray(function(err, result) {
                  if (err){
                    res.status(400).send({"message":"Problem with DB read operation"});
                  }
                  if(result.length){
                    if(parseInt(result[result.length-1]["id"])){
                      id=result[result.length-1]["id"];
                      id++;
                    }


                  }
                  console.log(timestamp);
                  coll.insertOne({"id":id,"timestamp":timestamp,updatedTimestamp:timestamp,"type":type,"status":status,"latitude":latitude,"longitude":longitude,"withinSmartNode":commNode,"withinCluster":withinCluster},function(err,result){
                    if(err){
                      res.status(400).send({"message":"Problem with DB read operation"});
                    }
                    else{
                      res.status(200).send({"message":"Cluster Node Successfully Added","1":result});
                    }
                    });
              });



            });
});


app.post('/delete/sensorNode',function(req,res){
  mongo.connect(mongoURL,function(){
    var coll=mongo.collection('sensorNode');
    var id=parseInt(req.body.id);
    coll.remove({"id":id},function(err,result){
      if(err){
        res.status(400).send({"message":"Problem with executing delete operation on the database"});
      }
      res.status(200).send({"message":"Successfully deleted sensor node","result":result});
    });
  });
});

app.post('/update/sensorNode',function(req,res){
  var t="";
  mongo.connect(mongoURL,function(){
    var coll = mongo.collection('sensorNode');
    var obj={};
    coll.find({id:req.body.id}).toArray(function(err, result) {
        if(err){
          res.status(400).send({});
        }
        t=result[0]["timestamp"];
        var coll1=mongo.collection('sensorNode');
        var id=req.body.id;
        var status=req.body.status;
        var latitude=req.body.latitude;
        var longitude=req.body.longitude;
        var now=new Date();
        var dateStr=dateFormat(now, "fullDate").split(",").join("");
        dateStr=dateStr+" "+dateFormat("longTime");
        console.log(dateStr);
        var timestamp=dateStr;
        timestamp=dateFormat(now, "fullDate");
        var type=req.body.type;
        var withinCluster=req.body.withinCluster;
        var commNode=req.body.commNode;
        coll1.updateOne({"id":parseInt(id)},{"id":parseInt(id),"timestamp":t,"updatedTimestamp":timestamp,"type":type,"status":status,"latitude":latitude,"longitude":longitude,"withinSmartNode":commNode,"withinCluster":withinCluster}, function(err1, result1) {
        if (err1){
          res.status(400).send({"message":"Problem with executing delete operation on the database"});
        }
        res.status(200).send({"message":"Successfully updated","result":result1});
        });
    //  })
      });
    });


  //mongo.connect(mongoURL,function(){

});

//smartNode

app.post('/add/smartNode',function(req,res){
  mongo.connect(mongoURL, function () {
              console.log('Connected to mongo at: ' + mongoURL);
              var coll = mongo.collection('smartNode');
              var id=1;
              var latitude="";
              var longitude="";
              var numOfNodes="";
              var commNode="";
              var now=new Date();
              var dateStr=dateFormat(now, "fullDate").split(",").join("");
              dateStr=dateStr+" "+dateFormat("longTime");
              console.log(dateStr);
              var timestamp=dateStr;
              timestamp=dateFormat(now, "fullDate");
              var withinCluster="";
              var status="";
              if(req.body){
                if(req.body.latitude){
                  latitude=req.body.latitude;
                }

                if(req.body.longitude){
                  longitude=req.body.longitude;
                }

                if(req.body.status){
                  status=req.body.status;
                }

                if(req.body.numOfNodes){
                  numOfNodes=req.body.numOfNodes;
                }

                if(req.body.commNode){
                  commNode=req.body.commNode;
                }

                if(req.body.withinCluster){
                  withinCluster=req.body.withinCluster;
                }
              }
              coll.find({}).toArray(function(err, result) {
                  if (err){
                    res.status(400).send({"message":"Problem with DB read operation"});
                  }
                  if(result.length){
                    if(parseInt(result[result.length-1]["id"])){
                      id=result[result.length-1]["id"];
                      id++;
                    }
                  }
                  coll.insertOne({"id":id,"latitude":latitude,"timestamp":timestamp,updatedTimestamp:timestamp,"longitude":longitude,"status":status,"commNode":commNode,"withinCluster":withinCluster},function(err,result){
                    if(err){
                      res.status(400).send({"message":"Problem with DB read operation"});
                    }
                    else{
                      res.status(200).send({"message":"Cluster Node Successfully Added","1":result});
                    }
                    });
              });



            });
});

app.post('/delete/smartNode',function(req,res){
  mongo.connect(mongoURL,function(){
    var coll=mongo.collection('smartNode');
    var id=parseInt(req.body.id);
    coll.remove({"id":id},function(err,result){
      if(err){
        res.status(400).send({"message":"Problem with executing delete operation on the database"});
      }
      res.status(200).send({"message":"Successfully deleted smart node","result":result});
    });
  });
});


app.post('/update/smartNode',function(req,res){
  var t="";
  mongo.connect(mongoURL,function(){
    var coll = mongo.collection('smartNode');
    var obj={};

    coll.find({id:req.body.id}).toArray(function(err, result) {
        if(err){
          res.status(400).send({});
        }
        t=result[0]["timestamp"];
        console.log(req.body);
        var coll1=mongo.collection('smartNode');
        var id=req.body.id;
        var status=req.body.status;
        var latitude=req.body.latitude;
        var longitude=req.body.longitude;
        var type=req.body.type;
        var withinCluster=req.body.withinCluster;
        var commNode=req.body.commNode;
        var now=new Date();
        var dateStr=dateFormat(now, "fullDate").split(",").join("");
        dateStr=dateStr+" "+dateFormat("longTime");
        console.log(dateStr);
        var timestamp=dateStr;
        timestamp=dateFormat(now, "fullDate");

        coll1.updateOne({"id":parseInt(id)},{"id":parseInt(id),"latitude":latitude,"timestamp":t,"updatedTimestamp":timestamp,"longitude":longitude,"status":status,"commNode":commNode,"withinCluster":withinCluster}, function(err1, result1) {
        if (err1){
          res.status(400).send({"message":"Problem with executing delete operation on the database"});
        }
        console.log(result1);
        res.status(200).send({"message":"Successfully updated","result":result1});
        });

      });
  });


  //mongo.connect(mongoURL,function(){

//  })
});



//clusterNode

app.post('/update/clusterNode',function(req,res){
  var t="";
  mongo.connect(mongoURL,function(){
    var coll = mongo.collection('clusterNode');
    var obj={};

    coll.find({id:parseInt(req.body.id)}).toArray(function(err, result) {
        if(err){
          res.status(400).send({});
        }
        console.log("get result:"+result);
        t=result[0]["timestamp"];


        var coll1=mongo.collection('clusterNode');
        var id=req.body.id;
        var status=req.body.status;
        var latitude=req.body.latitude;
        var longitude=req.body.longitude;
        var now=new Date();
        var dateStr=dateFormat(now, "fullDate").split(",").join("");
        dateStr=dateStr+" "+dateFormat("longTime");
        console.log(dateStr);
        var timestamp=dateStr;
        timestamp=dateFormat(now, "fullDate");

        var numOfNodes=req.body.commNode;

        coll1.updateOne({"id":parseInt(id)},{"id":parseInt(id),"timestamp":t,"updatedTimestamp":timestamp,"status":status,"latitude":latitude,"longitude":longitude,"communicatingNodes":numOfNodes}, function(err1, result1) {
        if (err1){
          res.status(400).send({"message":"Problem with executing delete operation on the database"});
        }
        res.status(200).send({"message":"Successfully updated","result":result});
        });
      });




    });

  //mongo.connect(mongoURL,function(){

//  })
});

app.post('/delete/clusterNode',function(req,res){
  mongo.connect(mongoURL,function(){
    var coll=mongo.collection('clusterNode');
    var id=parseInt(req.body.id);
    coll.remove({"id":id},function(err,result){
      if(err){
        res.status(400).send({"message":"Problem with executing delete operation on the database"});
      }
      res.status(200).send({"message":"Successfully deleted cluster node","result":result});
    });
});



});

app.post('/add/clusterNode',function(req,res){
  mongo.connect(mongoURL, function () {
              console.log('Connected to mongo at: ' + mongoURL);
              var coll = mongo.collection('clusterNode');
              var id=1;
              var latitude="";
              var longitude="";
              var numOfNodes="";
              var now=new Date();
              var dateStr=dateFormat(now, "fullDate").split(",").join("");
              dateStr=dateStr+" "+dateFormat("longTime");
              console.log(dateStr);
              var timestamp=dateStr;
              timestamp=dateFormat(now, "fullDate");

              var status="";
              if(req.body){
                if(req.body.latitude){
                  latitude=req.body.latitude;
                }

                if(req.body.status){
                  status=req.body.status;
                }


                if(req.body.longitude){
                  longitude=req.body.longitude;
                }

                if(req.body.commNode){
                  numOfNodes=req.body.commNode;
                }
              }
              coll.find({}).toArray(function(err, result) {
                  if (err){
                    res.status(400).send({"message":"Problem with DB read operation"});
                  }
                  if(result.length){
                    if(parseInt(result[result.length-1]["id"])){
                      id=result[result.length-1]["id"];
                      id++;
                    }
                  }
                  coll.insertOne({"id":id,"timestamp":timestamp,updatedTimestamp:timestamp,"status":status,"latitude":latitude,"longitude":longitude,"communicatingNodes":numOfNodes},function(err,result){
                    if(err){
                      res.status(400).send({"message":"Problem with DB read operation"});
                    }
                    else{
                      res.status(200).send({"message":"Cluster Node Successfully Added","1":result});
                    }
                    });
              });



            });
});


http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
