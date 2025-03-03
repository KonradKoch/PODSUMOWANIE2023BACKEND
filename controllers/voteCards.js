const VoteCard = require("../models/voteCard");
const multer = require("multer");

exports.saveVoteCard = async (request, response) => {
  let fileName;
  const uniqueSuffix = new Date().getFullYear() - 1;
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "./images");
    },
    filename: (req, file, cb) => {
      fileName = `${uniqueSuffix}_${file.originalname}`;
      cb(null, `${uniqueSuffix}_${file.originalname}`);
    },
  });

  const upload = multer({ storage: storage }).single("image");

  upload(request, response, async (error) => {
    if (error) {
      console.error(error);
      return response.status(500).send("Error saving image.");
    }
    const { category, name, video } = request.body;
    const voteCard = await VoteCard.findOneAndUpdate(
      { name, category },
      { image: fileName, name, category }
    );
    const newVoteCard = new VoteCard({
      category,
      name,
      image: fileName,
      year: uniqueSuffix,
      video,
    });
    if (voteCard) {
      response.json(voteCard);
    } else {
      newVoteCard.save();
    }
  });
};

exports.showVoteCards = async (request, response) => {
  const year = new Date().getFullYear() - 1;
  VoteCard.find({ year: year }, "category year name image video", {
    sort: { name: 1 },
  })
    .collation({ locale: "pl" })
    .exec((error, result) => {
      if (error) {
        response.json(error);
      } else {
        response.json(result);
      }
    });
};
exports.showOldResults = async (request, response) => {
  VoteCard.aggregate([
    {
      $sort: { votes: -1 } // Sortujemy najpierw według liczby głosów malejąco
    },
    {
      $group: {
        _id: { category: "$category", year: "$year" }, // Grupujemy po kategorii i roku
        bestVoteCard: { $first: "$$ROOT" }, // Wybieramy pierwszy (najlepszy) wpis
      },
    },
    {
      $project: {
        _id: 0,
        category: "$_id.category",
        year: "$_id.year",
        name: "$bestVoteCard.name",
        image: "$bestVoteCard.image",
        video: "$bestVoteCard.video",

      },
    },
    { $sort: { year: -1, category: 1 } } // Sortowanie wyników według roku malejąco i kategorii rosnąco
  ]).exec((error, result) => {
    if (error) {
      response.json(error);
    } else {
      response.json(result);
      console.log(response.data);
    }
  });
};
// exports.showOldResults = async (request, response) => {
//   const year = new Date().getFullYear() - 1;
//   VoteCard.aggregate([
//     { $match: VoteCard.find({year: {$ne: year}}).cast(VoteCard) },
//     {
//       $sort: {
//         votes: -1,
//       },
//     },
//     {
//       $group: {
//         _id: "$category",
//         voteCards: { $push: "$$ROOT" },
//         totalVotes: { $sum: "$votes" },
//       },
//     },
//     {
//       $project: {
//         voteCards: {
//           $slice: ["$voteCards", 3],
//         },
//         totalVotes: 1,
//       },
//     },
//     {
//       $project: {
//         category: 1,
//         data: {
//           $map: {
//             input: "$voteCards",
//             as: "voteCard",
//             in: {
//               name: "$$voteCard.name",
//               image: "$$voteCard.image",
//               year: "$$voteCard.year",
//               video: "$$voteCard.video",
//             },
//           },
//         },
//       },
//     },
//   ]).exec((error, result) => {
//     if (error) {
//       response.json(error);
//     } else {
//       response.json(result);
//       console.log(response.data)
//     }
//   });
// };


exports.showVoteCards = async (request, response) => {
  const year = new Date().getFullYear() - 1;
  VoteCard.find({ year: year }, "category year name image video", {
    sort: { name: 1 },
  })
    .collation({ locale: "pl" })
    .exec((error, result) => {
      if (error) {
        response.json(error);
      } else {
        response.json(result);
      }
    });
};

exports.showLastYearResults = async (request, response) => {
  const year = new Date().getFullYear() - 1;
  VoteCard.aggregate([
    { $match: VoteCard.where({year}).cast(VoteCard) },
    {
      $sort: {
        votes: -1,
      },
    },
    {
      $group: {
        _id: "$category",
        voteCards: { $push: "$$ROOT" },
        totalVotes: { $sum: "$votes" },
      },
    },
    {
      $project: {
        voteCards: {
          $slice: ["$voteCards", 3],
        },
        totalVotes: 1,
      },
    },
    {
      $project: {
        category: 1,
        data: {
          $map: {
            input: "$voteCards",
            as: "voteCard",
            in: {
              name: "$$voteCard.name",
              votesPercentage: {
                $round: [
                  {
                    $multiply: [
                      { $divide: ["$$voteCard.votes", "$totalVotes"] },
                      100,
                    ],
                  },
                  2,
                ],
              },
              image: "$$voteCard.image",
              year: "$$voteCard.year",
              video: "$$voteCard.video",
            },
          },
        },
      },
    },
  ]).exec((error, result) => {
    if (error) {
      response.json(error);
    } else {
      response.json(result);
      console.log(response.data)
    }
  });
};