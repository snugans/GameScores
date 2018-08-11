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
  selectedPlayer1: Player = null;
  selectedPlayer2: Player = null;
  selectedPlayer3: Player = null;
  selectedPlayer4: Player = null;
  gameName = null;

  saveButtonDisabled = null;
  constructor(public alertCtrl: AlertController, public viewCtrl: ViewController, public navCtrl: NavController, public navParams: NavParams, private databaseProvider: DatabaseProvider) {

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
    if (this.gameName != null && !playerSet.has(null) && playerSet.size == 4) {
      var match: CanastaMatch = {
        id: -1,
        date: null,
        name: this.gameName,
        player1: this.selectedPlayer1,
        player2: this.selectedPlayer2,
        player3: this.selectedPlayer3,
        player4: this.selectedPlayer4
      }
      this.databaseProvider.addCanastaMatch(match);
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
    this.players = this.navParams.get('players');
    console.log('ionViewDidLoad CanastaNewGamePage');
  }

}
