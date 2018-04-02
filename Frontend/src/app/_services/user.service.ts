import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SettingsService } from './settings.service';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map'

@Injectable()
export class UserService {

  constructor(private http: HttpClient,
              private settings: SettingsService) { }

  login(parameter){
    return this.http.post(this.settings.getUrl() + '/login', parameter);
  }

  register(parameter) {
    return this.http.post(this.settings.getUrl() + '/register', parameter);
  }

}
