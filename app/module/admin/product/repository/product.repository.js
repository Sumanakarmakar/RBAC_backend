const { ProductModel } = require("../model/product.model");


class productRepositories {
  //save
  async save(data) {
    try {
      const result = await ProductModel.create(data);
      return result;
    } catch (error) {
      console.log(error);
    }
  }

  //find
  async find(data) {
    try {
      const result = await ProductModel.find(data);
      return result;
    } catch (error) {
      console.log(error);
    }
  }

  //update
  async findById(id) {
    try {
      const result = await ProductModel.findById(id);
      return result;
    } catch (error) {
      console.log(error);
    }
  }

  async findByIdAndUpdate(id, data) {
    try {
      const result = await ProductModel.findByIdAndUpdate(id, data);
      // console.log(result);

      return result;
    } catch (err) {
      console.log(err);
    }
  }
}

module.exports = new productRepositories();
