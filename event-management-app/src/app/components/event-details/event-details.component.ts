import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EventService } from 'src/app/services/event.service';
import { Event } from 'src/app/models/event.model';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-event-details',
  templateUrl: './event-details.component.html',
  styleUrls: ['./event-details.component.scss']
})
export class EventDetailsComponent implements OnInit {
  event: any ;
    constructor(
    private route: ActivatedRoute,
    public router: Router,
    private http: HttpClient,
    public eventService: EventService
  ) { }

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.eventService.events$.subscribe(events => {
      this.event = events.find(e => e.id === id);
      console.log(this.event)
    });
  }
  goBack() {
    this.router.navigate(['/']);
  }

}
