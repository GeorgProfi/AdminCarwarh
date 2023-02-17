import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ClientsService } from '../../../common/services/api/clients.service';

@Component({
  selector: 'app-edit-client',
  templateUrl: './edit-client.component.html',
  styleUrls: ['./edit-client.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditClientComponent {
  constructor(
    private router: ActivatedRoute,
    private clientsService: ClientsService
  ) {
    this.clientsService.getClientById(this.id).subscribe(data => {
      this.clientForm.patchValue({
        name: data.name,
      });
    });
  }

  id: string = this.router.snapshot.queryParams['id'];
  clientForm = new FormGroup({
    name: new FormControl(``, Validators.required),
  });

  // $client = this.clientsService.getClientById(this.id).pipe(
  //   map(data => {
  //     this.clientForm.patchValue({
  //       name: data.name,
  //     });
  //   })
  // );

  // ngOnInit(): void {
  //   this.clientsService.getClientById(this.id).subscribe(data => {
  //     this.clientForm.patchValue({
  //       name: data.name,
  //     });
  //   });
  // }
}
