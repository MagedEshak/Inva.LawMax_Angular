import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { id } from '@swimlane/ngx-datatable/public-api';
import { CaseService, LawyerService } from 'src/app/proxy/inva/law-cases/controller';
import { CaseLawyerHearingsWithNavigationProperty } from 'src/app/proxy/inva/law-cases/dtos/case';
import { Status } from 'src/app/proxy/inva/law-cases/enums';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-edit-case',
  imports: [ReactiveFormsModule, FormsModule, CommonModule],
  templateUrl: './edit-case.component.html',
  styleUrl: './edit-case.component.scss',
})
export class EditCaseComponent implements OnInit {
  cases: CaseLawyerHearingsWithNavigationProperty | null = null;
  statusOptions: { value: Status; label: string }[] = [];
  form: FormGroup;
  isLoading = false;

  constructor(
    private _caseService: CaseService,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.statusOptions = this.getStatusOptions();

    this.form = this.fb.group({
      title: ['', [Validators.maxLength(100), Validators.required]],
      description: ['', [Validators.maxLength(100), Validators.required]],
      status: ['', Validators.required],
      lawyerId: [''],
      hearingId: [''],
      concurrencyStamp: [''],
    });

    this.caseDetails();
  }

  getStatusOptions(): { value: Status; label: string }[] {
    return Object.keys(Status)
      .filter(key => !isNaN(Number(Status[key as any])))
      .map(key => ({
        value: Status[key as keyof typeof Status],
        label: key,
      }));
  }

  caseDetails(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) return;

    this._caseService.getCaseWithLawyersAndHearingsById(id).subscribe(cases => {
      this.cases = cases;
      this.form.patchValue({
        ...cases.caseDto,
        concurrencyStamp: cases.caseDto.concurrencyStamp,
      });
    });
  }

  submit(): void {
    if (this.form.invalid || !this.form.dirty || !this.cases?.caseDto?.id) return;

    const updateDto = {
      ...this.form.value,
      id: this.cases.caseDto.id,
    };

    this.isLoading = true;
    this._caseService.updateCase(this.cases.caseDto.id, updateDto).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Case updated successfully!',
          toast: true,
          position: 'bottom',
          showConfirmButton: false,
          timer: 5000,
          background: '#166534',
          color: '#fff',
          customClass: { popup: 'custom-swal-toast' },
        });

        this.isLoading = false;
        this.router.navigate(['./case/details', this.cases.caseDto.id]);
      },
      error: error => {
        this.isLoading = false;
        const isConflict = error.status === 409;

        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: isConflict
            ? 'Someone else has already modified this record. Please refresh and try again.'
            : 'Failed to update Case',
          toast: true,
          position: 'bottom',
          showConfirmButton: false,
          timer: 5000,
          background: '#651616ff',
          color: '#fff',
          customClass: { popup: 'custom-swal-toast' },
        });

        if (isConflict) this.caseDetails();
      },
    });
  }

  cancel(): void {
    history.back(); // أو this.router.navigate(['/case']);
  }
}
