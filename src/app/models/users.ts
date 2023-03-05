export class User {
  UserId: number = 0;
  Name: string = '';
  Username: string = '';
  Address: string = '';
  Picture: string = '';
  DateofBirth: Date = new Date();
  Gender: string = '';
  CNIC: string = '';
  PMDCNo: string = '';
  Created: Date = new Date();
  CityId: number = 0;
  RoleId: number = 0;
  IsActive: boolean = false;
  CityName: string = '';
  RoleName: string = '';
  ProvinceName: string = '';
  PhoneNo: string = '';
  PhoneType: number = 0;
  Picturesrc: any;
  hasImage: boolean = false;

  constructor(data: any) {
    let jsonObj = JSON.stringify(data);

    let result = JSON.parse(jsonObj) as User;

    this.UserId = result.UserId;
    this.Name = result.Name;
    this.Username = result.Username;
    this.Address = result.Address;
    this.Picture = result.Picture;
    this.DateofBirth = result.DateofBirth;
    this.Gender = result.Gender;
    this.CNIC = result.CNIC;
    this.PMDCNo = result.PMDCNo;
    this.Created = result.Created;
    this.CityId = result.CityId;
    this.RoleId = result.RoleId;
    this.IsActive = result.IsActive;
    this.CityName = result.CityName;
    this.RoleName = result.RoleName;
    this.ProvinceName = result.ProvinceName;
    this.PhoneNo = result.PhoneNo;
    this.PhoneType = result.PhoneType;
  }
}
