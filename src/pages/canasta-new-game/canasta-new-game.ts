import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { DatabaseProvider } from "../../providers/database/database";
import { ViewController } from 'ionic-angular';
import { AlertController } from 'ionic-angular';


@IonicPage()
@Component({
  selector: 'page-canasta-new-game',
  templateUrl: 'canasta-new-game.html',
})
export class CanastaNewGamePage {

  players = [];
  selectedPlayer1 = null;
  selectedPlayer2 = null;
  selectedPlayer3 = null;
  selectedPlayer4 = null;
  gameName = null;

  saveButtonDisabled = null;
  constructor(public alertCtrl: AlertController, public viewCtrl: ViewController, public navCtrl: NavController, public navParams: NavParams, private databaseProvider: DatabaseProvider) {
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

  cancel() {
    this.viewCtrl.dismiss(false);
  }

  save() {
    let playerSet = new Set();
    playerSet.add(this.selectedPlayer1);
    playerSet.add(this.selectedPlayer2);
    playerSet.add(this.selectedPlayer3);
    playerSet.add(this.selectedPlayer4);
    if (this.gameName != null && !playerSet.has(null) && playerSet.size == 4 ) {
      this.databaseProvider.addCanastaMatch(this.gameName, this.selectedPlayer1, this.selectedPlayer2, this.selectedPlayer3, this.selectedPlayer4);
      this.viewCtrl.dismiss(true);
    } else {
      const alert = this.alertCtrl.create({
        title: 'Fehler',
        subTitle: 'Es müssen alle Felder ausgefüllt werden und die Spieler dürfen nicht mehrfach zugewiesen werden.',
        buttons: ['OK']
      });
      alert.present();
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CanastaNewGamePage');
  }

}
