CREATE TABLE IF NOT EXISTS player(id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT);
INSERT INTO player(name) VALUES ('Tobi');
INSERT INTO player(name) VALUES ('Danni');
INSERT INTO player(name) VALUES ('Stephan');
INSERT INTO player(name) VALUES ('Julia');


CREATE TABLE IF NOT EXISTS canasta_match(id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, date DATETIME DEFAULT CURRENT_TIMESTAMP, player1Id INTEGER, player2Id INTEGER, player3Id INTEGER, player4Id INTEGER  );
INSERT INTO canasta_match(name, player1Id, player2Id, player3Id, player4Id) VALUES ('TestGame', 1, 2, 3, 4);

CREATE TABLE IF NOT EXISTS canasta_match_round(id INTEGER PRIMARY KEY AUTOINCREMENT, canastaMatchId INTEGER, pointsT1 INTEGER, pointsT2 INTEGER, redThreeT1 INTEGER, redThreeT2 INTEGER, mixedCanastaT1 INTEGER, mixedCanastaT2 INTEGER, cleanCanastaT1 INTEGER, cleanCanastaT2 INTEGER, jokerCanastaT1 INTEGER, jokerCanastaT2 INTEGER, pointsTotalT1 INTEGER, pointsTotalT2 INTEGER, beendet INTEGER);