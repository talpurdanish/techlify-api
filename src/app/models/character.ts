export class Character {
  id: string;
  Name: string = '';
  Description: string = '';
  Picture: string = '';
  hasImage: boolean = false;
  Votes: number = 0;

  constructor(data?: any) {
    this.id = data ? data.characterId : -1;
    this.Name = data ? data.name : '';
    this.Picture = data ? data.picture : '';
    this.Description = data ? data.description : '';
    this.Votes = data ? data.votes : 0;
    this.hasImage = this.Picture != '' && this.Picture !== undefined;
    this.Picture = this.hasImage
      ? this.Picture
      : '../../../../assets/images/profile.png';
  }

  ToString(): String {
    return this.Votes + ' - ' + this.Name;
  }
}
