import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HearingService } from 'src/app/proxy/inva/law-cases/controller';
import { HearingWithNavigationPropertyDto } from 'src/app/proxy/inva/law-cases/dtos/hearing';
import { statusOptions } from 'src/app/proxy/inva/law-cases/enums';

@Component({
  selector: 'app-hearing-details',
  imports: [],
  templateUrl: './hearing-details.component.html',
  styleUrl: './hearing-details.component.scss',
})
export class HearingDetailsComponent implements OnInit {
  hearings: HearingWithNavigationPropertyDto | null = null;

  constructor(private route: ActivatedRoute, private hearingService: HearingService) {}

  ngOnInit(): void {
    this.hearingDetails();
  }

  hearingDetails(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.hearingService.getHearingById(id).subscribe(hearing => {
        this.hearings = hearing;
      });
    }
  }

  getStatusLabel(status: number | undefined): string {
    const option = statusOptions.find(opt => opt.value === status);
    return option?.key ?? '—';
  }
}
