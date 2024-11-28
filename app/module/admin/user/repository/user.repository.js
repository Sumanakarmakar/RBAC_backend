const { default: mongoose } = require("mongoose");
const { UserModel } = require("../model/user.model");



class userRepositories {

  //save
  async save(data) {
    try {
      const result = await UserModel.create(data);
      return result;
    } catch (error) {
      console.log(error);
    }
  }

  //find one
  async findOne(data) {
    try {
      const result = await UserModel.findOne(data);
      return result;
    } catch (error) {
      console.log(error);
    }
  }

  //find
  async find(data) {
    try {
      const result = await UserModel.find(data);
      return result;
    } catch (error) {
      console.log(error);
    }
  }
  
  async getAllUsers(){
    try {
      const alldata=UserModel.aggregate([
        {
          $lookup: {
            from: "roles",
            localField: "roleId",
            foreignField: "_id",
            as: "role_details"
          }
        },
        {
          $unwind: {
            path: "$role_details"
          }
        }
      ])
      return alldata;
    } catch (error) {
      console.log(error);
      
    }
  }

  //update
  async findById(id){
    try {
      const result=await UserModel.findById(id)
      return result
    } catch (error) {
      console.log(error);
    }
  }
  
  async findByIdAndUpdate(id, data) {
    try {
      const result = await UserModel.findByIdAndUpdate(id, data);
      // console.log(result);

      return result;
    } catch (err) {
      console.log(err);
    }
  }

  async findByIdAndDelete(id) {
    try {
      const result = await UserModel.findByIdAndDelete(id);
      return result;
    } catch (err) {
      console.log(err);
    }
  }

}

module.exports = new userRepositories();
