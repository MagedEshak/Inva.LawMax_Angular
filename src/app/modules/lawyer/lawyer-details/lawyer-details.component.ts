import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { LawyerDto } from 'src/app/proxy/dtos/lawyer';
import { LawyerService } from 'src/app/proxy/inva/law-cases/controller';

@Component({
  selector: 'app-lawyer-details',
  imports: [RouterLink],
  templateUrl: './lawyer-details.component.html',
  styleUrl: './lawyer-details.component.scss',
})
export class LawyerDetailsComponent implements OnInit {
  lawyer: LawyerDto | null = null;

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
}
