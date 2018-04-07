import { Component, OnInit } from '@angular/core';
import { SettingsService } from '../../../_services/settings.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-start-page',
  templateUrl: './start-page.component.html',
  styleUrls: ['./start-page.component.css']
})
export class StartPageComponent implements OnInit {

  constructor(private http:  HttpClient,
              private settings: SettingsService) { }

  temperature = 0;
  humidity = 0;
  wind = "";

  ngOnInit() {
    this.http.get(this.settings.getUrl() + '/get_weather').subscribe(res => {
      this.temperature = res['temperature'];
      this.humidity = res['humidity'];
      this.wind = res['wind'];
      console.log(res);
    })
  }

}
