import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import * as $ from 'jquery';

@Injectable()
export class EnergydataService {

  energyData;

  constructor(public http: HttpClient) { }
  
  getAllData(timestamp, energyKind) {
    let apiUrl = 'https://www.smard.de/app/chart_data/' + energyKind + '/DE/' + energyKind + '_DE_quarterhour_'+ timestamp +'.json';
    return $.getJSON('http://allorigins.me/get?url='+encodeURI(apiUrl)+'&callback=?');
  }
}


