import {DatabaseProvider} from "../../providers/database/database";
import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  players = [];
  player = {};
  constructor(public navCtrl: NavController, private databaseProvider: DatabaseProvider) {
    this.databaseProvider.getDatabaseState().subscribe(rdy => {
      if (rdy) {
        this.loadPlayerData();
      }
    })
  } 


  loadPlayerData() {
    this.databaseProvider.getAllPlayers().then(data => {
      this.players = data;

    });
  }

  addPlayer() {
    this.databaseProvider.addPlayer(this.player['name'])
      .then(data => {
        this.loadPlayerData();
      });
    this.player = {};
  }
  
}
