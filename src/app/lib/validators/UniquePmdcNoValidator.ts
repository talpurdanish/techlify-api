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
export class UniquePmdcNoValidator implements AsyncValidator {
  private static readonly PMDCDUPLICATED = { pmdcDuplicated: true };
  private static readonly PMDCNOT_DUPLICATED = null;

  constructor(private userService: UserService) {}

  validate(
    control: AbstractControl
  ): Promise<ValidationErrors> | Observable<ValidationErrors> {
    const value = control.value;
    return this.userService.checkUniqueValue('CheckPMDCNo', value).pipe(
      map((exists) =>
        exists
          ? UniquePmdcNoValidator.PMDCDUPLICATED
          : UniquePmdcNoValidator.PMDCNOT_DUPLICATED
      ),
      first()
    );
  }
}
