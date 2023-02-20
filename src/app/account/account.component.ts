import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { HomeComponent } from '../home/home.component';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css'],
})
export class AccountComponent implements OnInit {
  email;
  phone;
  money;
  books;
  bag;

  profile = [
    {
      hello: 'Добро пожаловать в личный кабинет, в будущем тут можно будет увидеть историю ваших маршрутов',
      text: 'Спасибо, что выбрали именно нас',
      imageUrl:
        'https://avatars.mds.yandex.net/i?id=dfb727d5e76653a7ee551242036b8c8f-4841525-images-thumbs&n=13',
    }
  ]
  static money: number;
  static books: any;
  static bag: any;
  
  constructor(private auth: AuthService) {
    this.email = auth.userEmail;
    this.phone = auth.userPhone;
    this.money = auth.userMoney;
    this.books = auth.userBooks;
    this.bag = auth.userBag;
  }

  ngOnInit(): void {}
}
