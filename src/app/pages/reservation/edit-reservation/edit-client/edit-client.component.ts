import { Component, EventEmitter, Input, Output } from "@angular/core";
import { BehaviorSubject, Observable, filter, startWith, switchMap } from "rxjs";
import { Client } from "src/app/common/entities/client.entity";
import { ClientsService } from "src/app/common/services/api/clients.service";

@Component({
  selector: 'app-edit-client',
  templateUrl: './edit-client.component.html'
})
export class EditClientComponent {
  @Input() client?: Client;
  @Output() eClientChange = new EventEmitter<Client | null>();
  newClient?: Client;
  replaceClient: boolean = false;
  searchClient$ = new BehaviorSubject<string | null>('');

  clients$: Observable<readonly Client[] | null> = this.searchClient$.pipe(
    filter(value => value !== null),
    switchMap(search => this.clientsService.searchClient(search ?? '')),
    startWith([])
  );

  constructor(
    private clientsService: ClientsService,
  ) {}

  onClientChange(client: Client): void {
    this.eClientChange.emit(client);
  }

  onReplaceClientChange(): void {
    this.replaceClient = !this.replaceClient;
    !this.replaceClient && this.eClientChange.emit(null);
  }

  extractValueFromEvent(event: Event): string | null {
    return (event.target as HTMLInputElement)?.value || null;
  }

  clientStringify(client: Client): string {
    return (client.name?.length ? client.name : 'Не указано') + ` (${client.phone})` + ` (${client.email})`;
  }
}
