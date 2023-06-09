import Users from "../models/userModel.js";
import bcrypt from "bcrypt";

export const getAllUsers = async(req,res)=>{
     try {
          const users = await Users.findAll({});
          res.json(users)
     } catch (error) {
          console.log(error);
     }
}


export const Register = async(req, res)=> {
     const {name, email, password, confPassword, isAdmin} = req.body;
     if(password !== confPassword){
          return res.json("پسوورد و تکرار آن با هم برابر نیست.")
     }
     const salt = await bcrypt.genSalt();
     const hashPassword = await bcrypt.hash(password, salt)
     try {
      await Users.create({
           name: name,
           email: email,
           password: hashPassword,
           isAdmin: isAdmin
      })  
      res.json({message: "ثبت نام موفقیت آمیز بود"})
     } catch (error) {
          console.log(error);
     }
}