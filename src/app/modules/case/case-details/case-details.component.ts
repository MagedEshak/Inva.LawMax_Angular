import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CaseService } from 'src/app/proxy/inva/law-cases/controller';
import { CaseLawyerHearingsWithNavigationProperty } from 'src/app/proxy/inva/law-cases/dtos/case';
import { statusOptions } from 'src/app/proxy/inva/law-cases/enums';

@Component({
  selector: 'app-case-details',
  imports: [RouterLink, DatePipe],
  templateUrl: './case-details.component.html',
  styleUrl: './case-details.component.scss',
})
export class CaseDetailsComponent implements OnInit {
  case: CaseLawyerHearingsWithNavigationProperty | null = null;

  constructor(private route: ActivatedRoute, private caseService: CaseService) {}

  ngOnInit(): void {
    this.caseDetails();
  }

  caseDetails(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.caseService.getCaseWithLawyersAndHearingsById(id).subscribe(cases => {
        this.case = cases;
      });
    }
  }

  getStatusLabel(status: number | undefined): string {
    const option = statusOptions.find(opt => opt.value === status);
    return option?.key ?? '—';
  }
}
