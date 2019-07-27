// здесь вызывается отрисовка карты
function Render() {


    let map = document.getElementById("game-map");
    let activeElement = null;
    let arrayStacks = [
        [null, null, null],
        [null, null, null],
        [null, null, null],
        [null, null, null],
        [null, null, null],
        [null, null, null]];
    let numbersStacks = [];

    const TILES_IMG = ["tmp_models/green.jpg", "models/stone_tex.png", "models/platform_tex.png", "tmp_models/blue.jpg"]
    const CLASS_STACK = ["down-card", "middle-card", "top-card"];
    const TEMPLATE_STACKS = {
        "number-1-icon" : 0,
        "number-2-icon" : 1,
        "number-3-icon" : 2,
        "number-4-icon" : 3,
        "number-5-icon" : 4,
        "number-6-icon" : 5
    };
    // count - количество возвращаемых карт
    let selectStack = function (e) {
        let stack = e.currentTarget;
        let nameClassStack = stack.children[0].className;
        let col = TEMPLATE_STACKS[nameClassStack];
        for (let i = 0; i < 3; i++) {
            if (arrayStacks[col][i] === null) {
                if (stack.typeStack === null) {
                    stack.appendChild(document.createElement("div"));
                    stack.children[1].className = CLASS_STACK[0];
                    stack.typeStack = activeElement.typeCard;
                    arrayStacks[col][i] = activeElement;
                    activeElement.style.border = "0";
                    stack.children[1].appendChild(activeElement);
                    activeElement = null;
                    numbersStacks.push(col);
                    break;
                } else if (stack.typeStack !== activeElement.typeCard) {
                    stack.innerHTML = '';
                    stack.appendChild(document.createElement("div"));
                    stack.children[0].className = nameClassStack;
                    stack.appendChild(document.createElement("div"));
                    stack.children[1].className = CLASS_STACK[0];
                    stack.typeStack = activeElement.typeCard;
                    arrayStacks[col][i] = activeElement;
                    activeElement.style.border = "0";
                    stack.children[1].appendChild(activeElement);
                    activeElement = null;
                    numbersStacks.push(col);
                    break;
                } else if (stack.typeStack === activeElement.typeCard) {
                    switch (stack.childElementCount) {
                        case(2) :
                            stack.appendChild(document.createElement("div"));
                            stack.children[2].className = CLASS_STACK[1];
                            arrayStacks[col][i] = activeElement;
                            activeElement.style.border = "0";
                            stack.children[2].appendChild(activeElement);
                            activeElement = null;
                            numbersStacks.push(col);
                            break;
                        case(3) :
                            stack.appendChild(document.createElement("div"));
                            stack.children[3].className = CLASS_STACK[2];
                            arrayStacks[col][i] = activeElement;
                            activeElement.style.border = "0";
                            stack.children[3].appendChild(activeElement);
                            activeElement = null;
                            numbersStacks.push(col);
                            break;
                        case(4) :
                            arrayStacks[col][i] = activeElement;
                            activeElement.style.border = "0";
                            stack.children[3].children[0] = activeElement;
                            activeElement = null;
                            numbersStacks.push(col);
                            break;
                    }
                    break;
                }
            }
        }

    };

    let selectHandCard = function (e) {
        if (activeElement === null || !activeElement.inStack) {
            e.currentTarget.style.border = "2px solid gold";
            e.currentTarget.isActive = true;
            activeElement = e.currentTarget;
            activeElement.inStack = false;
        }
    };


	this.renderMap = function(inputMap){
        let height = 6;
        let width = 12;
		for (let i = 0; i < height; i++) {
            map.children[0].appendChild(document.createElement("tr"));
            for (let j = 0; j < width; j++) {
                map.children[0].lastChild.appendChild(document.createElement("td"));
            }
        }
		for (let i = 0; i < height; i++) {

            for (let j = 0; j < width; j++) {
                let tmp = inputMap.get(j, i).type;
                let img = new Image();
                img.src = TILES_IMG[tmp];
                map.children[0].children[i].children[j].appendChild(img);
            }
        }

		let stack = document.getElementsByClassName("stack");
		for (let i = 0; i < stack.length; i++) {
            stack[i].onclick = selectStack;
            stack[i].typeStack = null;
        }
    };

	// Unit
	// cellTo.HasUnit тип получать cellTo.unit.type - тип юнита
	// const unitType = {Hero:0, Creep:1, Bomb:2} - юнит
	// cellTo.x cellTo.y - координаты

    const UNIT_IMGS = ["models/tmp files/man-with-sword-and-shield.svg", "models/monster.png", "models/tmp files/naval_mine.png"];

    // передвинуть юнита из in в out
    this.moveUnit = function(cellFrom, cellTo) {

        let fromElem = map.children[0].children[cellFrom.y].children[cellFrom.x];
        let toElem = map.children[0].children[cellTo.y].children[cellTo.x];

        let from_x = fromElem.offsetLeft;
        let from_y = fromElem.parentElement.offsetTop;

        let to_x = toElem.offsetLeft;
        let to_y = toElem.parentElement.offsetTop;

        let el = fromElem.lastChild

        el.style.zIndex = '9';
        el.style.transition = "transform 1s";
        el.style.transform = 'translateY('+ (to_y-from_y) +'px)';
        el.style.transform += 'translateX('+ (to_x-from_x) +'px)';


        setTimeout(function(){
        	toElem.appendChild(el)
        	el.style.transform = 'translateY(0px)';
        	el.style.transform += 'translateX(0px)';
        }, 1000)


    }

    // нарисовать юнита который есть в ячейке
    this.initUnit = function(cell) {

	    let img = new Image(120, 120);
        img.src = UNIT_IMGS[cell.unit.type];
        map.children[0].children[cell.y].children[cell.x].appendChild(img);
	}
    const CARD_IMGS = [
        "src/cards/card1.jpg",
        "src/cards/card2.jpg",
        "src/cards/card3.jpg",
        "src/cards/card4.jpg",
        "src/cards/card5.jpg",
        "src/cards/card6.jpg",
        "src/cards/card7.jpg",
        "src/cards/card8.jpg",
        "src/cards/card9.jpg",
        "src/cards/card10.jpg",
        "src/cards/card11.jpg",
        "src/cards/card12.jpg"
    ];

    // isThis = true если выбирает текущий игрок, если false, то callback не вызывать!


    //cards = array of int card id
    this.selectCards = function(cards, count, callback){

        for (let i = 0; i < numbersStacks.length; i++)
            numbersStacks.pop();

        let desk = document.getElementById("choose-board");
        desk.innerHTML = '';
        desk.style.display = "block";
        let arrayIdSelectedCards = [];
        desk.appendChild(document.createElement("div"));
        desk.children[0].style.display = "block";
        let index_board = 110;
        desk.style.width = (index_board * cards.length) + "px";
        //let pixels = 53.5 * (10 - cards.length);
        //desk.children[0].style.marginLeft = "" + pixels + "px";
        board = desk.children[0];
        board.className = "desk-card";
        for (let i = 0; i < cards.length; i++) {
            board.appendChild(document.createElement("div"));
            board.children[i].className = "round-cards";
            let img = new Image();
            img.src = CARD_IMGS[cards[i]];
            img.cardId = i;
            img.onclick = function(e) {
                if (arrayIdSelectedCards.length !== count && e.currentTarget.style.border !== "2px solid gold") {
                    e.currentTarget.style.border = "2px solid gold";
                    arrayIdSelectedCards.push(e.currentTarget.cardId|0);
                } else if (e.currentTarget.style.border === "2px solid gold") {
                    arrayIdSelectedCards = arrayIdSelectedCards.filter(c => c !== e.currentTarget.cardId);
                    e.currentTarget.style.border = "0";
                }
                if (arrayIdSelectedCards.length === count) {
                    let btn = document.getElementsByClassName("ok-choose");
                    btn[0].style.display = "block";
                } else {
                    let btn = document.getElementsByClassName("ok-choose");
                    btn[0].style.display = "none";
                }
            };
            board.children[i].appendChild(img);
        }
        desk.appendChild(document.createElement("div"));
        desk.children[1].style.display = "block";
        desk = desk.children[1];
        desk.className = "desk";
        desk.appendChild(document.createElement("button"));
        desk.children[0].className = "ok-choose";
        desk.children[0].textContent = "OK";
        desk.children[0].onclick = function () {
            if (callback !== undefined) {
                callback(arrayIdSelectedCards);
            }
        }
    }

    // Скрыть окро выбора карт
    this.stopSelect = function(){
        let board = document.getElementById("choose-board");
        board.style.display = "none";
        let btn = document.getElementsByClassName("ok-choose");
        btn[0].style.display = "none";

    }

    {
        let timerId = null;
        // Запуск таймера отсчета с intSecond до 0
        this.startTimer = function(intSecond){
          let realSecond = intSecond;
          let timer = document.getElementById("timer");

          function updateTimer(){
            let seconds = realSecond % 60;
            let minutes = (realSecond / 60) | 0;
            if (realSecond < 0 ){
              clearInterval(timerId);
              timerId = null;
              return;
            }
            timer.innerHTML = realSecond < 10 ? minutes+":0"+seconds :  minutes+":"+seconds;
            realSecond--;
          }

          updateTimer()
          timerId = setInterval(updateTimer, 1000);
        }


        this.stopTimer = function(){
          if (timerId !== null){
            let timer = document.getElementById("timer");
            timer.innerHTML = "0:00";
            clearInterval(timerId);
            timerId = null;
          }
        }
    }


    // Обновить карты в руке рука не активна(перемещать карты нельзя)
    this.setHand = function(cards){;
      let cardsCounter = document.getElementById("hand-counter");
      cardsCounter.innerHTML = "Hand:"+cards.length;
      let cardBoard = document.getElementById("hand-board");
	  cardBoard.style.display = "flex";
      cardBoard.innerHTML = "";
      console.log(cards);
      for (let i = 0; i < cards.length; i++){
        // cardBoard.appendChild(document.createElement("div"));
        // cardBoard.children[i].className = "hand-card";
        let img = new Image(201, 200);
        img.className = "hand-card"
        img.src = CARD_IMGS[cards[i]];
        img.cardId = cards[i];
        img.onclick = selectHandCard;
        img.isActive = false;
        cardBoard.appendChild(img);
      }
	  cardBoard.style.display = "flex";
    }

    // callback(массив длиной - количество карт в руке, элемент массива - новое место карты i в стеке или -1 если карта выброшена)
    // например при имеющихся картах [2, 3] мы ложим первую карту типа 2 в стек 4,
    // а вторую карту типа 3 в стек 1, нужно вызвать callback([4,1]) // 4, 1 Номера стеков
    this.programming = function(handCards, callback) {
        if (handCards.length === numbersStacks.length)
            callback(numbersStacks);
    };


    // cards - Массив 6x3 карт в стеках [ [top1,center1,down1], [top2,center2,down2], ... ] int id типы карт
    this.setStacks = function(cards){
        // заполняем стэки по массиву
    }


    // callback принимает список выбранных ячеек
    // cells array - массив
    this.selectCells = function(cellsArray, callback){

    }

    //Окно, отображающее поражение для текущей сессии
    this.defeat = function(){
      let defeatBlock = document.getElementById("win-or-defeat");
      defeatBlock.style.display = 'block'
      defeatBlock.src = "src/lose.mp4";
      defeatBlock.muted = "";
      defeatBlock.play();
    };

    // Высветить сообщение поверх всего
    this.showMessage = function(text, color) { // make enum
      let messageBlock = document.getElementById("message");
      messageBlock.style.display = "block";
      //messageBlock.style.background = "red"; //rgba(2,3,4,0.5);
      messageBlock.innerHTML = text;
    };

    // Скрыть сообщение
    this.hideMessge = function(){
      let messageBlock = document.getElementById("message");
      messageBlock.style.display = "none";
    };

}
