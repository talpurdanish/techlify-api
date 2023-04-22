interface IProcedureTypes {
  id: number;
  Name: string;
}

export class ProcedureTypes implements IProcedureTypes {
  public id: number;
  public Name: string;
  constructor(obj?: any) {
    this.id = obj?.id ?? 0;
    this.Name = obj?.name ?? '';
  }
}
