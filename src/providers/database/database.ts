import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { SQLitePorter } from '@ionic-native/sqlite-porter';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { BehaviorSubject } from 'rxjs/Rx';
import { Storage } from '@ionic/storage';

@Injectable()
export class DatabaseProvider {
  database: SQLiteObject;
  private databaseReady: BehaviorSubject<boolean>;

  constructor(public sqlitePorter: SQLitePorter, private storage: Storage, private sqlite: SQLite,
    private platform: Platform, private http: Http) {
    this.databaseReady = new BehaviorSubject(false);
    this.platform.ready().then(() => {
      this.sqlite.create({
        name: 'player.db',
        location: 'default'
      })
        .then((db: SQLiteObject) => {
          this.database = db;
          this.storage.get('database_filled').then(val => {
            if (val) {
              this.databaseReady.next(true);
            } else {
              this.fillDatabase();
            }
          });
        });
    });
  }

  fillDatabase() {
    this.http.get('assets/init.sql')
      .map(res => res.text())
      .subscribe(sql => {
        this.sqlitePorter.importSqlToDb(this.database, sql)
          .then(data => {
            this.databaseReady.next(true);
            this.storage.set('database_filled', true);
          })
          .catch(e => console.error(e));
      });
  }

  exportDatabase() {
   /*  this.sqlitePorter.exportDbToSql(this.database).then((data) => {
      console.log(JSON.stringify(data));
      return data;
    }).catch((e) => {
      console.log('Fehler beim Export!');
    }); */

    return this.sqlitePorter.exportDbToSql(this.database).then((data) => {
      let dump: string = JSON.stringify(data);     
      console.log('Dump: ', dump); 
      return dump;
    }, err => {
      console.log('Error: ', err);
      return "";
    });
  }

 

  addPlayer(player: Player) {
    let data = [player.name]
    return this.database.executeSql("INSERT INTO player (name) VALUES (?)", data).then(data => {
      return data;
    }, err => {
      console.log('Error: ', err);
      return err;
    });
  }

  deletePlayer(player: Player) {
    console.log("delete Player id: " + player.id);

    let data = [player.id]
    return this.database.executeSql("DELETE FROM player WHERE id = (?)", data).then(data => {
      return data;
    }, err => {
      console.log('Error: ', err);
      return err;
    });
  }

  getAllPlayers() {
    return this.database.executeSql("SELECT * FROM player ORDER BY name", []).then((data) => {
      let players: Player[] = [];
      if (data.rows.length > 0) {
        for (var i = 0; i < data.rows.length; i++) {
          let player: Player = {
            id: data.rows.item(i).id,
            name: data.rows.item(i).name
          }
          players.push(player);
        }
      }
      return players;
    }, err => {
      console.log('Error: ', err);
      return [];
    });
  }

  getPlayer(id) {
    let data = [id]
    console.log('Load PlayerId: ' + id);
    return this.database.executeSql("SELECT * FROM player WHERE id = (?)", data).then((data) => {
      let player: Player = {
        name: data.rows.item(0).name,
        id: data.rows.item(0).id
      };
      console.log('Player Loaded: ' + player);
      return player;
    }, err => {
      console.log('Error: ', err);
      return {};
    });
  }

  getAllCanastaMatches() {
    var playersMap = {};
    this.getAllPlayers().then(data => {
      for (var i = 0; i < data.length; i++) {
        playersMap[data[i].id] = data[i];
      }
    });
    return this.database.executeSql("SELECT * FROM canasta_match ORDER BY date DESC", []).then((data) => {
      let matches: CanastaMatch[] = [];
      if (data.rows.length > 0) {
        for (var i = 0; i < data.rows.length; i++) {
          let match: CanastaMatch = {
            id: data.rows.item(i).id,
            name: data.rows.item(i).name,
            date: data.rows.item(i).date,
            player1: playersMap[data.rows.item(i).player1Id],
            player2: playersMap[data.rows.item(i).player2Id],
            player3: playersMap[data.rows.item(i).player3Id],
            player4: playersMap[data.rows.item(i).player4Id]
          };
          matches.push(match);
        }
      }
      return matches;
    }, err => {
      console.log('Error: ', err);
      return [];
    });
  }

  addCanastaMatch(match: CanastaMatch) {
    let data = [match.name, match.player1.id, match.player2.id, match.player3.id, match.player4.id]
    return this.database.executeSql("INSERT INTO canasta_match (name, player1Id, player2Id, player3Id, player4Id) VALUES (?, ?, ?, ?, ?)", data).then(data => {
      return data;
    }, err => {
      console.log('Error: ', err);
      return err;
    });
  }

