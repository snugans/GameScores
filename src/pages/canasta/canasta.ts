import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';
import {DatabaseProvider} from "../../providers/database/database";

@IonicPage()
@Component({
  selector: 'page-canasta',
  templateUrl: 'canasta.html',
})
export class CanastaPage {

  matches = [];
  selectedMatch = {};
  playButtonDisabled = true;
  constructor(public navCtrl: NavController, private databaseProvider: DatabaseProvider) {
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

  ionViewDidLoad() {
    console.log('ionViewDidLoad CanastaPage');
  }

}
