import { WebSocket } from "ws";
import { COINS, Number, OutgoingMessages } from "@repo/common/types";
import { GameManager } from "./GameManager";

const Multiplyer = 17;

export class User {
  id: number;
  name: string;
  balance: number;
  ws: WebSocket;
  locked: number;

  constructor(id: number, name: string, ws: WebSocket) {
    this.id = id;
    this.name = name;
    this.balance = 2500;
    this.ws = ws;
    this.locked = 0;
  }

  bet(clientId: string, amount: COINS, betNumber: Number) {
    this.balance -= amount;
    this.locked += amount;
    const response = GameManager.getInstance().bet(amount, betNumber, this.id);
    if (response) {
      this.send({
        clientId,
        type: "bet",
        amount: amount,
        balance: this.balance,
        locked: this.locked,
      });
    } else {
      this.send({
        clientId,
        type: "bet-undo",
        amount: amount,
        balance: this.balance,
        locked: this.locked,
      });
    }
  }
  send(payload: OutgoingMessages) {
    this.ws.send(JSON.stringify(payload))
  }

  won(amount: number, output: Number) {
    this.balance +=
      amount * (output === Number.Zero ? Multiplyer * 2 : Multiplyer);
    this.locked -= amount;
    this.send({
        type: 'won',
        balance: this.balance,
        locked: this.locked,
        wonAmount: amount,
        outCome: output
    })
  }

  lost(amount: number, _output: Number) {
    this.locked += amount;
    this.send({
        type: 'lost',
        balance: this.balance,
        locked: this.locked,
        outCome: Number.Zero // or any appropriate value
    })
  }
}
