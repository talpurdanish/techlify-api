import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService, ConfirmationService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { ReportFilter } from 'src/app/helper/resultsFilter';
import { Character } from 'src/app/models/character';
import { Result } from 'src/app/models/result';
import { CharacterService } from 'src/app/services/character.service';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-top-character',
  templateUrl: './top-character.component.html',
  styleUrls: ['./top-character.component.css'],
})
export class TopCharacterComponent implements OnInit {
  filter: ReportFilter = new ReportFilter();
  loading: boolean = false;
  characterList = [];
  currentDate = new Date();
  rangeDates = [];

  isStartDateDisabled: boolean = true;
  isEndDateDisabled: boolean = true;
  isCharacterDisabled: boolean = true;
  constructor(
    public characterService: CharacterService,
    private storageService: StorageService,
    private router: Router,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    if (!this.storageService.isLoggedIn()) {
      this.router.navigate(['/home']);
    }
    this.loadTopCharacters();
  }

  toggleStartDateFilter() {
    this.isStartDateDisabled = !this.isStartDateDisabled;
  }

  toggleEndDateFilter() {
    this.isEndDateDisabled = !this.isEndDateDisabled;
  }

  toggleCharacterFilter() {
    this.isCharacterDisabled = !this.isCharacterDisabled;
  }
  applyFilter() {
    if (!this.isStartDateDisabled) {
      this.filter.startDate = this.formatDate(this.rangeDates[0]);
    } else this.filter.startDate = null;
    if (!this.isEndDateDisabled) {
      this.filter.startDate = this.formatDate(this.rangeDates[1]);
    } else this.filter.endDate = null;
    if (!this.isEndDateDisabled || !this.isStartDateDisabled) {
      this.filter.filterByDateRange = true;
    } else this.filter.filterByDateRange = false;
    this.filter.id = !this.isCharacterDisabled ? this.filter.id : -1;
    this.loadTopCharacters();
  }

  private formatDate(dateStr: string): string {
    var date = new Date(dateStr);

    return (
      date.getFullYear() + '/' + (date.getMonth() + 1) + '/' + date.getDate()
    );
  }

  loadTopCharacters(): void {
    this.loading = true;
    this.characterService.GetTopFiveCharacters(this.filter).subscribe({
      next: (output) => {
        let results = new Result(output);
        var data = results.results;
        for (const prop in data) {
          let jsonObj = JSON.stringify(data[prop]);
          var obj = JSON.parse(jsonObj);
          var character = new Character(obj);
          this.characterList.push(character);
        }
        this.loading = false;
      },
      error: (data) => {
        let results = new Result(data);
        this.messageService.add({
          severity: 'error',
          summary: 'Disney',
          detail: results.message,
        });
        this.characterList = [];
        this.loading = false;
      },
    });
  }
}
