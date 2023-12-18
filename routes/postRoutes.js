const express = require("express");
const { requireSignIn } = require("../controllers/userController");
const {
  createPostController,
  getAllPostsController,
  getUserPostsController,
  deletePostController,
  updatePostController,
} = require("../controllers/postController");

// router object
const router = express.Router();

// routes
// CREATE POST || POST
router.post("/create-post", requireSignIn, createPostController);
// GET ALL POSTS || GET
router.get("/get-all-posts", getAllPostsController);
// GET USER POSTS || GET
router.get("/get-user-post", requireSignIn, getUserPostsController);

// DELETE POST || DELETE
router.delete("/delete-post/:id", requireSignIn, deletePostController);

// UPDATE POST || UPDATE
router.put("/update-post/:id", requireSignIn, updatePostController);

// export
module.exports = router;
