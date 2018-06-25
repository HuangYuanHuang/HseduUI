import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, Params, Router } from '@angular/router';
@Component({
  selector: 'app-hsedu-notice',
  templateUrl: './hsedu-notice.component.html',
  styleUrls: ['./hsedu-notice.component.less']
})
export class HseduNoticeComponent implements OnInit {

  constructor(private modalService: NgbModal, private router: Router) { }

  ngOnInit() {
  }
  open(content) {
    this.modalService.open(content, { backdrop: 'static', size: 'lg' });
  }
}
