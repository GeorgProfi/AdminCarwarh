import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ClientsService } from '../../../common/services/api/clients.service';

@Component({
  selector: 'app-edit-client',
  templateUrl: './edit-client.component.html',
  styleUrls: ['./edit-client.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditClientComponent implements OnInit {
  constructor(
    private router: ActivatedRoute,
    private clientsService: ClientsService
  ) {}

  id: string = '';

  clientForm = new FormGroup({
    name: new FormControl(``, Validators.required),
  });

  ngOnInit(): void {
    this.id = this.router.snapshot.params['id'];
    this.clientsService.getClientById(this.id).subscribe(data => {
      this.clientForm.patchValue({
        name: data.name,
      });
    });
  }
}
