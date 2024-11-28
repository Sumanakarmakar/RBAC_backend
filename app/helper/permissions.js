const roleRepository = require("../module/admin/role/repository/role.repository");
const userRepository = require("../module/admin/user/repository/user.repository");


class Permissions {
  async getPermissionsByRoleName(userId) {
    const userdata=await userRepository.findById(userId)
    const role = await roleRepository.findById(userdata.roleId)
    // console.log("rrr", role);
    
    return role ? role.actions : [];
  }
}

const permissions = new Permissions();
module.exports = permissions;
