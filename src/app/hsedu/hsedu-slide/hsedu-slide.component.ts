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
    this.images = ['/assets/img/slide/index-car01.jpg', '/assets/img/slide/index-car02.jpg',
      '/assets/img/slide/index-car03.jpg', '/assets/img/slide/index-car04.jpg'];
  }

}