  deleteCanastaMatch(match: CanastaMatch) {
    console.log("delete Canasta Match id: " + match.id);

    let data = [match.id]
    return this.database.executeSql("DELETE FROM canasta_match WHERE id = (?)", data).then(data => {
      return data;
    }, err => {
      console.log('Error: ', err);
      return err;
    });
  }

  getAllCanastaMatchRounds(match: CanastaMatch) {
    let data = [match.id]
    return this.database.executeSql("SELECT * FROM canasta_match_round WHERE matchId = (?) ORDER BY date", data).then((data) => {
      let matches: CanastaRound[] = [];
      if (data.rows.length > 0) {
        for (var i = 0; i < data.rows.length; i++) {
          var round: CanastaRound = {
            id: data.rows.item(i).id,
            matchId: data.rows.item(i).matchId,
            pointsT1: data.rows.item(i).pointsT1,
            pointsT2: data.rows.item(i).pointsT2,
            redThreeT1: data.rows.item(i).redThreeT1,
            redThreeT2: data.rows.item(i).redThreeT2,
            mixedCanastaT1: data.rows.item(i).mixedCanastaT1,
            mixedCanastaT2: data.rows.item(i).mixedCanastaT2,
            cleanCanastaT1: data.rows.item(i).cleanCanastaT1,
            cleanCanastaT2: data.rows.item(i).cleanCanastaT2,
            jokerCanastaT1: data.rows.item(i).jokerCanastaT1,
            jokerCanastaT2: data.rows.item(i).jokerCanastaT2,
            pointsTotalT1: data.rows.item(i).pointsTotalT1,
            pointsTotalT2: data.rows.item(i).pointsTotalT2,
            beendetId: data.rows.item(i).beendet,
            date: data.rows.item(i).date
          }
          matches.push(round);
        }
      }
      return matches;
    }, err => {
      console.log('Error: ', err);
      return [];
    });
  }

  addCanastaRound(cr: CanastaRound) {
    let data = [cr.matchId, cr.pointsT1, cr.pointsT2, cr.redThreeT1, cr.redThreeT2,
    cr.mixedCanastaT1, cr.mixedCanastaT2, cr.cleanCanastaT1, cr.cleanCanastaT2,
    cr.jokerCanastaT1, cr.jokerCanastaT2, cr.pointsTotalT1, cr.pointsTotalT2, cr.beendetId]
    return this.database.executeSql(
      "INSERT INTO canasta_match_round (matchId, pointsT1, pointsT2, redThreeT1, redThreeT2, mixedCanastaT1, mixedCanastaT2, cleanCanastaT1, cleanCanastaT2, jokerCanastaT1, jokerCanastaT2, pointsTotalT1, pointsTotalT2, beendet) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", data)
      .then(data => {
        return data;
      }, err => {
        console.log('Error: ', err);
        return err;
      });
  }

  updateCanastaRound(cr: CanastaRound) {
    let data = [cr.pointsT1, cr.pointsT2, cr.redThreeT1, cr.redThreeT2,
    cr.mixedCanastaT1, cr.mixedCanastaT2, cr.cleanCanastaT1, cr.cleanCanastaT2,
    cr.jokerCanastaT1, cr.jokerCanastaT2, cr.pointsTotalT1, cr.pointsTotalT2, cr.beendetId, cr.id]
    console.log(JSON.stringify(cr));
    return this.database.executeSql(
      "UPDATE canasta_match_round SET pointsT1 = (?), pointsT2 = (?), redThreeT1 = (?), redThreeT2 = (?), mixedCanastaT1 = (?), mixedCanastaT2 = (?), cleanCanastaT1 = (?), cleanCanastaT2 = (?), jokerCanastaT1 = (?), jokerCanastaT2 = (?), pointsTotalT1 = (?), pointsTotalT2 = (?), beendet = (?) WHERE ID = (?)", data)
      .then(data => {
        return data;
      }, err => {
        console.log('Error: ', err);
        return err;
      });
  }

  deleteCanastaMatchRound(round: CanastaRound) {
    console.log("delete Canasta Match Round id: " + round.id);

    let data = [round.id]
    return this.database.executeSql("DELETE FROM canasta_match_round WHERE id = (?)", data).then(data => {
      return data;
    }, err => {
      console.log('Error: ', err);
      return err;
    });
  }

  getDatabaseState() {
    return this.databaseReady.asObservable();
  }

}