import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';

import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin, { DateClickArg } from '@fullcalendar/interaction';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-user-google-calender',
  templateUrl: './user-google-calender.component.html',
  styleUrls: ['./user-google-calender.component.css'],
})
export class UserGoogleCalenderComponent implements OnInit {
  constructor(
    private http: HttpClient,
    private router: Router,
    private toastr: ToastrService
  ) {}

  baseUrl: string = environment.production;
  currentMonth: any = null;
  @Output() dateClicked = new EventEmitter<{ date: string; price: any }>();

  events: any[] = [];
  newvariable: any = [];
  todaydate = new Date();
  daydate = this.todaydate.setDate(this.todaydate.getDate() + 2);

  // Format the new date as YYYY-MM-DD
  formattedDate = this.todaydate.toISOString().split('T')[0];
  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    selectable: true,
    weekends: false,
    plugins: [dayGridPlugin, interactionPlugin],
    validRange: {
      start: new Date(new Date().setDate(new Date().getDate() + 2))
        .toISOString()
        .split('T')[0],
    },
    dateClick: this.handleDateClick.bind(this),
    eventMouseEnter: this.handleDateMouseEnter.bind(this),
    eventMouseLeave: this.handleDateMouseLeave.bind(this),
  };

  async handleDateClick(arg: DateClickArg) {
    const maincontainer = document.querySelectorAll('.fc-theme-standard td');
    maincontainer.forEach((date: Element) => {
      (date as HTMLElement).style.backgroundColor = 'white';
    });
    const currMonth = parseInt(arg.dateStr.split('-')[1]);
    const selectedDate = arg.dayEl;
    (selectedDate as HTMLElement).style.backgroundColor = '#bfdbfe';
    const clickedDate = arg.dateStr;
    const monthData = 11;
    let date = clickedDate.split('-')[2];
    let newdate = parseInt(date) - 1;
    // let currentMonth =
    let clickedEvent = this.events.filter(
      (item, index) =>
        index == (currMonth == monthData ? newdate : newdate + 30)
    );
    if (clickedEvent.length === 0) {
      console.log('chala');
      clickedEvent = this.events.filter(
        (item, index) => index == (currMonth == monthData ? newdate : newdate)
      );
    }
       console.log(clickedEvent, 'cehck this out');
    // this.events.find((event) => event.start === clickedDate) || clickedDate;

    if (clickedEvent) {
      const eventData = { date: clickedDate, price: clickedEvent };
      console.log(eventData, 'data all ==>');
      this.dateClicked.emit(eventData);
    }
    this.currentMonth = clickedDate;
  }

  // Imp Note:
  // this function executes in user-expendedorder when they select study level
  async handleclickItem(price: any) {
    const currentDate = new Date();
    let i = 1;
    this.newvariable = this.events.map((data: any, index: number) => {
      const eventDate = new Date();
      console.log(price, data);
      return {
        title: data === 0 ? '' : '$' + (data + price).toString(),
        start:
          currentDate.getFullYear() +
          '-' +
          ('0' + (currentDate.getMonth() + 1)).slice(-2) +
          '-' +
          ('0' + i++).slice(-2),
      };
    });

    this.calendarOptions.events = this.newvariable;

    return this.newvariable.title;
  }

  ngOnInit() {
    const currentDate = new Date();
    // setTimeout(() => {
    //   const allprices = document.querySelectorAll('.fc-h-event .fc-event-main' );
    //   const alldates = document.querySelectorAll('.fc .fc-daygrid-day-top');
    //   const allcontainer = document.querySelectorAll(
    //     '.fc-daygrid-event.fc-event-end'
    //   );
    //   const maincontainer = document.querySelectorAll('.fc-theme-standard td');
    //   maincontainer.forEach((date: Element) => {
    //     (date as HTMLElement).style.backgroundColor = 'white';
    //   });
    //   allprices.forEach((date: Element) => {
    //     (date as HTMLElement).style.backgroundColor = 'white';
    //     (date as HTMLElement).style.color = '#77CDFF';
    //   });
    //   allcontainer.forEach((date: Element) => {
    //     (date as HTMLElement).style.textAlign = 'center';
    //     (date as HTMLElement).style.border = 'none';
    //     (date as HTMLElement).style.fontSize = '18px';
    //     (date as HTMLElement).style.fontWeight = '700';
    //   });
    //   alldates.forEach((date: Element) => {
    //     (date as HTMLElement).style.justifyContent = 'center';
    //     (date as HTMLElement).style.fontSize = '24px';
    //   });
    // }, 1000);
    this.http
      .get(`${this.baseUrl}/api/admin/calenders/${currentDate.getMonth() + 1}`)
      .subscribe({
        next: (res: any) => {
          this.events = res;
        },
        error: (err: any) => {
          console.log(err, 'error is');
        },
      });
  }

  handleDateMouseEnter(arg: any) {
    // arg.el.style.color = 'red';
  }

  handleDateMouseLeave(arg: any) {
    // arg.el.style.color = '#FF565F';
    const selectedDate = arg.el;
    (selectedDate as HTMLElement).style.backgroundColor = '';
  }
}
