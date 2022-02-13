const fetch = require('node-fetch')

exports.handler = async function(event, context) {

  const apiOptions = {
    headers: {
      cookie: `swid=${process.env.SWID}; espn_s2=${process.env.ESPN_S2}`
    }
  }
  const espnApiData = await fetch('https://fantasy.espn.com/apis/v3/games/ffl/seasons/2021/segments/0/leagues/216754', apiOptions).then(
    response => response.json()
  );

  return {
    statusCode: 200,
    body: JSON.stringify(espnApiData)
  }
}
