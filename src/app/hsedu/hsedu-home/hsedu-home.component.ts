import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-hsedu-home',
  templateUrl: './hsedu-home.component.html',
  styleUrls: ['./hsedu-home.component.css']
})
export class HseduHomeComponent implements OnInit {
  showNavigationArrows = false;
  showNavigationIndicators = true;
  currentImage = '/assets/img/home/index-edx.jpg';
  imagesNodes = ['/assets/img/home/index-edx.jpg', '/assets/img/home/index-edx2.jpg'];
  images = ['/assets/img/home/person1.png', '/assets/img/home/person2.png', '/assets/img/home/person3.png'];
  index = 1;
  constructor() { }

  ngOnInit() {
    setInterval(() => {
      this.currentImage = this.imagesNodes[this.index++ % 2];
    }, 5000);
  }

}
