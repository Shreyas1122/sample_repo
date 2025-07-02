

const db=require('../dbconnect/databaseconnect')
const dbclass=class Citizenform{
    Citizenform(){

    }

constructor(email,password,path){
this.email=email;
this.password=password;
this.image=path;

  }

//auto increment of id 


  async insertdata(){
    const databse=db.getdb();
    return databse.collection('shreyastest').insertOne(this)
  }

  fetchdata(){
    const database=db.getdb();
    return database.collection('shreyastest').find().toArray();
  }


}
module.exports=dbclass;