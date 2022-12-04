import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Output,
} from '@angular/core';
import { ServicesService } from '../services.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Service } from '../../../common/entities/service.entity';
import { delay, Observable, of, Subject, switchMap } from 'rxjs';
import { startWith } from 'rxjs/operators';

const databaseMockData: readonly string[] = [
  `John Cleese`,
  `Eric Idle`,
  `Michael Palin`,
  `Terry Gilliam`,
  `Terry Jones`,
  `Graham Chapman`,
];

@Component({
  selector: 'app-create-service',
  templateUrl: './create-service.component.html',
  styleUrls: ['./create-service.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateServiceComponent {
  constructor(private servicesService: ServicesService) {}

  @Output() createEvent = new EventEmitter();

  expanded = false;
  toggle(): void {
    this.expanded = !this.expanded;
  }

  formCreateService = new FormGroup({
    name: new FormControl(``, Validators.required),
    description: new FormControl(``),
    price: new FormControl(0, Validators.required),
  });
  onSubmit(): void {
    // FIXME: Кринж с типом(
    const data: Service = this.formCreateService.value as unknown as Service;

    this.servicesService.createService(data).subscribe(data => {
      console.log(data);
      this.formCreateService.reset();
      this.createEvent.emit();
    });
  }

  private readonly search$ = new Subject<string>();

  value = [];

  readonly items$ = this.search$.pipe(
    switchMap(search =>
      this.serverRequest(search).pipe(startWith<readonly string[] | null>(null))
    ),
    startWith(databaseMockData)
  );

  onSearchChange(search: string): void {
    this.search$.next(search);
  }

  /**
   * Server request emulation
   */
  private serverRequest(search: string): Observable<readonly string[]> {
    const result = databaseMockData.filter(item =>
      item.toLowerCase().includes(search.toLowerCase())
    );

    return of(result).pipe(delay(Math.random() * 1000 + 500));
  }
}
