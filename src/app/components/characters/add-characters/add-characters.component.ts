import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { StorageService } from 'src/app/services/storage.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Result } from 'src/app/models/result';
import { MessageService } from 'primeng/api';
import { DropdownFilterOptions } from 'primeng/dropdown';
import { AllValidationErrors } from 'src/app/lib/validators/AllValidationErrors';
import { CharacterService } from 'src/app/services/character.service';
import { Character } from 'src/app/models/character';

@Component({
  selector: 'app-add-characters',
  templateUrl: './add-characters.component.html',
  styleUrls: ['./add-characters.component.css'],
})
export class AddCharactersComponent implements OnInit {
  @Input() requiredFileType: string;

  isSuccessful = false;
  isSignUpFailed = false;
  isSubmitted = false;
  errorMessage = '';

  mainForm: FormGroup;
  isEdit: boolean = false;

  filterValue = '';

  imageSrc: string = '../../../../assets/images/profile.png';

  constructor(
    private characterService: CharacterService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private storageService: StorageService,
    private messageService: MessageService
  ) {
    this.createForm();
  }

  ngOnInit(): void {
    this.route.params.subscribe((param) => {
      if (param && param['id']) {
        this.characterService.getCharacter(param['id']).subscribe({
          next: (output) => {
            let results = new Result(output);
            var data = results.results;
            if (results.success) {
              let jsonObj = JSON.stringify(data);
              var userObj = JSON.parse(jsonObj);
              var user = new Character(userObj);
              this.isEdit = true;

              this.PopulateValues(user);
            } else {
              this.router.navigate(['/Characters']);
            }
          },
          error: (err) => {
            let results = new Result(err);
            this.messageService.add({
              severity: 'error',
              summary: 'Disney',
              detail: results.message,
            });

            // this.router.navigate(['/users']);
          },
        });
      }
    });
  }

  myResetFunction(options: DropdownFilterOptions) {
    options.reset();
    this.filterValue = '';
  }

  onFileSelected(event: any) {
    if (event.target.files && event.target.files.length) {
      const reader = new FileReader();
      const [file] = event.target.files;
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.imageSrc = reader.result as string;
        var finalPicData = this.imageSrc.replace(
          'data:' + file.type + ';base64,',
          ''
        );
        this.picture.patchValue(finalPicData);
      };
    }
  }

  PopulateValues(char: Character) {
    try {
      this.mainForm.patchValue({
        userId: char.id,
        uname: char.Name,
      });
    } catch (err) {}
  }

  createForm() {
    this.mainForm = this.fb.group({
      name: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(20),
        ],
      ],
      picture: [''],
      characterId: [''],
      description: [''],
    });
  }
  get characterId() {
    return this.mainForm.get('characterId');
  }

  get name() {
    return this.mainForm.get('name');
  }

  get picture() {
    return this.mainForm.get('picture');
  }
  get description() {
    return this.mainForm.get('description');
  }

  validationErrors: AllValidationErrors[] = [];
  totalErrors: number;
  onSubmit(): void {
    this.validationErrors = AllValidationErrors.getFormValidationErrors(
      this.mainForm.controls
    );
    this.totalErrors = this.validationErrors.length;
    this.isSubmitted = true;
    if (this.mainForm.dirty && this.mainForm.valid) {
      var fname = this.name.value;
      var fDesc = this.description.value;
      var fid = this.characterId.value;

      this.characterService
        .createOrUpdate(
          this.isEdit ? fid : '-1',
          fname,
          fDesc,
          this.picture.value
        )
        .subscribe({
          next: (data) => {
            let result = new Result(data);

            this.messageService.add({
              severity: result.success ? 'success' : 'error',
              summary: 'Disney',
              detail: result.message,
            });

            if (result.success) {
              this.mainForm.reset();
              this.isSubmitted = false;
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
  }
}
