import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { TuiDialogContext, TuiDialogService } from '@taiga-ui/core';
import { POLYMORPHEUS_CONTEXT } from '@tinkoff/ng-polymorpheus';

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
    private readonly context: TuiDialogContext<number, number>
  ) {}

  value: number | null = null;
  name = ``;

  get hasValue(): boolean {
    return this.value !== null;
  }

  get data(): number {
    return this.context.data;
  }

  submit(): void {
    if (this.value !== null) {
      this.context.completeWith(this.value);
    }
  }
}
