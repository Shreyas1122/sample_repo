
const database=require('../dbconnect/databaseconnect');
const dbclass=require('../model/simpleformodel');
const cloudinary=require('cloudinary');
const express=require('express');
const fs = require('fs');
const path = require("path");
const admin=require('firebase-admin');
const supabase = require('../firstserver');
const { error, Console } = require('console');
const {createClient} = require('@supabase/supabase-js');
const imagekit=require('../imagekit');
const bcryptjs=require('bcryptjs');

const { hash } = require('crypto');










 const Register= async(req,res,next)=>{

  try{
  console.log("You are visisted to the register psge dear");
  console.log(req.body);
  

  const name=req.body.Name;
  const Aadhar_no=req.body.Aadhar_Number;
  const City=req.body.City;
  const username=req.body.username;
  const password=req.body.password;
  const email=req.body.email;
var dataarray=[];
  const obj1=new dbclass();
  
  obj1.fetchdata().then(async (homeobject)=>{
  
    if(homeobject.length !== null){
     console.log("object came with some value ");
     console.log(homeobject);
     dataarray=homeobject;
     console.log(Aadhar_no);
     console.log(email);

    const decision= dataarray.some(element => {
      if(Aadhar_no == element.Aadhar_Number && email == element.Email ){
      res.status(409).json(
        {
        "success":false,
        "message": "User already registered"}
      );
  return true;
    
      }
      });

      if(decision === true){

        ///user already loginned 
        
        return 
      }
      else{
        const passwordhash=await bcryptjs.genSalt(10);
        const realpassword=await bcryptjs.hash(req.body.password,passwordhash);


      const  abc=new dbclass(name,Aadhar_no,City,username,realpassword,email);
  abc.insertdata();
  res.status(200).json({
    "success":true,
   "message":"user Registered Successfully"
  })}
    
}
    else{
     console.log("Error in Fetching the data from the database");
    }
  });

}catch(Error){
  Console.log("Eror occured While Registration Processs")
}





}

const login=(req,res,next)=>{

  
  try{

    const username=req.body.username;
  const email=req.body.email; 

  var dataarray=[];
  const obj1=new dbclass();

  obj1.fetchdata().then(async (homeobject)=>{
  
    if(homeobject.length !== null){
     console.log("object came with some value ");
     console.log(homeobject);
     dataarray=homeobject;
     console.log(email);

 const dataobject= dataarray.find(element => username === element.username && email === element.Email);

      if(dataobject){
        //valid email and username but checking password 

        // Compare password
const isPasswordValid = await bcryptjs.compare(req.body.password, dataobject.password);

        if(isPasswordValid){
          //valid password and valid all information 
                     res.status(200).json(
        {
        "status": true,
        "message": "user Login Successfuly",
      "userdata": dataobject }
      );

        }
        else{

          //password is incorrect 
             
              res.status(401).json(
        {
        "status": false,
        "message": "incorrect password Given " }
      );

        }

    
        
        
      }
      else{

        //user provided information is not correct and user access denied
        res.status(401).json({
          "message":"Invalid User Information! Access Denied ",
          "status ": false,
        }) 

       return 
      }
    
}
    else{
     console.log("Error in Fetching the data from the database");
    }
  });

}catch(Error){
  console.log("Error occured While Login process");
  console.log(Error);
  res.send("<h1>Error occured while login process </h1>")
}
}
const displaypage=(req,res,next)=>{
  // req.session.isloggedin=true;
  res.render('displaypage',{isloggedin:req.session.isloggedin});
}
const logipage=(req,res,next)=>{

  if(req.session.isloggedin){
    //user is already logged in 
    res.redirect('/home');
  } 
  else{
    res.render('Homepage');
  }
  
}     

posthomepage=(req,res,next)=>{
  const obj1=new dbclass(req.body.email,req.body.password,req.file.path);
   obj1.insertdata();
  console.log(req.body.email);
   console.log(req.body.password);
  req.session.isloggedin=true;
   console.log(req.body);
    console.log(req.file);
  res.redirect('/home');
}

logout=(req,res,next)=>{
  req.session.isloggedin=false;
  res.redirect('/loginpage');
};


fetchimages=async (req,res,next)=>{
   const obj1=new dbclass();
   obj1.fetchdata().then((homeobject)=>{
      if(homeobject.length !== null){
        console.log("object came with some value ");
        console.log(homeobject);
       dataobject=homeobject;
       console.log("the image url is as follows "+ dataobject[0].image);
       res.render("Imagesshow",{dataobject,isloggedin:req.session.isloggedin});
      }
      else{
        console.log("Error in Fetching the data from the database");
        res.status(500).json({
          "success":false,
          "message":"Error in Fetching the data from the database"
        })
      }
   })}


   Downloadpdf=(req,res,next)=>{
    const Pdfname="RulesPDF.pdf";
  const filePath = path.join(__dirname, '../Uploads', Pdfname);
  res.download(filePath, "RulesPDF.pdf");
    
   }

   Updateinformation=(req,res,next)=>{
    const para=req.params.id;
    res.status(200).json({
      "message":"Update information",
      "id":para
    });
   }

   deleteinformation=(req,res,next)=>{
    const para=req.params.id; 
    res.status(200).json({
      "message":"Delete information",
      "id":para
    });
  }


  postnotification=async(req,res,next)=>{
    const { title,body,image,topic } = req.body;
    const message = {
      notification:{
      title: title,
      body: body,
      image: image,
      },
      data: {
    customKey: "customValue",
    click_action: "Android_NOTIFICATION_CLICK" // optional
  },
      topic: topic || "all_users"
    };

    try{
      const response = await admin.messaging().send(message);
      console.log("Message sent successfully:", response);
      res.status(200).json({
        "success":true,
        "message":"Message sent successfully",
        "response": response
      });
    }
    catch(error){
      console.error("Error sending message:", error);
      res.status(500).json({
        "success":false,
        "message":"Error in sending message"
      });
    }


  }

  
module.exports={
  Register,
  login,
  displaypage,
  logipage,
  posthomepage,
  logout,
  fetchimages,
  Downloadpdf,
  Updateinformation,
  deleteinformation,
  postnotification
 
}