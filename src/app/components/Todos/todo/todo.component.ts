import { MessageService, ConfirmationService } from 'primeng/api';
import { TodoService } from '../../../services/todo.service';
import { Todo } from '../../../models/Todo';
import { Login } from '../../../models/login';
import { User } from 'src/app/models/users';
import { StorageService } from '../../../services/storage.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Result } from 'src/app/models/result';

@Component({
  selector: 'app-todo',
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.css'],
})
export class TodoComponent implements OnInit {
  @Output() UpdateTotalTasks = new EventEmitter<number>();
  todoForm: FormGroup;
  id: string = '';
  currentUser: Login;
  todos: Todo[] = [];
  selectedTodo: Todo;
  todo: Todo;
  selectedTodos: Todo[] = [];

  todoDialog: boolean;
  submitted: boolean;
  loading: boolean;
  isEdit: boolean;

  constructor(
    private formBuilder: FormBuilder,
    private storageService: StorageService,
    private todoService: TodoService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {
    if (this.storageService.isLoggedIn()) {
      this.currentUser = this.storageService.getUser();
    }
    this.createForm();
  }

  createForm() {
    this.todoForm = this.formBuilder.group({
      title: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(250),
        ],
      ],
      id: [''],
    });
  }

  loadTodos() {
    this.loading = true;
    this.todos = [];
    this.todoService.getTodoList().subscribe({
      next: (data) => {
        let result = new Result(data);
        const d = result.results;
        for (let key in d) {
          if (d.hasOwnProperty(key)) {
            let todo = new Todo(d[key]);
            this.todos.push(todo);
          }
        }
        this.selectedTodo = this.todos[0];
        this.UpdateTotalTasks.emit(this.todos.length);
        this.loading = false;
      },
    });
  }

  MarkCompleted() {
    if (this.selectedTodos.length > 0) {
      var ids: string[] = [];
      for (var i = 0; i < this.selectedTodos.length; i++) {
        ids.push(this.selectedTodos[i].Id);
      }
      this.todoService.markCompleted(ids).subscribe({
        next: (data) => {
          let results = new Result(data);
          this.messageService.add({
            severity: 'success',
            summary: 'FMDC',
            detail: results.message,
          });
          this.loadTodos();
        },
        error: (data) => {
          let results = new Result(data);
          this.messageService.add({
            severity: 'error',
            summary: 'FMDC',
            detail: results.message,
          });
        },
      });
    }
  }

  Delete() {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete the selected todo?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        if (this.selectedTodos.length > 0) {
          var ids: string[] = [];
          for (var i = 0; i < this.selectedTodos.length; i++) {
            ids.push(this.selectedTodos[i].Id);
          }
          this.todoService.deleteMany(ids).subscribe({
            next: (data) => {
              let results = new Result(data);
              this.messageService.add({
                severity: 'success',
                summary: 'FMDC',
                detail: results.message,
              });
              this.loadTodos();
            },
            error: (data) => {
              let results = new Result(data);
              this.messageService.add({
                severity: 'error',
                summary: 'FMDC',
                detail: results.message,
              });
            },
          });
        }
      },
    });
  }

  Edit(item: Todo) {
    if (item != null) {
      this.todoForm.patchValue({
        title: item.Title,
        id: item.Id,
      });
      this.isEdit = true;
    }
  }

  get Title() {
    return this.todoForm.get('title');
  }
  get Id() {
    return this.todoForm.get('id');
  }

  ngOnInit(): void {}

  onSumbit() {
    this.todoService
      .create(!this.isEdit ? '' : this.Id.value, this.Title.value)
      .subscribe({
        next: (data) => {
          let results = new Result(data);
          if (results.success) {
            this.messageService.add({
              severity: 'success',
              summary: 'FMDC',
              detail: results.message,
            });
            this.loadTodos();
            this.todoForm.reset();
          } else {
            let results = new Result(data);
            this.messageService.add({
              severity: 'error',
              summary: 'FMDC',
              detail: results.message,
            });
          }
        },
        error: (data) => {
          let results = new Result(data);
          this.messageService.add({
            severity: 'error',
            summary: 'FMDC',
            detail: results.message,
          });
        },
      });
  }
}
