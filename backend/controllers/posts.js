const express = require('express');
const multer = require('multer');

const Post = require('../models/post');
const checkAuth = require('../middleware/check-auth');

exports.createPost = (req, res, next) => {
  const url = `${req.protocol}://${req.get('host')}`;
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    imagePath: `${url}/images/${req.file.filename}`,
    creator: req.userData.userId
  });
  post.save()
    .then(createdPost => {
      res.status(201).json({
        message: 'Post added',
        post: {
          ...createdPost,
          id: createdPost._id,
        }
      });
    })
    .catch(error => {
      res.statusMessage(500).json({message: 'The post has failed to be created'});
    });
}

exports.updatePost = (req, res, next) => {
  let imagePath = req.body.imagePath;
  if (req.file) {
    const url = `${req.protocol}://${req.get('host')}`;
    imagePath = `${url}/images/${req.file.filename}`;
  }
  const post = new Post({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content,
    imagePath,
    creator: req.userData.userId
  });
  Post.updateOne(
    {_id: req.params.id, creator: req.userData.userId},post)
    .then(result => {
      if (result.n > 0) {
        res.status(200).json({message: 'update success'});
      } else {
        res.status(401).json({message: 'unauthorized'});
      }
    })
    .catch(error => {
      res.status(500).json({message: 'The post could not be updated'});
    })
}

exports.getPosts = (req, res, next) => {
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;
  const postQuery = Post.find();
  let fetchedPosts;
  if (pageSize && currentPage) {
    postQuery
      .skip(pageSize * (currentPage - 1))
      .limit(pageSize);
  }
  postQuery
    .then(documents => {
      fetchedPosts = documents;
      return Post.countDocuments();
    })
    .then(count => {
      res.status(200).json({
        message: 'Posts fetch success',
        posts: fetchedPosts,
        maxPosts: count
      });
    })
    .catch(err => {
      res.status(500).json('Fetching posts failed');
    })
}

exports.getSinglePost = (req, res, next) =>{
  Post.findById(req.params.id)
    .then(post => {
      if(post){
        res.status(200).json(post);
      }else{
        res.status(404).json({message: 'Post not found'});
      }
    })
    .catch(err => {
      res.status(500).json('Fetching posts failed');
    })
}

exports.deleteSinglePost = (req, res, next) => {
  Post.deleteOne({
    _id: req.params.id,
    creator: req.userData.userId
  })
    .then(result => {
      if (result.n > 0) {
        res.status(200).json({message: 'post deleted'});
      } else {
        res.status(401).json({message: 'unauthorized'});
      }
    })
    .catch(err => {
      res.status(500).json('Fetching posts failed');
    });
}
