import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ServicesService } from '../../../common/services/api/services.service';

@Component({
  selector: 'app-edit-service',
  templateUrl: './edit-service.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditServiceComponent implements OnInit {
  constructor(
    private router: ActivatedRoute,
    private servicesService: ServicesService
  ) {}

  serviceForm = new FormGroup({
    name: new FormControl(``, Validators.required),
  });

  id: string = '';

  ngOnInit(): void {
    this.id = this.router.snapshot.params['id'];
    this.servicesService.getServiceById(this.id).subscribe(data => {
      this.serviceForm.patchValue({
        name: data.name,
      });
    });
  }
}
