import { Injectable } from '@angular/core';

@Injectable()
export class SettingsService {

  
  private url = "http://localhost:5000";
  private localStorage = window.localStorage;

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
  
  constructor() { }

}
