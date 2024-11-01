import { AsyncValidatorFn } from '@angular/forms';
import { map, switchMap, timer } from 'rxjs';
import { UserApiService } from './services/user-api.service';

export const uniqueNameValidator: (userService: UserApiService) => AsyncValidatorFn = (userService) => {
  return (control) => {
    return timer(500).pipe(
      switchMap(() =>
        userService.checkUniqueUserName(control.value.name).pipe(map(({ status }) => (status === 409 ? { userNAmeAlreadyDefined: true } : null)))
      )
    );
  };
};
