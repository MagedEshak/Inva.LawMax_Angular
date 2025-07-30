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
import Swal from 'sweetalert2';
import { CaseService, LawyerService } from 'src/app/proxy/inva/law-cases/controller';
import { CaseLawyerHearingsWithNavigationProperty } from 'src/app/proxy/inva/law-cases/dtos/case';

@Component({
  selector: 'app-add-lawyer',
  imports: [ReactiveFormsModule, FormsModule, CommonModule],
  templateUrl: './add-lawyer.component.html',
  styleUrl: './add-lawyer.component.scss',
})
export class AddLawyerComponent implements OnInit {
  form: FormGroup;
  isLoading = false;
  availableCases: CaseLawyerHearingsWithNavigationProperty[] = [];

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private _lawyerService: LawyerService,
    private _caseService: CaseService
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      name: ['', [Validators.maxLength(100), Validators.required]],
      email: ['', [Validators.maxLength(100), Validators.required, Validators.email]],
      phone: [
        '',
        [Validators.maxLength(100), Validators.required, Validators.pattern('^\\+?[0-9]{10,15}$')],
      ],
      address: ['', [Validators.maxLength(200), Validators.required]],
      caseId: [''],
      speciality: ['', [Validators.maxLength(100)]],
    });

    this.loadAvailableCases();
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.isLoading = true;
    this._lawyerService.create(this.form.value).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Lawyer added successfully!',
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
        this.router.navigate(['/lawyer']);
      },
      error: err => {
        this.isLoading = false;
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to add lawyer!',
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
        this.availableCases = res.items.filter(c => !c.lawyerDto?.id);
      });
  }

  cancel(): void {
    this.router.navigate(['/lawyer']);
  }
}
