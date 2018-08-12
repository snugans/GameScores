import { EmailComposer } from '@ionic-native/email-composer';
import { File } from '@ionic-native/file';
import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { CanastaPage } from './../pages/canasta/canasta';
import { PlayerPage } from './../pages/player/player';
import { AboutPage } from './../pages/about/about';
import { CanastaGameOverviewPage } from './../pages/canasta-game-overview/canasta-game-overview';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { DatabaseProvider } from '../providers/database/database';
import { ConstantService } from './../providers/services/constantService';

import { IonicStorageModule } from '@ionic/storage';
import { HttpModule } from "@angular/http";

import { SQLitePorter } from '@ionic-native/sqlite-porter';
import { SQLite } from '@ionic-native/sqlite';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    CanastaPage,
    CanastaGameOverviewPage,
    PlayerPage,
    AboutPage
  ],
  imports: [
    BrowserModule,
    HttpModule, 
    IonicStorageModule.forRoot(),
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    CanastaPage,
    CanastaGameOverviewPage,
    PlayerPage,
    AboutPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    File,
    EmailComposer,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    DatabaseProvider,
    ConstantService,
    SQLitePorter,
    SQLite
  ]
})
export class AppModule {}
