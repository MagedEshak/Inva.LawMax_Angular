import { PagedAndSortedResultRequestDto } from '@abp/ng.core';
import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { NgModel } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { CaseService } from 'src/app/proxy/inva/law-cases/controller';
import { CaseLawyerHearingsWithNavigationProperty } from 'src/app/proxy/inva/law-cases/dtos/case';
import { statusOptions } from 'src/app/proxy/inva/law-cases/enums';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-list-case',
  imports: [NgxDatatableModule, RouterLink, CommonModule],
  templateUrl: './list-case.component.html',
  styleUrl: './list-case.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class ListCaseComponent implements OnInit {
  cases: CaseLawyerHearingsWithNavigationProperty[] = [];
  totalCount: number;
  input: PagedAndSortedResultRequestDto = {
    maxResultCount: 100,
    skipCount: 0,
    sorting: '',
  };
  isLoading = false;

  constructor(private _caseService: CaseService) {}
  ngOnInit(): void {
    this.loadCases();
  }
  loadCases(): void {
    this._caseService.getCaseWithLawyersAndHearingsList(this.input).subscribe({
      next: res => {
        this.cases = res.items;
        this.totalCount = res.totalCount;
      },
      error: () => {
        Swal.fire({
          icon: 'error',
          title: 'error',
          text: 'Failed to load Cases!',
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

        this.isLoading = false;
      },
    });
  }

  deleteHearing(id: string) {
    Swal.fire({
      icon: 'warning',
      title: 'Are you sure?',
      text: 'This action cannot be undone!',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
      background: '#dc3545',
      color: '#fff',
      position: 'center',
      customClass: {
        popup: 'custom-swal-toast',
      },
    }).then(res => {
      if (res.isConfirmed) {
        this._caseService.deleteCase(id).subscribe({
          next: () => {
            Swal.fire({
              icon: 'success',
              title: 'Deleted!',
              text: 'Case deleted successfully.',
              toast: true,
              position: 'bottom',
              showConfirmButton: false,
              timer: 4000,
              background: '#166534',
              color: '#fff',
              customClass: {
                popup: 'custom-swal-toast',
              },
            });

            this.loadCases();
          },
          error: () => {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Failed to delete Case.',
              toast: true,
              position: 'bottom',
              showConfirmButton: false,
              timer: 4000,
              background: '#651616ff',
              color: '#fff',
              customClass: {
                popup: 'custom-swal-toast',
              },
            });
          },
        });
      }
    });
  }
  getStatusLabel(status: number | undefined): string {
    const option = statusOptions.find(opt => opt.value === status);
    return option?.key ?? '—';
  }

  formatDescription(desc?: string): string {
    if (!desc) return '—';
    return desc.length > 10 ? desc.slice(0, 10) + '...' : desc;
  }

  getStatusClass(status: number | undefined): string {
    switch (status) {
      case 0:
        return 'text-primary'; // مثلاً: Draft
      case 1:
        return 'text-warning'; // مثلاً: Open
      case 2:
        return 'text-danger'; // مثلاً: Completed
      default:
        return 'text-dark'; // حالة غير معروفة
    }
  }
}
