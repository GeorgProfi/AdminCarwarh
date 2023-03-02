import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NewsService } from '../../../../common/services/api/news.service';

@Component({
  selector: 'app-edit-news',
  templateUrl: './edit-news.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditNewsComponent implements OnInit {
  constructor(
    private router: ActivatedRoute,
    private newsService: NewsService
  ) {}

  notificationForm = new FormGroup({
    title: new FormControl(``, Validators.required),
  });

  id: string = '';

  ngOnInit(): void {
    this.id = this.router.snapshot.params['id'];
    this.newsService.getNews(this.id).subscribe(data => {
      this.notificationForm.patchValue({
        title: data.title,
      });
    });
  }
}
