const express = require("express");
const userApiController = require("../../module/webservice/user.apiController");
const uploadUserImage = require("../../helper/UserImageUpload");
const uploadProductImage = require("../../helper/ProductImgUpload");
const productApiController = require("../../module/webservice/product.apiController");
const roleApiController = require("../../module/webservice/role.apiController");
const AuthCheck = require("../../middleware/authForApi");
const {
  checkPermissionApi,
} = require("../../middleware/checkPermissionForApi");

const ApiRouter = express.Router();

ApiRouter.post(
  "/user/register",
  uploadUserImage.single("profile_pic"),
  userApiController.registration
);
ApiRouter.post("/user/login", userApiController.loginUser);

//for roles
ApiRouter.post("/role/create", roleApiController.createRole);
ApiRouter.get("/roles", roleApiController.allRoles);
ApiRouter.get("/role/details/:id", roleApiController.singleRole);
ApiRouter.post("/actions/update/:id", roleApiController.updateActions);

ApiRouter.all("/*", AuthCheck);

//for product
ApiRouter.post(
  "/product/create",
  uploadProductImage.array("image", 10),
  checkPermissionApi("create_record"),
  productApiController.createProduct
);
ApiRouter.get(
  "/viewproducts",
  checkPermissionApi("read_record"),
  productApiController.getAllProducts
);
ApiRouter.get(
  "/product/details/:id",
  productApiController.singleProduct
);
ApiRouter.post(
  "/product/update/:id",
  uploadProductImage.array("image", 10),
  checkPermissionApi("update_record"),
  productApiController.updateProduct
);
ApiRouter.get(
  "/product/remove/:id",
  checkPermissionApi("delete_record"),
  productApiController.deleteProduct
);

ApiRouter.get("/users", userApiController.allUsers);

module.exports = ApiRouter;
