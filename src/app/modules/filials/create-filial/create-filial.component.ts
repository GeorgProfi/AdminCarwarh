import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Output,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { FilialsService } from '../filials.service';

@Component({
  selector: 'app-create-filial',
  templateUrl: './create-filial.component.html',
  styleUrls: ['./create-filial.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateFilialComponent {
  constructor(private filialsService: FilialsService) {}

  @Output() createEvent = new EventEmitter();

  expanded = false;
  toggle(): void {
    this.expanded = !this.expanded;
  }

  formCreateFilial = new FormGroup({
    name: new FormControl(``, Validators.required),
  });
  onSubmit(): void {
    console.log('Create!');
    const name = this.formCreateFilial.value.name;
    if (!name) {
      // TODO: Кинуть ошибку валидации
      return;
    }

    this.filialsService.createFilial({ name }).subscribe(data => {
      console.log(data);
      this.formCreateFilial.reset();
      this.createEvent.emit();
    });
  }
}
