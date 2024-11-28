const permissions = require("../helper/permissions");

const checkPermission = (permission) => {
  return async (req, res, next) => {
    const user = req.admin ? req.admin.id : "anonymous";
    // console.log("user",user);
    
    const userPermissions = await permissions.getPermissionsByRoleName(user);
    // console.log("userpermission",userPermissions);

    if (userPermissions.includes(permission)) {
      return next();
    } else {
      req.flash("message", "Access Denied")
      res.redirect('/admin/products')
    }
  };
};
module.exports = { checkPermission };
