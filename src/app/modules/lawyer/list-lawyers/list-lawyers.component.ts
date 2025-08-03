import { PagedAndSortedResultRequestDto } from '@abp/ng.core';
import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { RouterLink } from '@angular/router';
import { id, NgxDatatableModule } from '@swimlane/ngx-datatable';
import Swal from 'sweetalert2';
import { LawyerService } from 'src/app/proxy/inva/law-cases/controller';
import { LawyerWithNavigationPropertyDto } from 'src/app/proxy/inva/law-cases/dtos/lawyer';

@Component({
  selector: 'app-list-lawyers',
  imports: [NgxDatatableModule, CommonModule, RouterLink],
  templateUrl: './list-lawyers.component.html',
  styleUrl: './list-lawyers.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class ListLawyersComponent implements OnInit {
  lawyers: LawyerWithNavigationPropertyDto[] = [];
  totalCount: number;
  input: PagedAndSortedResultRequestDto = {
    maxResultCount: 100,
    skipCount: 0,
    sorting: '',
  };

  isLoading = false;
  constructor(private _lawyerService: LawyerService) {}

  ngOnInit(): void {
    this.loadAllLawyers();
  }

  loadAllLawyers(): void {
    this.isLoading = true;
    this._lawyerService.getList(this.input).subscribe({
      next: res => {
        this.totalCount = res.totalCount;
        this.lawyers = res.items;
        this.isLoading = false;
      },
      error: () => {
        Swal.fire({
          icon: 'error',
          title: 'error',
          text: 'Failed to load Lawyers!',
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

  deleteLawyer(id: string) {
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
    }).then(result => {
      if (result.isConfirmed) {
        this._lawyerService.delete(id).subscribe({
          next: () => {
            Swal.fire({
              icon: 'success',
              title: 'Deleted!',
              text: 'Lawyer deleted successfully.',
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

            this.loadAllLawyers();
          },
          error: () => {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Failed to delete lawyer.',
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
}
