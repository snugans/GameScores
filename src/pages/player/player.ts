import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { DatabaseProvider } from "../../providers/database/database";
import { AlertController } from 'ionic-angular';
/**
 * Generated class for the PlayerPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-player',
  templateUrl: 'player.html',
})
export class PlayerPage {

  
  players = [];
  player = {};
  selectedPlayer = {};
  constructor(public alertCtrl: AlertController, public navCtrl: NavController, private databaseProvider: DatabaseProvider) {
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

  selectPlayer(player){
    console.log(this.player['name']);
    console.log(player);
    this.selectedPlayer = player;
  }


  addPlayer() {
    this.databaseProvider.addPlayer(this.player['name'])
      .then(data => {
        this.loadPlayerData();
      });
    this.player = {};
  }

  deletePlayer() {
    this.showConfirmDelete(this.selectedPlayer['name']); 
  }


  showConfirmDelete(name) {
    const confirm = this.alertCtrl.create({
      title: 'Spieler löschen',
      message: 'Möchtest du den Spieler ' + name + ' wirklich löschen?',
      buttons: [
        {
          text: 'Abbrechen',
          handler: () => {
            console.log('Disagree clicked');
          }
        },
        {
          text: 'Löschen',
          handler: () => {
            console.log('Agree clicked');
            this.databaseProvider.deletePlayer(this.selectedPlayer['id']);
          }
        }
      ]
    });
    confirm.present();
  }
















  ionViewDidLoad() {
    console.log('ionViewDidLoad PlayerPage');
  }

}
