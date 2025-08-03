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
import { CaseService, HearingService } from 'src/app/proxy/inva/law-cases/controller';
import { CaseLawyerHearingsWithNavigationProperty } from 'src/app/proxy/inva/law-cases/dtos/case';
import { HearingWithNavigationPropertyDto } from 'src/app/proxy/inva/law-cases/dtos/hearing';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-edit-hearing',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, CommonModule],
  templateUrl: './edit-hearing.component.html',
  styleUrl: './edit-hearing.component.scss',
})
export class EditHearingComponent implements OnInit {
  form: FormGroup;
  isLoading = false;

  hearings: HearingWithNavigationPropertyDto | null = null;
  availableCases: CaseLawyerHearingsWithNavigationProperty[] = [];
  initialCaseTitle: string = '—';

  constructor(
    private _hearingService: HearingService,
    private _caseService: CaseService,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.form = this.fb.group({
      date: ['', Validators.required],
      location: ['', [Validators.required, Validators.maxLength(200)]],
      decision: ['', [Validators.required, Validators.maxLength(200)]],
      concurrencyStamp: [null],
      caseId: [''], // ✅ أضف هذا لو بتستخدمه لاحقًا
    });
  }

  ngOnInit(): void {
    this.loadHearingDetails();
  }
  private loadHearingDetails(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) return;

    this._hearingService.getHearingById(id).subscribe(hearings => {
      this.hearings = hearings;

      const formattedDate = this.formatDate(hearings.hearing.date);

      this.form.patchValue({
        ...hearings.hearing,
        date: formattedDate,
        concurrencyStamp: hearings.hearing.concurrencyStamp,
      });

      const caseId = hearings.hearing.caseId;
      this.form.get('caseId')?.setValue(caseId);

      if (caseId) {
        this.form.get('caseId')?.disable(); // محكمة مرتبطة → نمنع التغيير
        this.initialCaseTitle = hearings.case?.caseTitle ?? '—';
      } else {
        this.form.get('caseId')?.enable();
      }
      this.loadAvailableCases();
    });
  }

  private loadAvailableCases(): void {
    this._caseService
      .getCaseWithLawyersAndHearingsList({ skipCount: 0, maxResultCount: 1000, sorting: '' })
      .subscribe(res => {
        const currentCaseId = this.hearings?.hearing.caseId;

        this.availableCases = res.items.filter(c => {
          if (c.caseDto.id === currentCaseId) return true; // عرض القضية الحالية
          return !c.hearingDtos || c.hearingDtos.length === 0;
        });
      });
  }

  private formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  }

  get currentCaseTitle(): string {
    const caseId = this.hearings?.hearing?.caseId;
    const matched = this.availableCases.find(c => c.caseDto.id === caseId);
    return matched?.caseDto?.caseTitle || this.initialCaseTitle || '—';
  }
  submit(): void {
    if (this.form.invalid || !this.form.dirty || !this.hearings) return;

    const updateDto = {
      ...this.form.value,
      id: this.hearings.hearing.id,
      concurrencyStamp: this.form.get('concurrencyStamp')?.value, // ✅ تأكيد الإرسال
    };

    this.isLoading = true;

    this._hearingService.updateHearing(this.hearings.hearing.id, updateDto).subscribe({
      next: () => {
        this.isLoading = false;
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Hearing updated successfully!',
          toast: true,
          position: 'bottom',
          showConfirmButton: false,
          timer: 5000,
          background: '#166534',
          color: '#fff',
        });
        this.router.navigate(['/hearing']);
      },
      error: error => {
        this.isLoading = false;
        const msg =
          error.status === 409
            ? 'Someone else has already modified this record. Please refresh and try again.'
            : 'Failed to update hearing';

        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: msg,
          toast: true,
          position: 'bottom',
          showConfirmButton: false,
          timer: 5000,
          background: '#651616ff',
          color: '#fff',
        });
      },
    });
  }

  cancel(): void {
    this.router.navigate(['/hearing']);
  }
}
