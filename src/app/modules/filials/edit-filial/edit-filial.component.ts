import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { TuiDialogContext, TuiDialogService } from '@taiga-ui/core';
import { POLYMORPHEUS_CONTEXT } from '@tinkoff/ng-polymorpheus';
import { FilialsService } from '../filials.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Filial } from '../../../common/entities/filial.entity';

@Component({
  selector: 'app-edit-filial',
  templateUrl: './edit-filial.component.html',
  styleUrls: ['./edit-filial.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditFilialComponent {
  constructor(
    @Inject(TuiDialogService) private readonly dialogService: TuiDialogService,
    @Inject(POLYMORPHEUS_CONTEXT)
    private readonly context: TuiDialogContext<Filial, Filial>,
    private filialsService: FilialsService
  ) {}

  formEditFilial = new FormGroup({
    name: new FormControl(this.context.data.name, Validators.required),
  });

  id = this.context.data.id;

  get hasValue(): boolean {
    return this.id !== null;
  }

  onSubmit(): void {
    const name = this.formEditFilial.value.name;
    if (!name) {
      // FIXME: Кинуть норм ошибку
      throw 123;
    }

    this.filialsService.updateFilial(this.id, { name }).subscribe(data => {
      this.context.completeWith(data);
    });
  }
}
