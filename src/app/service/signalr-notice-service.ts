import { Injectable, Inject } from '@angular/core';
import { CourseConfig } from '../../shard/CourseConfig';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { RuntimeConfigService } from './runtime-config-service';
@Injectable()
export class SignalrNoticeService {

    private subjectNotice = new Subject<NoticeModel>();
    public obNoticeNodes;
    private connection;
    constructor(private runConfig: RuntimeConfigService) {
        this.obNoticeNodes = this.subjectNotice.asObservable();
        this.initSignalR();
    }
    initSignalR() {
        const signalrUrl = `${CourseConfig.signalRRootUrl}/hubs-systemNotification?groupId=${encodeURIComponent(this.runConfig.courseId)}`;
        console.log(signalrUrl);

        abp.signalr.startConnection(signalrUrl, (connection) => {
            connection.on('courseFileCreate', (newFile) => { // Register for incoming messages
                this.subjectNotice.next(new NoticeModel(NoticeTypeEnum.CourseFileCreate, newFile));
            });
            connection.on('courseVoteCreate', (newVote) => {
                this.subjectNotice.next(new NoticeModel(NoticeTypeEnum.CourseVoteCreate, newVote));
            });
            connection.on('userVoteCreate', (newVote) => {
                this.subjectNotice.next(new NoticeModel(NoticeTypeEnum.UserVoteCreate, newVote));
            });
        }).then(function (connection) {
            console.log('Connected to systemNotification server!');
        });
    }
}
export class NoticeModel {
    constructor(public type: NoticeTypeEnum, public data: any) {

    }
}

export enum NoticeTypeEnum {
    CourseFileCreate,
    CourseVoteCreate,
    UserVoteCreate

}

