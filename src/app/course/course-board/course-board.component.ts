import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { CourseConfig } from '../../../shard/CourseConfig';
import * as $ from 'jquery';
@Component({
  selector: 'app-course-board',
  templateUrl: './course-board.component.html',
  styleUrls: ['./course-board.component.css']
})
export class CourseBoardComponent implements OnInit {
  awwUrl: any;
  constructor(private donSanitizer: DomSanitizer) {
    const url = `${CourseConfig.CourseRootUrl}/home/AwwBoard`;
    this.awwUrl = this.donSanitizer.bypassSecurityTrustResourceUrl(url);
  }

  ngOnInit() {

  }
  initAwwboard() {
    console.log('is on init');
    const aww = new AwwBoard('#aww-wrapper', {
      apiKey: 'fd663949-45b3-42e5-a477-3f4c69ee1bb4',
      boardLink: 'cd10e7e2',
      autoJoin: true,
      sizes: [3, 5, 8, 13, 20],
      fontSizes: [10, 12, 16, 22, 30],
      menuOrder: ['colors', 'sizes', 'tools'],
      tools: ['pan', 'pencil', 'eraser', 'text', 'ellipse', 'ellipseFilled', 'lineStraight',
        'trash', 'undo', 'presentation', 'rectangle', 'rectangleFilled'],
      defaultColor: '#000000',
      defaultSize: 8,
      defaultTool: 'pan'
    });

    aww.toggleChatWindow();
    aww.toggleChatWindow();
  }
}
