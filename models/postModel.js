const monngoose = require("mongoose");

const postSchema = new monngoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please add Post Title"],
    },
    description: {
      type: String,
      required: [true, "Please add Post Description"],
      unique: true,
      trim: true,
    },
    postedBy: {
      type: monngoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = monngoose.model("Post", postSchema);
