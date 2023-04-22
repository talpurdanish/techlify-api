interface IMedication {
  Code: number;
  Name: string;
  Brand: string;
  Description: string;
  TypeId: number;
  Type: string;
  Sno: number;
}

export class Medication implements IMedication {
  Code: number;
  Name: string;
  Brand: string;
  Description: string;
  TypeId: number;
  Type: string;
  Sno: number;
  constructor(obj?: any) {
    this.Code = obj?.code ?? 0;
    this.Name = obj?.name ?? '';
    this.Brand = obj?.brand ?? '';
    this.TypeId = obj?.typeId ?? 0;
    this.Type = obj?.type ?? '';
    this.Description = obj?.description ?? '';
  }
}
