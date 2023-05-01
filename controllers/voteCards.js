const VoteCard = require('../models/voteCard');
const multer = require('multer');

exports.saveVoteCard = async (request, response) => {
    let fileName
    const uniqueSuffix = new Date().getFullYear() - 1;
    const storage = multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, './images');
      },
      filename: (req, file, cb) => {
        fileName = `${uniqueSuffix}_${file.originalname}`
        cb(null, `${uniqueSuffix}_${file.originalname}`);
      }
    });

    const upload = multer({ storage: storage }).single('image');

    upload(request, response, async (error) => {
      if (error) {
        console.error(error);
        return response.status(500).send('Error saving image.');
      }
      const {category, name, video} = request.body
      const voteCard = await VoteCard.findOneAndUpdate({name, category}, {image: fileName, name, category});
      const newVoteCard = new VoteCard({
        category,
        name,
        image: fileName,
        year: uniqueSuffix,
        video
      })
      if(voteCard){
        response.json(voteCard);
      } else {
        newVoteCard.save();
      }
    });
  };

exports.showVoteCards = async (request, response) => {
    const year = new Date().getFullYear() - 1;
    VoteCard.find({year: year}, 'category year name image video').exec((error, result) => {
        if(error) {
            response.json(error)
        } else {
            response.json(result)
        }
    })
};