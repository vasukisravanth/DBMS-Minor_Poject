require('dotenv').config();
const express =require('express');
const bodyParser = require('body-parser');
const ejs=require('ejs');
const mongoose=require("mongoose");
const app=express();
const md5=require('md5');
var items=["Buy food","Cook food","Eat food"];
var vehicles=[];
var workItems=[];
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
console.log(process.env.API_KEY);
mongoose.connect("mongodb://localhost:27017/rentalDB",{useNewUrlParser:true});

const userSchema=new mongoose.Schema({
    email:String,
    password:String
});

const usercSchema= new mongoose.Schema({
    email:String,
    password:String,
    name:String,
    address:String,
    phonenumber:String

});

const vehicleSchema={
    modelName:String,
    carYear:String,
    carNo:String,
    carTrans:String,
    carRate:Number
};
const availVehicleSchema={
    modelName:String,
    carYear:String,
    carNo:String,
    carTrans:String,
    carRate:Number
};
const userDetailSchema=new mongoose.Schema({
    userEmail:String,
    userName:String,
    userAdress:String,
    userPhonenumber:String,
    modelName:String,
    carNumber:String
});
let vehicleList=[];
let availVehicleList=[];
const User=new mongoose.model("User",userSchema);
const Userc=new mongoose.model("Userc",usercSchema);
const Vehicle=new mongoose.model("Vehicle",vehicleSchema);
const AvailVehicle=new mongoose.model("AvailVehicle",vehicleSchema);
const UserDetail=new mongoose.model("UserDetail",userDetailSchema);
app.get("/",function(req,res){
    res.render("homepage");
});

app.get("/loginhome",function(req,res){
    res.render("loginhome");
});

app.get("/homec",function(req,res){

    res.render("homec");
});

app.get("/login",function(req,res){
  res.render("login");
});
app.get("/homepage",function(req,res){
    res.render("homepage");
  });
  app.get("/loginc",function(req,res){
    res.render("loginc");
  });
  app.get("/registerc",function(req,res){
    res.render("registerc");
  });


const newUser=new User({
    email:"defg",
    password:md5("defg")
});
newUser.save(function(err){
    if(err){
        console.log(err);
    }
    else{
        console.log('Success');
    }
});
app.post("/login",function(req,res){
    const username=req.body.username;
    const password=md5(req.body.password);

   User.findOne({email:username},function(err,foundUser){
       if(err){
           console.log(err);
       }else{
           if(foundUser){
               if(foundUser.password===password){
                   res.redirect("/home");
               }
           }
       }
   })

});
app.get("/home",function(req,res){

 Vehicle.find({},function(err,vehicleList){
        if(vehicleList.length>0)
        {
            res.render("home",{newListItems:vehicleList});
        }
        if(err)
        {
            console.log(err);
        }
        else{
            console.log("Successfully shown");
        }
    });

});
app.get("/customer",function(req,res){
    AvailVehicle.find({},function(err,availVehicleList){
        if(availVehicleList.length>0)
        {
            res.render("customer",{newListItems:availVehicleList});
        }
        else
        {
            res.render("customer",{newListItems:"No vehicles are available"});
        }
        if(err)
        {
            console.log(err);
        }
        else{
            console.log("Successfully customer list shown");
        }
    });

});
app.get("/add",function(req,res){
    res.render("add");
});
app.post("/add",function(req,res){
    const vehDetails={
        modelName:req.body.modelName,
        carYear:req.body.carYear,
        carNo:req.body.carNo,
        carTrans:req.body.carTrans,
        carRate:req.body.carRate

    };
    const vehicle=new Vehicle({
        modelName:vehDetails.modelName,
        carYear:vehDetails.carYear,
        carNo:vehDetails.carNo,
        carTrans:vehDetails.carTrans,
        carRate:vehDetails.carRate
    });
    vehicle.save();
    res.redirect("/home");
});
app.post("/delete",function(req,res){
    const vehicleId=req.body.deleted;
    Vehicle.findByIdAndRemove(vehicleId,function(err){
        if(!err){
            console.log("successfully deleted");
            res.redirect("/home");
        }
        else{
            console.log(err);
        }
    })
});
app.post("/addTo",function(req,res){
    const vehicleId=req.body.addTo;
    
    Vehicle.findById(vehicleId,function(err,avl){
        if(!err){
            AvailVehicle.exists({name:avl.modelName},function(err,doc){
             if(!err){
                if(!doc)
                {
                    const availvehicle=new AvailVehicle({
                        modelName:avl.modelName,
                        carYear:avl.carYear,
                        carNo:avl.carNo,
                        carTrans:avl.carTrans,
                        carRate:avl.carRate 
                    });
                availvehicle.save();
                }
            }
            });
        }
      });
    res.redirect("/home");
});
app.post("/registerc",function(req,res){

    var newUser=new Userc({
    email:req.body.cusername,
    password:md5(req.body.cpassword),
    name:req.body.cname,
    address:req.body.caddress,
    phonenumber:req.body.cpno
    });
    newUser.save();
    res.redirect("/customer");
  });
var username;
  app.post("/loginc",function(req,res){
    username=req.body.username;
    const password=md5(req.body.password);

    Userc.findOne({email:username},function(err,foundUser){
        if(err){
            console.log(err);
        }
          else{if(foundUser){
              if(foundUser.password===password){
                res.redirect("/customer");
            }
          }

        }

    });
});
const userDetails1=[];
app.get("/users",function(req,res){
    UserDetail.find({},function(err,userDetails1){
          if(userDetails1.length>0)
          {
              res.render("users",{newListItems:userDetails1});
          }
          if(err){
              console.log(err);
          }
    })
    res.render("users",{newListItems:userDetails1});
});
app.post("/select",function(req,res){
    const vehicleId=req.body.Select;
    console.log(username);
    const vehicleDetails=[];
    AvailVehicle.findById(vehicleId,function(err,avl){
        if(avl){
        Userc.find({email:username},function(error,user){
            if(error){
                console.log(error);
            }
              else{if(user){
                  const userdetails=new UserDetail({
                      userEmail:user.email,
                      userName:user.name,
                      userAdress:user.adress,
                      userPhonenumber:user.phonenumber,
                      modelName:avl.modelName,
                      carNumber:avl.carNo

                  });
                  userdetails.save();
                }
              }
            
        });
    }

    });
    res.redirect("/users");
});

app.listen(3000,function(){
    console.log("Server started on posrt 3000");
});