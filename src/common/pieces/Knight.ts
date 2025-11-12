import { BasePiece } from "./BaseChess";

/**
 * 馬
 */
export class Knight extends BasePiece {
  GetChineseMovementName(
    x: number,
    y: number,
    newX: number,
    newY: number,
    board: ReadonlyArray<ReadonlyArray<number>>
  ): string {
    throw new Error("Method not implemented.");
  }
  GetName(): string {
    return "馬";
  }
  GetCode(): string {
    return this.isRed ? "N" : "n";
  }
  CanCheck():boolean{
    return true;
  }
  GetAvailableMovement(
    x: number,
    y: number,
    board: ReadonlyArray<ReadonlyArray<number>>,
    ChessArray: ReadonlyArray<BasePiece>
  ): [number, number][] {
    let movements: [number, number][] = [];

    //1點鐘方向
    movements.push([x + 1, y - 2]);
    //5點鐘方向
    movements.push([x + 2, y - 1]);
    //7點鐘方向
    movements.push([x + 2, y + 1]);
    //11點鐘方向
    movements.push([x + 1, y + 2]);

    //23點鐘方向
    movements.push([x - 1, y - 2]);
    //19點鐘方向
    movements.push([x - 2, y - 1]);
    //17點鐘方向
    movements.push([x - 2, y + 1]);
    //13點鐘方向
    movements.push([x - 1, y + 2]);

    movements = movements.filter(([tx, ty]) => {
      if (
        tx <= 8 &&
        tx >= 0 &&
        ty >= 0 &&
        ty <= 9 &&
        (board[ty][tx] === 0 ||
          ChessArray[board[ty][tx] - 1].IsRed() != this.isRed)
      ) {
        let blockX = x;
        let blockY = y;
        if (Math.abs(tx - x) == 2) {
          blockX = (tx + x) / 2;
        } else {
          blockY = (ty + y) / 2;
        }
        return board[blockY][blockX] === 0;
      }
      return false;
    });
    return movements;
  }
}
