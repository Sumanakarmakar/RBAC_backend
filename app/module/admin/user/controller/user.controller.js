const path = require("path");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const userRepository = require("../repository/user.repository");
const roleRepository = require("../../role/repository/role.repository");
const hashPassword = require("../../../../helper/hashPassword");
const { UserSchemaValidate } = require("../model/user.model");

class UserController {
  //for all users
  async allUsersPage(req, res) {
    try {
      var msz = req.flash("message");
      const alluserdata = await userRepository.getAllUsers();
      res.render("user/listUser", {
        title: "Users Page",
        data: req.admin,
        alluserdata,
        msz,
      });
    } catch (error) {
      console.log(`Error in getting all users ${error}`);
    }
  }

  //for adding user
  async addUserPage(req, res) {
    const roledata = await roleRepository.find();
    try {
      const msz = req.flash("message");
      res.render("user/addUser", {
        title: "Add User",
        data: req.admin,
        roledata,
        msz,
      });
    } catch (error) {
      console.log(error);
    }
  }

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
          req.flash("message", "User created successfully");
          res.redirect("/admin/users");
          // res.status(201).json({
          //   message: "User registration successful",
          //   data: savedUserdata,
          // });
        } else {
          req.flash("message", "Error detected in creating user");
          res.redirect("/admin/adduser");
          // res.status(500).json({
          //   message: "Internal Server Error",
          // });
        }
      }
    } catch (err) {
      console.log(`Error in creating user: ${err}`);
    }
  }

  //for removing product
  async deleteUser(req, res) {
    try {
      const id = req.params.id;
      const existingUser = await userRepository.findById(id);

      fs.unlink(
        "./uploads/user/" + path.basename(existingUser.profile_pic),
        (error) => {
          console.log(`Error in removing old pics ${error}`);
        }
      );

      const deletedUserData = await userRepository.findByIdAndDelete(id);
      if (deletedUserData) {
        req.flash("message", "User Data Removed Successfully");
        res.redirect("/admin/users");
      } else {
        throw new Error("User is not removed");
      }
    } catch (err) {
      console.log(`Error in removing user ${err}`);
    }
  }
}

module.exports = new UserController();
