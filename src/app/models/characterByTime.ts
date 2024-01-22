import { Character } from './character';

export class CharacterByTime {
  day: string;
  morningCharacter: Character;
  afternoonCharacter: Character;
  eveningCharacter: Character;

  constructor(day: string, mC: Character, aC: Character, eC: Character) {
    this.day = day;
    this.morningCharacter = mC;
    this.afternoonCharacter = aC;
    this.eveningCharacter = eC;
  }
}
