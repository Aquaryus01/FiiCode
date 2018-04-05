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
        'first_name'  : [null, Validators.required],
        'last_name'  : [null, Validators.required],
        'password'  : [null, Validators.compose([Validators.required, Validators.minLength(8)])],
      })
  }

  register(Post){
    var parameter = JSON.stringify(Post);
    this.rForm.reset();
    this.user.register(parameter).subscribe(
        res => {
          console.log(res);
          if(res['status']==true)
          {
              this.settings.setToken(res['values'].jwt);
              this.router.navigate(['/']);
          }
          else if(res['status']==false)
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
