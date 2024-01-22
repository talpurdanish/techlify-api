import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Result } from 'src/app/models/result';
import { CharacterService } from 'src/app/services/character.service';
import { StorageService } from 'src/app/services/storage.service';
import { PopularCharacter } from 'src/app/models/popularCharacter';
import { Character } from 'src/app/models/character';
@Component({
  selector: 'app-popular-character-by-time',
  templateUrl: './popular-character-by-time.component.html',
  styleUrls: ['./popular-character-by-time.component.css'],
})
export class PopularCharacterByTimeComponent {
  loading: boolean = false;
  dateList = [];
  popularCharacter: PopularCharacter = new PopularCharacter();
  isDateDisabled: boolean = true;
  selectedDate: Date = new Date();
  constructor(
    private storageService: StorageService,
    private router: Router,
    private characterService: CharacterService
  ) {
    if (this.storageService.isLoggedIn()) {
      this.loadCharacters(this.formatDate(new Date().toString()));
      this.loadDates();
    } else {
      this.router.navigate(['/home']);
    }
  }

  toggleStartDateFilter() {
    this.isDateDisabled = !this.isDateDisabled;
  }

  loadDates(): void {
    this.characterService.getAllVotesDates().subscribe({
      next: (data) => {
        let results = new Result(data);
        this.dateList = [];
        var characters = results.results;
        for (const prop in characters) {
          var pObj = JSON.stringify(characters[prop]);
          var cObj = JSON.parse(pObj);

          this.dateList.push({ Name: cObj, id: cObj });
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

  onDateSelected(event: any): void {
    if (event.value != undefined && event.value != '') {
      this.selectedDate = event.value;
    }
  }

  applyFilter() {
    this.loadCharacters(this.formatDate(new Date().toString()));
  }

  private formatDate(dateStr: string): string {
    var date = new Date(dateStr);

    return (
      date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()
    );
  }

  loadCharacters(date: string) {
    this.characterService.getPopularCharacters(date).subscribe((value) => {
      let results = new Result(value);
      var data = results.results;
      if (results.message.indexOf('No Stats') == -1) {
        let jsonObj = JSON.stringify(data);

        let output = JSON.parse(jsonObj);

        this.popularCharacter.morningCharacter = new Character(
          output.morningCharacter
        );
        this.popularCharacter.afternoonCharacter = new Character(
          output.afternoonCharacter
        );
        this.popularCharacter.eveningCharacter = new Character(
          output.eveningCharacter
        );
      }
    });
  }
}
