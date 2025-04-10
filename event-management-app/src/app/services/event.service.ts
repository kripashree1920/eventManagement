import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Event } from '../models/event.model';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class EventService {
  private events: Event[] = [];

  private eventsSubject = new BehaviorSubject<Event[]>([]);
  events$ = this.eventsSubject.asObservable();

  constructor(private http: HttpClient) {
    this.getInitialEvents();
  }

  getInitialEvents() {
    this.http.get<Event[]>('assets/mock-event.json').subscribe((data) => {
      const storedEvents = JSON.parse(
        localStorage.getItem('newEvents') || '[]'
      );
      this.events = [...data, ...storedEvents];
      this.eventsSubject.next(this.events);
    });
  }

  addEvent(event: any) {
    console.log('added event', event);
    event.id = Date.now();
    this.events.push(event);
    console.log(this.events,'list of new events');
    const eventsStored = JSON.parse(
      localStorage.getItem('newEvents') || '[]'
    );
    eventsStored.push(event);
    localStorage.setItem('newEvents', JSON.stringify(eventsStored));
    this.eventsSubject.next(this.events);
  }

  getAllEvents(): Event[] {
    return this.eventsSubject.value;
  }

  getEventById(id: number): Event | undefined {
    return this.events.find((e) => e.id === id);
  }

  updateEvent(updated: Event) {
    const index = this.events.findIndex((e) => e.id === updated.id);
    if (index !== -1) {
      this.events[index] = updated;
      this.eventsSubject.next(this.events);
    }
  }

  deleteEvent(id: number) {
    this.events = this.events.filter((e) => e.id !== id);
    const localEvents = JSON.parse(
      localStorage.getItem('newEvents') || '[]'
    );
    const updatedLocalEvents = localEvents.filter((e: any) => e.id !== id);
    localStorage.setItem('newEvents', JSON.stringify(updatedLocalEvents));

    this.eventsSubject.next(this.events);
  }
}
