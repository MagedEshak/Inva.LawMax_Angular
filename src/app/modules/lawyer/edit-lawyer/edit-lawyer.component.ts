import { CommonModule } from '@angular/common';
import { Component, NgModule, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { LawyerService } from 'src/app/proxy/inva/law-cases/controller';
import { LawyerWithNavigationPropertyDto } from 'src/app/proxy/inva/law-cases/dtos/lawyer';
import { statusOptions } from 'src/app/proxy/inva/law-cases/enums';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-edit-lawyer',
  templateUrl: './edit-lawyer.component.html',
  styleUrl: './edit-lawyer.component.scss',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, CommonModule],
})
export class EditLawyerComponent implements OnInit {
  lawyer: LawyerWithNavigationPropertyDto | null = null;
  form: FormGroup;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private _lawyerService: LawyerService,
    private router: Router
  ) {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(100)]],
      email: ['', [Validators.required, Validators.email, Validators.maxLength(100)]],
      phone: ['', [Validators.required, Validators.pattern('^\\+?[0-9]{10,15}$')]],
      address: ['', [Validators.required, Validators.maxLength(200)]],
      speciality: ['', [Validators.maxLength(100)]],
      concurrencyStamp: [''],
    });
  }

  ngOnInit(): void {
    this.loadLawyerDetails();
  }

  loadLawyerDetails(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) return;

    this._lawyerService.get(id).subscribe(lawyers => {
      this.lawyer = lawyers;

      this.form.patchValue({
        ...lawyers.lawyer,
        concurrencyStamp: lawyers.lawyer.concurrencyStamp,
      });
    });
  }

  submit(): void {
    if (this.form.invalid || !this.form.dirty || !this.lawyer?.lawyer.id) return;

    const updateDto = {
      ...this.form.value,
      id: this.lawyer.lawyer.id,
    };

    const { email, phone } = this.form.value;
    const oldEmail = this.lawyer.lawyer.email;
    const oldPhone = this.lawyer.lawyer.phone;

    this.isLoading = true;

    const emailChanged = email !== oldEmail;
    const phoneChanged = phone !== oldPhone;

    const checks: Promise<boolean>[] = [];

    if (emailChanged) {
      checks.push(this._lawyerService.checkEmail(email).toPromise());
    }

    if (phoneChanged) {
      checks.push(this._lawyerService.checkPhone(phone).toPromise());
    }

    Promise.all(checks).then(results => {
      let checkIndex = 0;

      if (emailChanged && results[checkIndex]) {
        this.isLoading = false;
        Swal.fire({
          icon: 'warning',
          title: 'Email already exists',
          text: 'Please use a different email address.',
          toast: true,
          position: 'bottom',
          showConfirmButton: false,
          timer: 4000,
          background: '#d6aa26ff',
          color: '#000',
        });
        return;
      }
      checkIndex += emailChanged ? 1 : 0;

      if (phoneChanged && results[checkIndex]) {
        this.isLoading = false;
        Swal.fire({
          icon: 'warning',
          title: 'Phone number already exists',
          text: 'Please use a different phone number.',
          toast: true,
          position: 'bottom',
          showConfirmButton: false,
          timer: 4000,
          background: '#d6aa26ff',
          color: '#000',
        });
        return;
      }

      this._lawyerService.update(this.lawyer.lawyer.id, updateDto).subscribe({
        next: () => {
          this.isLoading = false;
          Swal.fire({
            icon: 'success',
            title: 'Success',
            text: 'Lawyer updated successfully!',
            toast: true,
            position: 'bottom',
            showConfirmButton: false,
            timer: 5000,
            background: '#166534',
            color: '#fff',
          });
          this.router.navigate(['/lawyer/details', this.lawyer.lawyer.id]);
        },
        error: () => {
          this.isLoading = false;
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Failed to update lawyer data.',
            toast: true,
            position: 'bottom',
            showConfirmButton: false,
            timer: 5000,
            background: '#651616',
            color: '#fff',
          });
        },
      });
    });
  }

  cancel(): void {
    this.router.navigate(['/lawyer']);
  }

  getStatusLabel(status: number | undefined): string {
    const option = statusOptions.find(opt => opt.value === status);
    return option?.key ?? '—';
  }

  getStatusClass(status: number | undefined): string {
    switch (status) {
      case 0:
        return 'badge bg-primary';
      case 1:
        return 'badge bg-warning text-dark';
      case 2:
        return 'badge bg-danger';
      default:
        return 'badge bg-light text-dark';
    }
  }
}
