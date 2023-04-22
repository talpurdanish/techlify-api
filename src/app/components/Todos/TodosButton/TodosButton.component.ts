import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-TodosButton',
  templateUrl: './TodosButton.component.html',
  styleUrls: ['./TodosButton.component.css'],
})
export class TodosButtonComponent implements OnInit {
  totalTasks: number;

  constructor() {}

  ngOnInit() {}

  updateTotalTasks(event) {
    this.totalTasks = event;
  }
}
