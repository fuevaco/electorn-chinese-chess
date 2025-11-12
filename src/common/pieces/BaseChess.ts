/**
 * https://www.xqbase.com/protocol/cchess_move.htm
紅方    黑方	字母    相當於國際象棋中的棋子	數字
帥      將      K       King(王)               1
仕      士      A       Advisor(沒可比棋子)     2
相      象      B[1]	Bishop(象)	           3
傌      馬      N[2]	Knight(馬)	            4
俥      車      R       Rook(車)	            5
炮	    砲	    C	    Cannon(沒有可比較的棋子) 6
兵	    卒	    P	    Pawn(兵)                7
*/
export abstract class BasePiece {
  protected isRed: boolean;
  constructor(isRed: boolean) {
    this.isRed = isRed;
  }
  /**
   * 中式記譜法
   * https://zh.wikipedia.org/wiki/%E8%B1%A1%E6%A3%8B
   * https://www.xqbase.com/protocol/cchess_move.htm
   * 獲得移動名稱如“車二進三”
   *
   *
棋盤上的座標是對每個棋手由右至左的9條直線分別為1至9路。紅方用漢字（一、二、三……）書寫，黑方用阿拉伯數字（1、2、3）書寫 中式記譜法一般使用四個字來記錄棋子的移動。
第1字是棋子的名稱。如“馬”或“車”。
第2字是表示棋子所在直線（路）位置的數字。紅方用中國數字，黑方用阿拉伯數字。
當一方有2個以上名稱相同的棋子位於同一縱線時，需要用“前”或“後”來加以區別。例如，“前傌退六”（表示前面的紅傌退到直線六）、“後炮平4”（表示後面的黑炮平移到直線4）。士象不需要以前後來判斷，因為縱使是在同一直線上，也可以憑第三個字（進退）知道是移動哪一隻。
當兵卒在同一縱線達到3個，用前、中、後來區分，達到4個，用前、二、三、四（或後）區分，達到5個，用前、二、三、四、五（或後）區分。
當兵卒在兩個縱線都達到兩個以上時，按照舊的記譜方式舉例：前兵九平八，此時可省略兵（卒），記做前九平八，以達到都用4個漢字記譜的要求，此表示方式已在中國象棋DhtmlXQ動態棋盤上實現，是對中文記譜方法的一個重要完善。
第3字表示棋子移動的方向：橫走用“平”、向前走用“進”、向後走用“退”。有時也可以用“上”、“下”代替“進”、“退”。
第4字是表示棋子前往的目的地。
如果是隻能直行或橫行的棋子，在直行時表示步數，橫行時表示目的地直線（路）位置的數字。[c 5]
如果是隻能斜行的棋子，表示目的地直線（路）位置的數字。[c 6]
當棋子只能直行進退一步時可省略。[c 7]
如果記譜只包括中局或殘局部分，一開始就輪到黑方走子，那麼紅方的步數會標上省略號。以下是一個比較完整的例子，記載中炮屏風馬對三步虎的頭3步：
 
步數	紅方	黑方
1.	炮二平五	馬8進7
2.	傌二進三	炮8平9
3.	傌八進七	車9平8
（“炮二平五”表示紅炮從二路平移到五路；“馬8進7”表示黑馬從8路向前走到7路。）
 
速記法
為了適應形勢需要，提高記錄速度，有人對原來的中式記譜法記錄進行了改革：
 
把數字改為阿拉伯數字；
將四個字改為三個字——去掉第三個字（運動方向），改用短橫線。在第三個字下面畫一條橫線表示“進”，在上面畫一條橫線表示“退”，不加橫線表示“平”。
如：炮{\displaystyle 6{\overline {2}}}6\overline {2}（炮6退2）、車{\displaystyle 72}72（車七平二）、後車{\displaystyle {\underline {2}}}\underline {2}（後車進二）。[27]
   * @param x 當前位置x
   * @param y 當前位置y
   * @param newX 新位置x
   * @param newY 新位置y
   * @param board 盤面二維數組
   */
  abstract GetChineseMovementName(
    x: number,
    y: number,
    newX: number,
    newY: number,
    board: ReadonlyArray<ReadonlyArray<number>>,
  ): string;
  /**
   * 獲得名稱：如車
   */
  abstract GetName(): string;
  /**
   * 獲得名稱：如車->R
   */
  abstract GetCode(): string;

  CanCheck(): boolean {
    return false;
  }

  /**
   * 是否是紅方
   */
  IsRed() {
    return this.isRed;
  }

  /**
   * 獲得可以走的移動序列
   * @param x 棋子的x座標
   * @param y 棋子的y座標
   * @param board 盤面二維數組
   */
  abstract GetAvailableMovement(
    x: number,
    y: number,
    board: ReadonlyArray<ReadonlyArray<number>>,
    pieceArray: ReadonlyArray<BasePiece>
  ): Array<[number, number]>;
}
export const MovementNameArray: ReadonlyArray<string> = [
  "一",
  "二",
  "三",
  "四",
  "五",
  "六",
  "七",
  "八",
  "九",
];
export const GetChineseMovementNameForSimpleChess = (
  x: number,
  y: number,
  newX: number,
  newY: number,
  isRed: boolean,
  chessName: string
): string => {
  let actionName;
  const direction = isRed ? -1 : 1;
  let positionTo = "";
  let positionFrom = "" + (x + 1);
  if (newY != x) {
    actionName = (newY - y) * direction > 0 ? "進" : "退";
    const move = Math.abs(newY - y);
    positionTo = "" + move;
    if (isRed) {
      positionTo = MovementNameArray[move - 1];
      positionFrom = MovementNameArray[8 - x];
    }
  } else if (newX != x) {
    actionName = "平";
    if (isRed) {
      positionTo = MovementNameArray[newX];
      positionFrom = MovementNameArray[8 - x];
    }
  }
  return `${chessName}${positionFrom}${actionName}${positionTo}`;
};
