import { Component, OnInit } from '@angular/core';
import { Card } from '../../_classes/card';
import { HttpClient } from '@angular/common/http';
import { SettingsService } from '../../../../_services/settings.service';

@Component({
  selector: 'app-cards',
  templateUrl: './cards.component.html',
  styleUrls: ['./cards.component.css']
})
export class CardsComponent implements OnInit {

  cards: Card[] = [];
  constructor(private http: HttpClient,
              private settings: SettingsService) { }

  ngOnInit() {
    var parameter = new Card;
    parameter['jwt'] = this.settings.getToken();
    JSON.stringify(parameter);
    this.http.post(this.settings.getUrl() + "/get_allergies", parameter).subscribe(res => {
      console.log(res['length']);
      for (var _i = 0; _i < res['length']; _i++)
      {
        this.cards.push(res[_i]);
        console.log(res[_i]);
      }
      console.log(this.cards); 
      });
  }

}
