import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})

export class LoginComponent implements OnInit {
  isLogin: boolean = true;
  loginGroup: FormGroup;

  showpassword: boolean = false;
  showphone: boolean = false;

  constructor(private auth: AuthService) {
    this.loginGroup = new FormGroup({
      email: new FormControl('', [
        Validators.required,
        Validators.email,
        Validators.minLength(4),
        Validators.maxLength(40),
      ]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(20),
      ]),
      phone: new FormControl('', [
        Validators.required,
        Validators.minLength(7),
        Validators.maxLength(30),
      ]),
    });
  }
  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }

  checkLogin() {
    let email: string = this.loginGroup.controls['email'].value;
    if (email.includes('@') && email.includes('.') && email.length >= 7) {
      this.showpassword = true;
    } else {
      this.showpassword = false;
    }
  }

  checkPassword() {
    let password: string = this.loginGroup.controls['password'].value;
    if (password.length >= 6) {
      this.showphone = true;
    } else {
      this.showphone = false;
    }
  }

  login() {
    this.auth.login(
      this.loginGroup.controls['email'].value,
      this.loginGroup.controls['phone'].value
    );
  }

}