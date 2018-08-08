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
    return this.database.executeSql("SELECT * FROM player", []).then((data) => {
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

  getAllCanastaMatches(){
    return this.database.executeSql("SELECT * FROM canasta_match", []).then((data) => {
      let matches = [];
      if (data.rows.length > 0) {
        for (var i = 0; i < data.rows.length; i++) {
          matches.push({id: data.rows.item(i).id, name: data.rows.item(i).name, date: data.rows.item(i).date});
        }
      }
      return matches;
    }, err => {
      console.log('Error: ', err);
      return [];
    });
  }

  getDatabaseState() {
    return this.databaseReady.asObservable();
  }

}