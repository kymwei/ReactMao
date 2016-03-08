var express     =   require("express");
var app         =   express();
var bodyParser  =   require("body-parser");
var mongoOp     =   require("./model/mongo");
var router      =   express.Router();
var crypto      =   require('crypto');
var path        =  require('path');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({"extended" : false}));

//app.get('/*', function(req, res){
//    res.sendFile(__dirname + '/index.html');
//});

var rootPath = path.normalize(__dirname);

//app.use(express.static(rootPath + '/app'));

router.get("/",function(req,res){
    res.json({"error" : false,"message" : "Hi Mom!"});
});



//route() will allow you to use same path for different HTTP operation.
//So if you have same URL but with different HTTP OP such as POST,GET etc
//Then use route() to remove redundant code.

router.route("/foods")
    .get(function(req,res) {
        var response = {};
        mongoOp.find({}, function (err, data) {
            // Mongo command to fetch all data from collection.
            if (err) {
                response = {"error": true, "message": "Error fetching data"};
            } else {
                response = {"error": false, "message": data};
            }
            res.json(response);
        })
    })
    .post(function(req,res){
        var db = new mongoOp();
        var response = {};

        if (!req.body.food || !req.body.stars) {
            res.send('food and stars both required');
            return;
        }
        // fetch email and password from REST request.
        // Add strict validation when you use this in Production.
        db.food = req.body.food;

        db.stars = req.body.stars;
        // Hash the password using SHA1 algorithm.
        // https://masteringmean.com/lessons/46-Encryption-and-password-hashing-with-Nodejs
        db.userPassword =
            crypto
                .createHash('sha1')
                .update(req.body.password)
                .digest('base64');

        //crypto.randomBytes(128, function (err, salt) {
        //    if (err) { throw err; }
        //    salt = new Buffer(salt).toString('hex');
        //    crypto.pbkdf2(req.body.pass, salt, 7000, 256,
        //        function (err, hash) {
        //            if (err) { throw err; }
        //            userStore[req.body.user] = {salt : salt,
        //                hash : (new Buffer(hash).toString('hex')) };
        //            res.send('Thanks for registering ' + req.body.user);
        //            console.log(userStore);
        //        });
        //});
        db.addedDate.addToSet(new Date);
        db.save(function(err){
            // save() will run insert() command of MongoDB.
            // it will add new data in collection.
            if(err) {
                response = {"error" : true,"message" : "Error adding data"};
            } else {
                response = {"error" : false,"message" : "Data added"};
            }
            res.json(response);
        });
    });
router.route("/users/:id")
    .get(function(req,res){
        var response = {};
        mongoOp.findById(req.params.id, function(err,data){
            //this will run mongo Query to fetch data bsed on ID
            if(err){
                response = { "error":true, "message":"Error fetching data"};
            }else{
                response = { "error":false, "message": data};
            }
            res.json(response);
        });
    })
    .put(function(req,res){

        //if (!req.body.email || !req.body.password) {
        //    res.send('email and password both required');
        //    return;
        //}
        var response = {};
        // first find out record exists or not
        // if it does then update the record
        mongoOp.findById(req.params.id,function(err,data){
            if(err) {
                response = {"error" : true,"message" : "Error fetching data"};
            } else {
                // we got data from Mongo.
                // change it accordingly.
                if(req.body.food !== undefined) {
                    // case where email needs to be updated.
                    data.food = req.body.food;
                }
                if(req.body.stars !== undefined) {
                    // case where password needs to be updated
                    data.stars = req.body.stars;
                }
                if(req.body.userPassword !== undefined) {
                    // case where password needs to be updated
                    data.userPassword = req.body.userPassword;
                }
                // save the data
                data.save(function(err){
                    if(err) {
                        response = {"error" : true,"message" : "Error updating data"};
                    } else {
                        response = {"error" : false,"message" : "Data is updated for "+req.params.id};
                    }
                    res.json(response);
                })
            }
        });
    })


app.use('/',router);

var rootPath = path.normalize(__dirname);

app.use('/mao', express.static(rootPath));

app.listen(3000);
console.log("Listening to PORT 3000");