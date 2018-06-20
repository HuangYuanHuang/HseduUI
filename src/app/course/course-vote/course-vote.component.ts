import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { CourseConfig } from '../../../shard/CourseConfig';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs/Subject';
import { RuntimeConfigService } from '../../service/runtime-config-service';
import { SignalrNoticeService, NoticeTypeEnum, NoticeModel } from '../../service/signalr-notice-service';

@Component({
  selector: 'app-course-vote',
  templateUrl: './course-vote.component.html',
  styleUrls: ['./course-vote.component.css']
})
export class CourseVoteComponent implements OnInit {
  private readonly apiPath = '/api/services/app/CourseVote/GetCourseVoteByCourseId?courseId=';
  private readonly createPath = '/api/services/app/UserVote/Create';
  private readonly searchPath = '/api/services/app/UserVote/GetUserVoteByCourseId?courseId=';
  @ViewChild('voteViewContent') modalContext: ElementRef;
  voteNodes;
  modalData;
  modalResult;
  radioInput;
  userVotes;
  constructor(private http: HttpClient, private runConfig: RuntimeConfigService,
    private modalService: NgbModal, private noticeService: SignalrNoticeService) {
    this.noticeService.obNoticeNodes.subscribe(node => {
      const subject = node as NoticeModel;
      console.log(subject);
      if (subject.type === NoticeTypeEnum.CourseVoteCreate) {
        const item = subject.data;
        const newModel = new CourseVoteModel(item.creationTime, item.title, item.description,
          item.resultPublic, item.voteClose, item.voteRadio, item.id, item.votes);
        this.voteNodes.unshift(newModel);
        this.voteView(newModel, this.modalContext);
      }

    });
  }
  ngOnInit() {
    this.loadData();
  }
  loadData() {
    const url = `${CourseConfig.CourseRootUrl}${this.apiPath}${encodeURIComponent(this.runConfig.courseId)}`;
    this.http.get<any>(url).subscribe(data => {
      if (data.success) {
        this.voteNodes = [];
        data.result.items.forEach(item => {
          this.voteNodes.push(new CourseVoteModel(item.creationTime, item.title, item.description,
            item.resultPublic, item.voteClose, item.voteRadio, item.id, item.votes));
        });
      }
    });
    const userVoteUrl = `${CourseConfig.CourseRootUrl}${this.searchPath}${encodeURIComponent(this.runConfig.courseId)}&userId=${this.runConfig.userId}`;
    this.http.get<any>(userVoteUrl).subscribe(data => {
      if (data.success) {
        this.userVotes = data.result.items;
        setTimeout(() => {
          this.setUseVoteStaus(this.userVotes);
        }, 1000);
      }
    });
  }
  setUseVoteStaus(userVotes: any) {
    userVotes.forEach(item => {
      const findModel = this.voteNodes.filter(d => d.id === item.voteId);
      if (findModel && findModel.length > 0) {
        findModel[0].userVoteStaus = true;
        findModel[0].userVoteId = item.problemId;
      }
    });
  }
  voteView(data: any, content) {
    this.modalData = data;
    this.modalResult = this.modalService.open(content, { size: 'lg' });
    console.log(data);
  }
  voteReadonly(data: any, content) {
    this.modalData = data;
    this.radioInput = this.modalData.userVoteId + '';
    this.modalService.open(content, { size: 'lg' });
  }
  rowClick(data: any) {
    this.radioInput = data.id + '';
  }
  saveChanges() {
    const url = `${CourseConfig.CourseRootUrl}${this.createPath}`;
    const data = {
      userId: this.runConfig.userId,
      voteId: this.modalData.id,
      courseId: this.runConfig.courseId,
      problemId: parseInt(this.radioInput, 0)
    };
    console.log(data);
    this.http.post<any>(url, data).subscribe(res => {
      if (res.success) {
        this.modalResult.close();
        this.userVotes.push(res.result);
        this.setUseVoteStaus([res.result]);
      }
    });
  }
}

class CourseVoteModel {
  public userVoteStaus = false;
  public userVoteId: number;
  constructor(public creationTime: any, public title: string,
    public description: string, public resultPublic: boolean,
    public voteClose: boolean, public voteRadio: boolean,
    public id: number, public votes: any) {

  }
}
