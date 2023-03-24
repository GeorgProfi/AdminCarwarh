import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NewsService } from '../../../../common/services/api/news.service';
import { catchError, finalize, map, Observable, of, Subject, switchMap } from 'rxjs';
import { TUI_PROMPT, TuiFileLike } from '@taiga-ui/kit';
import { FilesService } from '../../../../common/services/api/files.service';
import { environment } from '../../../../../environments/environment';
import { TuiAlertService, TuiDialogService, TuiNotification } from '@taiga-ui/core';

@Component({
  selector: 'app-edit-news',
  templateUrl: './edit-news.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditNewsComponent implements OnInit {
  constructor(
    private router: ActivatedRoute,
    private newsService: NewsService,
    private filesService: FilesService,
    @Inject(TuiAlertService)
    private readonly alertService: TuiAlertService,
    @Inject(TuiDialogService)
    private readonly dialogService: TuiDialogService
  ) {}
  readonly prompt = this.dialogService.open<boolean>(TUI_PROMPT, {
    label: 'Вы уверены?',
    size: 's',
    closeable: false,
    dismissible: false,
  });

  newsForm = new FormGroup({
    title: new FormControl(``, Validators.required),
    text: new FormControl('', Validators.required),
  });
  imageId?: string;

  id: string = this.router.snapshot.params['id'];
  urlImage!: string;

  ngOnInit(): void {
    this.newsService.getNews(this.id).subscribe(data => {
      if (data.image) {
        this.urlImage = environment.imageUrl + '/' + data.image.fileName;
      }
      this.newsForm.patchValue({
        title: data.title,
        text: data.text,
      });
    });
  }

  async save() {
    const p = await this.prompt.toPromise();
    if (!p) {
      return;
    }
    const data = this.newsForm.value as any;
    this.newsService.updateNews({ ...data, imageId: this.imageId, id: this.id }).subscribe(
      () => {
        this.alertService.open('успех', { status: TuiNotification.Success }).subscribe();
      },
      () => {
        this.alertService.open('ошибка', { status: TuiNotification.Error }).subscribe();
      }
    );
  }

  // file:
  readonly control = new FormControl();

  readonly rejectedFiles$ = new Subject<TuiFileLike | null>();
  readonly loadingFiles$ = new Subject<TuiFileLike | null>();
  readonly loadedFiles$ = this.control.valueChanges.pipe(switchMap(file => (file ? this.makeRequest(file) : of(null))));

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
