const roleRepository = require("../admin/role/repository/role.repository");


class RoleApiController {

  //create role
  async createRole(req,res){
    try {
        const {roleName, actions}=req.body
        const data= {roleName, actions}
        const roledata=await roleRepository.save(data)
        if(roledata){
            res.status(201).json({
                message: "Role created successfully",
                data: roledata
            })
        }else{
            res.status(500).json({
                message: "Internal Server Error",
            }) 
        }
    } catch (error) {
        console.log(error);
        
    }
  }

  //all roles
  async allRoles(req,res){
    try {
        const allroledata=await roleRepository.find()
        if(allroledata){
            res.status(200).json({
                message: "All role data fetched successfully",
                total: allroledata.length,
                data: allroledata
            })
        }else{
            res.status(500).json({
                message: "Internal Server Error",
            }) 
        }
    } catch (error) {
        console.log(error);
        
    }
  }

  //single role
  async singleRole(req,res){
    try {
        const id=req.params.id
        const singledata=await roleRepository.findById(id)
        if(singledata){
            res.status(200).json({
                message: "Single role data fetched successfully",
                data: singledata
            })
        }else{
            res.status(500).json({
                message: "Internal Server Error"
            })
        }
    } catch (error) {
        console.log(error);
        
    }
  }

  //for edit role actions
  async updateActions(req, res) {
    try {
      const id = req.params.id;
      const updatedData = await roleRepository.findByIdAndUpdate(id, req.body);
      if (updatedData) {
        res.status(200).json({
            message: "Role data updated successfully",
            data: singledata
        })
      } else {
        res.status(500).json({
            message: "Internal Server Error"
        })
      }
    } catch (error) {
      console.log(error);
    }
  }
  
}

module.exports = new RoleApiController();
