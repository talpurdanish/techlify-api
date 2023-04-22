interface IProcedure {
  id: number;
  Name: string;
  Cost: number;
  SNo: number;
  TypeId: number;
  Type: string;
}

export class Procedure implements IProcedure {
  id: number;
  Name: string;
  Cost: number;
  SNo: number;
  TypeId: number;
  Type: string;
  constructor(obj?: any) {
    this.id = obj?.id ?? 0;
    this.Name = obj?.name ?? '';
    this.Cost = obj?.cost ?? 0;
    this.SNo = obj?.sno ?? 0;
    this.TypeId = obj?.typeId ?? 0;
    this.Type = obj?.type ?? '';
  }
}
