import { AbstractControl, FormGroup, ValidationErrors } from '@angular/forms';

export interface DisneyValidationError {
  control_name: string;
  error_name: string;
  error_value: any;
  error_message: string;
}

export interface FormGroupControls {
  [key: string]: AbstractControl;
}

export class AllValidationErrors {
  static getFormValidationErrors(
    controls: FormGroupControls
  ): DisneyValidationError[] {
    let errors: DisneyValidationError[] = [];
    Object.keys(controls).forEach((key) => {
      const control = controls[key];
      if (control instanceof FormGroup) {
        errors = errors.concat(this.getFormValidationErrors(control.controls));
      }
      const controlErrors: ValidationErrors = controls[key].errors;
      if (controlErrors !== null) {
        Object.keys(controlErrors).forEach((keyError) => {
          errors.push({
            control_name: key,
            error_name: keyError,
            error_value: controlErrors[keyError],
            error_message: this.getErrorMessage(
              this.ToTitleCase(key),
              keyError,
              controlErrors[keyError]
            ),
          });
        });
      }
    });
    return errors;
  }

  private static getErrorMessage(
    control_name: string,
    error_name: string,
    error_value: any
  ): string {
    let text;
    switch (error_name) {
      case 'required':
        text = `${control_name} is required!`;
        break;
      case 'pattern':
        text = `${control_name} has wrong pattern!`;
        break;
      case 'usernameExists':
      case 'cnicExists':
      case 'pmdcnoExists':
        text = `Duplicate ${control_name}`;
        break;
      case 'email':
        text = `${control_name} has wrong email format!`;
        break;
      case 'minlength':
        text = `${control_name} should be atleast ${error_value.requiredLength} chars long`;
        break;
      case 'maxlength':
        text = `${control_name} could be at max ${error_value.requiredLength} chars long`;
        break;
      case 'areEqual':
        text = `${control_name} must be equal!`;
        break;
      case 'greaterThan':
        const otherControlName = control_name.startsWith('MaleMax')
          ? 'MaleMinValue'
          : 'FemaleMinValue';
        text = `${control_name} should be greator than ${otherControlName}`;
        break;
      case 'passwordMismatch':
        text = 'New and Confirm password do not match';
        break;
      default:
        text = `${control_name}: ${error_name}: ${error_value}`;
    }
    return text;
  }

  private static ToTitleCase(name: string): string {
    return (
      name.charAt(0).toUpperCase() +
      name.substring(1, name.length).replace('Id', '')
    );
  }
}
