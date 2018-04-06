import { Component, OnInit, Input } from '@angular/core';
import {Card} from '../../../_classes/card';
import { HttpClient } from '@angular/common/http';
import { SettingsService } from '../../../../../_services/settings.service';
@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css']
})
export class CardComponent implements OnInit {

  @Input() card: Card;
  constructor(private http: HttpClient,
              private settings: SettingsService) { }

  ngOnInit() {
    console.log(this.card.title);
    /*if(this.card.check)
    {
      document.getElementById("checkbox").= true;
    }*/
  }

  toggleEditable(event) {
    var parameter = new Card;
    parameter['id'] = this.card.id;
    parameter['jwt'] = this.settings.getToken();
    if (event.target.checked) 
    {
      parameter['checked'] = 1;
      JSON.stringify(parameter);
      console.log(parameter);
      this.http.post(this.settings.getUrl() + "/check_allergy", parameter).subscribe(res => console.log(res));
   }
   else
   {
      parameter['checked'] = 0;
      JSON.stringify(parameter);
      this.http.post(this.settings.getUrl() + "/check_allergy", parameter).subscribe(res => console.log(res));;
   }
}

}
