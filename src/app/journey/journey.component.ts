import { Component, Input } from '@angular/core';

@Component({
  selector: 'ts-journey',
  imports: [],
  templateUrl: './journey.component.html',
  styleUrl: './journey.component.css'
})
export class JourneyComponent {
  @Input()
  trip!: string;
}
