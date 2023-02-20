import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {


  home = [
    {
      id : 1,
      name: 'Музей Космонавтики',
      author: "https://yandex.ru/map-widget/v1/?ll=37.636761%2C55.825436&mode=routes&rtext=55.828598%2C37.633872~55.823294%2C37.639853&rtt=pd&ruri=ymapsbm1%3A%2F%2Forg%3Foid%3D8981766017~ymapsbm1%3A%2F%2Forg%3Foid%3D1144510322&z=15.87",
      cost: 9,
      text: 'Один из крупнейших научно-исторических музеев мира. История музея началась во второй половине XX века.',
      imageUrl:
        'https://tttravel.ru/wp-content/uploads/2021/04/vdnh-kosmos_02.jpg',
      rating: 5,
      amount: 9
    },
    {
      id : 2,
      name: 'Фонтан Дружбы Народов',
      author: 'https://yandex.ru/maps/213/moscow/?ll=37.632520%2C55.829400&mode=routes&rtext=55.828598%2C37.633872~55.829850%2C37.631782&rtt=pd&ruri=ymapsbm1%3A%2F%2Forg%3Foid%3D8981766017~ymapsbm1%3A%2F%2Forg%3Foid%3D129731774929&utm_medium=mapframe&utm_source=maps&z=18.9',
      cost: 2,
      text: 'Фонтан «Дружба народов» — один из символов не только ВДНХ, но и Москвы. Его композиция состоит из нескольких частей. Овальная чаша фонтана увенчана золотым снопом пшеницы, технической конопли и подсолнухов, сплетенных в большой сноп.',
      imageUrl:
        'https://vdnh.ru/upload/resize_cache/iblock/b4b/1000_1000_1/b4ba255fc1f667f4629a8a2b9c0935be.JPG',
      rating: 5,
      amount: 8
    },
    {
      id : 3,
      name: 'Москвариум',
      author: 'Олдос Хаксли',
      cost: 13,
      text: 'Москвариум – это уникальные водные шоу с участием морских животных, не имеющие аналогов в мире. Один из крупнейших океанариумов Европы.',
      imageUrl:
        'https://www.mos.ru/upload/newsfeed/newsfeed/_Y7A0505.jpg',
      rating: 4.8,
      amount: 6
    },
    {
      id : 4,
      name: 'Робостанция',
      author: 'Стив Макконнелл',
      cost: 2,
      text: 'Более 20 роботов из разных стран, VR - аттракционы, мастер-классы, интерактивные стенды и многое другое.',
      imageUrl:
        'https://mm-g.ru/upload/iblock/12f/12f4c8b13bd3f0619e083cbf660c510e.jpg',
      rating: 4.2,
      amount: 23
    },
    {
      id : 5,
      name: 'Рабочий и колхозница',
      author: 'Стив Макконнелл',
      cost: 13,
      text: 'Памятник монументального искусства, «идеал и символ советской эпохи», признанный «эталон социалистического реализма».',
      imageUrl:
        'https://trip-guru.ru/images/easyblog_articles/83/b2ap3_large_rip-guru.ru-0060.jpg',
      rating: 4.5,
      amount: 2
    },
    {
      id : 6,
      name: 'Фонтан каменный цветок',
      author: 'Артур Хейли',
      cost: 9,
      text: 'Один из трёх главных фонтанов ВДНХ. Создан к открытию ВДНХ в 1954 году.',
      imageUrl:
        'https://i0.photo.2gis.com/images/geo/32/4503599675724628_bbc7_600x600.jpg',
      rating: 5,
      amount: 10
    },
    {
      id : 7,
      name: 'Павильон 34 Космос',
      author: 'Артур Хейли',
      cost: 17,
      text: 'В центре «Космонавтика и авиация» можно увидеть более 120 уникальных образцов летательной и космической техники.',
      imageUrl:
        'https://www.vao-moscow.ru/wp-content/uploads/2018/04/taKAf3xGk-M.jpg',
      rating: 5,
      amount: 10
    },
    {
      id : 8,
      name: 'Арка главного входа ВДНХ',
      author: 'Артур Хейли',
      cost: 4,
      text: 'ВДНХ - это череда торговых и видовых павильонов, в которых работают постоянные экспозиции, проводятся концерты и литературные вечера.',
      imageUrl:
        'https://fs3.fotoload.ru/f/0618/1529514075/1920x1080/b579be04e0.jpg',
      rating: 5,
      amount: 10
    },
  ];
    ISLogged;
    money;
    books;
    bag;
    error = 'хорошего отдыха'
    
    constructor(private auth: AuthService) {
      this.money = auth.userMoney;
      this.books = auth.userBooks;
      this.bag = auth.userBag;
      this.ISLogged = auth.isLogged;
    }

  ngOnInit(): void {}
  click: number = 0;

  /*
  amount = [9, 8, 6, 23, 2, 10];
  disabled: boolean = false;
  */

  doBook(cost:number, id: number){
    if (this.ISLogged){
    if ((this.money >= cost) || (this.money < cost)){
      this.money -= cost
      this.books += 1
      this.bag += cost
      alert("переход к построению маршрута")
      window.location.href = 'https://predprofsub.maryzemlyanskay.repl.co';
    }
    else{
      alert("добавлено слишком много точек")
    }
    this.auth.doBOOK(
      this.money, this.books, this.bag
    );
    }
    else{
      alert("для построения маршрута необходимо войти в аккаунт")
    }
    /*
    this.amount[id - 1] -= 1
     if (this.amount[id - 1] == 0){
        this.disabled = true;
     }
     */
  }

  doBOOK() {
    this.auth.doBOOK(
      this.money, this.books, this.bag
    );
  }
  /*
  doPost(id: number){
    this.amount[id - 1] -= 1
  }
  */ 

}
