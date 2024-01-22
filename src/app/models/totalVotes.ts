export class TotalVotes {
  day: string = '';
  name: string = '';
  total: number = 0;
  morning: number = 0;
  afternoon: number = 0;
  evening: number = 0;
  characterId: number = 0;
  constructor(data: any) {
    this.day = data.day;
    this.name = data.name;
    this.total = data.totalVotes;
    this.morning = data.morningVotes;
    this.evening = data.eveningVotes;
    this.characterId = data.characterId;
    this.afternoon = data.afternoonVotes;
  }
}
