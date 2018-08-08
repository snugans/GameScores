import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CanastaPage } from './canasta';

@NgModule({
  declarations: [
    CanastaPage,
  ],
  imports: [
    IonicPageModule.forChild(CanastaPage),
  ],
})
export class CanastaPageModule {}
