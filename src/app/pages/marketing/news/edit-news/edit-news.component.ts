import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NewsService } from '../../../../common/services/api/news.service';
import { finalize, map, Observable, of, Subject, switchMap, timer } from 'rxjs';
import { TuiFileLike } from '@taiga-ui/kit';

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

  // file:
  readonly control = new FormControl();

  readonly rejectedFiles$ = new Subject<TuiFileLike | null>();
  readonly loadingFiles$ = new Subject<TuiFileLike | null>();
  readonly loadedFiles$ = this.control.valueChanges.pipe(
    switchMap(file => (file ? this.makeRequest(file) : of(null)))
  );

  onReject(file: TuiFileLike | readonly TuiFileLike[]): void {
    this.rejectedFiles$.next(file as TuiFileLike);
  }

  removeFile(): void {
    this.control.setValue(null);
  }

  clearRejected(): void {
    this.removeFile();
    this.rejectedFiles$.next(null);
  }

  makeRequest(file: TuiFileLike): Observable<TuiFileLike | null> {
    this.loadingFiles$.next(file);

    return timer(1000).pipe(
      map(() => {
        if (Math.random() > 0.5) {
          return file;
        }

        this.rejectedFiles$.next(file);

        return null;
      }),
      finalize(() => this.loadingFiles$.next(null))
    );
  }
}
