exports.getOrCreateTimerEvent = async (request, response) => {
  // modify the timer counting time here:
    const endDate = new Date('2024-04-08T23:59:59Z');

// Timer endpoint

  const now = new Date();
  const diff = endDate - now;
  const remainingTime = {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
    minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
    seconds: Math.floor((diff % (1000 * 60)) / 1000)
  };
  response.json({remainingTime});
}