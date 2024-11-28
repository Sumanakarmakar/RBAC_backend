const path = require("path");
const fs=require('fs')
const productRepository = require("../admin/product/repository/product.repository");
const { ProductSchemaValidate } = require("../admin/product/model/product.model");

class ProductApiController {

  //create product
  async createProduct(req, res) {
    try {
      const { title, description, price, category } = req.body;

      //validation
      if (!title || !description || !price || !category ) {
        return res.status(500).json({
          message: "All fields are required",
        });
      }
      const imgs = req.files.map((f) => f.path);
      const productdata = {
        title, description, price, category
      };

      productdata.image= imgs

      //validating the request
      const { error, value } = ProductSchemaValidate.validate(productdata);
    //   console.log("ll", value);
      if (error) {
        res.status(500).json({
          message: error.message,
        });
      } else {
        //call the create post function in the service and pass the data from the request
        const savedProductdata = await productRepository.save(value);
        // console.log(savedProductdata);

        if (savedProductdata) {
          res.status(201).json({
            status: 200,
            message: "Product Created successfully",
            data: savedProductdata
          })
        } else {
          res.status(500).json({
            message: "Internal Server Error",
          });
        }
      }
    } catch (err) {
      console.log(`Error in creating product: ${err}`);
    }
  }

  //for all products
  async getAllProducts(req, res) {
    try {
      const allProductsData = await productRepository.find({isDeleted: false});
      if (allProductsData) {
        res.status(200).json({
          message: "All Products Fetched Successfully",
          total: allProductsData.length,
          products: allProductsData,
        });
      } else {
        res.status(500).json({
          message: "Internal server Error",
        });
      }
    } catch (err) {
      console.log(`Error in fetching all products ${err}`);
    }
  }

  //for single product
  async singleProduct(req, res) {
    try {
      const id = req.params.id;
      const singleProductData = await productRepository.findById(id);
      if (singleProductData) {
        res.status(200).json({
          status: 200,
          message: "Single product data fetched",
          singleData: singleProductData,
        });
      } else {
        res.status(500).json({
          message: "Internal Server Error",
        });
      }
    } catch (err) {
      console.log(`Error in fetching single product ${err}`);
    }
  }

  //for updating product
  async updateProduct(req, res) {
    try {
      const id = req.params.id;
      const existingProduct = await productRepository.findById(id);
      // console.log("existing product", existingProduct);

      if (req.files.length > 0) {
        req.body.image = req.files.map((file) => file.path);
        fs.unlink(
          "./uploads/" + existingProduct.image.map((f) => path.basename(f)),
          (err) => {
            console.log(`Error showing in deleting image ${err}`);
          }
        );
      } else {
        req.body.image = existingProduct.image;
      }

      const updatedProductData = await productRepository.findByIdAndUpdate(
        id,
        req.body
      );
      if (updatedProductData) {
        res.status(200).json({
          status: 200,
          message: "Product data updated successfully",
        });
      } else {
        res.status(500).json({
          message: "Internal Server Error",
        });
      }
    } catch (err) {
      console.log(`Error in updating product ${err}`);
    }
  }

  //for removing product
  async deleteProduct(req, res) {
    try {
      const id = req.params.id;
      const existingProduct = await productRepository.findById(id);
      existingProduct.image.map((f) => {
        fs.unlink("./uploads/product/" + path.basename(f), (error) => {
          console.log(`Error in removing old pics ${error}`);
        });
      });

      const deletedProductData = await productRepository.findByIdAndUpdate(id, {
        isDeleted: true,
      });
      if (deletedProductData) {
        res.status(200).json({
          status: 200,
          message: "Product data removed successfully",
        });
      } else {
        res.status(500).json({
          message: "Internal Server Error",
        });
      }
    } catch (err) {
      console.log(`Error in removing product ${err}`);
    }
  }

}

module.exports = new ProductApiController();
