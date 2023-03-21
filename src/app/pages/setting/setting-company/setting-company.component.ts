import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { catchError, finalize, map, Observable, of, Subject, switchMap } from 'rxjs';
import { TuiFileLike } from '@taiga-ui/kit';
import { FilesService } from '../../../common/services/api/files.service';
import { CompanyService } from '../../../common/services/api/company.service';

@Component({
  selector: 'app-setting-company',
  templateUrl: './setting-company.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingCompanyComponent implements OnInit {
  constructor(private filesService: FilesService, private companyService: CompanyService) {}

  ngOnInit() {
    this.companyService.getDataCompany().subscribe((data: any) => {
      this.description = data.description;
    });
  }

  description = '';

  saveData() {
    this.companyService
      .updateDataCompany({
        description: this.description,
        logoImageId: this.imageId,
      })
      .subscribe(
        () => {
          console.log('ok');
        },
        error => {
          console.error(error);
        }
      );
  }

  // file:
  imageId?: string;
  readonly file = new FormControl();

  readonly rejectedFiles$ = new Subject<TuiFileLike | null>();
  readonly loadingFiles$ = new Subject<TuiFileLike | null>();
  readonly loadedFiles$ = this.file.valueChanges.pipe(switchMap(file => (file ? this.makeRequest(file) : of(null))));

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
