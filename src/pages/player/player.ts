import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';
import { DatabaseProvider } from "../../providers/database/database";
import { AlertController } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-player',
  templateUrl: 'player.html',
})
export class PlayerPage {

  
  players = [];
  selectedPlayer = {};
  deleteButtonDisabled = true;
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
    console.log("Player selected: "+player);
    this.selectedPlayer = player;
    this.deleteButtonDisabled=null;
  }

  deletePlayer() {
    this.showConfirmDelete(this.selectedPlayer); 
  }


  showConfirmDelete(player) {
    const confirm = this.alertCtrl.create({
      title: 'Spieler löschen',
      message: 'Möchtest du den Spieler ' + player['name'] + ' wirklich löschen?',
      buttons: [
        {
          text: 'Abbrechen',
          handler: () => {
            console.log('Spieler Löschen: Abbrechen clicked');
          }
        },
        {
          text: 'Löschen',
          handler: () => {
            console.log('Spieler Löschen: Löschen clicked');
            this.databaseProvider.deletePlayer(player['id']);
            this.loadPlayerData();
          }
        }
      ]
    });
    confirm.present();
  }

  addPlayer() {
    let alert = this.alertCtrl.create({
      title: 'Spieler hinzufügen',
      inputs: [
        {
          name: 'name',
          placeholder: 'Spielername'
        }
        /* ,
        {
          name: 'password',
          placeholder: 'Password',
          type: 'password'
        } */
      ],
      buttons: [
        {
          text: 'Abbrechen',
          role: 'cancel',
          handler: data => {
            console.log('Spieler erstellen: Abbrechen clicked');
          }
        },
        {
          text: 'Erstellen',
          handler: data => {
            console.log('Spieler erstellen: Erstellen clicked');
            console.log(data.name);
            if (data.name != null && data.name.trim()!="") {
              this.databaseProvider.addPlayer(data.name)
              .then(data => {
                this.loadPlayerData();
              });
            }else{
              this.addPlayerNoNameAlert();
            }
          }
        }
      ]
    });
    alert.present();
  }


  addPlayerNoNameAlert() {
    let alert = this.alertCtrl.create({
      title: 'Fehler',
      subTitle: 'Es muss ein Spielername eingegeben werden!',
      buttons: ['OK']
    });
    alert.present();
  }



  ionViewDidLoad() {
    console.log('ionViewDidLoad PlayerPage');
  }

}
