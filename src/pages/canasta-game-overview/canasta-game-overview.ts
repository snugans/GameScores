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
  team1: string = "t1";
  team2: string = "t2";
  rounds: CanastaRound[] = [];
  selectedRound: CanastaRound;
  playersMap = {};
  player1: Player;
  player2: Player;
  player3: Player;
  player4: Player;
  dealer: Player;
  dealerStyle = {};
  editButtonDisabled = true;
  punkteTotalT1: number;
  punkteTotalT2: number;

  constructor(public alertCtrl: AlertController, private databaseProvider: DatabaseProvider, public navCtrl: NavController, public navParams: NavParams,
    public modalCtrl: ModalController, private constantService: ConstantService) {
    this.match = navParams.get("match");
    this.playersMap = navParams.get("playersMap");
    this.player1 = this.playersMap[0];
    this.player2 = this.playersMap[1];
    this.player3 = this.playersMap[2];
    this.player4 = this.playersMap[3];
    this.databaseProvider.getDatabaseState().subscribe(rdy => {
      if (rdy) {
        this.loadCanastaMatchRounds();
      }
    })
  }

  loadCanastaMatchRounds() {
    this.databaseProvider.getAllCanastaMatchRounds(this.match).then(data => {
      this.rounds = data;
      this.calcPointsTotal(data);
      this.setDealer(data);
    });
  }

  selectRound(round: CanastaRound) {
    this.selectedRound = round;
    if(round==null){
      this.editButtonDisabled=true;
    }else{
      this.editButtonDisabled=null;
    }
  }

  addRound() {
    /* https://www.techiediaries.com/ionic-modals/ */
    var data = { match: this.match, player1: this.player1, player2: this.player2, player3: this.player3, player4: this.player4, playersMap: this.playersMap };
    let newGamePage = this.modalCtrl.create('CanastaGameResultPage', data);
    newGamePage.onDidDismiss(data => {
      console.log('New Canasta Result closed ' + data);
      if (data) {
        this.loadCanastaMatchRounds();
        this.selectRound(null);
      }
    });
    newGamePage.present();
  }

  editRound() {
    var data = { match: this.match, player1: this.player1, player2: this.player2, player3: this.player3, player4: this.player4, playersMap: this.playersMap, selectedRound: this.selectedRound };
    let newGamePage = this.modalCtrl.create('CanastaGameResultPage', data);
    newGamePage.onDidDismiss(data => {
      console.log('Edit Canasta Result closed ' + data);
      if (data) {
        this.loadCanastaMatchRounds();
        this.selectRound(null);
      }
    });
    newGamePage.present();
    
  }

  getThreshold(team: string) {
    var points = team == this.team1 ? this.punkteTotalT1 : this.punkteTotalT2;
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

  calcPointsTotal(rounds: CanastaRound[]) {
    console.log('Calculate Canasta Results');
    var punkteT1 = 0;
    var punkteT2 = 0;
    for (var i = 0; i < rounds.length; i++) {
      punkteT1 = punkteT1 + rounds[i].pointsTotalT1;
      punkteT2 = punkteT2 + rounds[i].pointsTotalT2;
    }
    this.punkteTotalT1 = punkteT1;
    this.punkteTotalT2 = punkteT2;

  }

  setDealer(rounds: CanastaRound[]) {
    this.dealer = this.playersMap[rounds.length % 4];
    if (this.rounds.length % 2 == 0) {
      this.dealerStyle = 'team1bg';
    } else {
      this.dealerStyle = 'team2bg';
    }
  }

  getPointsStyle(team: string, round: CanastaRound) {
    var style: string;
    if ((team == this.team1 && round.pointsTotalT1 < 0) || (team == this.team2 && round.pointsTotalT2 < 0)) {
      style = this.constantService.negativPoints;
    } else {
      style = this.constantService.positivPoints;
    }
    return style;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CanastaGameOverviewPage');
  }

}



