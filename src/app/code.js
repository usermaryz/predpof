ymaps.ready(init);

// функция-обработчик выделения чекбокса
// параметры: объект myMap
// рисует маршрут
function checkboxChange(myMap){
    // Удаляем предыдущий маршрут, если он есть.
    // window.multiRoute - глобальная переменная
    if(window.multiRoute) {
        myMap.geoObjects.remove(window.multiRoute);
        window.multiRoute = null;
    }
    var selected = []; // список координат точек для посторения маршрута
    var count=0; 
    $('input:checked').each(function() {
        // атрибут name у чекбокса в формате  itemNUMBER
        item_name=$(this).attr('name');
        item_index = item_name.substr("item".length);
        // достаем координаты из списка объектов
        item_center = groups[0].items[item_index].center;
        // добавляем координаты
        selected.push(item_center);
        count+=1;
    });
    // если выделено два и более объектов, построить маршрут
    if(count>=2){
        
        // Создаем мультимаршрут
        window.multiRoute = new ymaps.multiRouter.MultiRoute({
            referencePoints:  selected ,
            params: {
                routingMode: 'pedestrian' //Тип маршрутизации - пешеходная маршрутизация.
            }
        }, {
            // Автоматически устанавливать границы карты так, чтобы маршрут был виден целиком.
            boundsAutoApply: true
        });
        // Добавляем мультимаршрут на карту.
        myMap.geoObjects.add(window.multiRoute);
       
    }
}

function init() {
    // window.multiRoute - глобальная переменная
    window.multiRoute = null;

    // Создание экземпляра карты.
    var myMap = new ymaps.Map('map', {
            center: groups[0].items[0].center, // координаты павилиона №1
            zoom: 14
        }, {
            searchControlProvider: 'yandex#search'
        }),
        // Контейнер для меню.
        menu = $('<ul class="menu"></ul>');
        
    for (var i = 0, l = groups.length; i < l; i++) {
        createMenuGroup(groups[i]);
    }

    function createMenuGroup (group) {
        // Пункт меню.
        var menuItem = $('<li><a href="#">' + group.name + '</a></li>'),
        // Коллекция для геообъектов группы.
            collection = new ymaps.GeoObjectCollection(null, { preset: group.style }),
        // Контейнер для подменю.
            submenu = $('<ul class="submenu"></ul>');

        // Добавляем коллекцию на карту.
        myMap.geoObjects.add(collection);
        // Добавляем подменю.
        menuItem
            .append(submenu)
            // Добавляем пункт в меню.
            .appendTo(menu)
            // По клику удаляем/добавляем коллекцию на карту и скрываем/отображаем подменю.
            .find('a')
            .bind('click', function () {
                if (collection.getParent()) {
                    myMap.geoObjects.remove(collection);
                    submenu.hide();
                } else {
                    myMap.geoObjects.add(collection);
                    submenu.show();
                }
            });
        for (var j = 0, m = group.items.length; j < m; j++) {
            createSubMenu(group.items[j], collection, submenu,j);
        }
    }

    function createSubMenu (item, collection, submenu,index) {
        // Пункт подменю.
        // каждый чекбокс имеет аттрибуты:
        // name - в формате itemNUMBER
        // value - координаты
        var submenuItem = $('<li><input name="item'+index+'" type="checkbox" value="'+item.center+'"><a href="#">' + item.name + '</a></li>'),
        // Создаем метку.
            placemark = new ymaps.Placemark(item.center, { balloonContent: item.name });

        // Добавляем метку в коллекцию.
        collection.add(placemark);
        // Добавляем пункт в подменю.
        submenuItem
            .appendTo(submenu)
            // При клике по пункту подменю открываем/закрываем баллун у метки.
            .find('a')
            .bind('click', function () {
                if (!placemark.balloon.isOpen()) {
                    placemark.balloon.open();
                } else {
                    placemark.balloon.close();
                }
                return false;
            });

        submenuItem.find('input')
        .bind('change', function(){
            checkboxChange(myMap);
        });
    }

    var pointA = [55.82862575877643, 37.63396279025236],
        pointB = [55.82996852380073, 37.631757682859615],
        pointC = [55.83229276727642, 37.62800184237887],
        pointD = [55.82642258248392, 37.6377663446128],
        pointE = [55.822583346577254, 37.63974013904379],
        pointF = [55.83509680679135, 37.62233436552858],
        pointG = [55.83285248898791, 37.618573490652494],
        pointH = [55.828657949826145, 37.631585505998856],
        /**
         * Создаем мультимаршрут.
         * @see https://api.yandex.ru/maps/doc/jsapi/2.1/ref/reference/multiRouter.MultiRoute.xml
         */
        multiRoute = new ymaps.multiRouter.MultiRoute({
            referencePoints: [
                pointA,
                pointB,
            ],
            params: {
                //Тип маршрутизации - пешеходная маршрутизация.
                routingMode: 'pedestrian'
            }
        }, {
            // Автоматически устанавливать границы карты так, чтобы маршрут был виден целиком.
            boundsAutoApply: true
        });

    // Добавляем мультимаршрут на карту.
    //myMap.geoObjects.add(multiRoute);

    // Добавляем меню в тэг BODY.
    menu.appendTo("#menu");
    // Выставляем масштаб карты чтобы были видны все группы.
    //myMap.setBounds(myMap.geoObjects.getBounds());
}