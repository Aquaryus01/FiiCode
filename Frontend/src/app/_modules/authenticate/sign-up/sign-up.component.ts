import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { SettingsService } from '../../../_services/settings.service';
import { UserService } from '../../../_services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {

  rForm: FormGroup;
  no_auth: boolean = false;
  constructor(private fb: FormBuilder,
    private http: HttpClient,
    private settings: SettingsService,
    private user: UserService,
    private router: Router) { 
      this.rForm = fb.group({
        'email'  : [null, Validators.email],
        'firstName'  : [null, Validators.required],
        'lastName'  : [null, Validators.required],
        'password'  : [null, Validators.compose([Validators.required, Validators.minLength(8)])],
      })
  }

  register(Post){
    var parameter = JSON.stringify(Post);
    this.rForm.reset();
    this.no_auth = true;
    this.user.login(parameter).subscribe(
        res => {
          console.log(res);
          if(res['response']==true)
          {
              this.settings.setToken(res['Token']);
              this.router.navigate(['/']);
          }
          else if(res['response']==false)
          {
              this.no_auth = true;
          }
          
        },
        err => {
          console.log(err);
        }
    );
  }

  ngOnInit() {
  }

}
