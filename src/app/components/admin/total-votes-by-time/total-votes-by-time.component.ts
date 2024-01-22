import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ReportFilter } from 'src/app/helper/resultsFilter';
import { Character } from 'src/app/models/character';
import { GraphTotalVotes } from 'src/app/models/graphTotalVotes';
import { Result } from 'src/app/models/result';
import { CharacterService } from 'src/app/services/character.service';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-total-votes-by-time',
  templateUrl: './total-votes-by-time.component.html',
  styleUrls: ['./total-votes-by-time.component.css'],
})
export class TotalVotesByTimeComponent {
  data: any;
  options: any;
  graphTotalVotes: GraphTotalVotes;
  filter: ReportFilter = new ReportFilter();
  loading: boolean = false;
  characterList = [];
  currentDate = new Date();
  rangeDates = [];

  isStartDateDisabled: boolean = true;
  isEndDateDisabled: boolean = true;
  isCharacterDisabled: boolean = true;

  constructor(
    private storageService: StorageService,
    private router: Router,
    private characterService: CharacterService
  ) {
    if (this.storageService.isLoggedIn()) {
      this.options = {
        plugins: {
          title: {
            display: false,
          },
          legend: {
            position: 'none',
          },
        },
      };
      this.loadTotalVotes();
      this.loadCharacters();
    } else {
      this.router.navigate(['/home']);
    }
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
  loadCharacters(): void {
    this.characterService.getCharacters(null).subscribe({
      next: (data) => {
        let results = new Result(data);
        this.characterList = [];
        var characters = results.results;
        for (const prop in characters) {
          var pObj = JSON.stringify(characters[prop]);
          var cObj = JSON.parse(pObj);
          var character = new Character(cObj);
          this.characterList.push({ Name: character.Name, id: character.id });
        }
      },
      error: (err) => {
        let results = new Result(err);
        // this.messageService.add({
        //   severity: 'error',
        //   summary: 'Disney',
        //   detail: results.message,
        // });
      },
    });
  }
  onCharacterSelected(event: any): void {
    if (event.value != undefined && event.value != '') {
      this.filter.id = event.value;
    }
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
    this.loadTotalVotes();
  }

  private formatDate(dateStr: string): string {
    var date = new Date(dateStr);

    return (
      date.getFullYear() + '/' + (date.getMonth() + 1) + '/' + date.getDate()
    );
  }

  loadTotalVotes() {
    this.characterService.GetTotalVotes(this.filter).subscribe((value) => {
      let results = new Result(value);
      var data = results.results;
      if (results.message.indexOf('No Stats') == -1) {
        let jsonObj = JSON.stringify(data);

        let output = JSON.parse(jsonObj);

        this.graphTotalVotes = new GraphTotalVotes(output);

        this.data = {
          labels: this.graphTotalVotes.Days,
          datasets: [
            {
              label: 'Votes',
              data: this.graphTotalVotes.Votes,
            },
          ],
        };
      }
    });
  }
}
