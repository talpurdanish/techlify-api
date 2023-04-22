import { AbstractControl, FormGroup, Validators } from '@angular/forms';

export class ValidationError {
  static form: FormGroup;

  static validationErrors: {
    key: string;
    errorType: ErrorType;
    message: string;
  }[] = [];

  public static generateValidationErrorMessage(
    name: string,
    errorType: ErrorType,
    length: number = 0,
    match: string = ''
  ): { key: string; error: ErrorType; message: string } {
    {
      var msg = '';
      switch (errorType) {
        case ErrorType.required:
          msg = name + ' is required';
          break;
        case ErrorType.maxLength:
          msg = `${name} could be ${length} chars long}`;
          break;
        case ErrorType.minLength:
          msg = `${name} could be min ${length} chars}`;
          break;
        case ErrorType.unique:
          msg = `${name} already exists`;
          break;
        case ErrorType.match:
          msg = `${name} and ${match} does not match`;
          break;
        case ErrorType.pattern:
          msg = `${name} is not valid`;
          break;
      }
      return { key: name, error: errorType, message: msg };
    }
  }
  public static findAllControls(group: FormGroup): void {
    // loop through each key in the FormGroup
    Object.keys(group.controls).forEach((key: string) => {
      // Get a reference to the control using the FormGroup.get() method
      const abstractControl = group.get(key) as AbstractControl;

      if (abstractControl.hasValidator(Validators.required)) {
        this.validationErrors.push({
          key: key,
          errorType: ErrorType.required,
          message: `${key} is required`,
        });
      }
    });
  }
}

export enum ErrorType {
  required,
  maxLength,
  minLength,
  pattern,
  match,
  unique,
}
