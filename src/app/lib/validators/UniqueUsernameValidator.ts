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
export class UniqueUsernameValidator implements AsyncValidator {
  private static readonly USERNAME_DUPLICATED = { usernameDuplicated: true };
  private static readonly USERNAME_NOT_DUPLICATED = null;

  constructor(private userService: UserService) {}

  validate(
    control: AbstractControl
  ): Promise<ValidationErrors> | Observable<ValidationErrors> {
    const username = control.value;
    const id = control.updateValueAndValidity;
    return this.userService.checkUniqueValue('CheckUsername', username).pipe(
      map((exists) =>
        exists
          ? UniqueUsernameValidator.USERNAME_DUPLICATED
          : UniqueUsernameValidator.USERNAME_NOT_DUPLICATED
      ),
      first()
    );
  }
}
