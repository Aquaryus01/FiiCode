import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SettingsService } from '../../../_services/settings.service';

@Component({
  selector: 'app-weather',
  templateUrl: './weather.component.html',
  styleUrls: ['./weather.component.css']
})
export class WeatherComponent implements OnInit {

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
