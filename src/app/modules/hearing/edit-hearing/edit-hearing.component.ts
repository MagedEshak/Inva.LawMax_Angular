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
import { CaseService, HearingService } from 'src/app/proxy/inva/law-cases/controller';
import { CaseLawyerHearingsWithNavigationProperty } from 'src/app/proxy/inva/law-cases/dtos/case';
import {
  HearingDto,
  HearingWithNavigationPropertyDto,
} from 'src/app/proxy/inva/law-cases/dtos/hearing';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-edit-hearing',
  imports: [ReactiveFormsModule, FormsModule, CommonModule],
  templateUrl: './edit-hearing.component.html',
  styleUrl: './edit-hearing.component.scss',
})
export class EditHearingComponent implements OnInit {
  form: FormGroup;
  isLoading = false;
  hearings: HearingWithNavigationPropertyDto | null = null;
  availableCases: CaseLawyerHearingsWithNavigationProperty[] = [];

  constructor(
    private _hearingService: HearingService,
    private _caseService: CaseService,
    private activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.form = this.formBuilder();
  }
  ngOnInit(): void {
    this.hearingDetails();
  }

  hearingDetails() {
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    if (!id) return;

    const formatDate = (dateString: string): string => {
      const date = new Date(dateString);
      return date.toISOString().split('T')[0]; // يحول إلى YYYY-MM-DD
    };

    if (id) {
      this._hearingService.getHearingById(id).subscribe(hearing => {
        this.hearings = hearing;

        this.form.patchValue({
          ...hearing.hearing,
          date: formatDate(hearing.hearing.date),
          concurrencyStamp: hearing.hearing.concurrencyStamp,
        });

        this.loadAvilableCases();
      });
    }
  }

  formBuilder(): FormGroup {
    return (this.form = this.fb.group({
      date: ['', Validators.required],
      location: ['', [Validators.maxLength(200), Validators.required]],
      caseId: [''],
      concurrencyStamp: [''],
    }));
  }

  submit() {
    if (this.form.invalid || !this.form.dirty || !this.hearings?.hearing.id) {
      return;
    }

    if (this.form.valid && this.hearings.hearing.id) {
      const updateDto = {
        ...this.form.value,
        id: this.hearings.hearing.id,
      };

      const selectedCaseId = this.form.value.caseId;
      const selectedCase = this.availableCases.find(c => c.caseDto.id === selectedCaseId);

      if (
        selectedCase &&
        selectedCase.hearingDto &&
        selectedCase.hearingDto.id &&
        selectedCase.hearingDto.id !== this.hearings?.hearing.id
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

      this.isLoading = true;
      this._hearingService.updateHearing(this.hearings.hearing.id, updateDto).subscribe({
        next: () => {
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
            customClass: {
              popup: 'custom-swal-toast',
            },
          });

          this.isLoading = false;
          this.router.navigate(['./hearing']);
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
          } else {
            Swal.fire({
              icon: 'error',
              title: 'error',
              text: 'Failed to update hearing',
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
    history.back();
  }

  loadAvilableCases(): void {
    this._caseService
      .getCaseWithLawyersAndHearingsList({ skipCount: 0, maxResultCount: 1000, sorting: '' })
      .subscribe(res => {
        const currentLawyerCaseId = this.hearings?.hearing.caseId;

        this.availableCases = res.items.filter(
          c => !c.hearingDto?.id || c.hearingDto.id === this.hearings?.hearing.id
        );
      });
  }
}
