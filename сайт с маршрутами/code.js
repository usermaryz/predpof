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
			referencePoints: selected,
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
	
	let allTimes = {};
	let entries = 0;
	for(let i=0; i<groups[0].items.length-1; i++) { // создаем связанный граф всех точек
		for(let j=i+1; j<groups[0].items.length; j++) {
			new ymaps.route(
				[groups[0].items[i].center, groups[0].items[j].center],
				{
					routingMode: "pedestrian",
					multiRoute: true
				}
			).then(function(mroute) {
				var route = mroute.getRoutes().get(0);
				let duration = route.properties.get("duration").value;
				allTimes[i] ??= {} // если еще не определен, поставить пустой массив
				allTimes[j] ??= {}
				allTimes[i][j] = duration;
				allTimes[j][i] = duration;
				entries++;
				precalculateAllPaths();
			});
		}
	}

	let timeMap = {};
	function precalculateAllPaths() { // посчитать все возможные пути на старте, и затем выбирать лучшие
		if(entries*2 < groups[0].items.length*(groups[0].items.length-1)) return;
		for(let [key, value] of Object.entries(allTimes[0])) {
			timeMap["0;"+key] = value;
		}
		for(let depth=2; depth<groups[0].items.length; depth++) {
			let depthFastest = {} // минимальное время чтобы добраться до точки
			for(let i=0; i<groups[0].items.length; i++) {
				depthFastest[i] = 99999999; // условный максимум
			}
			for(let key of Object.keys(timeMap)) {
				let points = key.split(";");
				if(points.length == depth) {
					for(let i=1; i<groups[0].items.length; i++) {
						if(points.includes(String(i))) continue;
						let t = timeMap[key] + allTimes[points[depth-1]][i];
						depthFastest[i] = Math.min(t, depthFastest[i]);
						if(t <= depthFastest[i]) {
							timeMap[key + ";" + i] = t;
						}
					}
				}
			}
		}
	}

	function findBestPathUnderTime(time) {
		let entries = Object.entries(timeMap);
		let under = entries.filter(([path, t]) => t < time); // Оптимизируем время
		let ml = Math.max(...under.map(([path, t]) => path.split(";").length)); // MaxLength
		let maxPoints = under.filter(([path, t]) => path.split(";").length == ml); // Оптимизируем количество мест
		let mt = Math.min(...maxPoints.map(([path, t]) => t)); // MinTime
		let bestPath = maxPoints.find(([path, t]) => t == mt);
		return bestPath;
	}
	
	$("#makePath").click(function() {
		let maxTime = $("#time").val();
		let path = findBestPathUnderTime(maxTime*60);
		if(path) {
			if(window.multiRoute) {
				myMap.geoObjects.remove(window.multiRoute);
				window.multiRoute = null;
			}
			let ids = path[0].split(";");
			let points = ids.map(id => groups[0].items[id].center);
			window.multiRoute = new ymaps.multiRouter.MultiRoute({
				referencePoints: points,
				params: {
					routingMode: 'pedestrian' // Тип маршрутизации - пешеходная маршрутизация.
				}
			}, {
				// Автоматически устанавливать границы карты так, чтобы маршрут был виден целиком.
				boundsAutoApply: true
			});
			// Добавляем мультимаршрут на карту.
			myMap.geoObjects.add(window.multiRoute);

			$("#pathDesc").empty();
			for(let id of ids) {
				let item = $("<li>" + groups[0].items[id].name + "</li>");
				$("#pathDesc").append(item);
			}
		}
		$("#pathError").toggle(!path);
		$("#pathDesc").toggle(!!path);
	});
	
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