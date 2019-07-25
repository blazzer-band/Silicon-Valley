"use strict"
// локальный пользователь получающий запросы(из ядра) на данные и управляющий рендером

class LocalAgent extends AbstractAgent{

	constructor(){
		super();
	}
	
	selectCards(cards, count, callback){
		game.getRender.selectCards(cards, count, function(callb) {

			game.getRender.stopSelect()
			game.getRender.setHand(callb)

			callback(callb)
		})
	}



}