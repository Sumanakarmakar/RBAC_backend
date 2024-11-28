const express = require("express");
const productController = require("../../module/admin/product/controller/product.controller");
const uploadProductImage = require("../../helper/ProductImgUpload");
const userController = require("../../module/admin/user/controller/user.controller");
const roleController = require("../../module/admin/role/controller/role.controller");
const UserAuthCheck = require("../../middleware/userAuth");
const authController = require("../../module/admin/auth/controller/auth.controller");
const AdminAuthCheck = require("../../middleware/adminAuth");
const { checkPermission } = require("../../middleware/checkPermission");
const uploadUserImage = require("../../helper/UserImageUpload");

const Router = express.Router();

Router.get("/", authController.loginPage);
Router.post("/login_create", authController.adminLogin);
Router.get(
  "/dashboard",
  AdminAuthCheck,
  authController.authcheckUser,
  authController.dashboard
);
Router.get("/logout", authController.logout);

Router.all("/*", AdminAuthCheck, authController.authcheckUser);

//for roles
Router.get("/addrole",roleController.addRolePage);
Router.post("/role/create", roleController.createRole);
Router.get("/roles", roleController.allRoles);
Router.get("/role/details/:id", roleController.singleRoles);
Router.post("/actions/update/:id", roleController.updateActions);

//for products
Router.get(
  "/products",
  checkPermission("read_record"),
  productController.productPage
);
Router.get(
  "/addproduct",
  checkPermission("create_record"),
  productController.addProductPage
);
Router.post(
  "/product/create",
  uploadProductImage.array("image", 10),
  productController.createProduct
);
Router.get(
  "/product/edit/:id",
  checkPermission("update_record"),
  productController.singleProduct
);
Router.post(
  "/product/update/:id",
  uploadProductImage.array("image", 10),
  productController.updateProduct
);
Router.get(
  "/product/remove/:id",
  checkPermission("delete_record"),
  productController.deleteProduct
);

//for users
Router.get("/users", userController.allUsersPage);
Router.get("/adduser", userController.addUserPage);
Router.post(
  "/user/create",
  uploadUserImage.single("profile_pic"),
  userController.registration
);
Router.get("/user/remove/:id", userController.deleteUser);

module.exports = Router;
