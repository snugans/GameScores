import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CanastaNewGamePage } from './canasta-new-game';

@NgModule({
  declarations: [
    CanastaNewGamePage,
  ],
  imports: [
    IonicPageModule.forChild(CanastaNewGamePage),
  ],
})
export class CanastaNewGamePageModule {}
