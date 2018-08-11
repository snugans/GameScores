import {Injectable} from '@angular/core';
import {Platform} from 'ionic-angular';
import {SQLite, SQLiteObject} from '@ionic-native/sqlite';
import {SQLitePorter} from '@ionic-native/sqlite-porter';
import {Http} from '@angular/http';
import 'rxjs/add/operator/map';
import {BehaviorSubject} from 'rxjs/Rx';
import {Storage} from '@ionic/storage';

@Injectable()
export class DatabaseProvider {
  database: SQLiteObject;
  private databaseReady: BehaviorSubject<boolean>;

  constructor(public sqlitePorter: SQLitePorter, private storage: Storage, private sqlite: SQLite, private platform: Platform, private http: Http) {
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
    this.sqlitePorter.exportDbToSql(this.database).then((data) => {
      console.log('Export erfolgreich.');
    }).catch((e) => {
      console.log('Fehler beim Export!');
    });
  }

  addPlayer(name) {
    let data = [name]
    return this.database.executeSql("INSERT INTO player (name) VALUES (?)", data).then(data => {
      return data;
    }, err => {
      console.log('Error: ', err);
      return err;
    });
  }

  deletePlayer(id) {
    console.log("delete Player id: "+id);
    
    let data = [id]
    return this.database.executeSql("DELETE FROM player WHERE id = (?)", data).then(data => {
      return data;
    }, err => {
      console.log('Error: ', err);
      return err;
    });
  }

  getAllPlayers() {
    return this.database.executeSql("SELECT * FROM player ORDER BY name", []).then((data) => {
      let players = [];
      if (data.rows.length > 0) {
        for (var i = 0; i < data.rows.length; i++) {
          players.push({name: data.rows.item(i).name, id: data.rows.item(i).id});
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
    console.log('Load PlayerId: '+ id);
    return this.database.executeSql("SELECT * FROM player WHERE id = (?)", data).then((data) => {
      let player = {'name': data.rows.item(0)['name'], 'id': data.rows.item(0)['id']};
      console.log('Player Loaded: '+ player);
      return player;
    }, err => {
      console.log('Error: ', err);
      return {};
    });
  }

  getAllCanastaMatches( ){
    return this.database.executeSql("SELECT * FROM canasta_match ORDER BY date DESC", []).then((data) => {
      let matches = [];
      if (data.rows.length > 0) {
        for (var i = 0; i < data.rows.length; i++) {
          matches.push({
            id: data.rows.item(i).id, 
            name: data.rows.item(i).name, 
            date: data.rows.item(i).date, 
            player1Id:  data.rows.item(i).player1Id, 
            player2Id:  data.rows.item(i).player2Id, 
            player3Id:  data.rows.item(i).player3Id, 
            player4Id:  data.rows.item(i).player4Id
          });
        }
      }
      return matches;
    }, err => {
      console.log('Error: ', err);
      return [];
    });
  }

  addCanastaMatch(name, player1Id, player2Id, player3Id, player4Id) {
    let data = [name, player1Id, player2Id, player3Id, player4Id]
    return this.database.executeSql("INSERT INTO canasta_match (name, player1Id, player2Id, player3Id, player4Id) VALUES (?, ?, ?, ?, ?)", data).then(data => {
      return data;
    }, err => {
      console.log('Error: ', err);
      return err;
    });
  }

  deleteCanastaMatch(id) {
    console.log("delete Canasta Match id: "+id);
    
    let data = [id]
    return this.database.executeSql("DELETE FROM canasta_match WHERE id = (?)", data).then(data => {
      return data;
    }, err => {
      console.log('Error: ', err);
      return err;
    });
  }

  getAllCanastaMatchRounds(matchId){
    let data = [matchId]
    return this.database.executeSql("SELECT * FROM canasta_match_round WHERE matchId = (?) ORDER BY date DESC", data).then((data) => {
      let matches = [];
      if (data.rows.length > 0) {
        for (var i = 0; i < data.rows.length; i++) {
          matches.push({
            id: data.rows.item(i).id, 
            name: data.rows.item(i).name, 
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
            beendet: data.rows.item(i).beendet, 
            date: data.rows.item(i).date
          });
        }
      }
      return matches;
    }, err => {
      console.log('Error: ', err);
      return [];
    });
  }

  addCanastaMatchRound(canastaMatchRound) {
  /*   let data = [name, player1Id, player2Id, player3Id, player4Id]
    return this.database.executeSql("INSERT INTO canasta_match_round (name, player1Id, player2Id, player3Id, player4Id) VALUES (?, ?, ?, ?, ?)", data).then(data => {
      return data;
    }, err => {
      console.log('Error: ', err);
      return err;
    }); */
  }

  deleteCanastaMatchRound(roundId) {
    console.log("delete Canasta Match Round id: "+roundId);
    
    let data = [roundId]
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