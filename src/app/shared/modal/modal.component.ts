import { ModalType } from './ModalType.enum';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css'],
})
export class ModalComponent implements OnInit {
  @Input() modalTitle: string;
  @Input() modalText: string;
  @Input() modalType: string;
  @Output() closeModal: EventEmitter<any> = new EventEmitter<any>();

  constructor() {}

  ngOnInit() {}

  close(event) {
    this.closeModal.emit(event);
  }
}
