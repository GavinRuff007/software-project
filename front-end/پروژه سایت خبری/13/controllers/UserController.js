import Users from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
export const getAllUsers = async (req, res) => {
  try {
    const users = await Users.findAll({});
    res.json(users);
  } catch (error) {
    console.log(error);
  }
};

export const Register = async (req, res) => {
  const { name, email, password, confPassword, isAdmin } = req.body;
  if (password !== confPassword) {
    return res.json("پسوورد و تکرار آن با هم برابر نیست.");
  }
  const salt = await bcrypt.genSalt();
  const hashPassword = await bcrypt.hash(password, salt);
  try {
    const found = await Users.findOne({ where: { email: email } });
    if (found) {
      return res.json("ایمیل قبلا ثبت نام کرده است");
    }
    await Users.create({
      name: name,
      email: email,
      password: hashPassword,
      isAdmin: isAdmin,
    });
    res.json({ message: "ثبت نام موفقیت آمیز بود" });
  } catch (error) {
    console.log(error);
  }
};

export const Login = async (req, res) => {
  try {
    const user = await Users.findAll({
      where: {
        email: req.body.email,
      },
    });
    const match = await bcrypt.compare(req.body.password, user[0].password);
    if (!match) {
      return res.json({ error: "پسوورد اشتباه است" });
    }
    const userId = user[0].id;
    const name = user[0].name;
    const email = user[0].email;
    const isAdmin = user[0].isAdmin;
    const accessToken = jwt.sign(
      { userId, name, email, isAdmin },
      process.env.ACCESS_TOKEN_SECRET,{
           expiresIn: "45s"
      }
    );

    const refreshToken = jwt.sign(
     { userId, name, email, isAdmin },
     process.env.REFRESH_TOKEN_SECRET,{
          expiresIn : "1d"
     }
    )

    await Users.update({refresh_token: refreshToken},{
         where: {
              id: userId,
         }
    })

    res.json({ 
         userId,
          name,
           email,
            isAdmin,
            accessToken,
             msg: "شما با موفقیت وارد شدید" });
  } catch (error) {
    res.json({ error: "کاربر وجود ندارد" });
  }
};
