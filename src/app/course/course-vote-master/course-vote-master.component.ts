import { Component, OnInit } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { CourseConfig } from '../../../shard/CourseConfig';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs/Subject';
import { RuntimeConfigService } from '../../service/runtime-config-service';
import { SignalrNoticeService, NoticeTypeEnum, NoticeModel } from '../../service/signalr-notice-service';

@Component({
  selector: 'app-course-vote-master',
  templateUrl: './course-vote-master.component.html',
  styleUrls: ['./course-vote-master.component.css']
})
export class CourseVoteMasterComponent implements OnInit {
  private readonly apiPath = '/api/services/app/CourseVote/GetCourseVoteByCourseId?courseId=';
  private readonly createPath = '/api/services/app/CourseVote/Create';
  private readonly courseVotePath = '/api/services/app/UserVote/GetAllCourseVote?courseId=';
  colors = ['bg-primary', 'bg-secondary', 'bg-success', 'bg-danger', 'bg-warning', 'bg-info', 'bg-light', 'bg-dark'];
  voteProblems = [];
  MaxProblemCount = 8;
  voteModel;
  voteNodes;
  modalResult;
  modalData;
  echartOption: any;
  voteProgress;
  constructor(private http: HttpClient, private runConfig: RuntimeConfigService,
    private modalService: NgbModal, private noticeService: SignalrNoticeService) {
    this.initModal();
    this.noticeService.obNoticeNodes.subscribe(node => {
      const subject = node as NoticeModel;
      const item = subject.data;
      if (subject.type === NoticeTypeEnum.CourseVoteCreate) {
        this.voteNodes.unshift(new CourseVoteModel(item.creationTime, item.title, item.description,
          item.resultPublic, item.voteClose, item.voteRadio, item.id, item.votes));
      } else if (subject.type === NoticeTypeEnum.UserVoteCreate) {
        const res = this.voteNodes.filter(d => d.id === item.voteId);
        if (res) {
          res[0].voteCount += res.length;
          res[0].userVotes.push(item);
          if (this.modalData) {
            this.loadChart();
          }
        }
        console.log(item);
      }

    });
  }
  initModal() {
    this.voteProblems = [];
    this.voteModel = {
      courseId: this.runConfig.courseId, title: '', description: '',
      resultPublic: true, voteClose: false, voteRadio: true, votes: []
    };
    this.voteProblems.push({ color: this.colors[0], problem: '' });
    this.voteProblems.push({ color: this.colors[1], problem: '' });
    this.voteProblems.push({ color: this.colors[2], problem: '' });
    this.voteProblems.push({ color: this.colors[3], problem: '' });
    this.voteProblems.push({ color: this.colors[4], problem: '' });
  }
  saveChanges() {
    const result = this.voteProblems.filter((s) => s.problem.length > 0);
    if (result.length > 1) {
      this.voteModel.votes = result;
      const url = `${CourseConfig.CourseRootUrl}${this.createPath}`;
      this.http.post<any>(url, this.voteModel).subscribe(data => {
        if (data.success) {
          this.modalResult.close();
          this.modalResult = null;
        }
      });
    }
  }
  ngOnInit() {
    this.loadData();
  }
  openWindow(content) {
    this.modalResult = this.modalService.open(content, { size: 'lg' });
    this.initModal();
  }
  voteChartWindow(data: any, content) {
    this.modalData = data;
    console.log(data);
    this.modalService.open(content, { size: 'lg' });
    this.loadChart();
  }
  appendProblem() {
    if (this.voteProblems.length < this.MaxProblemCount) {
      this.voteProblems.push({ color: this.colors[this.voteProblems.length], problem: '' });
    }

  }
  loadData() {
    const url = `${CourseConfig.CourseRootUrl}${this.apiPath}${encodeURIComponent(this.runConfig.courseId)}`;
    this.http.get<any>(url).subscribe(data => {
      this.voteNodes = [];
      if (data.success) {
        data.result.items.forEach(item => {
          this.voteNodes.push(new CourseVoteModel(item.creationTime, item.title, item.description,
            item.resultPublic, item.voteClose, item.voteRadio, item.id, item.votes));
        });
      }
    });

    const userVoteUrl = `${CourseConfig.CourseRootUrl}${this.courseVotePath}${encodeURIComponent(this.runConfig.courseId)}`;
    this.http.get<any>(userVoteUrl).subscribe(data => {
      if (data.success) {
        setTimeout(() => {
          this.loadCourseUserVote(data.result.items);
        }, 1000);
      }
    });

  }
  loadCourseUserVote(userVotes: any) {
    this.voteNodes.forEach(item => {
      const res = userVotes.filter(d => d.voteId === item.id);
      if (res && res.length > 0) {
        item.voteCount = res.length;
        item.userVotes = res;
      }
    });

  }
  loadChart() {
    const sourseData = [];
    let total = 0;
    this.modalData.votes.forEach(item => {
      sourseData.push({ name: item.problem, value: 0, id: item.id, color: item.color, percent: null, style: null });
    });

    if (this.modalData.userVotes && this.modalData.userVotes.length > 0) {
      this.modalData.userVotes.forEach(item => {
        const find = sourseData.filter(d => d.id === item.problemId);
        if (find && find.length > 0) {
          find[0].value++;
          total++;
        }
      });
    }

    sourseData.forEach(d => {
      const temp = parseInt(((d.value * 100) / total) + '', 0);
      if (total === 0) {
        d.percent = 0;
        d.style = { 'width': '0%' };
      } else {
        d.percent = temp;
        d.style = { 'width': temp + '%' };
      }


    });
    this.voteProgress = { total: total, nodes: sourseData };
  }
  setEchartOption(data: any) {
    this.echartOption = {
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b} : {c} ({d}%)'
      },
      legend: {
        orient: 'vertical',
        left: 'left'
      },
      series: [
        {
          name: this.modalData.title,
          type: 'pie',
          radius: '55%',
          center: ['50%', '60%'],
          data: data,
          itemStyle: {
            emphasis: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }
      ]
    };
  }
}
class CourseVoteModel {
  public voteCount = 0;
  public userVotes = [];
  constructor(public creationTime: any, public title: string,
    public description: string, public resultPublic: boolean,
    public voteClose: boolean, public voteRadio: boolean,
    public id: number, public votes: any) {

  }
}
