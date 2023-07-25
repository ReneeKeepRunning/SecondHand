const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const express = require('express');
const multer = require('multer');

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET
})

const storage = new CloudinaryStorage({
    cloudinary,
    params: {
      folder: 'SecondHand products',
      allowedFormats: ['jpeg', 'png', 'jpg'],
      //public_id: (req, file) => 'computed-filename-using-request',
    },
  });

  module.exports= {
    cloudinary,
    storage
  }