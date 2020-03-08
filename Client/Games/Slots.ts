enum WinType {
  WIN,
  LOSE,
  JACKPOT
}

interface WinResult {
  type: WinType;
  board: string;
}

export default class SlotMachine {
  private board: string[] = [];
  private emojis: string[] = ["🍎", "🍋", "🍓", "🍒", "💰", "🍇", "🍑"];

  private winPos: string[][] = [
    ["1", "2", "3"],
    ["4", "5", "6"],
    ["7", "8", "9"],
    ["3", "6", "9"],
    ["2", "5", "8"],
    ["1", "4", "7"],
    ["3", "5", "7"],
    ["7", "5", "3"],
    ["1", "5", "9"],
    ["9", "5", "1"]
  ];

  private loadBoard(): void {
    for (let i = 0; i < 9; i++) {
      this.board.push(
        this.emojis[Math.floor(Math.random() * this.emojis.length)]
      );
    }
  }

  public checkWin(): WinResult {
    this.loadBoard();

    for (let subPos of this.winPos) {
      let number = 0;
      let firstEmoji: string;
      const index = this.winPos.indexOf(subPos);

      for (let pos of subPos) {
        if (firstEmoji == null) firstEmoji = this.board[Number(pos) - 1];
        else if (firstEmoji === this.board[Number(pos) - 1]) number++;
      }

      if (index === 1 && firstEmoji === "💰" && number === 2) {
        return { type: WinType.JACKPOT, board: this.display() };
      }

      if (number === 2) {
        return { type: WinType.WIN, board: this.display() };
      }
    }

    return { type: WinType.LOSE, board: this.display() };
  }

  private display(): string {
    const format = "0 | 1 | 2\n3 | 4 | 5\n6 | 7 | 8";
    return format.replace(/\d/g, match => this.board[Number(match)]);
  }
}
