import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CanastaGameOverviewPage } from './canasta-game-overview';

@NgModule({
  declarations: [
    CanastaGameOverviewPage,
  ],
  imports: [
    IonicPageModule.forChild(CanastaGameOverviewPage),
  ],
})
export class CanastaGameOverviewPageModule {}
