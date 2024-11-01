import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { uniqueNameValidator } from '../valitators';
import { UserApiService } from '../services/user-api.service';
import { UserStateService } from '../state/user.state';

type UserFormGroup = FormGroup<{
  name: FormControl<string>;
  active: FormControl<boolean>;
}>;

@Component({
  selector: 'app-add-user-modal',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './add-user-modal.component.html',
  styleUrl: './add-user-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddUserModalComponent implements OnInit {
  activeModal = inject(NgbActiveModal);
  userForm!: UserFormGroup;
  nameValidator = uniqueNameValidator(inject(UserApiService));

  private fb = inject(FormBuilder);
  private userStateService = inject(UserStateService);

  ngOnInit(): void {
    this.userForm = this.fb.group(
      {
        name: this.fb.control<string>('', { nonNullable: true, validators: [Validators.required] }),
        active: this.fb.control(false, { nonNullable: true }),
      },
      { asyncValidators: [this.nameValidator] }
    );
  }

  onSubmitUserForm(): void {
    const { name, active } = this.userForm.controls;
    this.userStateService.addUser(name.value, active.value);
    this.activeModal.close();
  }
}
