import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { LawyerService } from 'src/app/proxy/inva/law-cases/controller';

@Component({
  selector: 'app-add-lawyer',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './add-lawyer.component.html',
  styleUrl: './add-lawyer.component.scss',
})
export class AddLawyerComponent implements OnInit {
  form: FormGroup;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private _lawyerService: LawyerService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      name: [''],
      email: [''],
      phone: [''],
      address: [''],
      speciality: [''],
      caseId: [''],
    });
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this._lawyerService.create(this.form.value).subscribe({
      next: () => {
        this.toastr.success('Lawyer added successfully', 'Success', {
          closeButton: true,
          timeOut: 7000,
          progressBar: true,
        });

        this.router.navigate(['/lawyer']);
      },
      error: err => {
      
        this.toastr.error('Failed to add lawyer');
      },
    });
  }

  cancel(): void {
    this.router.navigate(['/lawyer']);
  }
}
