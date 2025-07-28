import { LawyerDto } from './../../../proxy/dtos/lawyer/models';
import { PagedAndSortedResultRequestDto } from '@abp/ng.core';
import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { RouterLink } from '@angular/router';
import { id, NgxDatatableModule } from '@swimlane/ngx-datatable';
import { ToastrService } from 'ngx-toastr';
import { LawyerService } from 'src/app/proxy/inva/law-cases/controller';

@Component({
  selector: 'app-list-lawyers',
  imports: [NgxDatatableModule, CommonModule, RouterLink],
  templateUrl: './list-lawyers.component.html',
  styleUrl: './list-lawyers.component.css',
  encapsulation: ViewEncapsulation.None,
})
export class ListLawyersComponent implements OnInit {
  lawyers: LawyerDto[] = [];
  totalCount: number;
  input: PagedAndSortedResultRequestDto = {
    maxResultCount: 100,
    skipCount: 0,
    sorting: '',
  };

  isLoading = false;
  constructor(private _lawyerService: LawyerService, private toastr: ToastrService) {}

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
      error: err => {
        this.toastr.error('Failed to add lawyer');
        this.isLoading = false;
      },
    });
  }

  deleteLawyer(id: string) {
    if (confirm('Are you sure you want to delete this lawyer?')) {
      this._lawyerService.delete(id).subscribe({
        next: () => {
          this.toastr.success('Lawyer deleted successfully');
          this.loadAllLawyers();
        },
        error: () => {
          this.toastr.error('Failed to delete lawyer');
        },
      });
    }
  }
}
