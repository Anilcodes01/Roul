import { GameState } from "./types";


export class GameManager {
    state: GameState = "CanBet";
    private static _instance = GameManager;



    private constructor() {
  
    }

    public static getInstance() {
        if(!this._instance) {
            this._instance = new GameManager();
        }

        return this._instance
    }
}