import { Component, OnInit } from '@angular/core';
import { Post } from '../../_classes/post';
import { HttpClient } from '@angular/common/http';
import { SettingsService } from '../../../../_services/settings.service';
import {PostService} from '../_services/post.service'
import { trigger,style,transition,animate,keyframes,query,stagger, state } from '@angular/animations';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.css'],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: '0' }),
        animate('.5s ease-out', style({ opacity: '1' })),
      ]),
    ]),
  ],
})


export class PostsComponent implements OnInit {

  marime: number = 5;
  posts: Post[] = [];
  constructor(private http: HttpClient,
              private settings: SettingsService,
              private postService: PostService) { 
  }

  post: Post[] = [];

  ngOnInit() {
    
    this.postService.curentPost.subscribe(res=> {
      console.log(res);
      this.posts = res;
    })

            
    var parameter = new Post;
    parameter['jwt'] = this.settings.getToken();
    this.http.post(this.settings.getUrl() + "/get_posts", parameter).subscribe(res =>{
       //console.log(res['length']);
       for (var _i = 0; _i < res['length']; _i++)
       {
         this.posts.push(res[_i]);
         //console.log(res[_i]);
       }
       //console.log(this.posts);
    })
  }

  
    
  //   JSON.stringify(parameter);
  //   this.http.post(this.settings.getUrl() + "/get_allergies", parameter).subscribe(res => {
  //     console.log(res['length']);
  //     for (var _i = 0; _i < res['length']; _i++)
  //     {
  //       this.cards.push(res[_i]);
  //       console.log(res[_i]);
  //     }
  //     console.log(this.cards); 
  //     });
  // }


}
