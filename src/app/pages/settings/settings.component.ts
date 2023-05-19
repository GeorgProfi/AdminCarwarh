import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { catchError, finalize, map, Observable, of, Subject, switchMap } from 'rxjs';
import { TUI_PROMPT, TuiFileLike } from '@taiga-ui/kit';
import { FilesService } from '../../common/services/api/files.service';
import { CompanyService } from '../../common/services/api/company.service';
import { environment } from '../../../environments/environment';
import { TuiAlertService, TuiDialogService, TuiNotification } from '@taiga-ui/core';
import { UpdateDataCompanyDto } from 'src/app/common/dto/company/update-data-company.dto';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsComponent implements OnInit {
  imageId?: string;
  readonly file = new FormControl();
  readonly rejectedFiles$ = new Subject<TuiFileLike | null>();
  readonly loadingFiles$ = new Subject<TuiFileLike | null>();
  readonly loadedFiles$ = this.file.valueChanges.pipe(switchMap(file => (file ? this._makeRequest(file) : of(null))));
  logoUrl: string | null = null;

  form = new FormGroup({
    description: new FormControl('', { nonNullable: true }),
  });

  readonly prompt = this.dialogService.open<boolean>(TUI_PROMPT, {
    label: 'Вы уверены?',
    size: 's',
    closeable: false,
    dismissible: false,
  });

  constructor(
    private filesService: FilesService,
    private companyService: CompanyService,
    @Inject(TuiAlertService)
    private readonly alertService: TuiAlertService,
    @Inject(TuiDialogService)
    private readonly dialogService: TuiDialogService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.companyService.getDataCompany().subscribe((data: any) => {
      if (data.logo) {
        this.logoUrl = environment.imageUrl + '/' + data.logo.fileName;
      }
      this.form.patchValue({
        description: data.description,
      });
      this.cdr.detectChanges();
    });
  }

  onSave() {
    this.prompt.subscribe({ next: value => value && this._saveData({
        description: this.form.controls.description.value,
        logoImageId: this.imageId,
      })
    });
  }

  onReject(file: TuiFileLike | readonly TuiFileLike[]): void {
    this.rejectedFiles$.next(file as TuiFileLike);
  }

  onRemoveFile(): void {
    this._removeFile();
  }
  

  onClearRejected(): void {
    this._clearRejected();
  }

  private _clearRejected(): void {
    this._removeFile();
    this.rejectedFiles$.next(null);
  }

  private _makeRequest(file: TuiFileLike): Observable<TuiFileLike | null> {
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

  private _saveData(data: UpdateDataCompanyDto): void {
    this.companyService
      .updateDataCompany(data)
      .subscribe({
        next: () => this.alertService.open('успех', { status: TuiNotification.Success }).subscribe(),
        error: () => this.alertService.open('ошибка', { status: TuiNotification.Error }).subscribe(),
      });
  }

  private _removeFile(): void {
    this.imageId = undefined;
    this.file.setValue(null);
  }
}
