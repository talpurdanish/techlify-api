import { TestParameter } from './TestParameter';

interface ITest {
  id: number;
  Name: string;
  Description: string;
  TestParameters: TestParameter[];
}

export class Test implements ITest {
  id: number;
  Name: string;
  Description: string;
  TestParameters: TestParameter[];
  constructor(obj?: any) {
    this.id = obj?.id ?? 0;
    this.Name = obj?.name ?? '';
    this.Description = obj?.description ?? '';
  }
}
