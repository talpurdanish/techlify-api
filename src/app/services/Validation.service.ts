import { CommonFunctions } from './../helper/common.function';
import {
  AbstractControl,
  AsyncValidatorFn,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
} from '@angular/forms';
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

      return user
        .checkUniqueValue('checkusername', control?.value, id)
        .pipe(
          map((user) =>
            !this.getValidatorResults(user) ? { usernameExists: true } : null
          )
        );
    };
  }

  private static getValidatorResults(user: any) {
    let jsonObj = JSON.stringify(user);
    let result = JSON.parse(jsonObj);

    var notExists = result.message == undefined || result.message == false;

    return notExists;
  }

  static greaterThan(matchTo: string, check: string = ''): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      // if (control.parent) {
      //   const c = (control.parent?.controls as any)[matchTo] as AbstractControl;
      //   if (c) {
      //     console.log('c is valid');
      //     c.updateValueAndValidity();
      //   }

      //   return null;
      // }

      if (
        check != '' &&
        !!control.parent &&
        !!control.parent.value &&
        !(control.parent?.controls as any)[check].value
      ) {
        return null;
      }
      return !!control.parent &&
        !!control.parent.value &&
        control.value > (control.parent?.controls as any)[matchTo].value
        ? null
        : { greaterThan: true };
    };
  }

  static matchValidator(matchTo: string, reverse?: boolean): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (control.parent && reverse) {
        const c = (control.parent?.controls as any)[matchTo] as AbstractControl;
        if (c) {
          c.updateValueAndValidity();
        }
        return null;
      }
      return !!control.parent &&
        !!control.parent.value &&
        control.value === (control.parent?.controls as any)[matchTo].value
        ? null
        : { passwordMismatch: true };
    };
  }
}
