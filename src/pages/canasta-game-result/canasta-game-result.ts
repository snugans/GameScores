import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ViewController } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { ConstantService } from '../../providers/services/constantService';


@IonicPage()
@Component({
  selector: 'page-canasta-game-result',
  templateUrl: 'canasta-game-result.html',
})
export class CanastaGameResultPage {

  public add = 'add';
  public sub = 'sub';

  public match;
  player1 = {};
  player2 = {};
  player3 = {};
  player4 = {};
  beendetPlayer = {};
  team1: CanastaTeam;
  team2: CanastaTeam;

  constructor(public alertCtrl: AlertController, public viewCtrl: ViewController, public navCtrl: NavController,
    public navParams: NavParams, private constantService: ConstantService) {
    this.team1 = {
      points: 0,
      redThree: 0,
      cleanCanasta: 0,
      mixedCanasta: 0, 
      jokerCanasta: 0,
      pointsTotal: 0,
      beendet: {},
      players: [this.player1, this.player3]
    }
    this.team2 = {
      points: 0,
      redThree: 0,
      cleanCanasta: 0,
      mixedCanasta: 0,
      jokerCanasta: 0,
      pointsTotal: 0,
      beendet: {},
      players: [this.player2, this.player4]
    }
  }

  cancel() {
    this.viewCtrl.dismiss(false);
  }

  save() {
    /*  let playerSet = new Set();
     playerSet.add(this.selectedPlayer1);
     playerSet.add(this.selectedPlayer2);
     playerSet.add(this.selectedPlayer3);
     playerSet.add(this.selectedPlayer4);
     if (this.gameName != null && !playerSet.has(null) && playerSet.size == 4 ) {
       this.databaseProvider.addCanastaMatch(this.gameName, this.selectedPlayer1['id'], this.selectedPlayer2['id'], this.selectedPlayer3['id'], this.selectedPlayer4['id']);
       this.viewCtrl.dismiss(true);
     } else {
       const alert = this.alertCtrl.create({
         title: 'Fehler',
         subTitle: 'Es müssen alle Felder ausgefüllt werden und die Spieler dürfen nicht mehrfach zugewiesen werden.',
         buttons: ['OK']
       });
       alert.present();
     } */
  }

  clickRedThree(team: CanastaTeam, action: string) {
    if (action == this.add && this.team1.redThree + this.team2.redThree < 4) {
      team.redThree = team.redThree + 1;
    } else if (action == this.sub && team.redThree > 0) {
      team.redThree = team.redThree - 1;
    }
    this.calculatePoints(team);
  }

  clickCleanCanasta(team: CanastaTeam, action: string) {
    if (action == this.add) {
      team.cleanCanasta = team.cleanCanasta + 1;
    } else if (action == this.sub && team.cleanCanasta > 0) {
      team.cleanCanasta = team.cleanCanasta - 1;
    }
    this.calculatePoints(team);
  }

  clickMixedCanasta(team: CanastaTeam, action: string) {
    if (action == this.add) {
      team.mixedCanasta = team.mixedCanasta + 1;
    } else if (action == this.sub && team.mixedCanasta > 0) {
      team.mixedCanasta = team.mixedCanasta - 1;
    }
    this.calculatePoints(team);
  }

  clickJokerCanasta(team: CanastaTeam, action: string) {
    if (action == this.add) {
      team.jokerCanasta = team.jokerCanasta + 1;
    } else if (action == this.sub && team.jokerCanasta > 0) {
      team.jokerCanasta = team.jokerCanasta - 1;
    }
    this.calculatePoints(team);
  }

  setTeamPoints(team: CanastaTeam, value: number) {
    team.points = value;
    this.calculatePoints(team);
  }

  calculatePoints(team: CanastaTeam) {
    var pointsTotal: number = 0;
    var canastaPoints: CanastaPoints = this.constantService.canastaPoints;
    if (team.redThree == 4) {
      pointsTotal += canastaPoints.redThree4;
    } else {
      pointsTotal += team.redThree * canastaPoints.redThree;
    }
    pointsTotal += team.cleanCanasta * canastaPoints.cleanCanasta;
    pointsTotal += team.mixedCanasta * canastaPoints.mixedCanasta;
    pointsTotal += team.jokerCanasta * canastaPoints.jokerCanasta;
    pointsTotal += 1 * team.points;
    if (team.cleanCanasta == 0 && team.mixedCanasta == 0 && team.jokerCanasta == 0) {
      pointsTotal *= -1;
    }else if(team.players[0] == this.beendetPlayer || team.players[1] == this.beendetPlayer){
      pointsTotal += 1 * canastaPoints.beendet;
    }
    console.log("Player 1 -> "+ team.players[0]);
    console.log("Player 2 -> "+ team.players[1]);
    console.log("Player Beendet -> "+ this.beendetPlayer);
    team.pointsTotal = pointsTotal;
  }

  beendenDisabled(team: CanastaTeam) {
    if (team.cleanCanasta == 0 && team.mixedCanasta == 0 && team.jokerCanasta == 0) {
      return true;
    }
    return false;
  }

  getPointsStyle(team: CanastaTeam) {
    var style: string;
    if (team.pointsTotal < 0) {
      style = this.constantService.negativPoints;
    } else {
      style = this.constantService.positivPoints;
    }
    return style;
  }

  ionViewDidLoad() {
    this.match = this.navParams.get('match');
    this.player1 = this.navParams.get('player1');
    this.player2 = this.navParams.get('player2');
    this.player3 = this.navParams.get('player3');
    this.player4 = this.navParams.get('player4');
    console.log('ionViewDidLoad CanastaGameResultPage');
  }

}

