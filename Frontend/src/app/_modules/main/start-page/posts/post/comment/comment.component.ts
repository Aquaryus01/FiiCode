import { Component, OnInit } from '@angular/core';
import { SettingsService } from '../../../../../../_services/settings.service';
import { HttpClient } from '@angular/common/http';
import {Comment} from '../../../../_classes/comment';
@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.css']
})
export class CommentComponent implements OnInit {

  constructor(private http: HttpClient,
              private settings: SettingsService) { }

  ngOnInit() {
  }

  addComment(){
    var parameter = new Object;
    parameter['jwt'] = this.settings.getToken();
    //parameter['id'] = this.post.id;
    //parameter['comment'] = this.comment;
    this.http.post(this.settings.getUrl() + '/post_comment', parameter).subscribe(res => {
      var comentel = new Comment;
      comentel.id = res['id'];
      comentel.comment = res['comment'];
      comentel.date = res['date'];
      comentel.mine = res['mine'];
      comentel.name = res['name'];
      //this.comments.unshift(comentel);
      //console.log(this.comments);
    })
  }
    removeComment(comment){
      console.log('da');
      var parameter = new Object;
      parameter['jwt'] = this.settings.getToken();
      parameter['id'] = comment.id;
      parameter = JSON.stringify(parameter);
      this.http.post(this.settings.getUrl() + '/delete_comment', parameter).subscribe(res => console.log(res));

      //var index = this.comments.indexOf(comment);
      //this.comments.splice(index,1);
      //this.comments.length
  }

}
