import { Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { Component } from '@angular/core';

@Component({
  template: '',
})
export abstract class NgbdModalContent implements OnInit {
  @Input() name;

  constructor(public activeModal: NgbActiveModal) {}
  ngOnInit(): void {}
}
