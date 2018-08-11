import { DatabaseProvider } from './../../providers/database/database';
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

  public match: CanastaMatch;
  playersMap = {};
  player1: Player;
  player2: Player;
  player3: Player;
  player4: Player;
  beendetPlayerNr: string = "-1";
  team1: CanastaTeam;
  team2: CanastaTeam;
  editMode: boolean;
  roundId: number = -1;

  constructor(public alertCtrl: AlertController, public viewCtrl: ViewController, public navCtrl: NavController,
    public navParams: NavParams, private constantService: ConstantService, public databaseProvider: DatabaseProvider) {
    this.match = this.navParams.get('match');
    this.player1 = this.navParams.get('player1');
    this.player2 = this.navParams.get('player2');
    this.player3 = this.navParams.get('player3');
    this.player4 = this.navParams.get('player4');
    this.playersMap = this.navParams.get('playersMap');
    this.editMode = this.navParams.get('selectedRound') != null;
    console.log("Canasta Round Mode: " + this.editMode ? "EDIT" : "SAVE")
    if (this.editMode) {
      this.setTeams(this.navParams.get('selectedRound'));
    } else {
      this.initTeams();
    }

  }

  setTeams(round: CanastaRound) {
    if (this.playersMap[0].id == round.beendetId) {
      this.beendetPlayerNr = "0";
    } else if (this.playersMap[1].id == round.beendetId) {
      this.beendetPlayerNr = "1";
    }
    else if (this.playersMap[2].id == round.beendetId) {
      this.beendetPlayerNr = "2";
    }
    else if (this.playersMap[3].id == round.beendetId) {
      this.beendetPlayerNr = "3";
    }
    this.roundId = round.id;
    this.team1 = {
      points: round.pointsT1,
      redThree: round.redThreeT1,
      cleanCanasta: round.cleanCanastaT1,
      mixedCanasta: round.mixedCanastaT1,
      jokerCanasta: round.jokerCanastaT1,
      pointsTotal: round.pointsTotalT1,
      beendetId: round.beendetId,
      players: [this.player1, this.player3]
    }
    this.team2 = {
      points: round.pointsT2,
      redThree: round.redThreeT2,
      cleanCanasta: round.cleanCanastaT2,
      mixedCanasta: round.mixedCanastaT2,
      jokerCanasta: round.jokerCanastaT2,
      pointsTotal: round.pointsTotalT2,
      beendetId: round.beendetId,
      players: [this.player2, this.player4]
    }
  }


  initTeams() {
    this.team1 = {
      points: 0,
      redThree: 0,
      cleanCanasta: 0,
      mixedCanasta: 0,
      jokerCanasta: 0,
      pointsTotal: 0,
      beendetId: -1,
      players: [this.player1, this.player3]
    }
    this.team2 = {
      points: 0,
      redThree: 0,
      cleanCanasta: 0,
      mixedCanasta: 0,
      jokerCanasta: 0,
      pointsTotal: 0,
      beendetId: -1,
      players: [this.player2, this.player4]
    }
  }

  cancel() {
    this.viewCtrl.dismiss(false);
  }

  save() {
    let beendetPlayerInt = parseInt(this.beendetPlayerNr);
    if (beendetPlayerInt >= 0) {
      let beendetPlayer: Player = this.playersMap[beendetPlayerInt];
      let canastaRound: CanastaRound = {
        id: this.roundId,
        matchId: this.match.id,
        pointsT1: this.team1.points,
        pointsT2: this.team2.points,
        redThreeT1: this.team1.redThree,
        redThreeT2: this.team2.redThree,
        mixedCanastaT1: this.team1.mixedCanasta,
        mixedCanastaT2: this.team2.mixedCanasta,
        cleanCanastaT1: this.team1.cleanCanasta,
        cleanCanastaT2: this.team2.cleanCanasta,
        jokerCanastaT1: this.team1.jokerCanasta,
        jokerCanastaT2: this.team2.jokerCanasta,
        pointsTotalT1: this.team1.pointsTotal,
        pointsTotalT2: this.team2.pointsTotal,
        beendetId: beendetPlayer.id,
        date: null
      }
      console.log("Save Mode: " + this.editMode ? "EDIT" : "SAVE")
      if (this.editMode) {
        this.databaseProvider.updateCanastaRound(canastaRound);
      } else {
        this.databaseProvider.addCanastaRound(canastaRound);
      }
      this.viewCtrl.dismiss(true);
    } else {
      const alert = this.alertCtrl.create({
        title: 'Fehler',
        subTitle: 'Wer hat das Spiel beendet?',
        buttons: ['OK']
      });
      alert.present();
    }
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

  calculateAllPoints() {
    this.calculatePoints(this.team1);
    this.calculatePoints(this.team2);
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

    let beendetPlayerInt = parseInt(this.beendetPlayerNr);
    if (beendetPlayerInt >= 0) {
      let beendetPlayer: Player = this.playersMap[beendetPlayerInt];
      if (beendetPlayer != null && team.players[0].id == beendetPlayer.id || team.players[1].id == beendetPlayer.id) {
        pointsTotal += 1 * canastaPoints.beendet;
      }
      if (beendetPlayer != null) {
        this.team1.beendetId = beendetPlayer.id;
        this.team2.beendetId = beendetPlayer.id;
      }
    }

    if (team.cleanCanasta == 0 && team.mixedCanasta == 0 && team.jokerCanasta == 0) {
      pointsTotal *= -1;
    }
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
    console.log('ionViewDidLoad CanastaGameResultPage');
  }

}

