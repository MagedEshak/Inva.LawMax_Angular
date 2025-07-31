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
import { CaseService, LawyerService } from 'src/app/proxy/inva/law-cases/controller';
import {
  CaseDto,
  CaseLawyerHearingsWithNavigationProperty,
} from 'src/app/proxy/inva/law-cases/dtos/case';
import { LawyerWithNavigationPropertyDto } from 'src/app/proxy/inva/law-cases/dtos/lawyer';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-edit-lawyer',
  imports: [ReactiveFormsModule, FormsModule, CommonModule],
  templateUrl: './edit-lawyer.component.html',
  styleUrl: './edit-lawyer.component.scss',
})
export class EditLawyerComponent implements OnInit {
  lawyer: LawyerWithNavigationPropertyDto | null = null;
  availableCases: CaseLawyerHearingsWithNavigationProperty[] = [];

  form: FormGroup;
  isLoading = false;
  constructor(
    private _lawyerService: LawyerService,
    private _caseService: CaseService,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.form = this.gettingForm();
  }

  ngOnInit(): void {
    this.lawyerDetails();
  }

  gettingForm(): FormGroup {
    return this.fb.group({
      name: [[null], [Validators.maxLength(100), Validators.required]],
      email: ['', [Validators.maxLength(100), Validators.required, Validators.email]],
      phone: [
        '',
        [Validators.maxLength(100), Validators.required, Validators.pattern('^\\+?[0-9]{10,15}$')],
      ],
      address: ['', [Validators.maxLength(200), Validators.required]],
      caseId: [''],
      speciality: ['', [Validators.maxLength(100)]],
      concurrencyStamp: [''],
    });
  }

  lawyerDetails(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) return;

    this._lawyerService.get(id).subscribe(lawyers => {
      this.lawyer = lawyers;
      this.form.patchValue({
        ...lawyers.lawyer,
        concurrencyStamp: lawyers.lawyer.concurrencyStamp,
      });
      this.loadAvilableCases(); // ✅ دي لازم تبقى هنا
    });
  }

  submit() {
    if (this.form.invalid || !this.form.dirty || !this.lawyer.lawyer.id) {
      return;
    }
    const selectedCaseId = this.form.value.caseId;
    const selectedCase = this.availableCases.find(c => c.caseDto.id === selectedCaseId);

    if (
      selectedCase &&
      selectedCase.lawyerDto &&
      selectedCase.lawyerDto.id &&
      selectedCase.lawyerDto.id !== this.lawyer?.lawyer.id
    ) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'This case is already assigned to another lawyer.',
        toast: true,
        position: 'bottom',
        showConfirmButton: false,
        timer: 4000,
        background: '#651616ff',
        color: '#fff',
        customClass: { popup: 'custom-swal-toast' },
      });
      return;
    }

    if (this.form.valid && this.lawyer.lawyer.id) {
      const updateDto = {
        ...this.form.value,
        id: this.lawyer.lawyer.id,
      };
      this.isLoading = true;
      this._lawyerService.update(this.lawyer.lawyer.id, updateDto).subscribe({
        next: () => {
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
            customClass: {
              popup: 'custom-swal-toast',
            },
          });

          this.isLoading = false;
          this.router.navigate(['./lawyer/details', this.lawyer.lawyer.id]);
        },
        error: error => {
          this.isLoading = false;
          if (error.status === 409) {
            Swal.fire({
              icon: 'error',
              title: 'error',
              text: 'Someone else has already modified this record. Please refresh and try again.!',
              toast: true,
              position: 'bottom',
              showConfirmButton: false,
              timer: 5000,
              background: '#651616ff',
              color: '#fff',
              customClass: {
                popup: 'custom-swal-toast',
              },
            });
            this.lawyerDetails();
          } else {
            Swal.fire({
              icon: 'error',
              title: 'error',
              text: 'Failed to update lawyer',
              toast: true,
              position: 'bottom',
              showConfirmButton: false,
              timer: 5000,
              background: '#651616ff',
              color: '#fff',
              customClass: {
                popup: 'custom-swal-toast',
              },
            });
          }
        },
      });
    }
  }
  cancel(): void {
    history.back(); // أو this.router.navigate(['/lawyers'])
  }

  loadAvilableCases(): void {
    this._caseService
      .getCaseWithLawyersAndHearingsList({ skipCount: 0, maxResultCount: 1000, sorting: '' })
      .subscribe(res => {
        const currentLawyerCaseId = this.lawyer?.lawyer.cases;

        this.availableCases = res.items.filter(
          c => !c.lawyerDto?.id || c.lawyerDto.id === this.lawyer?.lawyer.id
        );
      });
  }
}
