import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NewsService } from '../../../../common/services/api/news.service';
import {
  BehaviorSubject,
  catchError,
  finalize,
  map,
  Observable,
  of,
  Subject,
  switchMap,
} from 'rxjs';
import { TuiFileLike } from '@taiga-ui/kit';
import { environment } from '../../../../../environments/environment';
import { FilesService } from '../../../../common/services/api/files.service';

@Component({
  selector: 'app-edit-news',
  templateUrl: './edit-news.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditNewsComponent implements OnInit {
  constructor(
    private router: ActivatedRoute,
    private newsService: NewsService,
    private filesService: FilesService
  ) {}

  notificationForm = new FormGroup({
    title: new FormControl(``, Validators.required),
    text: new FormControl('', Validators.required),
  });
  imageId?: string;

  id: string = this.router.snapshot.params['id'];
  urlImage!: string;
  urlImage$ = new BehaviorSubject('');

  ngOnInit(): void {
    this.newsService.getNews(this.id).subscribe(data => {
      console.log(data?.image.fileName);
      this.urlImage$.next(environment.imageUrl + '/' + data?.image.fileName);
      //this.urlImage = data?.image.fileName;
      this.imageId = data?.image.id;
      this.notificationForm.patchValue({
        title: data.title,
        text: data.text,
      });
    });
  }

  save() {
    const data = this.notificationForm.value as any;
    this.newsService.updateNews({ ...data, id: this.id }).subscribe(() => {
      console.log('ok');
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
    this.imageId = undefined;
    this.control.setValue(null);
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
