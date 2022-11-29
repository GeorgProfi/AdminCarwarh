import { Component, EventEmitter, Output } from '@angular/core';
import { ClientsService } from '../clients.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CreateClientDto } from '../dto/create-client.dto';

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

  formCreateService = new FormGroup({
    name: new FormControl(``, Validators.required),
    phone: new FormControl(``, Validators.required),
    email: new FormControl(``, Validators.required),
  });
  onSubmit(): void {
    // FIXME: Кринж с типом(
    const data: CreateClientDto = this.formCreateService
      .value as unknown as CreateClientDto;

    this.clientsService.createClient(data).subscribe(data => {
      console.log(data);
      this.formCreateService.reset();
      this.createEvent.emit();
    });
  }
}
