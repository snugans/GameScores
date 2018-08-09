import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';


@IonicPage()
@Component({
  selector: 'page-canasta-game-overview',
  templateUrl: 'canasta-game-overview.html',
})
export class CanastaGameOverviewPage {

  public match;
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.match = navParams.get("match");
    console.log('Match gestartet: '+this.match);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CanastaGameOverviewPage');
  }

}
