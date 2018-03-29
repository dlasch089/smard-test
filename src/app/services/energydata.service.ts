import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import * as $ from 'jquery';

@Injectable()
export class EnergydataService {

  energyData;

  getLastSunday(date) {
    date.setDate(date.getDate() - date.getDay());
    return date.setHours(23,0,0,0);
  }
  
  timestamp = this.getLastSunday(new Date());

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
    others: 1227 
  };

  powerPrognosis = {
    all: 122,
    windOffshore: 3791,
    windOnshore: 123,
    pv: 125,
    others: 715
  };

  apiUrl = 'https://www.smard.de/app/chart_data/' +this.powerGeneratorCategories.pv +'/DE/' +this.powerGeneratorCategories.pv +'_DE_hour_1522015200000.json';

  constructor(public http: HttpClient) { }

  getAllData() {
    return $.getJSON('http://allorigins.me/get?url='+encodeURI(this.apiUrl)+'&callback=?');
  }



}
