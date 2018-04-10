import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class SettingsService {

  
  private url = "http://90.0.0.111:5000";
  private localStorage = window.localStorage;

  constructor(private http: HttpClient) { }

  getUrl()
  {
    return this.url;
  }

  public getToken()
  {
    return this.localStorage.getItem('key');
  }

  public setToken(str: string)
  {
    this.localStorage.setItem('key', str);
  }
}
