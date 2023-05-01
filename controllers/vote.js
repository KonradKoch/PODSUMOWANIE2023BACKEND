
const Vote = require('../models/vote');
const VoteCard = require('../models/voteCard');
const nodemailer = require('nodemailer');


const transporter = nodemailer.createTransport({
    host: 'rapgrinder.nazwa.pl',
    port: 465,
    secure: true,
  auth: {
    user: 'podsumowanie@poznanskirap.com',
    pass: 'Podsumowaniekondej69'
  }
});

exports.saveVote = async (request, response) => {
    console.log(request.body)
    const { email, artysta, producent, dj, album, teledysk, impreza, wydarzenie } = request.body;
    const vote = await Vote.findOne({email});

    const newVote = await new Vote({
        email,
        artysta,
        producent,
        dj,
        album,
        teledysk,
        impreza,
        wydarzenie
    });
    if(vote) {
        response.status(404).send('Zapraszamy za rok!')
    } else {
        newVote.save().then( async () => {
            const voteId = newVote._id
            const verificationLink = `${process.env.REACT_APP_API_DOMAIN}/verify-vote?id=${voteId}`;
            const mailOptions = {
                from: 'podsumowanie@poznanskirap.com',
                to: email,
                subject: 'PODSUMOWANIE POZNANSKIRAP.COM - link weryfikacyjny',
                html: `Witaj! <br/><br/>
                Dziękujemy za Twój udział w akcji PODSUMOWANIE ROKU 2022 na poznańskiej scenie hip-hopowej.<br/>
                Kliknij <a href="${verificationLink}">TUTAJ</a>, aby potwierdzić swój udział w głosowaniu.<br/>
                Pamiętaj, że tylko potwierdzone głosy biorą udział w zabawie!<br/>
                <br/>
                Pozdrawiamy!<br/>

                Redakcja portalu poznanskirap.com`
              };
              await transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                  console.error(error);
                } else {
                  console.log('Email sent: ' + info.response);
                }
              });
            response.json(`vote request succeeded! ${vote} Proceed with the link sent to your email to confirm your vote!`)
        }).catch(error => response.json(`vote request failed! ${error}`));

    }
};

exports.voteVerification = async (request, response) => {
  const { code } = request.headers;

  const vote = await Vote.findByIdAndUpdate(code, {confirmed: true}).exec();
  console.log(vote.email)
  if(vote.confirmed) {
    response.status(403).send('Ten głos już został potwierdzony!')
  }
  else if(vote){
      console.log('vote verified!')
      const {artysta, producent, dj, album, wydarzenie, impreza, teledysk} = vote
      Object.keys({artysta, producent, dj, album, wydarzenie, impreza, teledysk}).forEach((voteKey) => {
        VoteCard.findOneAndUpdate({category: voteKey, name: vote[voteKey]}, {$inc: {votes: 1}}).exec()
      })
      const html = `
        <html>
          <head>
            <style>
              .wyniki-link {
                text-justify: center;
              }
            </style>
          </head>
          <body>
          <p>Dzięki za potwierdzenie głosu! <p><br/>
            <h3>Twoje głosy w poszczególnych kategoriach:</h3>
            <p><strong>Artysta:</strong> ${vote.artysta}</p>
            <p><strong>Producent:</strong> ${vote.producent}</p>
            <p><strong>DJ:</strong> ${vote.dj}</p>
            <p><strong>Album:</strong> ${vote.album}</p>
            <p><strong>Teledysk:</strong> ${vote.teledysk}</p>
            <p><strong>Impreza:</strong> ${vote.impreza}</p>
            <p><strong>Wydarzenie:</strong> ${vote.wydarzenie}</p>
            <br/>
            <p>W oczekiwaniu na koniec głosowania i aktualne wyniki sprawdź te z poprzednich edycji. </p><br/>
             <a class="wyniki-link" href="http://podsumowanie.poznanskirap.com/wyniki">przejdź od wyników</a>
          </body>
        </html>`
      const mailOptions = {
        from: 'podsumowanie@poznanskirap.com',
        to: vote.email,
        subject: 'DZIĘKUJEMY ZA UDZIAŁ W PODSUMOWANIU POZNANSKIRAP.COM',
        html: html
      };
      response.json('Właśnie potwierdziłeś swój głos! Na maila wysłaliśmy Ci potwierdzenie.')
      await transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      })
    } else {
      response.status(404).send('Błąd! Nie znaleziono głosu w bazie danych!')
    }
}