import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { NewsService } from '../../../../common/services/api/news.service';

@Component({
  selector: 'app-create-news',
  templateUrl: './create-news.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateNewsComponent {
  constructor(private newsService: NewsService) {}

  formCreateNotification = new FormGroup({
    title: new FormControl(),
    content: new FormControl(),
  });
  onSubmit() {
    const data = this.formCreateNotification.value as any;
    this.newsService.createNews(data).subscribe(data => {
      this.formCreateNotification.reset();
    });
  }
}
