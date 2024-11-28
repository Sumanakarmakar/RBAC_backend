const RoleModel = require("../model/role.model");


class roleRepositories {

  //save
  async save(data) {
    try {
      const result = await RoleModel.create(data);
      return result;
    } catch (error) {
      console.log(error);
    }
  }

  //find one
  async findOne(data) {
    try {
      const result = await RoleModel.findOne(data);
      return result;
    } catch (error) {
      console.log(error);
    }
  }

  //find
  async find() {
    try {
      const result = await RoleModel.find();
      return result;
    } catch (error) {
      console.log(error);
    }
  }
  

  //update
  async findById(id){
    try {
      const result=await RoleModel.findById(id)
      return result
    } catch (error) {
      console.log(error);
    }
  }
  
  async findByIdAndUpdate(id, data) {
    try {
      const result = await RoleModel.findByIdAndUpdate(id, data);
      // console.log(result);

      return result;
    } catch (err) {
      console.log(err);
    }
  }

  async findByIdAndDelete(id) {
    try {
      const result = await RoleModel.findByIdAndDelete(id);
      return result;
    } catch (err) {
      console.log(err);
    }
  }

}

module.exports = new roleRepositories();
