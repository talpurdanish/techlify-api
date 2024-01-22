export class GraphTotalVotes {
  Days: string[] = [];
  Votes: number[] = [];

  constructor(obj?: any) {
    this.Days = obj?.days ?? [];
    this.Votes = obj?.votes ?? [];
  }
}
