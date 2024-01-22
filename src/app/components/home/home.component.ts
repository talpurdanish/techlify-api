import { Component, OnDestroy, OnInit } from '@angular/core';
import { StorageService } from 'src/app/services/storage.service';
import { Router } from '@angular/router';
import { Character } from 'src/app/models/character';
import { Login } from 'src/app/models/login';

import { CharacterService } from 'src/app/services/character.service';
import { Result } from 'src/app/models/result';
import { MessageService } from 'primeng/api';
import { Roles } from 'src/app/models/Roles';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit, OnDestroy {
  content?: string;
  listCharacters: Character[] = [];
  currentUser: Login = new Login();
  data: any;
  options: any;
  i: number = 0;
  constructor(
    private storageService: StorageService,
    private characterService: CharacterService,
    private messageService: MessageService,
    private router: Router
  ) {
    if (this.storageService.isLoggedIn()) {
      this.currentUser = this.storageService.getUser();
    }
  }
  ngOnInit(): void {
    this.loadCharacters();
  }
  ngOnDestroy() {}

  loadCharacters(): void {
    this.characterService.getCharacters(null).subscribe({
      next: (data) => {
        let results = new Result(data);
        this.listCharacters = [];
        var characters = results.results;
        for (const prop in characters) {
          var pObj = JSON.stringify(characters[prop]);
          var cObj = JSON.parse(pObj);
          var character = new Character(cObj);
          this.listCharacters.push(character);
        }
      },
      error: (err) => {
        let results = new Result(err);
        this.messageService.add({
          severity: 'error',
          summary: 'Disney',
          detail: results.message,
        });
      },
    });
  }

  private alertCharacters(): void {
    var finalr = '';
    this.listCharacters.forEach((element) => {
      finalr += element.ToString() + '\n';
    });
    alert(finalr);
  }

  public voteCharacter(id: number): void {
    if (
      this.currentUser.id !== '0' &&
      this.currentUser.role !== Roles.Administrator
    ) {
      this.characterService.vote(id).subscribe({
        next: (data) => {
          let results = new Result(data);
          this.messageService.add({
            severity: data.success ? 'success' : 'error',
            summary: 'Disney',
            detail: results.message,
          });
          this.loadCharacters();
        },
        error: (err) => {
          let results = new Result(err);
          this.messageService.add({
            severity: 'error',
            summary: 'Disney',
            detail: results.message,
          });
        },
      });
    }
  }
}
