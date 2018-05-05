import { Component, OnInit } from '@angular/core';
import { Card } from '../_classes/card';
import { HttpClient } from '@angular/common/http';
import { SettingsService } from '../../../_services/settings.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  cards: Card[] = [];
  constructor(private http: HttpClient,
              private settings: SettingsService) { 
    var parameter = new Card;
    parameter['jwt'] = this.settings.getToken();
    JSON.stringify(parameter);
    this.http.post(this.settings.getUrl() + "/get_unrated", parameter).subscribe(res => {
      //console.log(res['length']);
      for (var _i = 0; _i < res['length']; _i++)
      {
        this.cards.push(res[_i]);
      }
      console.log(this.cards); 
      });
  
  }

  accept(id){
    var parameter = new Object;
    parameter['jwt'] = this.settings.getToken();
    parameter['id'] = id;
    this.http.post(this.settings.getUrl() + "/validate_allergy", parameter).subscribe(res => {
      
      this.http.post(this.settings.getUrl() + "/get_unrated", parameter).subscribe(res => {
        for (var _i = 0; _i < res['length']; _i++)
        {
          this.cards.push(res[_i]);
        }
      })
      
    });
  }

  refuse(id){
    var parameter = new Object;
    parameter['jwt'] = this.settings.getToken();
    parameter['id'] = id;
    this.http.post(this.settings.getUrl() + "/delete_allergy", parameter).subscribe(res => {
      this.cards = [];
      this.http.post(this.settings.getUrl() + "/get_unrated", parameter).subscribe(res => {
        for (var _i = 0; _i < res['length']; _i++)
        {
          this.cards.push(res[_i]);
        }
      })
      
    });
  }
  ngOnInit() {
  }

}
