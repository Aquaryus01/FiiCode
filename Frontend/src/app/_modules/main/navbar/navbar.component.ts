import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SettingsService } from '../../../_services/settings.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  constructor(private router: Router,
              private settings: SettingsService) { }

  signOut(){
    console.log('ok');
    this.settings.removeToken();
    this.router.navigate(['/sign-in']);
  }

  ngOnInit() {
  }

}
