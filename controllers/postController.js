const postModel = require("../models/postModel");

// create post
const createPostController = async (req, res) => {
  try {
    const { title, description } = req.body;

    // validation
    if (!title || !description) {
      return res.status(400).send({
        success: false,
        message: "Please Provide All Fields",
      });
    }

    // save user in database
    const post = await postModel({
      title,
      description,
      postedBy: req.auth._id,
    }).save();

    res.status(201).send({
      success: true,
      message: "Post Created Successfully",
      post,
    });
  } catch (error) {
    console.log("err", error);
    return res.status(500).send({
      success: false,
      message: "Error in Create Post API",
      error,
    });
  }
};

// get all posts
const getAllPostsController = async (req, res) => {
  try {
    const posts = await postModel
      .find()
      .populate("postedBy", "_id name")
      .sort({ createdAt: -1 });

    res.status(200).send({
      success: true,
      message: "All Posts Data",
      posts,
    });
  } catch (error) {
    console.log("err", error);
    return res.status(500).send({
      success: false,
      message: "Error in Get All Posts API",
      error,
    });
  }
};

// get user posts
const getUserPostsController = async (req, res) => {
  try {
    const userPosts = await postModel.find({ postedBy: req.auth._id });

    res.status(200).send({
      success: true,
      message: "User Posts Data",
      userPosts,
    });
  } catch (error) {
    console.log("err", error);
    return res.status(500).send({
      success: false,
      message: "Error in Get User Posts API",
      error,
    });
  }
};

// delete post
const deletePostController = async (req, res) => {
  try {
    const { id } = req.params;
    await postModel.findByIdAndDelete(id);

    res.status(200).send({
      success: true,
      message: "Post has benn deleted!",
    });
  } catch (error) {
    console.log("err", error);
    return res.status(500).send({
      success: false,
      message: "Error in Delete Post API",
      error,
    });
  }
};

// update post
const updatePostController = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description } = req.body;
    const post = await postModel.findById(id);

    // validation
    if (!title || !description) {
      return res.status(400).send({
        success: false,
        message: "Please Provide Post Title and Description",
      });
    }

    const updatedPost = await postModel.findByIdAndUpdate(
      id,
      {
        title: title || post.title,
        description: description || post.description,
      },
      {
        new: true,
      }
    );

    res.status(200).send({
      success: true,
      message: "Post has been updated!",
      updatedPost,
    });
  } catch (error) {
    console.log("err", error);
    return res.status(500).send({
      success: false,
      message: "Error in Update Post API",
      error,
    });
  }
};

module.exports = {
  createPostController,
  getAllPostsController,
  getUserPostsController,
  deletePostController,
  updatePostController,
};
