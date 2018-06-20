import { Component, OnInit, Input } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CourseConfig } from '../../../shard/CourseConfig';
import { DomSanitizer } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';
import { RuntimeConfigService } from '../../service/runtime-config-service';
import { SignalrPointService, CoursePointModel } from '../../service/signalr-point-service';
import { SignalrNoticeService, NoticeTypeEnum, NoticeModel } from '../../service/signalr-notice-service';
@Component({
  selector: 'app-course-file',
  templateUrl: './course-file.component.html',
  styleUrls: ['./course-file.component.css']
})
export class CourseFileComponent implements OnInit {
  private readonly apiPath = '/api/services/app/CourseFile/GetCourseFileByCourseId?courseId=';
  private readonly downPath = '/coursefile/download?path=';
  private readonly uploadPath = '/coursefile?courseId=';
  uploadUrl: any;
  fileNodes;
  @Input() isTeacher;
  constructor(private modalService: NgbModal, private http: HttpClient,
    private donSanitizer: DomSanitizer,
    private runConfig: RuntimeConfigService,
    private pointService: SignalrPointService,
    private noticeService: SignalrNoticeService) {
    const url = `${CourseConfig.CourseRootUrl}${this.uploadPath}${encodeURIComponent(runConfig.courseId)}&language=${runConfig.language}`;
    this.uploadUrl = this.donSanitizer.bypassSecurityTrustResourceUrl(url);
    this.noticeService.obNoticeNodes.subscribe(node => {
      const subject = node as NoticeModel;
      console.log(subject);
      if (subject.type === NoticeTypeEnum.CourseFileCreate) {
        this.fileNodes.push(new CourseFileModel(this.isTeacher, subject.data.fileName, subject.data.path, this.pointService));
        setTimeout(() => {
          $('.file-list').scrollTop(50000);
        }, 100);
      }
    });
    this.signalRCourseConvert();
  }

  signalRCourseConvert() {
    this.pointService.obRealNodes.subscribe(node => {
      const item = node as CoursePointModel;
      const result = this.fileNodes.filter(d => d.path === item.fileId);
      if (result && result.length > 0) {
        const find = result[0] as CourseFileModel;
        find.setProgress(item);
      }
    });
  }
  openWindow(content) {
    this.modalService.open(content, { size: 'lg' });
    $('.modal-content').width(900);
  }

  loadData() {
    const url = `${CourseConfig.CourseRootUrl}${this.apiPath}${encodeURIComponent(this.runConfig.courseId)}`;
    this.http.get<any>(url).subscribe(data => {
      if (data.success) {
        this.fileNodes = [];
        data.result.items.forEach(item => {
          this.fileNodes.push(new CourseFileModel(this.isTeacher, item.fileName, item.path, this.pointService));
        });
      }
    });
  }
  ngOnInit() {
    this.loadData();
    if (!this.isTeacher) {
      setTimeout(() => {
        $('.file-list').height($('.file-list').height() + 40 + 'px');
      }, 1000);

    }
  }
}

class CourseFileModel {
  private readonly downPath = '/coursefile/download?path=';
  public canConvert = false;
  public imageNodes = [];
  public convertBtnReadonly = false;
  public showProgress = false;
  public convertFinished = false;
  public trClass = '';
  public progressValue = 0;
  public imageCount = 0;
  constructor(public isTeach: boolean, public fileName: string,
    public path: string, private pointService: SignalrPointService) {
    if (isTeach && fileName.toLocaleLowerCase().indexOf('ppt') > -1) {
      this.canConvert = true;
    }
  }
  fileConvert() {
    if (this.convertFinished) {
      this.pointService.pushImages(this.imageNodes);
      return;
    }
    this.showProgress = true;
    this.progressValue = 0.1;
    this.pointService.convertFile(this.path, () => {
      console.log('File Is Convert Finished');
    });
  }
  setProgress(value: CoursePointModel) {
    if (!value.success) {
      setTimeout(() => {
        this.showProgress = false;
        this.trClass = 'table-danger';
        this.progressValue = 0;
      }, 1000);
      return;
    }
    if (this.progressValue < value.progress) {
      this.progressValue = value.progress;
    }
    this.loadImageNodes(value);
    if (this.progressValue === 4) {
      this.convertFinished = true;
      setTimeout(() => {
        this.showProgress = false;
        this.trClass = 'table-success';
        this.progressValue = 0;
      }, 1000);
    }
  }
  fileDownload() {
    const url = `${CourseConfig.CourseRootUrl}${this.downPath}${this.path}`;
    console.log(url);
    window.open(url);
  }
  loadImageNodes(value: CoursePointModel) {
    if (this.progressValue >= 3 && this.imageCount < value.total) {
      let currentIndex = this.imageCount + 1;
      let appendCount = value.total - this.imageCount;
      while (appendCount-- > 0) {
        this.imageNodes.push(`${CourseConfig.ConvertImageUrl}/${this.path}/ppt${currentIndex++}.jpg`);
      }
      this.pointService.pushImages(this.imageNodes);
    }
  }


}
