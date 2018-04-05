import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { SettingsService } from '../../../_services/settings.service';
import { UserService } from '../../../_services/user.service';
@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})
export class SignInComponent implements OnInit {

  rForm: FormGroup;
  no_auth: boolean = false;
  constructor(private fb: FormBuilder,
    private http: HttpClient,
    private settings: SettingsService,
    private user: UserService,
    private router: Router) { 
      this.rForm = fb.group({
        'email'  : [null, Validators.email],
        'password'  : [null, Validators.compose([Validators.required, Validators.minLength(8)])],
      })
  }

  login(Post){
    var parameter = JSON.stringify(Post);
    this.rForm.reset();
    this.user.login(parameter).subscribe(
        res => {
          console.log(res);
          if(res['status']==true)
          {
              
              this.settings.setToken(res['values'].jwt);
              this.router.navigate(['/']);
          }
          else if(res['status']==false)
          {
            console.log(
              );  
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
