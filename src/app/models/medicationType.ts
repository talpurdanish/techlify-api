interface IMedicationTypes {
  id: number;
  Name: string;
}

export class MedicationTypes implements IMedicationTypes {
  public id: number;
  public Name: string;
  constructor(obj?: any) {
    this.id = obj?.id ?? 0;
    this.Name = obj?.name ?? '';
  }
}
