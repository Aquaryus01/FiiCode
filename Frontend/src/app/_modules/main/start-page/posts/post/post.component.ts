import { Component, OnInit, Input } from '@angular/core';
import { trigger,style,transition,animate,keyframes,query,stagger } from '@angular/animations';
import {Post} from '../../../_classes/post'
import { SettingsService } from '../../../../../_services/settings.service';
import { HttpClient } from '@angular/common/http';
import {Comment} from '../../../_classes/comment';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css'],
  animations: [

    trigger('goals', [
      transition('* => *', [

        query(':enter', style({ opacity: 0 }), {optional: true}),

        query(':enter', stagger('300ms', [
          animate('.6s ease-in', keyframes([
            style({opacity: 0, transform: 'translateY(-75%)', offset: 0}),
            style({opacity: .5, transform: 'translateY(35px)',  offset: 0.3}),
            style({opacity: 1, transform: 'translateY(0)',     offset: 1.0}),
          ]))]), {optional: true})
      ])
    ])

  ]
})
export class PostComponent implements OnInit {

  @Input() post: Post;
  comments_bool: boolean = false;
  comments: Comment[] = [];
  comment: string = "";
  constructor(private http: HttpClient,
              private settings: SettingsService) { }

  ngOnInit() {
    var parameter = new Object;
    parameter['jwt'] = this.settings.getToken();
    parameter['id'] = this.post.id;
    parameter = JSON.stringify(parameter);
    this.http.post(this.settings.getUrl() + '/get_comments', parameter).subscribe(res => {
      for (var _i = 0; _i < res['length']; _i++)
       {
         this.comments.push(res[_i]);
         //console.log(res[_i]);
       }
        console.log()
    })
  }

  addComment(){
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
  }
    removeComment(comment){
      console.log('da');
      var parameter = new Object;
      parameter['jwt'] = this.settings.getToken();
      parameter['id'] = comment.id;
      parameter = JSON.stringify(parameter);
      this.http.post(this.settings.getUrl() + '/delete_comment', parameter).subscribe(res => console.log(res));

      var index = this.comments.indexOf(comment);
      // console.log(index);
      this.comments.splice(index,1);
      this.comments.length
      // for (var _i = 0; _i < this.comments.length; _i++)
      // {
          
      //     if(this.comments[_i].id==comment.id){
      //         var index = this.comments.indexOf(comment);
      //         this.comment.slice(index, 1);
              
      //         console.log(this.comments);
      //         break; 
      //     }
      // }
  }

}
