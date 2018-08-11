import { ConstantService } from './../../providers/services/constantService';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ModalController } from 'ionic-angular';
import { DatabaseProvider } from "../../providers/database/database";
import { AlertController } from 'ionic-angular';


@IonicPage()
@Component({
  selector: 'page-canasta-game-overview',
  templateUrl: 'canasta-game-overview.html',
})
export class CanastaGameOverviewPage {

  public match;
  rounds = [];
  playersMap = {};
  player1 = {};
  player2 = {};
  player3 = {};
  player4 = {};
  dealer = {};
  dealerStyle = {};
  editButtonDisabled = true;
  selectedRound = {};
  pointsTeam1: CanastaPoints;
  pointsTeam2: CanastaPoints;

  constructor(public alertCtrl: AlertController, private databaseProvider: DatabaseProvider, public navCtrl: NavController, public navParams: NavParams, 
    public modalCtrl: ModalController, private constantService: ConstantService) {
    this.match = navParams.get("match");
    this.playersMap = navParams.get("playersMap");
    console.table(this.playersMap);
    this.pointsTeam1 = {
      pointsTotal: 0
    }
    this.pointsTeam2 = {
      pointsTotal: 0
    }
    console.log('Match gestartet: ' + this.match);
    this.databaseProvider.getDatabaseState().subscribe(rdy => {
      if (rdy) {
        this.loadPlayers();
        this.loadCanastaMatchRounds();
      }
    })
  }

  loadCanastaMatchRounds() {
    this.databaseProvider.getAllCanastaMatchRounds(this.match.id).then(data => {
      this.rounds = data;
    });
    this.calculateResults();
  }

  loadPlayers() {
    this.player1 = this.playersMap[0];
    this.player2 = this.playersMap[1];
    this.player3 = this.playersMap[2];
    this.player4 = this.playersMap[3];
  }

  roundSelected(round) {
    this.selectedRound = round;
  }

  addRound() {
    /* https://www.techiediaries.com/ionic-modals/ */
    var data = { match: this.match, player1: this.player1, player2: this.player2, player3: this.player3, player4: this.player4 };
    let newGamePage = this.modalCtrl.create('CanastaGameResultPage', data);
    newGamePage.onDidDismiss(data => {
      console.log('New Canasta Result closed ' + data);
      if (data) {
        this.loadCanastaMatchRounds();
      }
    });
    newGamePage.present();
  }

  editRound() {

  }

  getThreshold(teamPoints: CanastaPoints) {
    var points = teamPoints.pointsTotal;
    var result: number;
    if (points < 0) {
      result = 15;
    } else if (points < 1500) {
      result = 50;
    } else if (points < 3000) {
      result = 90;
    } else {
      result = 120;
    }

    return result;
  }

  calculateResults() {
    console.log('Calculate Canasta Results');
    var punkteT1 = 0;
    var punkteT2 = 0;
    for (var i = 0; i < this.rounds.length; i++) {
      punkteT1 = punkteT1 + this.rounds[i]['pointsTotalT1'];
      punkteT2 = punkteT2 + this.rounds[i]['pointsTotalT2'];
    }
    this.pointsTeam1.pointsTotal = punkteT1;
    this.pointsTeam2.pointsTotal = punkteT2;
    this.setDealer();
  }

  setDealer() {
    this.dealer = this.playersMap[this.rounds.length % 4];
    if (this.rounds.length % 2 == 0) {
      this.dealerStyle = 'team1bg';
    } else {
      this.dealerStyle = 'team2bg';
    }
  }

  getPointsStyle(round) {
    var style : string;
    if(round['pointsTotalT1']<0){
      style = this.constantService.negativPoints;
    }else{
      style = this.constantService.positivPoints;
    }
    return style;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CanastaGameOverviewPage');
  }

}

interface CanastaPoints {
  pointsTotal: number;
}


