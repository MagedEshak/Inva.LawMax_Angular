import { Component, OnInit } from '@angular/core';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin, { DateClickArg } from '@fullcalendar/interaction';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CommonModule } from '@angular/common';
import { DateTime } from 'luxon';
import { EventInput } from '@fullcalendar/core';
import { LawyerService } from 'src/app/proxy/inva/law-cases/controller';
import { ActivatedRoute, Router } from '@angular/router';
import { LawyerWithNavigationPropertyDto } from 'src/app/proxy/inva/law-cases/dtos/lawyer';

@Component({
  selector: 'app-lawyer-calender',
  standalone: true,
  templateUrl: './lawyer-calender.component.html',
  styleUrls: ['./lawyer-calender.component.scss'],
  imports: [CommonModule, FullCalendarModule],
})
export class LawyerCalenderComponent implements OnInit {
  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin, interactionPlugin],
    initialView: 'dayGridMonth',
    events: [],
    locale: 'en',
    height: 'auto',
  };
  allEvents: EventInput[] = [];
  selectedEvents: EventInput[] = [];
  selectedDate: string | null = null;

  lawyerId: string; // غيّرها أو استقبلها كـ Input

  constructor(
    private lawyerService: LawyerService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.lawyerId = params['id'];
      this.fetchHearings(); // استدعاء الداتا بعد تعيين المعرف
    });
  }

  fetchHearings(): void {
    this.lawyerService.get(this.lawyerId, '').subscribe(res => {
      const events: EventInput[] = [];

      res.cases?.forEach(caseItem => {
        caseItem.hearingDtos?.forEach(hearing => {
          events.push({
            id: hearing.id,
            title: caseItem.caseTitle ?? 'Untitled Hearing',
            start: new Date(hearing.date),
            extendedProps: {
              hearing,
              case: caseItem,
            },
          });
        });
      });

      this.allEvents = events;

      this.calendarOptions = {
        plugins: [dayGridPlugin, interactionPlugin],
        initialView: 'dayGridMonth',
        events: this.allEvents,
        dateClick: this.handleDateClick.bind(this),
        height: 'auto',
        headerToolbar: {
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,dayGridWeek',
        },
      };
    });
  }

  handleDateClick(arg: DateClickArg): void {
    const clickedDate = DateTime.fromJSDate(arg.date).toISODate();
    this.selectedDate = clickedDate;

    this.selectedEvents = this.allEvents.filter(event => {
      const eventDate = DateTime.fromJSDate(event.start as Date).toISODate();
      return eventDate === clickedDate;
    });
  }
  goToCaseDetails(caseId: string): void {
    this.router.navigate(['case/details', caseId]);
  }

  back() {
    history.back();
  }
}
