interface ITestParameter {
  id: number;
  Name: string;
  MaleMaxValue: number;
  MaleMinValue: number;
  FemaleMaxValue: number;
  FemaleMinValue: number;
  Unit: string;
  Value: number;
  TestId: number;
  ReferenceRange: string;
  Gender: boolean;
  Status: Boolean;
  ValidRange: string;
  Test: string;
}

export class TestParameter implements ITestParameter {
  id: number;
  Name: string;
  MaleMaxValue: number;
  MaleMinValue: number;
  FemaleMaxValue: number;
  FemaleMinValue: number;
  Unit: string;
  Value: number;
  TestId: number;
  ReferenceRange: string;
  Gender: boolean;
  Status: boolean;
  ValidRange: string;
  Test: string;
  constructor(obj?: any) {
    this.id = obj?.id ?? 0;
    this.Name = obj?.name ?? '';
    this.MaleMaxValue = obj?.maleMaxValue ?? 0;
    this.MaleMinValue = obj?.maleMinValue ?? 0;
    this.FemaleMaxValue = obj?.femaleMaxValue ?? 0;
    this.FemaleMinValue = obj?.femaleMinValue ?? 0;
    this.Unit = obj?.unit ?? '';
    this.Value = obj?.value ?? 0;
    this.TestId = obj?.testId ?? 0;
    this.ReferenceRange = obj?.referenceRange ?? '';
    this.Gender = obj?.gender ?? false;
    this.Status = obj?.status ?? false;
    this.Test = obj?.testName ?? '';

    this.ValidRange =
      this.FemaleMaxValue > 0 && this.FemaleMinValue > 0
        ? `<i class='fa fa-fw fa-mars'></i> (${this.MaleMinValue} -${this.MaleMaxValue} ) <i class='fa fa-fw fa-venus'></i> (${this.FemaleMinValue} -${this.FemaleMaxValue} ) `
        : `${this.MaleMinValue} -${this.MaleMaxValue}`;
  }
}
