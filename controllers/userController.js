const User = require("../models/user");
const { forgotpasswordMail } = require("../config/mail");
const { Sequelize } = require("sequelize");
require("dotenv").config();

const SECRET_KEY = process.env.JWT;

const {
  generateHasePassword,
  verifyPassword,
} = require("../config/hash_password");
const { generateToken } = require("../config/auth");

const register = async (req, res) => {
  try {
    let user = await User.findOne({
      where: {
        email: req.body.email,
      },
    });
    if (user) {
      return res.status(400).json({
        error: "user alredy exit",
      });
    }
    req.body.password = await generateHasePassword(req.body.password);
    console.log(req.body);
    user = await User.create(req.body);
    res.status(200).json({
      message: "successfully registered",
      user,
    });
  } catch (error) {
    if (error instanceof Sequelize.ValidationError) {
      return res.status(400).json({ error: "Validation error" });
    }
    res.status(500).json({ error });
  }
};
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ error: "email and password both are required" });
    }
    let user = await User.findOne({
      where: {
        email: email,
      },
    });
    if (!user) {
      return res.status(400).json({ error: "email does not exist" });
    }
    const isMatch = await verifyPassword(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "password does not match" });
    }
    if (!user.status) {
      return res.status(400).json({ message: "wait for Admin Approval" });
    }
    const payLoad = {
      id: user.id,
      email: user.email,
      role: user.role,
    };
    const token = await generateToken(payLoad, SECRET_KEY);
    res.status(200).json({ message: "Login successfully", token });
  } catch (error) {
    res.status(500).json({ error });
  }
};

const forgotpassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: "email is required" });
    }
    const user = await User.findOne({
      where: {
        email: email,
      },
    });
    if (!user) {
      return res.status(400).json({ error: "email does not exist" });
    }
    const payload = {
      id: user.id,
      email: user.email,
    };

    const token = await generateToken(payload, process.env.FORGOT_KEY, "1h");
    const mailOptions = {
      from: "sagarsenjaliya423@gmail.com",
      to: email,
      subject: "password by cafe management",
      html: `
      <p>
      <b>Dear ${user.name},</b>
    </p>
    <p>
      We received a request to reset your password for your Cafe Management System account.
    </p>
    <p>
      <b>Account Details:</b><br>
      <b>Name:</b> ${user.name}<br>
      <b>Email:</b> ${user.email}<br>
      <b>Role:</b> ${user.role}
    </p>
    <p>
      Please click the link below to reset your password:
    </p>
    <p>
      <a href="http://localhost:4200/reset-password/${token}">Click here to reset your password</a>
    </p>
    <p>
      This link will expire in 5 minutes. If you did not request a password reset, please ignore this email.
    </p>
    <p>
      Thank you,<br>
      The Cafe Management Team
    </p>
    `,
    };
    forgotpasswordMail(mailOptions);
    res.status(200).json({ message: "check your mail" });
  } catch (error) {
    res.status(500).json({ error });
  }
};

const reset_password = async (req, res) => {
  try {
    const { new_password } = req.body;
    if (!new_password) {
      return res.status(400).json({ error: "password is required" });
    }
    const { id, email } = req.local;
    console.log(id, new_password);
    await User.update(
      {
        password: await generateHasePassword(new_password),
      },
      { where: { id } }
    );
    res.status(200).json({
      message: "password update successufully",
    });
  } catch (error) {
    if (error instanceof Sequelize.ValidationError) {
      return res.status(400).json({ error: "Validation error" });
    }
    res.status(500).json({ error });
  }
};

const changePassword = async(req,res)=>{
    try {
        const {old_password,new_password} = req.body;
        const {email} = req.local;
        const user = await User.findOne({
          where:{email}
        })
 
        if (!user) {
          return res.status(404).json({ error: "User not found" });
        }
        const isMatch = await  verifyPassword(old_password,user.password);
        if(!isMatch) return res.status(400).json({error : "old_password incorrect"})
        user.password = await generateHasePassword(new_password);
      
        await user.save();
        res.status(200).json({message : "password updated successfully"})
        
    } catch (error) {
      if (error instanceof Sequelize.ValidationError) {
        return res.status(400).json({ error: "Validation error" });
      }
      res.status(500).json({ error: "internal server error"});
    } 
}

const allUser = async (req, res) => {
  try {
    let users = await User.findAll({
      where: {
        role: "user",
      },
    });

    users = users.map((user) => {
      return {
        id: user.id,
        name: user.name,
        email: user.email,
        contactNumber: user.contactNumber,
        status: user.status,
      };
    });
    res.status(200).json({
      users,
    });
  } catch (error) {
    res.status(500).json({
      error: "internal server error",
    });
  }
};

const activeOrUnactive = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findOne({ where: { id } });

    if (!user) {
      return res.status(400).json({ error: "User does not exist" });
    }

    await User.update({ status: !user.status }, { where: { id } });
    // Fetch the updated user
    const updatedUser = await User.findOne({ where: { id } });

    let message;
    if (updatedUser.status) {
      message = "User activated successfully";
    } else {
      message = "User deactivated successfully";
    }

    res.status(200).json({ message });
  } catch (error) {
    console.error("Error in activeOrUnactive:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const logOut = async (req, res) => {
  try {
    console.log(req.body);
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  register,
  login,
  forgotpassword,
  reset_password,
  changePassword,
  allUser,
  activeOrUnactive,
  logOut,
};
