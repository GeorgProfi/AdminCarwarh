import { NgModule } from '@angular/core';
import { CreateNewsComponent } from './create-news/create-news.component';
import { NewsComponent } from './news.component';
import {
  TuiButtonModule,
  TuiErrorModule,
  TuiGroupModule,
  TuiLabelModule,
  TuiLinkModule,
  TuiLoaderModule,
  TuiTextfieldControllerModule,
} from '@taiga-ui/core';
import {
  TuiAccordionModule,
  TuiDataListWrapperModule,
  TuiFieldErrorPipeModule,
  TuiInputFilesModule,
  TuiInputModule,
  TuiIslandModule,
  TuiPaginationModule,
  TuiSelectModule,
  TuiTextAreaModule,
} from '@taiga-ui/kit';
import { AsyncPipe, NgForOf, NgIf, NgOptimizedImage } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TuiTableModule } from '@taiga-ui/addon-table';
import { TuiLetModule } from '@taiga-ui/cdk';
import { RouterLinkWithHref, RouterModule } from '@angular/router';
import { EditNewsComponent } from './edit-news/edit-news.component';

@NgModule({
  declarations: [CreateNewsComponent, EditNewsComponent, NewsComponent],
  exports: [NewsComponent],
  imports: [
    TuiGroupModule,
    TuiInputModule,
    AsyncPipe,
    TuiTextfieldControllerModule,
    FormsModule,
    TuiLoaderModule,
    NgIf,
    TuiTableModule,
    TuiLetModule,
    RouterLinkWithHref,
    TuiPaginationModule,
    NgForOf,
    TuiLinkModule,
    TuiButtonModule,
    TuiSelectModule,
    TuiDataListWrapperModule,
    ReactiveFormsModule,
    TuiInputFilesModule,

    TuiLabelModule,
    RouterModule,
    TuiErrorModule,
    TuiFieldErrorPipeModule,
    TuiLinkModule,
    TuiIslandModule,
    TuiTextAreaModule,
    TuiAccordionModule,
    NgOptimizedImage,
  ],
})
export class NewsModule {}
