import { Component, OnInit } from '@angular/core';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin, { DateClickArg } from '@fullcalendar/interaction';
import { CaseService } from 'src/app/proxy/inva/law-cases/controller';
import { DateTime } from 'luxon';
import { EventInput } from '@fullcalendar/core';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-calendar-view',
  standalone: true,
  templateUrl: './hearing-details.component.html',
  styleUrls: ['./hearing-details.component.scss'],
  imports: [FullCalendarModule, CommonModule],
})
export class HearingDetailsComponent implements OnInit {
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

  constructor(private caseService: CaseService, private router: Router) {}

  ngOnInit(): void {
    this.loadCalendarData();
  }

  goToCaseDetails(caseId: string): void {
    this.router.navigate(['case/details', caseId]);
  }

  loadCalendarData(): void {
    this.caseService
      .getList({ skipCount: 0, maxResultCount: 1000, sorting: '' }, null)
      .subscribe(res => {
        this.allEvents = [];

        res.items.forEach(caseItem => {
          caseItem.hearingDtos?.forEach(hearing => {
            this.allEvents.push({
              id: hearing.id,
              title: caseItem.caseTitle ?? 'Untitled Case',
              start: new Date(hearing.date),
              extendedProps: {
                case: caseItem,
                hearing: hearing,
              },
            });
          });
        });

        this.calendarOptions = {
          plugins: [dayGridPlugin, interactionPlugin],
          initialView: 'dayGridMonth',
          events: this.allEvents,
          dateClick: this.handleDateClick.bind(this),
          locale: 'en',
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
}
