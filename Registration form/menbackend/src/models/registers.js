const mongoose = require("mongoose");
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

const employeeSchema = new mongoose.Schema({
    firstname :{
        type:String,
        required:true
    },
    lastname :{
        type:String,
        required:true
    },
    email :{
        type:String,
        required:true,
        unique:true
    },
    phone:{
        type:Number,
        required:true,
        uniqur:true
    },
    password :{
        type:String,
        required:true
    },
    confirmpassword :{
        type:String,
        required:true
    },
    tokens:[{
        token:{
            type:String,
            required:true
        }
    }]

})

//generating token
employeeSchema.methods.generateAuthToken = async function(){
    try {
        const token = jwt.sign({_id:this._id.toString()},process.env.SECRET_KEY);
        this.tokens = this.tokens.concat({token:token})
        await this.save();
        return token;
    } catch (error) {
        console.log(error);
    }
}

//hashing code
employeeSchema.pre("save",async function(next) {
    
    try{
        if(this.isModified("password")){
            //const passwordHash = await bcrypt.hash(password,10)
            this.password = await bcrypt.hash(this.password,10);
        }
        next();
    }
    catch(err){
        console.log("Error");
    }
})

const Register = new mongoose.model("Register",employeeSchema);

module.exports = Register;


