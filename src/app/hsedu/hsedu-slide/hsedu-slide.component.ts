import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-hsedu-slide',
  templateUrl: './hsedu-slide.component.html',
  styleUrls: ['./hsedu-slide.component.css']
})
export class HseduSlideComponent implements OnInit {
  images: Array<string>;

  constructor() { }

  ngOnInit() {
    this.images = ['/assets/img/slide/1.png', '/assets/img/slide/2.png', '/assets/img/slide/3.png'];
  }

}
