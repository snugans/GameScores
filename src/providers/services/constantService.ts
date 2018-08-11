import { Injectable } from "@angular/core";

@Injectable()
export class ConstantService {

    public negativPoints = 'negativPoints';
    public positivPoints = 'positivPoints';

    public canastaPoints: CanastaPoints = {
        redThree: 100,
        redThree4: 800,
        cleanCanasta: 500,
        mixedCanasta: 300,
        jokerCanasta: 1000,
        beendet:100
    }


}