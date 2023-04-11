const Proposals = require('../models/proposal');

exports.emailCheck = async (request, response, next) => {
    const { email } = request.body;
    const proposal = await Proposals.findOne({ email }).exec();

    if(proposal) {
        response.status(403).json({
            err: "This email already exists in database!"
        });
    } else {
        next()
    }
};