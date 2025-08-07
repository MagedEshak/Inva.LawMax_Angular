import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { LawyerService } from 'src/app/proxy/inva/law-cases/controller';
import { LawyerWithNavigationPropertyDto } from 'src/app/proxy/inva/law-cases/dtos/lawyer';
import { statusOptions } from './../../../proxy/inva/law-cases/enums/status.enum';
import { CaseDto } from 'src/app/proxy/inva/law-cases/dtos/case';
import { CommonModule, DatePipe } from '@angular/common';

@Component({
  selector: 'app-lawyer-details',
  templateUrl: './lawyer-details.component.html',
  styleUrls: ['./lawyer-details.component.scss'],
  imports: [CommonModule, DatePipe, RouterLink],
})
export class LawyerDetailsComponent implements OnInit {
  lawyer: LawyerWithNavigationPropertyDto | null = null;
  selectedCase: CaseDto | null = null;

  constructor(private route: ActivatedRoute, private lawyerService: LawyerService) {}

  ngOnInit(): void {
    this.lawyerDetails();
  }

  lawyerDetails(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.lawyerService.get(id,null).subscribe(lawyer => {
        this.lawyer = lawyer;
      });
    }
  }

  getStatusLabel(status: number | undefined): string {
    const option = statusOptions.find(opt => opt.value === status);
    return option?.key ?? '—';
  }

  selectCase(caseItem: CaseDto): void {
    this.selectedCase = caseItem;
  }

  getStatusClass(status: number | undefined): string {
    switch (status) {
      case 0:
        return 'badge badge-primary'; // Draft
      case 1:
        return 'badge badge-warning'; // Pending
      case 2:
        return 'badge badge-danger'; // InProgress
      default:
        return 'badge badge-light';
    }
  }
}
