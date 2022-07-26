// SELECT
// (SELECT name FROM collegepickems."Schools" WHERE id = 2) AS Away,
// COALESCE(away_team_score, 0) AS AwayScore,
// (SELECT name FROM collegepickems."Schools" WHERE id = 1) AS Home,
// COALESCE(home_team_score, 0) AS HomeScore,
// week_number,
// year
// FROM collegepickems."Games"
// WHERE id = 1