import { Component, OnInit } from '@angular/core';
import { EnergydataService } from '../../services/energydata.service';

@Component({
  selector: 'app-dataview',
  templateUrl: './dataview.component.html',
  styleUrls: ['./dataview.component.css']
})
export class DataviewComponent implements OnInit {

  rawData: Array<any>;

  currentEnergy: Array<any> = [];
  prognosisEnergy: Array<any> = [];

  getLastSunday(date) {
    date.setDate(date.getDate() - date.getDay());
    return date.setHours(24,0,0,0);
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
    windOffshore: 3791,
    windOnshore: 123,
    pv: 125,
    others: 715
  };

  constructor(public energyService: EnergydataService) { }

  ngOnInit() {
    this.getCurrentProduction(this.powerGeneratorCategories, this.currentEnergy);
    this.getCurrentProduction(this.powerPrognosis, this.prognosisEnergy);
  }

  async getCurrentProduction(object, array){
    for(var key in object){
      await this.energyService.getAllData(this.getLastSunday(new Date()), object[key])
      .then(data => {
        this.rawData = JSON.parse(data.contents).series;
        let index = this.rawData.length;
        while (index-- && !this.rawData[index][1]);
        return array.push([key, this.rawData[index]]);
      })
    }
  }
}
