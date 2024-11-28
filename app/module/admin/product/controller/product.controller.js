const path = require("path");
const fs = require("fs");
const productRepository = require("../repository/product.repository");

class ProductController {
  async productPage(req, res) {
    try {
      var msz = req.flash("message");
      const allProductData = await productRepository.find({ isDeleted: false });
      res.render("product/listProduct", {
        title: "All Products",
        data: req.admin,
        allProductData,
        msz,
      });
    } catch (error) {
      console.log(error);
    }
  }

  //add product page
  async addProductPage(req, res) {
    try {
      var msz = req.flash("message");
      res.render("product/addProduct", {
        title: "Add Product Page",
        data: req.admin,
        msz,
      });
    } catch (error) {
      console.log(error);
    }
  }

  //create product
  async createProduct(req, res) {
    try {
      const { title, description, price, category } = req.body;

      //validation
      if (!title || !description || !price || !category) {
        return res.redirect("/admin/addproduct");
      }
      const imgs = req.files.map((f) => f.path);
      const productdata = {
        title,
        description,
        price,
        category,
      };

      productdata.image = imgs;

      const savedProductdata = await productRepository.save(productdata);
      console.log(savedProductdata);

      if (savedProductdata) {
        req.flash("message", "Product Created Successfully");
        res.redirect("/admin/products");
      } else {
        req.flash("message", "Internal Server Error");
        res.redirect("/admin/addproduct");
      }
    } catch (err) {
      console.log(`Error in creating product: ${err}`);
    }
  }

  //single product
  async singleProduct(req, res) {
    try {
      const singledata = await productRepository.findById(req.params.id);
      res.render("product/updateProduct", {
        title: "Update Product",
        data: req.admin,
        singledata,
      });
    } catch (error) {
      console.log(error);
    }
  }

  //update product
  async updateProduct(req, res) {
    try {
      const id = req.params.id;
      const existingProduct = await productRepository.findById(id);

      if (req.files.length > 0) {
        for (let img of existingProduct.image) {
          console.log("abcd", img);

          if (fs.existsSync("./uploads/product/" + path.basename(img))) {
            fs.unlinkSync("./uploads/product/" + path.basename(img));
          }
        }

        req.body.image = req.files.map((file) => file.path);
      } else {
        req.body.image = existingProduct.image;
      }

      const updatedProductData = await productRepository.findByIdAndUpdate(
        id,
        req.body
      );
      if (updatedProductData) {
        req.flash("message", "Product data updated successfully");
        res.redirect("/admin/products");
      } else {
        req.flash("message", "Error occured in updating product");
        res.redirect(`/admin/product/edit/${id}`);
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
        req.flash("message", "Product Data Removed Successfully");
        res.redirect("/admin/products");
      } else {
        throw new Error("Product is not removed");
      }
    } catch (err) {
      console.log(`Error in removing product ${err}`);
    }
  }
}

module.exports = new ProductController();
