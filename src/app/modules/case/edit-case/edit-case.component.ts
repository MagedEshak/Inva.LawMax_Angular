import { HearingDto } from './../../../proxy/inva/law-cases/dtos/hearing/models';
import { CommonModule, DatePipe } from '@angular/common';
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
import {
  CaseService,
  HearingService,
  LawyerService,
} from 'src/app/proxy/inva/law-cases/controller';
import { CaseLawyerHearingsWithNavigationProperty } from 'src/app/proxy/inva/law-cases/dtos/case';
import { HearingWithNavigationPropertyDto } from 'src/app/proxy/inva/law-cases/dtos/hearing';
import { LawyerWithNavigationPropertyDto } from 'src/app/proxy/inva/law-cases/dtos/lawyer';
import { Status } from 'src/app/proxy/inva/law-cases/enums';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-edit-case',
  imports: [ReactiveFormsModule, FormsModule, CommonModule, DatePipe],
  templateUrl: './edit-case.component.html',
  styleUrl: './edit-case.component.scss',
})
export class EditCaseComponent implements OnInit {
  cases: CaseLawyerHearingsWithNavigationProperty | null = null;
  statusOptions: { value: Status; label: string }[] = [];
  form: FormGroup;
  isLoading = false;
  availableLawyers: LawyerWithNavigationPropertyDto[] = [];
  availableHearings: HearingWithNavigationPropertyDto[] = [];

  constructor(
    private _caseService: CaseService,
    private _lawyerService: LawyerService,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private router: Router,
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
      number: ['', [Validators.required, Validators.maxLength(50)]],
      caseTitle: ['', [Validators.required, Validators.maxLength(200)]],
      description: ['', [Validators.maxLength(1000)]],
      litigationDegree: ['', [Validators.maxLength(1000)]],
      finalVerdict: ['', [Validators.maxLength(1000)]],
      year: [null, [Validators.required]],
      status: [null, [Validators.required]],
      lawyerId: [null],
      hearingDtos: [[]],
      concurrencyStamp: [null],
    });

    this.caseDetails(); // 🟢 هذا يستدعي تحميل المحامي/الجلسات بعد الاستعلام
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

      // تعبئة النموذج
      this.form.patchValue({
        ...cases.caseDto,
        lawyerId: cases.lawyerDto?.id ?? null, // ✅ من العلاقة الخارجية
        hearingDtos: cases.hearingDtos?.map(h => h.id) ?? [],
        concurrencyStamp: cases.caseDto.concurrencyStamp,
      });

      // بعد تحميل البيانات كاملة، حمّل الاختيارات
      this.loadAvailableLawyers();
      this.loadAvailableHearings();
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
  loadAvailableLawyers() {
    const currentLawyerId = this.cases?.lawyerDto?.id;

    this._lawyerService.getList({ skipCount: 0, maxResultCount: 1000 }).subscribe(res => {
      const allLawyers = res.items;
    });
  }

  loadAvailableHearings() {
    const currentCaseId = this.cases?.caseDto?.id;

    this._hearingService.getList({ skipCount: 0, maxResultCount: 1000 }).subscribe(res => {
      this.availableHearings = res.items.filter(h => {
        // عرض الجلسات المرتبطة بالقضية الحالية أو اللي مالهاش قضية
        return !h.hearing.caseId || h.hearing.caseId === currentCaseId;
      });
    });
  }

  cancel(): void {
    history.back(); // أو this.router.navigate(['/case']);
  }
}
