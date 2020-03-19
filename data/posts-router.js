const express = require("express");
const Posts = require("./db.js");
const router = express.Router();

console.log("Running posts router");


router.post("/", (req, res) => {
  const { title, contents } = req.body;
  !title || !contents
    ? res.status(400).json({
        errorMessage: "Please provide title and contents for the post."
      })
    : Posts.insert(req.body)
        .then(post => {
          res.status(201).json({ message: "Post Successfull", post });
        })
        .catch(err => {
          res.status(500).json({
            error: "There was an error while saving the post to the database",
            err
          });
        });
});

router.post("/:id/comments", (req, res) => {
  const comment = req.body;
  const { post_id, text } = req.body;
  Posts.findById(post_id)
    .then(post => {
      console.log(post);
          
      post.length !== 0
        ? !text
            ? res.status(400).json({ errorMessage: "Please provide text for the comment." })
            : Posts.insertComment(comment)
                .then(comment_id => {
                    res.status(201).json({ message: "Comment Successfull", comment, comment_id });
                })
                .catch(err => {
                  res.status(500).json({
                    error:
                      "There was an error while saving the comment to the database",
                    err
                  });
                })
        : res.status(404).json({
          message: "The post with the specified ID does not exist."
        });
    })
    .catch(err => {
      res.status(404).json({
        message: "The post with the specified ID does not exist."
      })
    });
});

router.get("/", (req, res) => {
  Posts.find()
    .then(posts => {
      res.status(200).json({ posts });
    })
    .catch(err => {
      res
        .status(500)
        .json({ error: "The posts information could not be retrieved.", err });
    });
});

router.get("/:id", (req, res) => {
  const { id } = req.params;
  Posts.findById(id)
    .then(post => {
      post.length !== 0
        ? res.status(200).json({ post })
        : res
            .status(404)
            .json({ message: "The post with the specified ID does not exist." });
    })
    .catch(err => {
      res
        .status(500)
        .json({ error: "The post information could not be retrieved.", err });
    });
});

router.get("/:id/comments", (req, res) => {
  const { id } = req.params;
  Posts.findPostComments(id)
    .then(comments => {
      comments.length === 0
        ? res
            .status(404)
            .json({ message: "The post with the specified ID does not exist." })
        : res.status(200).json({ comments });
    })
    .catch(err => {
      res.status(500).json({
        error: "The comments information could not be retrieved.",
        err
      });
    });
});

router.delete("/:id", (req, res) => {
  const { id } = req.params;
  Posts.remove(id)
    .then(post => {
      !post
        ? res
            .status(404)
            .json({ message: "The post with the specified ID does not exist." })
        : res.status(201).json({
            message: "The post with the specified ID has been removed.",
            id
          });
    })
    .catch(err => {
      res.status(500).json({ error: "The post could not be removed", err });
    });
});

router.put("/:id", (req, res) => {
  const changes = req.body;
  const { id } = req.params;

  !changes.title || !changes.contents
    ? res.status(400).json({
        errorMessage: "Please provide title and contents for the post."
      })
    : Posts.update(id, changes)
        .then(update => {
          !update
            ? res
                .status(404)
                .json({
                  message: "The post with the specified ID does not exist."
                })
            : res
                .status(200)
                .json({ message: "Edit Successfull", id, changes });
        })
        .catch(err => {
          res.status(500).json({
            error: "There was an error while saving the post to the database",
            err
          });
        });
});

module.exports = router;
