import { CanastaGameOverviewPage } from './../canasta-game-overview/canasta-game-overview';
import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';
import { ModalController } from 'ionic-angular';
import { DatabaseProvider } from "../../providers/database/database";
import { AlertController } from 'ionic-angular';


@IonicPage()
@Component({
  selector: 'page-canasta',
  templateUrl: 'canasta.html',
})
export class CanastaPage {

  matches = [];
  players = [];
  playersMap = {};
  selectedMatch = {};
  playDeleteButtonDisabled = true;
  constructor(public alertCtrl: AlertController, public navCtrl: NavController, private databaseProvider: DatabaseProvider, public modalCtrl: ModalController) {
    this.databaseProvider.getDatabaseState().subscribe(rdy => {
      if (rdy) {
        this.loadPlayerData();
        this.loadCanastaMatchData();
      }
    })
  }

  selectMatch(match) {
    console.log("Match selected: " + match);
    this.selectedMatch = match;
    this.playDeleteButtonDisabled = null;
  }

  getPlayer(id){
    return this.playersMap[id]; 
  }

  loadPlayerData() {
    this.databaseProvider.getAllPlayers().then(data => {
      this.players = data;
      for (var i = 0; i < data.length; i++) {
        this.playersMap[data[i]['id']] = data[i];
      }
    });
  }

  loadCanastaMatchData() {
    this.databaseProvider.getAllCanastaMatches().then(data => {
      this.matches = data;
    });
  }

  startMatch() {
    let playersMapSorted = {};
    playersMapSorted[0] = this.playersMap[this.selectedMatch['player1Id']];
    playersMapSorted[1] = this.playersMap[this.selectedMatch['player2Id']];
    playersMapSorted[2] = this.playersMap[this.selectedMatch['player3Id']];
    playersMapSorted[3] = this.playersMap[this.selectedMatch['player4Id']];
   this.navCtrl.push(CanastaGameOverviewPage, {
     match: this.selectedMatch,
     playersMap: playersMapSorted
   });
  }

  addMatch() {
    /* https://www.techiediaries.com/ionic-modals/ */
    var players = { players : this.players };
    let newGamePage = this.modalCtrl.create('CanastaNewGamePage', players );
    newGamePage.onDidDismiss(data => {
      this.playDeleteButtonDisabled = true;
      console.log('New Match closed ' + data);
      if (data) {
        this.loadCanastaMatchData();
      }
    });
    newGamePage.present();
  }

  deleteMatch() {
    this.showConfirmDelete(this.selectedMatch);
  }

  showConfirmDelete(match) {
    const confirm = this.alertCtrl.create({
      title: 'Spieler löschen',
      message: 'Möchtest du die Begegnung ' + match['name'] + ' vom ' + match['date'] + ' wirklich löschen?',
      buttons: [
        {
          text: 'Abbrechen',
          handler: () => {
            console.log('Match Löschen: Abbrechen clicked');
          }
        },
        {
          text: 'Löschen',
          handler: () => {
            console.log('Match Löschen: Löschen clicked');
            this.databaseProvider.deleteCanastaMatch(match['id']);
            this.playDeleteButtonDisabled = true;
            this.loadCanastaMatchData();
          }
        }
      ]
    });
    confirm.present();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CanastaPage');
  }

}
