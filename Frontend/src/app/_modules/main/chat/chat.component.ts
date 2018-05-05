import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SettingsService } from '../../../_services/settings.service';
import { Chat} from '../_classes/chat';
import {Size} from '../_classes/size';
@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {

  constructor(private http: HttpClient,
              private settings: SettingsService) 
  { 
      /*this.http.get(this.settings.getUrl() + '/').subscribe(res => {
        console.log(res);
      })*/
  }

  message: string = "";
  comments: Chat[] = [];
  add_allergy_pop: boolean = false;
  map: boolean = false;
  sizes: Size[] = []; 

  lat: number = 0;
  lon: number = 0;
  ngOnInit() {
  }

  sendCommand(){
    //console.log(this.message);
    this.map = false;
    var comentel = new Chat;
    comentel.text = this.message;
    comentel.user = true;
    this.comments.push(comentel);
    console.log(this.comments);

    
    var parameter = new Object;
    parameter['jwt'] = this.settings.getToken();
    parameter['command'] = this.message;
    parameter = JSON.stringify(parameter);
    console.log(parameter);
    this.http.post(this.settings.getUrl() + "/robot", parameter).subscribe(res => {
      console.log(res);

      if(res['check'] == "add_allergy")
      {
          console.log('ssssssssssssssss');
          comentel.allergy = res['allergy'];
          this.add_allergy_pop = true;
      }
      else if(res['check'] == "map")
      {
        this.lat = res['lat'];
        this.lon = res['lon'];
        this.map = true;
        for (let index = 0; index < res['stores'].length; index++) {
          console.log(res['stores'][0]);
          this.sizes.push(res['stores'][index]);
        }
      }
      else
      {
        comentel = new Chat;
        comentel.text = res['text'];
        comentel.check = res['check'];
        comentel.url = res['url'];
        comentel.user = false;
        this.comments.push(comentel);
        console.log(this.comments);
      }

      this.message = "";
    });
  }
/*
var parameter = new Object;
    parameter['jwt'] = this.settings.getToken();
    parameter['id'] = this.post.id;
    parameter['comment'] = this.comment;
    this.http.post(this.settings.getUrl() + '/post_comment', parameter).subscribe(res => {
      var comentel = new Comment;
      comentel.id = res['id'];
      comentel.comment = res['comment'];
      comentel.date = res['date'];
      comentel.mine = res['mine'];
      comentel.name = res['name'];
      this.comments.unshift(comentel);
      console.log(this.comments);
    })
*/
  speak(text) {
    text = "hello admin";
    var u = new SpeechSynthesisUtterance();
    u.text = text
    u.lang = 'en-US';
    speechSynthesis.speak(u);
  }

  alergyTitle: string = "";
  alergyDescription: string = "";
  alergyPills: string = "";
  addAllergy(){
    var parameter = new Object;
    parameter['jwt'] = this.settings.getToken();
    parameter['name'] = this.alergyTitle;
    parameter['description'] = this.alergyDescription;
    parameter['pills'] = this.alergyPills;
    parameter = JSON.stringify(parameter);
    this.http.post(this.settings.getUrl() + '/add_allergy', parameter).subscribe(res => console.log(res));
  }

}
