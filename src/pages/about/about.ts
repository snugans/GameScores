import { File } from '@ionic-native/file';
import { EmailComposer } from '@ionic-native/email-composer';
import { DatabaseProvider } from './../../providers/database/database';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';


@IonicPage()
@Component({
  selector: 'page-about',
  templateUrl: 'about.html',
})
export class AboutPage {

  constructor(public alertCtrl: AlertController, public navCtrl: NavController, public navParams: NavParams,
    public databaseProvider: DatabaseProvider, private file: File, private emailComposer: EmailComposer) {
    this.databaseProvider.getDatabaseState().subscribe(rdy => {
      if (rdy) {
        /*do nothing*/
      }
    })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AboutPage');
  }

  createDump() {
    this.showConfirmSendDump();
  }

  sendEmail(data) {
    let myActualDate = new Date(new Date().getTime()).toISOString().replace(/:/g,'-');
    let filename: string = 'dump' + myActualDate + '.txt';
    console.log(filename);
    this.file.writeFile(this.file.externalDataDirectory, filename, JSON.stringify(data), {})
      .then(() => {
        let email = {
          to: 'tobias.boenning@gmail.com',
          attachments: [
            this.file.externalDataDirectory +''+ filename
          ],

          subject: 'GameScores Database Dump',
          body: JSON.stringify(data),
          isHtml: true
        };
        this.emailComposer.open(email);

      })
      .catch((err) => {
        console.error(err);
      });

  }

  showConfirmSendDump() {
    const confirm = this.alertCtrl.create({
      title: 'Datenbankdump erzeugen',
      message: 'Möchtest du wirklich einen Datenbank Dump erzeugen und per Email verschicken?',
      buttons: [
        {
          text: 'Abbrechen',
          handler: () => {
            console.log('Dump erstellen: Abbrechen clicked');
          }
        },
        {
          text: 'Senden',
          handler: () => {
            console.log('Dump erstellen: Senden clicked');
           
            this.databaseProvider.exportDatabase().then((data) => { 
              this.sendEmail(data);
            });
            
          }
        }
      ]
    });
    confirm.present();
  }

}
