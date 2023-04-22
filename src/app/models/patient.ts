interface IPatient {
  id: number;
  PatientNumber: string;
  Name: string;
  FatherName: string;
  Address: string;
  Gender: string;
  PhoneType: number;
  PhoneNo: string;
  BloodGroup: string;
  DateofBirth: string;
  CNIC: string;
  CityId: number;
  City: string;
  ProvinceName: string;
  ProvinceId: number;
  Picture: string;
  Created: Date;
  hasImage: boolean;
  Picturesrc: any;
  ImageType: string;
  Appointment: string;
}

export class Patient implements IPatient {
  public id: number = 0;
  public PatientNumber: string;
  public Name: string;
  public FatherName: string;
  public Address: string;
  public Gender: string;
  public PhoneType: number = 0;
  public PhoneNo: string;
  public BloodGroup: string;
  public DateofBirth: string;
  public CNIC: string;
  public CityId: number = 0;
  public City: string;
  public ProvinceName: string;
  public ProvinceId: number = 0;
  public Picture: string;
  public Created: Date = new Date();
  public hasImage: boolean = false;
  public Picturesrc: any;
  public ImageType: string;
  public Appointment: string;

  constructor(data?: any) {
    this.id = data?.id ?? 0;
    this.PatientNumber = data?.patientNumber ?? '';
    this.Name = data?.name ?? '';
    this.FatherName = data?.fatherName ?? '';
    this.Address = data?.address ?? '';
    this.Gender = data?.gender ?? '';
    this.PhoneType = data?.phoneType ?? 0;
    this.PhoneNo = data?.phoneNo ?? '';
    this.BloodGroup = data?.bloodGroup ?? '';
    this.DateofBirth = data?.dateofBirth ?? new Date();
    this.CNIC = data?.cnic ?? '';
    this.CityId = data?.cityId ?? 0;
    this.City = data?.city ?? '';
    this.ProvinceName = data?.provinceName ?? '';
    this.ProvinceId = data?.provinceId ?? 0;
    this.Picture = data?.picture ?? '';
    this.Created = data?.created ?? new Date();
    this.Appointment = data?.appointment ?? 0;
    this.hasImage = this.Picture != '';
  }
}
