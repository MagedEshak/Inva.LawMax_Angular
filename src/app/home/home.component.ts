import { CommonModule, DatePipe } from '@angular/common';
import { AuthService } from '@abp/ng.core';
import { Component, OnInit } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { CaseService, DashboardService } from '../proxy/inva/law-cases/controller';
import { CaseByMonthDto, CaseStatusNumberDto } from '../proxy/inva/law-cases/dtos/dashboard';
import { Status } from '../proxy/inva/law-cases/enums';
import { CaseLawyerHearingsWithNavigationProperty } from '../proxy/inva/law-cases/dtos/case';

Chart.register(...registerables);
@Component({
  imports: [DatePipe, CommonModule],
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  cases: CaseLawyerHearingsWithNavigationProperty[] = [];
  todayHearings: CaseLawyerHearingsWithNavigationProperty[] = [];

  statusesCount: CaseStatusNumberDto[] = [];
  openStatusCount = 0;
  closeStatusCount = 0;
  newStatusCount = 0;

  get hasLoggedIn(): boolean {
    return this.authService.isAuthenticated;
  }

  constructor(
    private authService: AuthService,
    private _dashboardService: DashboardService,
    private caseService: CaseService
  ) {
    this.loadCasesByStatus();
    this.loadCasesByMonth();
  }

  login() {
    this.authService.navigateToLogin();
  }
  ngOnInit(): void {
    this.loadOpenCasesByStatus();
    this.caseDetails();
  }

  loadOpenCasesByStatus() {
    this._dashboardService.getListOfCaseStatusNumber().subscribe(data => {
      this.statusesCount = data;

      const open = data.find(item => item.status === Status.Open);
      const close = data.find(item => item.status === Status.Close);
      const newS = data.find(item => item.status === Status.New);

      this.openStatusCount = open?.couunt || 0;
      this.closeStatusCount = close?.couunt || 0;
      this.newStatusCount = newS?.couunt || 0;
    });
  }

  loadCasesByStatus() {
    this._dashboardService.getListOfCaseStatusNumber().subscribe(data => {
      const labels = data.map((item: CaseStatusNumberDto) => {
        return Status[item.status as number]; // 👈 تحويل الرقم إلى اسم النصي
      });

      const values = data.map((item: CaseStatusNumberDto) => item.couunt);

      new Chart('statusChart', {
        type: 'pie',
        data: {
          labels: labels,
          datasets: [
            {
              label: 'Cases by Status',
              data: values,
              backgroundColor: ['#0d6efd','#198754','#dc3545' ],
            },
          ],
        },
      });
    });
  }

  loadCasesByMonth() {
    this._dashboardService.getListOfCaseByMonth().subscribe(data => {
      const labels = data.map((item: CaseByMonthDto) => item.month);
      const values = data.map((item: CaseByMonthDto) => item.couunt);

      new Chart('monthChart', {
        type: 'line',
        data: {
          labels: labels,
          datasets: [
            {
              label: 'Cases by Month',
              data: values,
              fill: false,
              borderColor: '#0d6efd',
              tension: 0.4,
            },
          ],
        },
      });
    });
  }

  caseDetails() {
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

    this.caseService
      .getCaseWithLawyersAndHearingsList({ maxResultCount: 100, skipCount: 0, sorting: '' })
      .subscribe(response => {
        this.cases = response.items;

        this.todayHearings = this.cases.filter(c => {
          const hearingDate = c.hearingDto?.date?.split('T')[0]; // YYYY-MM-DD
          return hearingDate === today;
        });
      });
  }
}
