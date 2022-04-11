const fetch = require('node-fetch');

exports.handler = async function(event, context) {

  const apiOptions = {
    headers: {
      cookie: `swid=${process.env.SWID}; espn_s2=${process.env.ESPN_S2}`
    }
  };
  const espnApiData = await fetch('https://fantasy.espn.com/apis/v3/games/ffl/seasons/2021/segments/0/leagues/216754?view=mTeam&view=mScoreboard&view=mMatchupScore', apiOptions).then(
    response => response.json()
  );

  const teams = espnApiData.teams.map((team) => {
    return {
      id: Number(team.id),
      location: team.location,
      nickname: team.nickname,
      fullName: `${team.location} ${team.nickname}`,
      owner: espnApiData.members.find((member) => member.id === team.primaryOwner),
      logo: team.logo
    };
  });

  const weeklyScores = Object.keys(espnApiData.settings.scheduleSettings.matchupPeriods).map((period) => {
    const matchups = espnApiData.schedule.filter(matchup => matchup.matchupPeriodId == period)
      .map(matchup => {
        const newObject = {};
        if (matchup.away) {
          newObject.awayTeamId = Number(matchup.away.teamId);
          newObject.awayTeamScore = Number(matchup.away.totalPoints);
        }
        if (matchup.home) {
          newObject.homeTeamId = Number(matchup.home.teamId);
          newObject.homeTeamScore = Number(matchup.home.totalPoints);
        }
        return newObject;
      });
    return {
      id: period,
      matchups,
    };
  });

  const weeklyRankings = weeklyScores.map((week) => {
    return week.matchups
      .reduce((prev, curr) => {
        if (curr.homeTeamId) {
          prev.push({teamId: curr.homeTeamId, totalPoints: curr.homeTeamScore});
        }
        if (curr.awayTeamId) {
          prev.push({teamId: curr.awayTeamId, totalPoints: curr.awayTeamScore});
        }
        return prev;
      }, [])
      .sort((a, b) => {
        return b.totalPoints - a.totalPoints;
      });
  });

  const records = teams.map((team) => {
    // Calculate H2H Record
    const h2hRecord = {
      wins: 0,
      losses: 0,
    };
    weeklyScores.forEach((week) => {
      const matchup = week.matchups.find(matchup =>
        (matchup.homeTeamId && matchup.awayTeamId) && (matchup.homeTeamId == team.id || matchup.awayTeamId == team.id));
      if (matchup) {
        const isAwayTeam = matchup.awayTeamId == team.id;
        const isHomeTeam = matchup.homeTeamId == team.id;
        if ( isHomeTeam && (matchup.homeTeamScore > matchup.awayTeamScore)) {
          h2hRecord.wins++;
        } else if (isAwayTeam && (matchup.awayTeamScore > matchup.homeTeamScore)) {
          h2hRecord.wins++;
        } else {
          h2hRecord.losses++;
        }
      }
    });
    // Calculate Top Half Record
    const topHalfRecord = {
      wins: 0,
      losses: 0,
    };
    const totalTeams = teams.length;
    weeklyRankings.forEach((week) => {
      if (week) {
        const ranking = week.findIndex((score) => score.teamId == team.id) + 1;
        if (ranking <= totalTeams / 2) {
          topHalfRecord.wins ++;
        } else {
          topHalfRecord.losses ++;
        }
      }
    });
    return {
      teamId: team.id,
      teamDetails: team,
      h2h: h2hRecord,
      topHalf: topHalfRecord,
      overall: {
        wins: h2hRecord.wins + topHalfRecord.wins,
        losses: h2hRecord.losses + topHalfRecord.losses,
      }
    };
  });

  // Calculate bowl points
  const bowlPoints = teams.map((team) => {
    let totalPoints = 0;
    weeklyRankings.forEach((week) => {
      // Get Points scored by team for each week
      const pointsForWeek = week.find((score) => {
        return score.teamId === team.id;
      }).totalPoints;
      // Get Ranking for team for each week
      const rankForWeek = week.findIndex((score) => {
        return score.teamId === team.id;
      }) + 1;
      if (pointsForWeek > 100) {
        totalPoints += pointsForWeek - 100;
      }
      switch (rankForWeek) {
      case 1:
        return totalPoints += 250;
      case 2:
        return totalPoints += 180;
      case 3:
        return totalPoints += 150;
      case 4:
        return totalPoints += 120;
      case 5:
        return totalPoints += 100;
      case 6:
        return totalPoints += 80;
      case 7:
        return totalPoints += 60;
      case 8:
        return totalPoints += 40;
      case 9:
        return totalPoints += 20;
      case 10:
        return totalPoints += 10;
      default:
        return;
      }
    });
    return {
      teamId: team.id,
      bowlPoints: totalPoints,
    };
  });


  return {
    statusCode: 200,
    body: JSON.stringify({teams, weeklyScores, weeklyRankings, records, bowlPoints}),
  };
};
