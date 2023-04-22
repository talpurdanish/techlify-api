interface IPrescriptionMedication {
  id: number;
  Quantity: number;
  Units: string;
  Times: number;
  Code: number;
  PrescriptionId: number;
  Medicine: string;
  sno: number;
}
export class PrescriptionMedication {
  id: number;
  Quantity: number;
  Units: string;
  Times: number;
  Code: number;
  PrescriptionId: number;
  Medicine: string;
  sno: number;
  constructor(obj?: any) {
    this.id = obj?.id ?? 0;
    this.Quantity = obj?.quantity ?? 0;
    this.Units = obj?.units ?? '';
    this.Code = obj?.code ?? 0;
    this.PrescriptionId = obj?.prescriptionId ?? 0;
    this.Times = obj?.times ?? 0;
    this.Medicine = obj?.medication ?? '';
  }

  ToString(this: PrescriptionMedication) {
    return (
      this.Medicine +
      ' ............................... ' +
      this.Quantity +
      ' ' +
      this.Units +
      ' ' +
      this.Times +
      ' times/Day'
    );
  }

  ToOutput(this: PrescriptionMedication) {
    return (
      this.Code + ':' + this.Quantity + ':' + this.Units + ':' + this.Times
    );
  }
}
