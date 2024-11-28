const mongoose = require("mongoose");
const { Schema } = mongoose;
const Joi = require("joi");

const UserSchemaValidate = Joi.object({
  name: Joi.string().required().min(3).messages({
    "string.base": `name must be a type of text`,
    "any.required": `name is required`,
    "string.min": `minimum 3 characters required`,
  }),
  email: Joi.string().required(),
  phone: Joi.number().required(),
  password: Joi.string().required(),
  address: {
    city: Joi.string().required(),
    state: Joi.string().required(),
  },
  first_school: Joi.string().required(),
  roleId: Joi.string(),
  profile_pic: Joi.string().required(),
});

const UserSchema = new Schema(
  {
    roleId: {
      type: Schema.Types.ObjectId,
      ref: "role",
    },
    name: {
      type: String,
    },
    email: {
      type: String,
    },
    phone: {
      type: Number,
    },
    password: {
      type: String,
    },
    address: {
      city: {
        type: String,
      },
      state: {
        type: String,
      },
    },
    profile_pic: {
      type: String,
    },
    first_school: {
      type: String,
    },
  },
  {
    timestamps: true,
    versionKey: 0,
  }
);

const UserModel = mongoose.model("user", UserSchema);

module.exports = { UserModel, UserSchemaValidate };
