CREATE TABLE IF NOT EXISTS player(id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT);
INSERT INTO player(name) VALUES ('Tobi');
INSERT INTO player(name) VALUES ('Danni');


CREATE TABLE IF NOT EXISTS canasta_match(id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, date DATETIME DEFAULT CURRENT_TIMESTAMP  );
INSERT INTO canasta_match(name) VALUES ('TestGame');

CREATE TABLE IF NOT EXISTS canasta_match_round(id INTEGER PRIMARY KEY AUTOINCREMENT, canastaMatchId INTEGER, pointsT1 INTEGER, pointsT2 INTEGER, redThreeT1 INTEGER, redThreeT2 INTEGER, mixedCanastaT1 INTEGER, mixedCanastaT2 INTEGER, cleanCanastaT1 INTEGER, cleanCanastaT2 INTEGER, jokerCanastaT1 INTEGER, jokerCanastaT2 INTEGER, pointsTotalT1 INTEGER, pointsTotalT2 INTEGER );

CREATE TABLE IF NOT EXISTS canasta_match_player(canastaMatchId INTEGER, playerId INTEGER, teamId INTEGER);