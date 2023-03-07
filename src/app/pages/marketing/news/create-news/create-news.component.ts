import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Output,
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { NewsService } from '../../../../common/services/api/news.service';
import {
  catchError,
  finalize,
  map,
  Observable,
  of,
  Subject,
  switchMap,
} from 'rxjs';
import { TuiFileLike } from '@taiga-ui/kit';
import { FilesService } from '../../../../common/services/api/files.service';

@Component({
  selector: 'app-create-news',
  templateUrl: './create-news.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateNewsComponent {
  constructor(
    private newsService: NewsService,
    private filesService: FilesService
  ) {}

  @Output() createEvent = new EventEmitter();

  formCreateNotification = new FormGroup({
    title: new FormControl(),
    text: new FormControl(),
  });
  imageId?: string;
  onSubmit() {
    const data = this.formCreateNotification.value as any;
    this.newsService
      .createNews({ ...data, imageId: this.imageId })
      .subscribe(data => {
        this.formCreateNotification.reset();
        this.file.reset();
        this.createEvent.emit();
      });
  }

  // file:
  readonly file = new FormControl();

  readonly rejectedFiles$ = new Subject<TuiFileLike | null>();
  readonly loadingFiles$ = new Subject<TuiFileLike | null>();
  readonly loadedFiles$ = this.file.valueChanges.pipe(
    switchMap(file => (file ? this.makeRequest(file) : of(null)))
  );

  onReject(file: TuiFileLike | readonly TuiFileLike[]): void {
    this.rejectedFiles$.next(file as TuiFileLike);
  }

  removeFile(): void {
    this.imageId = undefined;
    this.file.setValue(null);
  }

  clearRejected(): void {
    this.imageId = undefined;
    this.removeFile();
    this.rejectedFiles$.next(null);
  }

  makeRequest(file: TuiFileLike): Observable<TuiFileLike | null> {
    this.loadingFiles$.next(file);

    const formData = new FormData();
    formData.append('image', file as File);

    return this.filesService.oneImageUpload(formData).pipe(
      map((data: any) => {
        this.imageId = data.id;
        return file;
      }),
      catchError(e => {
        console.log(e);
        this.rejectedFiles$.next(file);
        return of(null);
      }),
      finalize(() => this.loadingFiles$.next(null))
    );
  }
}
