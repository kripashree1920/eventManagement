import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EventService } from 'src/app/services/event.service';
import { Event } from 'src/app/models/event.model';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-event-creation',
  templateUrl: './event-creation.component.html',
  styleUrls: ['./event-creation.component.scss'],
})
export class EventCreationComponent implements OnInit {
  eventForm!: FormGroup;
  eventId: number | null = null;
  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    public router: Router,
    private eventService: EventService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.eventForm = this.fb.group({
      title: ['', Validators.required],
      date: ['', Validators.required],
      location: ['', Validators.required],
      description: [''],
      image: ['', Validators.required],
    });

    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.eventId = +id;
        const event = this.eventService.getEventById(this.eventId);
        if (event) {
          this.eventForm.patchValue(event);
        }
      }
    });
  }

  onSubmit(): void {
    if (this.eventForm.invalid) return;
    const eventData: Event = { ...this.eventForm.value, id: this.eventId ?? 0 };

    if (this.eventId) {
      this.eventService.updateEvent(eventData);
      this.snackBar.open('Event updated successfully!', 'Close', {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'top',
      });
    } else {
      this.eventService.addEvent(eventData);
      this.snackBar.open('Event added successfully!', 'Close', {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'top',
      });
    }

    this.router.navigate(['/']);
  }
}
