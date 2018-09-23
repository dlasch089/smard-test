import { Component, OnInit } from '@angular/core';
import { EnergydataService } from '../../services/energydata.service';

@Component({
  selector: 'app-dataview',
  templateUrl: './dataview.component.html',
  styleUrls: ['./dataview.component.css']
})
export class DataviewComponent implements OnInit {

  rawData: Array<any>;
  rawPrognosis: Array<any>;

  currentEnergy: Array<any> = [];
  prognosisEnergyNow: Array<any> = [];

  prognosisEnergyOneHour: Array<any> = [];
  prognosisEnergyTwoHour: Array<any> = [];

  currentRenewableShare: Number;
  futureRenewableShare: Number;
  futureTwoRenewableShare: Number;

  now:Number;

  getLastSunday(date) {
    if(date.getDay() != 0){
      date.setDate(date.getDate() - date.getDay());
      return date.setHours(24,0,0,0);
    } else{
      date.setDate(date.getDate() - 7)
      return date.setHours(24,0,0,0);
    }
  }
  
  // timestamp = this.getLastSunday(new Date());

  powerGeneratorCategories = {
    bio: 103, 
    water: 1226, 
    windOffshore: 1225, 
    windOnshore: 100, 
    pv: 102, 
    otherRenewables: 1228, 
    nuclear: 1224, 
    brownCoal: 1223, 
    hardCoal: 111, 
    naturalGas: 112, 
    pumpedStorage: 113, 
    others: 1227,
  };

  powerPrognosis = {
    all: 122,
    others: 715,
    windOffshore: 3791,
    windOnshore: 123,
    pv: 125,
  };

  constructor(public energyService: EnergydataService) { }

  ngOnInit() {
    this.now = new Date().getTime();
    // Gets the last available Production data and saves it in an array
    this.getCurrentProduction(this.powerGeneratorCategories, this.currentEnergy);

    // gets the data for the full week and calculates the renewable share for the current quarterly hour:
    this.getPrognosis(this.powerPrognosis, this.prognosisEnergyNow, this.findNow)
      .then(array => this.getRenewableShare(array))
      .then(share => this.currentRenewableShare = share);

    // gets the data for the full week and calculates the renewable share for the quarterly hour one hour after now:
    this.getPrognosis(this.powerPrognosis, this.prognosisEnergyOneHour, this.findInOneHour)
      .then(array => this.getRenewableShare(array))
      .then(share => this.futureRenewableShare = share);

    this.getPrognosis(this.powerPrognosis, this.prognosisEnergyTwoHour, this.findInTwoHour)
      .then(array => this.getRenewableShare(array))
      .then(share => this.futureTwoRenewableShare = share);

      // trying to make an array or object for the hours to only use the function once:
    // this.getPrognosis(this.powerPrognosis, this.hoursKey, this.finInHour+time)
    //   .then(array => this.getRenewableShare(array))
    //   .then(share => this.futureTwoRenewableShare = share);
  }

  async getCurrentProduction(object, array){
    for(var key in object){
      await this.energyService.getAllData(this.getLastSunday(new Date()), object[key])
      .then(data => {
        // console.log(data);
        this.rawData = JSON.parse(data.contents).series;
        let index = this.rawData.length;
        while (index-- && !this.rawData[index][1]);
        return array.push([key, this.rawData[index]]);
      })
    }
  }

  async getPrognosis(object, array, findFunction) {
    for(var key in object) {
      await this.energyService.getAllData(this.getLastSunday(new Date()), object[key])
      .then(data => {    
        this.rawPrognosis = JSON.parse(data.contents).series;
        const now = new Date().getTime();
        const index = this.rawPrognosis.find(findFunction);
        return array.push([key, index]);
      });
    }
    return array;
  }

  // async getFuturePrognosis(object, array) {
  //   for(var key in object) {
  //     await this.energyService.getAllData(this.getLastSunday(new Date()), object[key])
  //     .then(data => {    
  //       this.rawPrognosis = JSON.parse(data.contents).series;
  //       const now = new Date().getTime();
  //       const index = this.rawPrognosis.find(this.findInOneHour);
  //       return array.push([key, index]);
  //     });
  //   }
  //   return array;
  // }

  findNow(element) {
    const time = new Date().getTime();
    // console.log(time);
    return element[0] > time;
  }

  findInOneHour(element) {
    const time = new Date().getTime() + 3600000;
    // console.log(time);
    return element[0] > time;
  }

  findInTwoHour(element) {
    const time = new Date().getTime() + 7200000;
    // console.log(time);
    return element[0] > time;
  }

  getRenewableShare(array) {
    let share: Number;
    let renewables: number = 0;
    array.forEach((element, index) => index > 1 ? renewables += element[1][1] : renewables);
    let renewableShare = renewables / array.find(element => element.includes('all'))[1][1];
    return share = Math.floor(renewableShare*100);
  }
}
