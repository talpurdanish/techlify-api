import { AbstractControl, AsyncValidatorFn, FormGroup } from '@angular/forms';
import { map } from 'rxjs';
import { Result } from '../models/result';
import { UserService } from './user.service';

export class ValidationService {
  static getValidatorErrorMessage(validatorName: string, validatorValue?: any) {
    let config = {
      required: '${validatorName} is Required',
      minlength:
        '${validatorName} shoudld be  atleast ${validatorValue.requiredLength} long',
      maxlength:
        '${validatorName} can be ${validatorValue.requiredLength} long',
    };

    return config[validatorName];
  }

  static creditCardValidator(control) {
    // Visa, MasterCard, American Express, Diners Club, Discover, JCB
    if (
      control.value.match(
        /^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|6(?:011|5[0-9][0-9])[0-9]{12}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|(?:2131|1800|35\d{3})\d{11})$/
      )
    ) {
      return null;
    } else {
      return { invalidCreditCard: true };
    }
  }

  static emailValidator(control) {
    // RFC 2822 compliant regex
    if (
      control.value.match(
        /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
      )
    ) {
      return null;
    } else {
      return { invalidEmailAddress: true };
    }
  }

  static passwordValidator(control) {
    // {6,100}           - Assert password is between 6 and 100 characters
    // (?=.*[0-9])       - Assert a string has at least one number
    if (control.value.match(/^(?=.*[0-9])[a-zA-Z0-9!@#$%^&*]{6,100}$/)) {
      return null;
    } else {
      return { invalidPassword: true };
    }
  }

  static usernameValidator(user: UserService): AsyncValidatorFn {
    return (control: AbstractControl) => {
      var id = control?.parent.get('userId').value;
      id = id == '' ? 0 : id;
      return user
        .checkUniqueValue('CheckUsername', control?.value, id)
        .pipe(map((user) => (user ? { usernameExists: true } : null)));
    };
  }

  static cnicValidator(user: UserService): AsyncValidatorFn {
    return (control: AbstractControl) => {
      var id = control?.parent.get('userId').value;
      id = id == '' ? 0 : id;
      return user
        .checkUniqueValue('CheckCNIC', this.changeCNICValue(control.value), id)
        .pipe(map((user) => (user ? { cnicExists: true } : null)));
    };
  }

  static pmdcNoValidator(user: UserService): AsyncValidatorFn {
    return (control: AbstractControl) => {
      var id = control?.parent.get('userId').value;
      id = id == '' ? 0 : id;
      return user
        .checkUniqueValue('CheckPMDCNo', control.value, id)
        .pipe(map((user) => (user ? { pmdcnoExists: true } : null)));
    };
  }

  static changeCNICValue(value: string): string {
    var start = value.substring(0, 5);
    var middle = value.substring(5, 12);
    var end = value.substring(12, 13);

    return start + '-' + middle + '-' + end;
  }

  static confirmPasswordValidator(
    controlName: string,
    matchingControlName: string
  ) {
    return (formGroup: FormGroup) => {
      let control = formGroup.controls[controlName];
      let matchingControl = formGroup.controls[matchingControlName];

      if (
        matchingControl.errors &&
        !matchingControl.errors['passwordMismatch']
      ) {
        return null;
      }
      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({ passwordMismatch: true });
      } else {
        matchingControl.setErrors(null);
      }
    };
  }
}
