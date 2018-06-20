import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SignalrPointService } from '../../service/signalr-point-service';

@Component({
  selector: 'app-course-point-master',
  templateUrl: './course-point-master.component.html',
  styleUrls: ['./course-point-master.component.css']
})
export class CoursePointMasterComponent implements OnInit {
  pointNodes = [];
  currentPoint: any;
  nextPoint: any;
  title = '大型网站架构设计';
  isShare = false;
  constructor(private modalService: NgbModal, private pointService: SignalrPointService) {
    this.pointService.obMasterNodes.subscribe(nodes => {
      this.pointNodes = [];
      let index = 1;
      nodes.forEach(d => {
        this.pointNodes.push(new PointModel(d, index++));
      });
      this.currentPoint = { index: 0, model: this.pointNodes[0] };
      this.pointNodes[0].isPlay = true;
      if (this.pointNodes.length > 1) {
        this.nextPoint = { index: 1, model: this.pointNodes[1] };
      }
    });
  }

  ngOnInit() {
    // for (let i = 1; i <= 34; i++) {
    //   this.pointNodes.push(new PointModel(`/assets/img/ppt/ppt${i}.jpg`, i));
    // }

  }
  selectPoint(item: PointModel, index: number) {
    if (this.isShare) {
      this.pointService.shareImage(this.pointNodes[index].path, () => console.log('share success!' + this.pointNodes[index].path));
    }
    const preIndex = this.currentPoint.index;
    this.pointNodes[preIndex].isPlay = false;
    this.currentPoint = { index: index, model: this.pointNodes[index] };
    this.pointNodes[index].isPlay = true;
    if (index + 1 <= this.pointNodes.length) {
      this.nextPoint = { index: index + 1, model: this.pointNodes[index + 1] };
    }
  }
  openWindow(content, index) {
    this.isShare = true;
    this.selectPoint(null, index);
    this.modalService.open(content, { windowClass: 'point-modal' }).result.then(d => {
      console.log('Modal Serve');
      this.isShare = false;
      this.pointService.shareImage('', () => console.log('share exit!'));
    });
    $('.modal-content').width($('body').width());

    setTimeout(() => {
      $('.point-modal div').removeClass('modal-dialog');
      $('.point-modal div div[class="modal-content"]').css('margin', '0 auto');
    }, 10);
  }
  changePage(type) {
    const current = this.currentPoint.index + type;
    if (current < 0 || current >= this.pointNodes.length) {
      return;
    }
    this.selectPoint(null, current);
  }
}

class PointModel {
  public isPlay = false;

  constructor(public path: string, public index: number) {

  }
}
