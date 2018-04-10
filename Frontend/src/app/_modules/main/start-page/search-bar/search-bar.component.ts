import { Component, OnInit } from '@angular/core';

import { SettingsService } from '../../../../_services/settings.service';
import { HttpClient } from '@angular/common/http';
import { PostService } from '../_services/post.service';
import { Post } from '../../_classes/post';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.css']
})
export class SearchBarComponent implements OnInit {

  constructor(private http: HttpClient,
              private settings: SettingsService,
              private postService: PostService) { }

  posts: Post[] = 
  [{
    id: 0,
    title: "mue",
    description: 'stalin',
    image:'/.sad',
    date:  '123143',
    comments: 'salca'
  },
  {
    id: 2,
    title: "sal",
    description: 'lel',
    image:'/.sad',
    date:  '123143',
    comments: 'salca'
  }];


  text: string = "";

  search(){
    /*this.http.post(this.settings.getUrl() + '/search_post', this.text).subscribe(res =>{
      for (var _i = 0; _i < res['length']; _i++)
        this.posts.push(res[_i]);
        
      this.postService.sendPost(this.posts);
    })*/
    this.postService.sendPost(this.posts);
  }
  ngOnInit() {
  }

}
