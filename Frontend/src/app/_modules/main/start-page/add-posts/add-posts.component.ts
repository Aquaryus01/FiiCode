import { Component, OnInit } from '@angular/core';
import { Post } from '../../_classes/post';
import { SettingsService } from '../../../../_services/settings.service';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-add-posts',
  templateUrl: './add-posts.component.html',
  styleUrls: ['./add-posts.component.css']
})
export class AddPostsComponent implements OnInit {

  post: Post = new Post();
  constructor(private http: HttpClient,
              private settings: SettingsService) { }

  ngOnInit() {
  }

  send(){
    var parameter = this.post;
    parameter['jwt'] = this.settings.getToken();
    console.log(parameter);
    this.http.post(this.settings.getUrl() + '/add_post', parameter).subscribe(res => {
      console.log(res);
    })
  }

}
