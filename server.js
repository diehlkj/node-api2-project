const express = require("express");
const server = express();
const postsRouter = require("./data/posts-router.js");

server.use(express.json());
server.use("/api/posts", postsRouter);

server.get("/", (req, res) => {
  res.send(`
        <h1>Node API 2 Project</h1>
        <p>Express Router</p>
    `);
});

module.exports = server;
