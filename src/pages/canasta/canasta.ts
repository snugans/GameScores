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
  selectedMatch = {};
  playDeleteButtonDisabled = true;
  constructor(public alertCtrl: AlertController, public navCtrl: NavController, private databaseProvider: DatabaseProvider, public modalCtrl: ModalController) {
    this.databaseProvider.getDatabaseState().subscribe(rdy => {
      if (rdy) {
        this.loadCanastaMatchData();
      }
    })
  }

  selectMatch(match) {
    console.log("Match selected: " + match);
    this.selectedMatch = match;
    this.playDeleteButtonDisabled = null;
  }


  loadCanastaMatchData() {
    this.databaseProvider.getAllCanastaMatches().then(data => {
      this.matches = data;
    });
  }

  startMatch() {
   /*  this.navCtrl.setRoot(CanastaGameOverviewPage); */
   this.navCtrl.push(CanastaGameOverviewPage, {
     match: this.selectedMatch
   });
  }

  addMatch() {
    /* https://www.techiediaries.com/ionic-modals/ */
    let newGamePage = this.modalCtrl.create('CanastaNewGamePage');
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
