import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonFunctions } from './../../../helper/common.function';
import { Filter } from './../../../helper/filter';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { MessageService, LazyLoadEvent, MenuItem } from 'primeng/api';
import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { CharacterService } from 'src/app/services/character.service';
import { StorageService } from 'src/app/services/storage.service';
import { Router } from '@angular/router';
import { Character } from 'src/app/models/character';
import { Login } from 'src/app/models/login';

import { Result } from 'src/app/models/result';

import { ConfirmationService } from 'primeng/api';
import { Table } from 'primeng/table';

@Component({
  selector: 'app-view-characters',
  templateUrl: './view-characters.component.html',
  styleUrls: ['./view-characters.component.css'],
})
export class ViewCharactersComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  @ViewChild('dt') dt: Table | undefined;
  Characters: Character[] = [];
  charactersSource: Character[] = [];
  i = 0;
  data: any;

  totalRecords: number;

  loading: boolean;
  selectedCharacter: Character;
  filterForm: FormGroup;

  items: MenuItem[];

  ngOnDestroy(): void {}
  currentUser: Login = new Login();
  constructor(
    public characterService: CharacterService,
    private storageService: StorageService,
    private router: Router,
    private messageService: MessageService,
    private dialogService: DialogService,
    private confirmationService: ConfirmationService,
    private formBuilder: FormBuilder
  ) {}
  ngOnInit(): void {
    if (this.storageService.isLoggedIn()) {
      this.currentUser = this.storageService.getUser();
      this.filterForm = this.formBuilder.group({
        term: ['', [Validators.required]],
      });

      this.items = [
        {
          label: 'Edit',
          icon: 'pi pi-fw pi-pencil',
          command: () => this.ManageCharacter(1, this.selectedCharacter),
        },
        {
          label: 'Delete',
          icon: 'pi pi-fw pi-times',
          command: () => this.ManageCharacter(2, this.selectedCharacter),
        },
      ];
    } else {
      this.router.navigate(['/login']);
    }
  }

  get Term() {
    return this.filterForm.get('term');
  }

  getPageNumber(firstRow: number, rows: number): number {
    let page = 1;
    if (firstRow != 0 && rows > 0) {
      page = Math.ceil(rows / firstRow) + 1;
    }
    return page;
  }

  applyFilterGlobal(term: string) {
    this.dt!.filterGlobal(term, 'contains');
  }

  loadCharacters(event: LazyLoadEvent) {
    this.loading = true;
    this.Characters = [];
    this.charactersSource = [];
    this.i = 0;
    var filter: Filter;
    if (event != null) {
      let jsonObj = JSON.stringify(event.filters);
      let global = JSON.parse(jsonObj);
      if (global.global != undefined) {
        filter = new Filter(
          global.global.value,
          1,
          CommonFunctions.ComputeField(event.sortField),
          event.sortOrder
        );
      }
    }
    this.characterService.getCharacters(filter).subscribe({
      next: (output) => {
        let results = new Result(output);
        var data = results.results;
        for (const prop in data) {
          let jsonObj = JSON.stringify(data[prop]);
          var characterObj = JSON.parse(jsonObj);
          var character = new Character(characterObj);
          this.charactersSource.push(character);
          this.selectedCharacter = character;
        }
        if (this.charactersSource && event != null) {
          this.Characters = this.charactersSource.slice(
            event.first,
            event.rows + event.first
          );
        } else {
          this.Characters = this.charactersSource;
        }
        this.loading = false;
        this.totalRecords = this.charactersSource.length;
      },
      error: (data) => {
        let results = new Result(data);
        this.messageService.add({
          severity: 'error',
          summary: 'Disney',
          detail: results.message,
        });
        this.Characters = [];
        this.charactersSource = [];
        this.loading = false;
        this.totalRecords = this.charactersSource.length;
      },
    });
  }

  getCharacters(): void {
    this.Characters = [];
    this.charactersSource = [];
  }

  convertToImage(binary: any, imageType: string): any {
    var slashIndex = binary.indexOf('base64');
    var base64 = true;
    if (slashIndex == -1) {
      slashIndex = binary.indexOf('/');
      base64 = false;
    }
    const newIndex = slashIndex + (base64 ? 6 : 0);
    const newBinary = binary.substring(newIndex, binary.length - newIndex);

    const str = 'data:' + imageType + ';base64,' + newBinary;

    return str;
  }

  ngAfterViewInit(): void {}

  ManageCharacter(id: number, character: Character): void {
    switch (id) {
      case 1:
        this.router.navigate(['/editCharacter/' + character.id]);
        break;
      case 2:
        this.Delete(character.id);
        break;
    }
  }

  Delete(id: any): void {
    this.confirmationService.confirm({
      target: event.target,
      message: 'Are you sure that you want to proceed?',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Delete',
      rejectLabel: 'Cancel',
      acceptIcon: 'pi pi-fw pi-recycle',
      rejectIcon: 'pi pi-fw pi-times',
      acceptButtonStyleClass: 'p-button-danger',
      rejectButtonStyleClass: 'p-button-success',
      accept: () => {
        this.characterService.deleteCharacter(id).subscribe({
          next: (data) => {
            let results = new Result(data);
            this.messageService.add({
              severity: results.success ? 'success' : 'error',
              summary: 'Disney',
              detail: results.message,
            });
            this.loadCharacters(null);
          },
          error: (data) => {
            let results = new Result(data);
            this.messageService.add({
              severity: 'error',
              summary: 'Disney',
              detail: results.message,
            });
          },
        });
      },
      reject: () => {},
    });
  }
}
