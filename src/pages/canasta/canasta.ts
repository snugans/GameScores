import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';
import { ModalController } from 'ionic-angular';
import { DatabaseProvider } from "../../providers/database/database";

@IonicPage()
@Component({
  selector: 'page-canasta',
  templateUrl: 'canasta.html',
})
export class CanastaPage {

  matches = [];
  selectedMatch = {};
  playButtonDisabled = true;
  constructor(public navCtrl: NavController, private databaseProvider: DatabaseProvider, public modalCtrl : ModalController) {
    this.databaseProvider.getDatabaseState().subscribe(rdy => {
      if (rdy) {
        this.loadCanastaMatchData();
      }
    })
  } 

  selectMatch(match){
    console.log("Match selected: "+match);
    this.selectedMatch= match;
    this.playButtonDisabled=null;
  }


  loadCanastaMatchData() {
    this.databaseProvider.getAllCanastaMatches().then(data => {
      this.matches = data;
    });
  }

  addMatch(){
   /* https://www.techiediaries.com/ionic-modals/ */
   var newGamePage = this.modalCtrl.create('CanastaNewGamePage'); 
   newGamePage.present(); 
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CanastaPage');
  }

}
