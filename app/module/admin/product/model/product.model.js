const mongoose = require("mongoose");
const { Schema } = mongoose;
const Joi = require("joi");

const ProductSchemaValidate = Joi.object({
  title: Joi.string().required().min(3).messages({
    "string.base": `name must be a type of text`,
    "any.required": `name is required`,
    "string.min": `minimum 3 characters required`,
  }),
  description: Joi.string().required(),
  price: Joi.number().required(),
  category: Joi.string().required(),
  image: Joi.array().required(),
});

const ProductSchema = new Schema(
  {
    title: {
      type: String,
    },
    description: {
      type: String,
    },
    price: {
      type: Number,
    },
    category: {
      type: String,
    },
    image: {
      type: [String],
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
  },
  {
    timestamps: true,
    versionKey: 0,
  }
);

const ProductModel = mongoose.model("product", ProductSchema);

module.exports = {ProductModel, ProductSchemaValidate};
