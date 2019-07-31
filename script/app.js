"use strict"

const tileType = {Grass:0, Base:1, Runes:2, Target:3};
const unitType = {Hero:0, Creep:1, Bomb:2};
const userType = {Human:0, Bot:1, UserAgent:2};
const ramsType = {Hero: true, Creep: false, Bomb: true};
const higlightType = {Rotate: 0, Move: 1, Attack:2, Hook:3};




function Game() {

	class User {
		constructor(isHost) {
			this.isHost = isHost;
			this.hand = []; // Карты в руке, int id типы карт
			this.stacks = [[],[],[],[],[],[]]; // подмассивы - стеки, верхняя карта - последняя
			this.agent = null;
			this.myHero = null;
			this.disables = [false, false, false, false, false, false]; // Массив Карт Повреждений
		}

		// возвращает текущего пользователя закончившего ход
		selectCards(count, cards, callback) { // Запрос пользователю выбрать x карт

			if(callback !== undefined){
				let user = this;

				this.agent.selectCards(cards, count, function(sels) {
					for (let i of sels) {
						user.hand.push(cards[i]);
					}
					user.agent.setHand(user.hand);
					callback(sels);
				})
			}
		}

		chooseRotate(rotateArray){  // 1: 90,  2: 180, 3: 270(-90), 4:360
			let user = this;
			return new Promise(function(resolve, reject){
				user.agent.chooseRotate(rotateArray, function(rotateId){

					resolve(rotateId)

				})
			})
		}

		scrapRequest(type){
			// Утилизация для ремонта. Утилизация огненных или металлических карт позволяет вам освободить слот от повреждения на выбор
			// Утилизация электрических или компьютерных карт для перепрограммирования - свап 2-х активных стеков на выбор
			let user = this;
			return new Promise(function(resolve, reject){
				//user
				if(type === cardType.Fire || type === cardType.Metal){


				}
				else if(type === cardType.Fire || type === cardType.Metal){


				}

				resolve()
			})
		}

		programming(callback) {
			// callback - вызвать при завершении работы с этим пользователем
			let outCallback = callback;
			let user = this;
			user.agent.setStacks(user.stacks);
			user.agent.setHand(user.hand);
			render.setDisables(user.disables);

			// Обновить данные
			let request = function(){


				user.agent.programming(async function(cardPosInHand, stackId){



					if(stackId === -1){// Карты если она УТИЛИЗИРУЕТСЯ

						await user.scrapRequest(cardsParams[user.hand[cardPosInHand]].type)
						user.hand.splice(cardPosInHand, 1);

					} else if (user.stacks[stackId].length === 4) {
						console.log("Don't push this");
					} else if (user.stacks[stackId].length === 0 || cardsParams[user.stacks[stackId][0]].type === cardsParams[user.hand[cardPosInHand]].type) {
						if (user.stacks[stackId].length === 3) {
							for (let i = 1; i < 3; i++){
								user.stacks[stackId][i - 1] = user.stacks[stackId][i];
							}
							user.stacks[stackId].pop();
						}
						user.stacks[stackId].push(user.hand[cardPosInHand]);
						user.hand.splice(cardPosInHand, 1);
					} else {
						user.stacks[stackId] = [user.hand[cardPosInHand]];
						user.hand.splice(cardPosInHand, 1);
					}

					user.agent.setStacks(user.stacks);
					user.agent.setHand(user.hand);
					render.setDisables(user.disables);


					if(user.hand.length > 0){
						setTimeout(request, 0);
					}
					else{
						outCallback();
					}

				})
			}
			request();
		}

		async selectCells(cellsArray, highlight){ //
			let user = this;
			return new Promise(function(resolve, reject){
				user.agent.selectCells(cellsArray, highlight, function(selSell){
					resolve(selSell)
				})
			})
		}



	}







	//this.seedRandom = /*0.5297204857065221//*/Math.random(); // Общее случайное число, получать его от хоста
	this.seedRandom =  0.12800927790647165 // - рядом с бомбой

	const inputMap = [ // Ландшафт
		[1, 0, 0, 0, 0, 2,  2, 0, 0, 0, 0, 0],
		[1, 1, 0, 0, 0, 0,  0, 2, 0, 2, 2, 0],
		[1, 1, 1, 0, 0, 0,  0, 0, 0, 0, 0, 0],
		[1, 1, 1, 0, 0, 0,  0, 2, 0, 3, 0, 2],
		[1, 1, 0, 0, 0, 0,  0, 2, 0, 0, 2, 0],
		[1, 0, 0, 0, 0, 2,  0, 0, 0, 0, 0, 0]
	];

	function Unit(type) {
		this.type = type;
		this.rotation = 1; // 1: 90, 2: 180, 3: -90(270)
		this.ownerUser = null;
		this.attachedCell = null; // тот кого тащит Unit

		this.rotate = function(angle){  // 1: 90, 2: 180, 3: -90(270)
			this.rotation += angle;
			this.rotation %= 4;
		}
	}



	function MapObject(inputMap) { // Структура данных для работы с полем игры

		function Cell() {
			this.x = null;
			this.y = null;
			this.type = null;
			this.unit = null;
			this.stop = false; // Проверка, можно ли продвинуть юнита вперед

			this.hasUnit = function(){
				return this.unit !== null;
			};

			this.setUnit = function(unit){
				if(this.unit !== null) throw "unit has been planted";
				this.unit = unit;
				return this;
			}
		}

		// инициализация

		this.size = {x:inputMap[0].length, y:inputMap.length};
		this.map = [];
		this.typesCells = [];

		for(let i in tileType) {
			this.typesCells.push([]);
		}

		for (let i = 0; i < inputMap.length; i++) {
			this.map.push([]);
			for (let j = 0; j < inputMap[i].length; j++) {
				let cell = new Cell();
				cell.x = j;
				cell.y = i;
				cell.type = inputMap[i][j];

				this.map[i][j] = cell;
				this.typesCells[cell.type].push(cell);
			}
		}


		// Возвращает объект клетки(Cell) по координатам (x, y)
		this.get = function(x, y) {
			if( y < 0 || x < 0 || y >= this.map.length || x >= this.map[y].length) return null;
			return this.map[y][x];
		};

		// Возвращает все объекты клетки типа tileType (new Cell[])
		this.getAllCellsByType = function(type) {
			return this.typesCells[type];
		};

		// Возвращает все объекты клетки типа unitType (new Unit[])
		this.getAllCellHasUnits = function(type) {
			let retArray = [];
			for (let row of this.map) {
				for (let cell of row) {
					if(cell.hasUnit() && cell.unit.type === type) {
						retArray.push(cell);
					}
				}
			}
			return retArray;
		};

		// Перемещает, если не может, возвращает null иначе клетку в которую переместил
		this.moveUnitFromCellToCoords = function(cellFrom, x, y) {
			let cellTo = this.get(x, y);
			if(cellTo === null) return null;
			if(cellTo.hasUnit()) return null;
			cellTo.unit = cellFrom.unit;
			cellFrom.unit = null;
			return cellTo;
		}
	}

	// Инициализация
	let random = new Math.seedrandom(this.seedRandom);
	let map = new MapObject(inputMap);

	const cardsParams = cardsJSON; // Описания карт

	let roundCounter = 0; // Увеличивать на 1 в конце спауна мобов
	const render = new Render();
	this.getRender = render;
	this.getRandom = random;
	render.renderMap(map);


	const cardsCount = 96;
	let cardsDeck = null; // Колода карт по 8 карт
	let bombHP = 7;


	let users = null; // Пользователи
	// TODO: users: AbstractAgent[] array - инициализированные обьекты пользователей
	this.start = function(newUsers){
		users = newUsers ? newUsers : [];

		{ /// временная генерация пользователей
			let testUserAgent = new BotAgent();
			let testUser = new User(false);
			testUser.agent = testUserAgent;
			users.push(testUser);
		}
		{
			let testUserAgent = new LocalAgent();
			let testUser = new User(true);
			testUser.agent = testUserAgent;
			users.push(testUser);

			/// DEBUG
			testUser.stacks[0] = [3, 3, 3]
			//testUser.stacks[1] = [1, 1]
			testUser.agent.setStacks(testUser.stacks);
		}




		// Генерация колоды
		cardsDeck = [];
		for (let card in cardsParams) {
			for (let i = 0; i < (cardsCount/cardsParams.length)|0; i++) {
				cardsDeck.push(card);
			}
		}
		shakeArray(cardsDeck, random);

		// Начальный спаун мобов на рунах
		let runesFree = map.getAllCellsByType(tileType.Runes).filter(cell => !cell.hasUnit());
		for (let spawnCell of runesFree) {
			render.initUnit(spawnCell.setUnit(new Unit(unitType.Creep)));
		}

		// Спаун героев
		let baseFree = map.getAllCellsByType(tileType.Base).filter(cell => !cell.hasUnit());
		shakeArray(baseFree, random);

		for (let user of users) {
			let heroCell = baseFree.pop().setUnit(new Unit(unitType.Hero));
			user.myHero = heroCell.unit;
			heroCell.unit.ownerUser = user;
			render.initUnit(heroCell);
		}
		// Спаун бомбы
		render.initUnit(baseFree.pop().setUnit(new Unit(unitType.Bomb)));

		chooseСards();
		//warriorsAct()
	};

	function lose() {
		render.stopSelect();
		render.stopTimer();
		render.defeat();
		render.showMessage("Ты проиграл, позорно!");
	}
	this.lose = lose;

	function chooseСards() {
		let isFirstRound = roundCounter === 0;

		let selectionCards = [];

		let countCards = isFirstRound ? 10 : 5; // TODO: добавить еще условие для core карт

 		for (let i = 0; i < countCards && cardsDeck.length > 0; i++) {
			selectionCards.push(cardsDeck.pop());
		}

		let countGived = 0;

		function select(userId = 0) {
			if(selectionCards.length === 0) {
				lose();
				return;
			}

			users[userId].selectCards( users.length === 1 ? (isFirstRound ? 2 : 4) : 1, selectionCards, function(selectedCards) {

				for (let i = 0; i < selectedCards.length; i++) {
					selectionCards.splice(selectedCards[i], 1);
				}

				countGived += selectedCards.length;

				if (isFirstRound && countGived < (users.length * 2) || !isFirstRound && countGived < 4) {
					select((userId + 1) % users.length);
				} else {
					setTimeout(programmingAct, 0);
				}
			})
		}
		select();
	}


	function programmingAct() { // DONE!
		let countUsers = 0;
		for (let user of users) {
			user.programming(function() {
				countUsers++;
				if (countUsers === users.length) {
					setTimeout(warriorsAct, 100)
				}
			})
		}
	}



	function warriorsAct() {
		// Исполняется карта, верхняя в каждом стеке в порядке игроков

		async function go(userId = 0) {



			for (let stack of users[userId].stacks) {
				if(stack.length === 0) continue;

				await runStack(users[userId], stack)
			}




			if (userId + 1 < users.length) {
				go(userId + 1);
			} else {
				setTimeout(creepsMoveAct, 0);
			}
		}
		go()
	}

	function runStack(user, stack){
		let level = stack.length;
		return new Promise(async function(resolve, reject) {
			let cardId = stack[level - 1];
			let card = cardsParams[cardId].levels[level-1];
			let heroCell = map.getAllCellHasUnits(unitType.Hero).filter(cell => cell.unit === user.myHero)[0]

			if(card.rotate.length !== 0){
				let rotateAngleId = 0;
				if(card.rotate.length > 1){
					rotateAngleId = await user.chooseRotate(card.rotate);
				}
				user.myHero.rotate(card.rotate[rotateAngleId]);
				render.updateCellRotate(heroCell, user.myHero.rotation)
			}


			if (card.move.length !== 0) {
				let selVect = null
				if(card.move.length === 1){ // card.move[i] - вектор до которого идти нужно до предела
					selVect = card.move[0]
				}
				else{
					selVect = card.move[0]
				}
				if(selVect !== null){
					let v = vectorRotate(selVect, user.myHero.rotation)
					await goRamming(user, heroCell, v.x, v.y);
				}

			}


			/*if (card.attack.length !== 0) {
				if(card.attack.length === 1){

				}
				else{

				}

			}*/


			resolve();
			// Punch

		})
	}





	// Возвращает bool удалось перейти или нет
	function goRamming(user, thisCell, vecX, vecY) {
		return new Promise(async function(resolve, reject){
			// толкать можно бесконечно много до упора только перед собой
			//resolve(); return;

			let hookArray = []
			let hookVecs = [vectorRotate({x:-1, y:0}, thisCell.unit.rotation), vectorRotate({x:0, y:-1}, thisCell.unit.rotation), vectorRotate({x:1, y:0}, thisCell.unit.rotation)]
			let hookSelect = null
			for(let hook of hookVecs){
				let hookTemp = map.get(thisCell.x + hook.x, thisCell.y + hook.y)
				if(hookTemp !== null && hookTemp.hasUnit() && (hookTemp.unit.type === unitType.Hero || hookTemp.unit.type === unitType.Bomb)){
					hookArray.push(hookTemp)
				}
			}
			hookArray.push(thisCell)

			let unit = thisCell.unit;

			if(hookArray.length !== 0 /*TODO: и сила больше 1*/){
				hookSelect = hookArray[await user.selectCells(hookArray, higlightType.Hook)]
				if(hookSelect !== null && hookSelect !== thisCell)
					unit.attachedCell = hookSelect
			}


			let toX = thisCell.x + vecX;
			let toY = thisCell.y + vecY;


			let temp = Math.max(Math.abs(vecX), Math.abs(vecY))
			//let next = {x: thisCell.x + (toX/temp)|0, y: thisCell.y + (toX/temp)|0}
			//let tempCell = map.get(next.x, next.y)

			//

			// Развернутая рекурсия
			let stack = []
			stack.push(thisCell) // клетка которую двигаем

			let stopMatrix = createArray(map.size.x, map.size.y)

			while(stack.length !== 0){

				let curCell = stack.pop();

				let next = map.get((curCell.x + vecX/temp)|0, (curCell.y + vecY/temp)|0)

				if(next === null || (curCell.x === toX && curCell.y === toY) || stopMatrix[next.x][next.y] == true) { /// Дальше двигаться никак нельзя
					stopMatrix[curCell.x][curCell.y] = true
					continue;
				}

				if(next.unit !== null && (next.unit.type === unitType.Hero || next.unit.type === unitType.Bomb)) { // Следующую можно толкать положить в стек
					stack.push(curCell)
					stack.push(next)
					continue;
				}

				if(next.unit !== null && next.unit.type === unitType.Creep) creepKill(next)

				map.moveUnitFromCellToCoords(curCell, next.x, next.y)
				render.moveUnit(curCell, next)

				if(next.unit.attachedCell !== null) { // Если юнит кого-то тащит, то тот занимает ячейку юнита
					map.moveUnitFromCellToCoords(next.unit.attachedCell, curCell.x, curCell.y);
					render.moveUnit(next.unit.attachedCell, curCell)
					next.unit.attachedCell = curCell
				}


				stack.push(next)



			}
			unit.attachedCell = null
			//for



			resolve();


			// проверить есть ли позади или слева или справа бомба или герой
			// если есть и движение > 1 клетки, предложить выбрать кого тащить

			// если тащит то расстояние движения уменьшается на 1


		})

	}

	function creepKill(cell){
		cell.unit = null;
		render.killUnit(cell)
	}



	function creepsMoveAct() { // TODO: таранят бомбу или героя если они на пути

		let creepsCells = map.getAllCellHasUnits(unitType.Creep);
		let bombCells = map.getAllCellHasUnits(unitType.Bomb);

		for (let cellFrom of creepsCells) {
			let next = getNextCellFromAToB(cellFrom, bombCells[0]);
			let to = map.moveUnitFromCellToCoords(cellFrom, next.x, next.y);

			if (to !== null) render.moveUnit(cellFrom, to);
		}

		setTimeout(creepsSpawnAct, 500);
	}


	function creepsSpawnAct() {
		let runesFree = map.getAllCellsByType(tileType.Runes).filter(cell => !cell.hasUnit());
		for (let spawnCell of runesFree) {
			render.initUnit(spawnCell.setUnit(new Unit(unitType.Creep)));
		}


		setTimeout(creepsAttackAct, 500);
	}


	function creepsAttackAct() {
		let bombs = map.getAllCellHasUnits(unitType.Bomb);
		let heroCells = map.getAllCellHasUnits(unitType.Hero);

		let sortHeroCells = [];
		for (let user of users) {
			sortHeroCells.push(heroCells.find(cell => cell.unit === user.myHero));
		}
		let attackedCells = bombs.concat(sortHeroCells);

		let attackEvent = [];
		const crossVectorsZone = [[-1,0],[1,0],[0,-1],[0,1]];

		for (let cell of attackedCells) {
			for (let vec of crossVectorsZone) {
				let creepCell = map.get(cell.x + vec[0], cell.y + vec[1]);
				if (creepCell !== null && creepCell.unit !== null && creepCell.unit.type === unitType.Creep) {
					attackEvent.push({attacking: creepCell, attacked: cell});
				}
			}
		}



		function attack(eventId = 0) {
			let atEv = attackEvent[eventId];

			//atEv.attacking
			//atEv.attacked

			// TODO дописать атаку
			//TEST
			console.log(atEv.attacking);
			console.log('напал на');
			console.log(atEv.attacked);

			if (atEv.attacked.unit.type === unitType.Hero){
				getDisable();
			}

			else if (atEv.attacked.unit.type === unitType.Bomb){
				render.updateBombCounter(--bombHP);
				if (bombHP === 0){
					lose();
					return;
				}
			}

			if (eventId + 1 < attackEvent.length) {
				attack(eventId + 1);
			} else {
				finalAct();
			}

		}

		if (attackEvent.length > 0) {
			attack();
		} else {
			finalAct();
		}
	}

	function getDisable(userID = 0){
		//TODO: random for choosing stacks
		//let user = this;
		users[userID].disables[0] = true;
		render.setDisables(users[userID].disables);
	}


	function finalAct() {
		users.unshift(users.pop());
		roundCounter++;

		setTimeout(chooseСards, 500);
	}

}




