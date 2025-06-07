import { AfterViewInit, Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { JourneyComponent } from './journey/journey.component';

export enum Level {
  L1 = 'L1',
  L2 = 'L2',
}

export interface trip {
  startingPoint: string;
  endingPoint: string;
  trip: string;
  level: Level;
  isArrow: boolean;
}

@Component({
  selector: 'app-root',
  imports: [ReactiveFormsModule, JourneyComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit, AfterViewInit {
  title = 'Journey';
  form!: FormGroup;
  data: trip[] = [];
  Level = Level;
  public ALPHABETS_ONLY = '[a-zA-Z][a-zA-Z ]+';
  constructor(private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      startingPoint: [
        '',
        [Validators.pattern(this.ALPHABETS_ONLY), Validators.required],
      ],
      endingPoint: [
        '',
        [Validators.pattern(this.ALPHABETS_ONLY), , Validators.required],
      ],
    });
  }

  ngAfterViewInit() {
    this.setPathLines();
  }

  addJourney() {
    let startingPoint = this.form.get('startingPoint')?.value;
    let endingPoint = this.form.get('endingPoint')?.value;
    let concatenatedTrip =
      startingPoint.substring(0, 3) + '-' + endingPoint.substring(0, 3);
    let level =
      this.data.length >= 1 &&
      this.data[this.data.length - 1].startingPoint.toLowerCase() ===
        startingPoint.toLowerCase() &&
      this.data[this.data.length - 1].endingPoint.toLowerCase() ===
        endingPoint.toLowerCase()
        ? Level.L2
        : Level.L1;
    if (level == Level.L2) {
      this.data[this.data.length - 1].level = Level.L2;
    }
    let isArrow =
      this.data.length >= 1 &&
      this.data[this.data.length - 1].endingPoint.toLowerCase() !==
        startingPoint.toLowerCase() &&
      !(level === Level.L2);
    this.data.push({
      startingPoint,
      endingPoint,
      trip: concatenatedTrip,
      level,
      isArrow,
    });
    console.log(this.data);
    this.setPathLines();

    this.form.setValue({ startingPoint: '', endingPoint: '' });
  }
  clear() {
    this.data = [];
  }

  setPathLines() {
    setTimeout(() => {
      const container = document.getElementById('trip');
      const svg = document.getElementById('svg');
      if (!container || !svg) return;
      const dots = Array.from(
        container.querySelectorAll('.dot')
      ) as HTMLElement[];
      const containerRect = container.getBoundingClientRect();
      const defs = svg.querySelector('defs')?.outerHTML || '';
      svg.innerHTML = defs;
      svg.setAttribute('width', container.offsetWidth.toString());
      svg.setAttribute('height', container.offsetHeight.toString());

      for (let i = 0; i < dots.length - 1; i++) {
        const dot1 = dots[i].getBoundingClientRect();
        const dot2 = dots[i + 1].getBoundingClientRect();

        const x1 = dot1.left + dot1.width / 2 - containerRect.left;
        const y1 = dot1.top + dot1.height / 2 - containerRect.top;
        const x2 = dot2.left + dot2.width / 2 - containerRect.left;
        const y2 = dot2.top + dot2.height / 2 - containerRect.top;

        const dx = (x2 - x1) / 2;

        const path = document.createElementNS(
          'http://www.w3.org/2000/svg',
          'path'
        );
        path.setAttribute(
          'd',
          `M${x1},${y1} C${x1 + dx},${y1} ${x2 - dx},${y2} ${x2},${y2}`
        );
        path.setAttribute('stroke', '#000');
        path.setAttribute('stroke-width', '2');
        path.setAttribute('fill', 'none');
        const arrow = dots[i + 1].dataset['arrow'] === 'true';
        if (arrow) {
          path.setAttribute('marker-end', 'url(#arrowhead)');
        }
        svg.appendChild(path);

        window.addEventListener('resize', this.setPathLines);
        window.addEventListener('DOMContentLoaded', this.setPathLines);
      }
    }, 0);
  }
}
