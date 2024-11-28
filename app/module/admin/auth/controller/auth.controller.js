const { default: mongoose } = require("mongoose");
const comparePassword = require("../../../../helper/comparePassword");
const userRepository = require("../../user/repository/user.repository");
const jwt = require("jsonwebtoken");

class AuthController {
  //for auth check
  async authcheckUser(req, res, next) {
    // console.log("ab",res);

    if (req.admin) {
      // console.log("after login user", req.admin);
      next();
    } else {
      console.log("Error While User Auth");
      res.redirect("/admin");
    }
  }

  async dashboard(req, res) {
    try {
      var msz = req.flash("message");
      res.render("dashboard", {
        title: "Admin Dashboard",
        data: req.admin,
        msz,
      });
    } catch (error) {
      console.log(error);
    }
  }

  //user login page
  async loginPage(req, res) {
    try {
      var msz = req.flash("message");
      res.render("login", {
        title: "Admin Login",
        data: req.admin,
        msz,
      });
    } catch (err) {
      console.log(`Error in getting login page ${err}`);
    }
  }

  //admin login
  async adminLogin(req, res) {
    try {
      const { email, password } = req.body;

      //validation
      if (!email || !password) {
        req.flash("message", "Invalid email or password");
        res.redirect("/admin");
      }

      //validate if user exist in database
      const user = await userRepository.findOne({ email });
      if (!user) {
        req.flash("message", "Email does not exist");
        res.redirect("/admin");
      }

      const matchPassword = await comparePassword(password, user.password);
      if (!matchPassword) {
        req.flash("message", "Incorrect Password Detected");
        res.redirect("/admin");
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
            city: user.address.city,
            state: user.address.state,
            first_school: user.first_school,
            profile_pic: user.profile_pic,
            role: user.role,
          },
          process.env.JWT_SECRET,
          { expiresIn: "12h" }
        );

        if (token) {
          res.cookie("adminToken", token);
          req.flash("message", "Logged in Successfully");
          res.redirect("/admin/dashboard");
        } else {
          req.flash("message", "Login Failed");
          res.redirect("/admin");
        }
      }
    } catch (err) {
      console.log(`Error in login admin ${err}`);
    }
  }

  //for logout
  async logout(req, res) {
    try {
      req.flash("message", "Logged out successfully");
      res.clearCookie("adminToken");
      res.redirect("/admin");
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = new AuthController();
