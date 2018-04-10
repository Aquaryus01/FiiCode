import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import {Post} from '../../_classes/post'
@Injectable()
export class PostService {

  private postSource = new Subject<Post[]>();
  curentPost = this.postSource.asObservable();
  
  constructor() { }

  sendPost(post: Post[])
  {
      this.postSource.next(post);
  }
}
