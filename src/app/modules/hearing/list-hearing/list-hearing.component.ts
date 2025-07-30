import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HearingDto, HearingWithNavigationPropertyDto } from 'src/app/proxy/inva/law-cases/dtos/hearing';
import { PagedAndSortedResultRequestDto } from '@abp/ng.core';
import { HearingService } from 'src/app/proxy/inva/law-cases/controller';
import Swal from 'sweetalert2';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-list-hearing',
  imports: [NgxDatatableModule, RouterLink, DatePipe],
  templateUrl: './list-hearing.component.html',
  styleUrl: './list-hearing.component.scss',
})
export class ListHearingComponent implements OnInit {
  hearings: HearingWithNavigationPropertyDto[] = [];
  totalCount: number;
  input: PagedAndSortedResultRequestDto = {
    maxResultCount: 100,
    skipCount: 0,
    sorting: '',
  };
  isLoading = false;

  constructor(private _hearingService: HearingService) {}
  ngOnInit(): void {
    this.loadHearing();
  }

  loadHearing(): void {
    this._hearingService.getList(this.input).subscribe({
      next: res => {
        this.hearings = res.items;
        this.totalCount = res.totalCount;
      },
      error: () => {
        Swal.fire({
          icon: 'error',
          title: 'error',
          text: 'Failed to load Hearings!',
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
        this._hearingService.deleteHearing(id).subscribe({
          next: () => {
            Swal.fire({
              icon: 'success',
              title: 'Deleted!',
              text: 'Hearing deleted successfully.',
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

            this.loadHearing();
          },
          error: () => {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Failed to delete hearing.',
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

  calendar() {}
}
