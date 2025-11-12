import { BasePiece, GetChineseMovementNameForSimpleChess } from "./BaseChess";

const isFacing = (
  k: King,
  board: ReadonlyArray<ReadonlyArray<number>>,
  ChessArray: ReadonlyArray<BasePiece>,
  x: number,
  y: number
): boolean => {
  let direction = 1;
  if (k.IsRed()) {
    direction = -1;
  }
  for (let j = y + direction; j <= 9 && j >= 0; j = j + direction) {
    if (board[j][x] !== 0) {
      if (ChessArray[board[j][x] - 1] instanceof King) {
        return true;
      } else {
        return false;
      }
    }
  }
  return false;
};

/**
 * 帥or將
 */
export class King extends BasePiece {
  GetChineseMovementName(
    x: number,
    y: number,
    newX: number,
    newY: number,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    board: ReadonlyArray<ReadonlyArray<number>>
  ): string {
    return GetChineseMovementNameForSimpleChess(
      x,
      y,
      newX,
      newY,
      this.IsRed(),
      this.GetName()
    );
  }

  GetName(): string {
    return this.isRed ? "帥" : "將";
  }
  GetCode(): string {
    return this.isRed ? "K" : "k";
  }
  GetAvailableMovement(
    x: number,
    y: number,
    board: ReadonlyArray<ReadonlyArray<number>>,
    ChessArray: ReadonlyArray<BasePiece>
  ): [number, number][] {
    const movements: [number, number][] = [];

    // 容錯
    if (x < 0 && x > 8 && y < 0 && y > 9) {
      return movements;
    }
    const no = board[y][x];
    const c = ChessArray[no - 1];
    if (!(c instanceof King)) {
      return movements;
    }

    // 紅
    if (c.isRed) {
      //上
      if (
        //可以上去
        y > 7 &&
        //目標位置無棋
        (board[y - 1][x] === 0 ||
          // 或者是對方棋子
          ChessArray[board[y - 1][x] - 1].IsRed() !== c.isRed) &&
        //走完後不白臉
        !isFacing(c, board, ChessArray, x, y - 1)
      ) {
        movements.push([x, y - 1]);
      }
      //下
      if (
        //可以下去
        y < 9 &&
        //目標位置無棋
        (board[y + 1][x] === 0 ||
          // 或者是對方棋子
          ChessArray[board[y + 1][x] - 1].IsRed() !== c.isRed)
      ) {
        movements.push([x, y + 1]);
      }
    }

    // 黑
    if (!c.isRed) {
      //上
      if (
        //可以上去
        y < 2 &&
        //目標位置無棋
        (board[y + 1][x] === 0 ||
          // 或者是對方棋子
          ChessArray[board[y + 1][x] - 1].IsRed() !== c.isRed) &&
        //走完後不白臉
        !isFacing(c, board, ChessArray, x, y + 1)
      ) {
        movements.push([x, y + 1]);
      }
      //下
      if (
        //可以下去
        y > 0 &&
        //目標位置無棋
        (board[y - 1][x] === 0 ||
          // 或者是對方棋子
          ChessArray[board[y - 1][x] - 1].IsRed() !== c.isRed)
      ) {
        movements.push([x, y - 1]);
      }
    }

    //左
    if (
      //可以左
      x > 3 &&
      //目標位置無棋
      (board[y][x - 1] === 0 ||
        // 或者是對方棋子
        ChessArray[board[y][x - 1] - 1].IsRed() !== c.isRed) &&
      //走完後不白臉
      !isFacing(c, board, ChessArray, x - 1, y)
    ) {
      movements.push([x - 1, y]);
    }

    //右
    if (
      //可以右
      x < 5 &&
      //目標位置無棋
      (board[y][x + 1] === 0 ||
        // 或者是對方棋子
        ChessArray[board[y][x + 1] - 1].IsRed() !== c.isRed) &&
      //走完後不白臉
      !isFacing(c, board, ChessArray, x + 1, y)
    ) {
      movements.push([x + 1, y]);
    }
    return movements;
  }
}
