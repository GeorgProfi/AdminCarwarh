import { Component, EventEmitter, Output } from '@angular/core';
import { ClientsService } from '../../../common/services/api/clients.service';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-create-client',
  templateUrl: './create-client.component.html',
  styleUrls: ['./create-client.component.less'],
})
export class CreateClientComponent {
  constructor(private clientsService: ClientsService) {}

  @Output() createEvent = new EventEmitter();

  expanded = false;
  toggle(): void {
    this.expanded = !this.expanded;
  }

  phone = new FormControl('', Validators.required);
  onSubmit(): void {
    const phone: string = this.phone.value as string;
    this.clientsService.requestRegistrationClient(phone).subscribe({
      next: () => {
        this.expandedCode = true;
        this.phone.reset();
      },
      error: error => {
        console.error(error);
      },
    });
  }

  loader: boolean = false;

  expandedCode = false;
  code = new FormControl('', Validators.required);
  onAcceptCode() {
    this.loader = true;
    const code: string = this.code.value as string;
    this.clientsService.codeRegistrationClient(code).subscribe(() => {
      this.loader = false;
      this.expandedCode = false;
      this.code.reset();
    });
  }
}
