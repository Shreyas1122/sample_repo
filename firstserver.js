const express=require('express');
const firstrouter=require('./Routes/simplerouter');
const db=require('./dbconnect/databaseconnect');
const multer=require('multer');
const cloudinary=require('cloudinary')
const path = require("path");
const {createClient} = require('@supabase/supabase-js');
const fs = require('fs');
const admin=require('firebase-admin');
const bodyparser=require('body-parser');
const node=require('node-cron')



///session storing in the mongodb
const session= require('express-session');
const mongodbsession= require('connect-mongodb-session')(session);
const DBPATH="mongodb+srv://shreyas:shreyas@shreyas.8rxrw.mongodb.net/?retryWrites=true&w=majority&appName=shreyas";

const morgan=require('morgan');
const color =require('colors');



// const ImageKit = require("imagekit");

const app=express();

const store=new mongodbsession({
    uri: DBPATH,
    collection: 'sessions'});

//firebase notification code is here 
 
//var serviceAccount = require(path.join(__dirname, 'assets/','shreyas-project-70669-firebase-adminsdk-fbsvc-c3e5b57c7a.json'));

// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount)
// });






const storage = multer.diskStorage({
  destination: function (req, file, cb) { 
    console.log("Inside the destination function of multer");
    cb(null, "Uploads/");
   if (!fs.existsSync(path.join(__dirname, "Uploads/"))) {
     fs.mkdirSync(path.join(__dirname, "Uploads/"), { recursive: true }); // Ensure the folder exists
     }},
     //Date.now() + "-" + file.originalname
    filename: function (req, file, cb) {
    cb(null,"RulesPDF.pdf");}
});
const storageoptions={
  storage
}


//intializing the firebase database 



const database =admin.firestore();



app.use(express.static(path.join(__dirname, "Views")));
app.use(express.urlencoded());
app.use(multer(storageoptions).single('filename'));

app.use(session({
  secret: 'shreyas',
  resave: false,
  saveUninitialized: true,
  store: store,}));

app.set('view engine','ejs');
app.set('views',path.join(__dirname, "./Views"));
app.use("/Uploads", express.static(path.join(__dirname, "Uploads")));
app.use(morgan('dev'));
app.use(express.json({
  extended:true
}))

app.post("/register",firstrouter.Register);
app.post("/login",firstrouter.login);
app.get("/home",firstrouter.displaypage);
app.get("/loginpage", firstrouter.logipage);
app.post("/home", firstrouter.posthomepage);
app.get("/logout", firstrouter.logout);
app.get("/getimg", firstrouter.fetchimages);
app.get("/Download", firstrouter.Downloadpdf);
app.put("/update/:id",firstrouter.Updateinformation);
app.delete("/delete/:id", firstrouter.deleteinformation);
app.post("/postnotification", firstrouter.postnotification);






const port=process.env.PORT || 2003;


app.listen(port,()=>{
node.schedule("* * * * * *", () => {
  console.log("Running a task every day at midnight");});
  db.connection();
  console.log("The server started successfully dear");
  console.log("firebase admin initialized successfully".green.bold);
    });

  

   