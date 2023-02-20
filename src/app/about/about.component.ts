import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {

  posts = [
    {
      name: 'PRADA catwalk',
      author: 'Frankel Susannah',
      cost: '240 рублей',
      text: 'супер книга для тех, кто не равнодушен к миру моды и его истории',
      imageUrl:
        'https://img.brandshop.ru/cache/products/9/9780500022047-1_552x552.jpg',
      rating: 5,
    },
    {
      name: 'Искусство программирования',
      author: 'Дональд Кнут',
      cost: '210 рублей',
      text: 'Прекрасная книга! Классика, которую надо изучить всем, кто считает себя программистом',
      imageUrl:
        'http://media.karelia.pro/28/2ca5f79dbea1e061a29a19fd6a9d0bd7.jpg',
      rating: 5,
    },
    {
      name: 'О дивный новый мир',
      author: 'Олдос Хаксли',
      cost: '150 рублей',
      text: 'Эта антиутопия ставит правильные вопросы перед читателем а именно- каких жертв требует идеальное общество и идеальное ли оно если обезличенно?',
      imageUrl:
        'https://avatars.mds.yandex.net/get-zen_doc/1711766/pub_5e0a20b4027a1500b2df35a0_5e0a22caaad43600b1c0aa35/scale_1200',
      rating: 4.7,
    },
  ];

  constructor() { }

  ngOnInit(): void {
  }

}
