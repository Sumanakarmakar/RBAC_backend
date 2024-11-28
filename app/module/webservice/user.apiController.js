const path = require("path");
const jwt = require("jsonwebtoken");
const userRepository = require("../admin/user/repository/user.repository");
const hashPassword = require("../../helper/hashPassword");
const { UserSchemaValidate } = require("../admin/user/model/user.model");
const comparePassword = require("../../helper/comparePassword");

class UserApiController {
  //create user
  async registration(req, res) {
    try {
      const {
        name,
        email,
        phone,
        password,
        first_school,
        city,
        state,
        roleId,
      } = req.body;

      //validation
      if (
        !name ||
        !email ||
        !phone ||
        !password ||
        !first_school ||
        !city ||
        !state ||
        !roleId
      ) {
        return res.status(500).json({
          message: "All fields are required",
        });
      }
      //check duplicate email
      const existingEmail = await userRepository.findOne({ email });
      if (existingEmail) {
        return res.status(500).json({
          message: "Email already registered, Please Login",
        });
      }

      const hashpassword = await hashPassword(password);
      const userdata = {
        name,
        email,
        phone,
        address: {
          city,
          state,
        },
        password: hashpassword,
        first_school,
        roleId,
      };

      if (req.file) {
        userdata.profile_pic = req.file.path;
      }

      //validating the request
      const { error, value } = UserSchemaValidate.validate(userdata);
      //   console.log("ll", value);
      if (error) {
        res.status(500).json({
          message: error.message,
        });
      } else {
        //call the create post function in the service and pass the data from the request
        const savedUserdata = await userRepository.save(value);
        // console.log(savedUserdata);

        if (savedUserdata) {
          res.status(201).json({
            message: "User registration successful",
            data: savedUserdata,
          });
        } else {
          res.status(500).json({
            message: "Internal Server Error",
          });
        }
      }
    } catch (err) {
      console.log(`Error in creating user: ${err}`);
    }
  }

  //user login
  async loginUser(req, res) {
    try {
      const { email, password } = req.body;

      //validation
      if (!email || !password) {
        return res.status(500).json({
          message: "Invalid email or password",
        });
      }

      //validate if user exist in database
      const user = await userRepository.findOne({ email });
      if (!user) {
        return res.status(500).json({
          message: "Email does not exist",
        });
      }

      const matchPassword = await comparePassword(password, user.password);
      if (!matchPassword) {
        return res.status(500).json({
          message: "Password is not matched",
        });
      }

      if (user && matchPassword) {
        //create token
        const token = jwt.sign(
          {
            id: user._id,
            roleId: user.roleId,
            name: user.name,
            email: user.email,
            phone: user.phone,
            first_school: user.first_school,
            city: user.address.city,
            state: user.address.state,
            profile_pic: user.profile_pic,
            actions: user.actions,
            
          },
          process.env.JWT_SECRET,
          { expiresIn: "12h" }
        );
        // console.log("token", token);

        if (token) {
          res.cookie("userToken", token);
          res.status(201).json({
            status: 200,
            message: "User Login Successful",
            data: user,
            token: token,
          });
        } else {
          res.status(500).json({
            message: "Login failed",
          });
        }
      }
    } catch (err) {
      console.log(`Error in login user ${err}`);
    }
  }


  //get all users
  async allUsers(req,res){
    try {
      const alldata=await userRepository.getAllUsers()
      if(alldata){
        res.status(200).json({
          message: "All users fetched successfully",
          data: alldata
        })
      }else{
        res.status(500).json({
          message: "Internal Server Error",
        })
      }
    } catch (error) {
      console.log(`Error in getting all users ${error}`);
      
    }
  }

  
}

module.exports = new UserApiController();
