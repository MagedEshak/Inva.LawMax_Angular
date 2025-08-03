import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Route, Router } from '@angular/router';
import { CaseService, HearingService } from 'src/app/proxy/inva/law-cases/controller';
import { CaseLawyerHearingsWithNavigationProperty } from 'src/app/proxy/inva/law-cases/dtos/case';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-hearing',
  imports: [ReactiveFormsModule, FormsModule, CommonModule],
  templateUrl: './add-hearing.component.html',
  styleUrl: './add-hearing.component.scss',
})
export class AddHearingComponent implements OnInit {
  form: FormGroup;
  isLoading = false;
  availableCases: CaseLawyerHearingsWithNavigationProperty[] = [];
  constructor(
    private _hearingService: HearingService,
    private router: Router,
    private fb: FormBuilder,
    private _caseService: CaseService
  ) {}

  ngOnInit(): void {
    this.formBuilder();
    this.loadAvailableCases();
  }

  formBuilder(): void {
    this.form = this.fb.group({
      date: ['', Validators.required],
      location: ['', [Validators.maxLength(200), Validators.required]],
      decision: ['', [Validators.maxLength(200), Validators.required]],
      caseId: [null],
    });
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
    }
    this.isLoading = true;
    this._hearingService.createHearing(this.form.value).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Hearing added successfully!',
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
        this.router.navigate(['/hearing']);
      },
      error: err => {
        this.isLoading = false;
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to add hearing!',
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

  loadAvailableCases(): void {
    this._caseService
      .getCaseWithLawyersAndHearingsList({ skipCount: 0, maxResultCount: 1000, sorting: '' })
      .subscribe(res => {
        this.availableCases = res.items;
      });
  }

  cancel(): void {
    this.router.navigate(['/hearing']);
  }
}
