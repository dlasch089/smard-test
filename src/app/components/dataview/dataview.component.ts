import { Component, OnInit } from '@angular/core';
import { EnergydataService } from '../../services/energydata.service';

@Component({
  selector: 'app-dataview',
  templateUrl: './dataview.component.html',
  styleUrls: ['./dataview.component.css']
})
export class DataviewComponent implements OnInit {

  energyData: Array<any>;

  constructor(public energyService: EnergydataService) { }

  ngOnInit() {
    this.energyService.getAllData()
      .then(data => {
        console.log(data);
        this.energyData = JSON.parse(data.contents).series;
        this.energyService.energyData = JSON.parse(data.contents).series;
      })
        // .then(res  => {
        //   let index = res.findIndex((element) => {
        //     return element.includes(null);
        //   });
        //   return res[index-1];
        // })
  }
}
