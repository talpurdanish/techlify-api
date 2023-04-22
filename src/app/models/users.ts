export class User {
  id: string;
  Name: string = '';
  Username: string = '';
  Address: string = '';
  Picture: string = '';
  DateofBirth: Date = new Date();
  Gender: string = '';
  CNIC: string = '';
  PMDCNo: string = '';
  Created: Date = new Date();
  IsActive: boolean = false;
  City: string = '';
  Role: string = '';
  ProvinceName: string = '';
  PhoneNo: string = '';
  PhoneType: number = 0;
  Picturesrc: any;
  hasImage: boolean = false;
  ImageType: string;

  constructor(data: any) {
    this.id = data.id;
    this.Name = data.name;
    this.Username = data.username;
    this.Address = data.address;
    this.Picture = data.picture;
    this.DateofBirth = data.dateofBirth;
    this.Gender = data.gender;
    this.CNIC = data.cnic;
    this.PMDCNo = data.pmdcNo;
    this.Created = data.created;
    this.IsActive = data.isActive;
    this.City = data.city;
    this.Role = data.role;
    this.ProvinceName = data.province;
    this.PhoneNo = data.phoneNo;
    this.PhoneType = data.phoneType;
  }
}