//////////////// Функции Расширения

function getRandomInt(random, min, max) {
  return Math.floor(random() * (max - min)) + min;
}


function shakeArray(a, random) {
	a.sort(function () {
  		return random() - 0.5;
	});
	return a;
}


function vectorRotate(a, angle){ // angle 0 - 0; 1 - 90; 2 - 180; 3 - 270
	let an = {x:a.x, y:a.y}
	for (let i = 0; i < angle; i++) {
		let c = an.x;
		an.x = an.y;
		an.y = -c;
	}
	return(an)
}

//a, b - {x:X, y:Y}
function getNextCellFromAToB(a, b){
	const vectorFromAToB = (a, b) => ({x:b.x-a.x, y:b.y-a.y});
	const vectorMultiple = (a, v) => ({x: a.x * v, y:a.y * v});
	const vectorAdd = (a, b)=>({x:b.x+a.x, y:b.y+a.y});
	const vectorRound = a => ({x: Math.round(a.x), y: Math.round(a.y)});
	const vectorLen = a => Math.sqrt(a.x*a.x+a.y*a.y);

	let v = vectorFromAToB(a, b);
	let l = vectorLen(v);

	let c = vectorMultiple(v, 1/l);
	c = vectorRound(c);

	if(c.x !== 0 && c.y !== 0) c.x = 0;

	return vectorAdd(a, c);
}


//createArray(3, 2); // [new Array(2),
                     //  new Array(2),
                     //  new Array(2)]
function createArray(length) {
    var arr = new Array(length || 0),
        i = length;

    if (arguments.length > 1) {
        var args = Array.prototype.slice.call(arguments, 1);
        while(i--) arr[length-1 - i] = createArray.apply(this, args);
    }

    return arr;
}
