export class Province {
  id?: any;
  Name?: string;

  constructor(data: any) {
    this.id = data.id;
    this.Name = data.Name;
  }
}
