const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: 'dpyug4akr',
  api_key: '878475698721938',
  api_secret: '<your_api_secret>',
});

cloudinary.uploader.upload('path/to/your/image.jpg', (error, result) => {
  if (error) {
    console.error('Upload Error:', error);
  } else {
    console.log('Upload Success:', result);
  }
});
