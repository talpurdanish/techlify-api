import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { LazyLoadEvent } from 'primeng/api';

@Component({
  selector: 'app-prescriptionmedication',
  templateUrl: './prescriptionmedication.component.html',
  styleUrls: ['./prescriptionmedication.component.css'],
})
export class PrescriptionmedicationComponent implements OnInit {
  @Output() DeleteMedicine = new EventEmitter<number>();
  @Input()
  medicationsInput: { sno: number; content: string }[] = [];
  medications: { sno: number; content: string }[] = [];
  totalRecords: number = 0;
  loading: boolean = false;
  constructor() {}

  ngOnChanges() {
    this.medications = this.medicationsInput;
  }

  deleteMedicine(sno: number) {
    this.DeleteMedicine.emit(sno);
  }

  load() {}

  ngOnInit() {}
}
