import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { Router } from '@angular/router';
import { Event } from 'src/app/models/event.model';
import { EventService } from 'src/app/services/event.service';

@Component({
  selector: 'app-event-listing',
  templateUrl: './event-listing.component.html',
  styleUrls: ['./event-listing.component.scss'],
})
export class EventListingComponent implements OnInit {
  today = new Date();
  events: any[] = [];
  paginatedEvents: any[] = [];
  currentPage = 1;
  itemsPerPage = 3;
  selectedDate: Date | null = null;
  filteredEvents: any[] = [];
  searchEvents: string = '';

  constructor(
    public router: Router,
    public eventService: EventService
  ) {}

  ngOnInit(): void {
    this.eventService.events$.subscribe((events) => {
      this.events = events;
      this.applyFilter();
    });
  }

  onDateChange(event: MatDatepickerInputEvent<Date>) {
    this.selectedDate = event.value;
    this.currentPage = 1;
    this.applyFilter();
  }

  applyFilter(): void {
    let filtered = this.events;

    if (this.selectedDate) {
      const selected = new Date(this.selectedDate).toDateString();
      filtered = filtered.filter(
        (event) => new Date(event.date).toDateString() === selected
      );
    }

    if (this.searchEvents.trim()) {
      const search = this.searchEvents.toLowerCase();
      filtered = filtered.filter(
        (event) =>
          event.title.toLowerCase().includes(search) ||
          event.location.toLowerCase().includes(search)
      );
    }

    this.filteredEvents = filtered;
    this.currentPage = 1;
    this.updatePagination();
  }

  clearSearch(): void {
    this.searchEvents = '';
    this.applyFilter();
  }

  clearDateFilter() {
    this.selectedDate = null;
    this.applyFilter();
  }

  updatePagination(): void {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    this.paginatedEvents = this.filteredEvents.slice(start, end);
  }

  nextPage(): void {
    if (this.currentPage * this.itemsPerPage < this.events.length) {
      this.currentPage++;
      this.updatePagination();
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePagination();
    }
  }

  moreInfo(id: number) {
    this.router.navigate(['/event', id]);
  }

  onEdit(event: Event) {
    this.router.navigate(['/edit', event.id]);
  }

  onDelete(id: number) {
    if (confirm('Are you sure you want to delete this event?')) {
      this.eventService.deleteEvent(id);
    }
  }
  goToHome() {
    this.searchEvents = '';
    this.selectedDate = null;
    this.applyFilter();
  }
}
