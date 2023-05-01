const multer = require('multer');
const VoteCard = require('../models/voteCard');

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, 'images/');
//   },
//   filename: function (req, file, cb) {
//     const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
//     cb(null, path.extname(file.originalname));
//   }
// });

// const upload = multer({ storage: storage });

exports.saveVoteCard = async (request, response) => {
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, './images');
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = new Date().getFullYear() - 1;
      cb(null, `${uniqueSuffix}_${file.originalname}`);
    }
  });

  const upload = multer({ storage: storage }).single('image');

  upload(request, response, async (error) => {
    if (error) {
      console.error(error);
      return response.status(500).send('Error saving image.');
    }
    const {category, name} = request.body

  });
};