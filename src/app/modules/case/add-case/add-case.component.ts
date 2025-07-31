import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import {
  CaseService,
  HearingService,
  LawyerService,
} from 'src/app/proxy/inva/law-cases/controller';
import { HearingWithNavigationPropertyDto } from 'src/app/proxy/inva/law-cases/dtos/hearing';
import { LawyerWithNavigationPropertyDto } from 'src/app/proxy/inva/law-cases/dtos/lawyer';
import { Status } from 'src/app/proxy/inva/law-cases/enums';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-case',
  imports: [ReactiveFormsModule, FormsModule, CommonModule],
  templateUrl: './add-case.component.html',
  styleUrl: './add-case.component.scss',
})
export class AddCaseComponent implements OnInit {
  form: FormGroup;
  isLoading = false;
  availableLawyers: LawyerWithNavigationPropertyDto[] = [];
  availableHearings: HearingWithNavigationPropertyDto[] = [];
  statusOptions: { value: Status; label: string }[] = [];

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private _caseService: CaseService,
    private _lawyerService: LawyerService,
    private _hearingService: HearingService
  ) {}

  ngOnInit(): void {
    this.statusOptions = Object.keys(Status)
      .filter(key => !isNaN(Number(Status[key as any])))
      .map(key => ({
        value: Status[key as keyof typeof Status],
        label: key,
      }));

    this.form = this.fb.group({
      title: ['', [Validators.maxLength(100), Validators.required]],
      description: ['', [Validators.maxLength(100), Validators.required]],
      status: ['', Validators.required],
      lawyerId: [''],
      hearingId: [''],
    });

    this.loadAvailableLawyers();
    this.loadAvailableHearings();
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.isLoading = true;
    this._caseService.createCase(this.form.value).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Case added successfully!',
          toast: true,
          position: 'bottom',
          showConfirmButton: false,
          timer: 5000,
          background: '#166534',
          color: '#fff',
          customClass: {
            popup: 'custom-swal-toast',
          },
        });
        this.isLoading = false;
        this.router.navigate(['/case']);
      },
      error: err => {
        this.isLoading = false;
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to add Case!',
          toast: true,
          position: 'bottom',
          showConfirmButton: false,
          timer: 5000,
          background: '#651616',
          color: '#fff',
          customClass: {
            popup: 'custom-swal-toast',
          },
        });
      },
    });
  }
  loadAvailableLawyers() {
    this._lawyerService.getList({ skipCount: 0, maxResultCount: 1000 }).subscribe(res => {
      this.availableLawyers = res.items.filter(l => !l.lawyer.cases);
    });
  }

  loadAvailableHearings() {
    this._hearingService.getList({ skipCount: 0, maxResultCount: 1000 }).subscribe(res => {
      this.availableHearings = res.items.filter(h => !h.hearing.caseId);
    });
  }

  cancel(): void {
    this.router.navigate(['/case']);
  }
}
