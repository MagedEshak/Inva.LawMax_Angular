import { statusOptions } from './../../../proxy/inva/law-cases/enums/status.enum';
import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { LawyerService } from 'src/app/proxy/inva/law-cases/controller';
import { LawyerWithNavigationPropertyDto } from 'src/app/proxy/inva/law-cases/dtos/lawyer';

@Component({
  selector: 'app-lawyer-details',
  imports: [RouterLink, DatePipe],
  templateUrl: './lawyer-details.component.html',
  styleUrl: './lawyer-details.component.scss',
})
export class LawyerDetailsComponent implements OnInit {
  lawyer: LawyerWithNavigationPropertyDto | null = null;

  constructor(private route: ActivatedRoute, private lawyerService: LawyerService) {}

  ngOnInit(): void {
    this.lawyerDetails();
  }

  lawyerDetails(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.lawyerService.get(id).subscribe(lawyer => {
        this.lawyer = lawyer;
      });
    }
  }

  getStatusLabel(status: number | undefined): string {
    const option = statusOptions.find(opt => opt.value === status);
    return option?.key ?? '—';
  }
}
