import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SettingsService } from '../../../_services/settings.service';
import { Chat} from '../_classes/chat';
@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {

  constructor(private http: HttpClient,
              private settings: SettingsService) { }

  message: string = "";
  comments: Chat[] = [];

  ngOnInit() {
  }

  sendCommand(){
    //console.log(this.message);
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
      comentel = new Chat;
      comentel.text = res['text'];
      comentel.options = res['options'];
      comentel.buttons = res['buttons'];
      comentel.button_names = res['button_names'];
      comentel.user = false;
      comentel.url = res['url'];
      this.comments.push(comentel);
      console.log(this.comments);
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
}
