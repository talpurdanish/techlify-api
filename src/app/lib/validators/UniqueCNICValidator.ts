import { Injectable } from '@angular/core';
import {
  AbstractControl,
  AsyncValidator,
  ValidationErrors,
} from '@angular/forms';
import { first, map, Observable } from 'rxjs';
import { UserService } from 'src/app/services/user.service';

@Injectable({
  providedIn: 'root',
})
export class UniqueCnicValidator implements AsyncValidator {
  private static readonly CNICDUPLICATED = { pmdcDuplicated: true };
  private static readonly CNICNOT_DUPLICATED = null;

  constructor(private userService: UserService) {}

  validate(
    control: AbstractControl
  ): Promise<ValidationErrors> | Observable<ValidationErrors> {
    const value = control.value;

    return this.userService.checkUniqueValue('CheckCNIC', value).pipe(
      map((exists) =>
        exists
          ? UniqueCnicValidator.CNICDUPLICATED
          : UniqueCnicValidator.CNICNOT_DUPLICATED
      ),
      first()
    );
  }

  changeCNICValue(value: string): string {
    var start = value.substring(0, 5);
    var middle = value.substring(5, 12);
    var end = value.substring(12, 13);

    return start + '-' + middle + '-' + end;
  }
}
