const Proposal = require('../models/proposal');

exports.saveProposal = async (request, response) => {
    console.log(request)
    const { email, artysta, producent, dj, album, teledysk, impreza, wydarzenie } = request.body;
    const proposal = await new Proposal({
        email,
        artysta,
        producent,
        dj,
        album,
        teledysk,
        impreza,
        wydarzenie
    });
    proposal.save().then(response.json(`proposal succeeded! ${proposal}`)).catch(error => response.json(`proposal failed! ${error}`));
};