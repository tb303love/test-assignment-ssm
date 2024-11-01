import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, OnInit } from '@angular/core';
import { NgbModal, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { AddUserModalComponent } from '../add-user-modal/add-user-modal.component';
import { UserStateService } from '../state/user.state';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule, NgbModalModule],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserListComponent implements OnInit {
  private modalService = inject(NgbModal);
  private userStateService = inject(UserStateService);

  users = this.userStateService.users;

  isAddNewButtonEnabled = computed(() => {
    const users = this.users();
    const everyActive = users.every(({ active }) => active);
    return everyActive && users.length < 5;
  });

  ngOnInit(): void {
    this.userStateService.getUsers();
  }

  openAddNewUserModal(): void {
    this.modalService.open(AddUserModalComponent);
  }
}
