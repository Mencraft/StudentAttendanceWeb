import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { AuthService } from '../../../shared/auth.service';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader'; // Import NgxUiLoaderService

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  public loginForm: FormGroup;
  constructor(    private authService: AuthService,
    private router: Router,
    private formBuilder: FormBuilder,private ngxService: NgxUiLoaderService) {
      this.loginForm = this.formBuilder.group({
        email: ['',
          Validators.compose([Validators.required, Validators.email])],
        password: [
          '',
          Validators.compose([Validators.required, Validators.minLength(6)]),
        ],
      });
    }

    async loginUser(loginForm: FormGroup): Promise<void> {
      if (!loginForm.valid) {
       // alert('Form is not valid yet, current value:', loginForm.value);
        console.log('Form is not valid yet, current value:', loginForm.value);
      } else {

        this.ngxService.start();
        const email = loginForm.value.email;
        const password = loginForm.value.password;

        this.authService.loginUser(email, password).then(
          () => {
            this.ngxService.stop();
            this.router.navigate(['home']);

          },
          error => {
            alert(error);
            this.ngxService.stop();
          }
        );
      }
    }

  ngOnInit(): void {
  }

}
