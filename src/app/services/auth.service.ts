import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  isLogged: boolean = false;
  userEmail: string = '';
  userPhone: string = '';
  userMoney: number =  500;
  userBag: number = 0;
  userBooks: number = 0;

  getLogged() {
    return this.isLogged;
  }

  setLogged(newvalue: boolean) {
    this.isLogged = newvalue;
  }

  login(email: string, phone: string) {
    this.userEmail = email;
    this.userPhone = phone;
    this.userMoney = 500;
    this.userBag = 0;
    this.userBooks = 0;

    this.setLogged(true);
    console.log('Logged');
  }

  doBOOK(money:number, books:number, bag:number){
    this.userMoney = money;
    this.userBooks = books;
    this.userBag = bag;
  }

  logout() {
    this.userEmail = this.userPhone = '';
    this.setLogged(false);
  }
}
