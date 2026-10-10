const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
   
//    product name
    name: {
      type: String,
      required: true,
    
    },

    // product description
    description: {
      type: String,
      required: true,
    },

    // product price
    price: {
      type: Number,
      required: true,
    },

    // product category
    category: {
      type: String,
      required: true,
    },

    // product image
    image: {
        type: String,
        required: true,
    },

    isFeatured: {
      type: Boolean,
      default: false,
    },

    // product orderlist
    orderList: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Order",
        }
    ],
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("Product", productSchema);