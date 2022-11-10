const dotenv = require("dotenv").config();
const express = require("express");
const app = express();
const path = require('path')
const hbs = require("hbs");
const {json} = require("express");
const bodyParser = require('body-parser');

const port = process.env.PORT || 3000 ;

require("./db/conn");
const Register = require("./models/registers")

// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({extended:true})); 


const static_path = path.join(__dirname,"../public");
const template_path = path.join(__dirname,"../templates/views");
const partial_path = path.join(__dirname,"../templates/partials");

 app.use(express.json());
 app.use(express.urlencoded({extended:false})); 


app.use(express.static(static_path))
app.set("view engine","hbs");
app.set("views",template_path);
hbs.registerPartials(partial_path);

console.log(process.env.SECRET_KEY);

app.get("/" , (req , res)=>{
    res.render("index");
})

app.get("/login",(req,res)=>{
    res.render("login");
})

app.get("/register",(req,res)=>{
    res.render("register");
})

//create a new database in our database
app.post("/register",async (req,res)=>{
    try {
        const password = req.body.password;
        const cpassword = req.body.confirmpassword;
        if(password===cpassword){
            const registerEmployee = new Register({
                firstname : req.body.firstname,
                lastname : req.body.lastname,
                email : req.body.email,
                phone : req.body.phone,
                password : password,
                confirmpassword :cpassword
            })
            // middle ware 


            console.log(registerEmployee);
            const token = await registerEmployee.generateAuthToken();
           const registered = await registerEmployee.save();
           res.status(201).render("index");
        }else{
            res.send("Password are not matching")
        }
    } catch (error) {
        res.status(400).send(error);
    }
})


// login check 

app.post("/login",async (req, res)=>{
    try {
        const email = req.body.email;
        const password = req.body.password;
       // console.log(`${email} and password-${password}`);
        const userEmail = await Register.findOne({email:email});
       // res.send(userEmail.password);
        //console.log(userEmail);
        const isMatch = bcrypt.compare(password,userEmail.password);
        const token = await registerEmployee.generateAuthToken();
        if(isMatch){
            res.status(201).render("index");
        }
        else{
            res.send("Incorrect password");
        }
    } catch (error) {
        res.status(400).send("Invalid login details")
    }
})

// const bycrypt = require('bcrypt');
// const securePassword = async (password) =>{
//    const passwordHash =  await bycrypt.hash(password,10 );
//     console.log(passwordHash);
// }

const jwt = require("jsonwebtoken");

const createToken = async ()=>{
    const token =  await jwt.sign({_id:"34423523"},"32chara",{
    expiresIn:"200 seconds"
   })
    console.log(token);
}

createToken();




app.listen(port , () =>{
    console.log(`Server is connected at port -${port}`);
})
