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
  prognosisEnergy: Array<any> = [];

  currentRenewableShare: Number;

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
    this.getCurrentProduction(this.powerGeneratorCategories, this.currentEnergy);
    this.getPrognosis(this.powerPrognosis, this.prognosisEnergy)
      .then(array => this.getRenewableShare(array));
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

  async getPrognosis(object, array) {
    for(var key in object) {
      await this.energyService.getAllData(this.getLastSunday(new Date()), object[key])
      .then(data => {    
        this.rawPrognosis = JSON.parse(data.contents).series;
        const index = this.rawPrognosis.find(this.findNow);
        return array.push([key, index]);
      });
    }
    return array;
  }

  findNow(element) {
    const time = new Date().getTime();
    // console.log(time);
    return element[0] > time;
  }

  getRenewableShare(array) {
    let renewables: number = 0;
    array.forEach((element, index) => index > 1 ? renewables += element[1][1] : renewables);
    let renewableShare = renewables / array.find(element => element.includes('all'))[1][1];
    return this.currentRenewableShare = Math.floor(renewableShare*100);
  }
}
