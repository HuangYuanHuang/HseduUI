import { Injectable, Inject } from '@angular/core';
import { CourseConfig } from '../../shard/CourseConfig';
import { Subject } from 'rxjs/Subject';
import { RuntimeConfigService } from './runtime-config-service';
@Injectable()
export class SignalrOnlineChatService {

    private subjectReal = new Subject<OnlineMessageNode>();
    public currentUserOperaGUID;
    public isVideoChat = false;
    private subjectOnline = new Subject<any>();
    private subjectNotice = new Subject<any>();
    public obMessageNodes;
    public obOnlineNodes;
    public obNoticeNodes;
    private connection;
    constructor(runConfig: RuntimeConfigService) {
        this.obMessageNodes = this.subjectReal.asObservable();
        this.obNoticeNodes = this.subjectNotice.asObservable();
        this.obOnlineNodes = this.subjectOnline.asObservable();
        this.initSignalR('Peer-Peer', runConfig.userId, runConfig.userName);
    }
    initSignalR(courseId: string, userId: any, userName: string) {
        let signalrUrl = `${CourseConfig.signalRRootUrl}/hubs-onlineChatHub?groupId=${encodeURIComponent(courseId)}`;
        signalrUrl += `&userId=${userId}&userName=${userName}`;
        console.log(signalrUrl);
        abp.signalr.startConnection(signalrUrl, (connection) => {
            this.connection = connection;
            console.log('Connection onlineChatHub is  start');
            this.connection.on('onGetChatMessage', (node) => {
                this.subjectReal.next(new OnlineMessageNode(node.fromUserId, node.toUserId, node.message,
                    node.courseId, node.messageType, node.isRead, node.creationTime, node.id));
            });
            this.connection.on('onGetUserOnline', (node) => {
                console.log(node);
                this.subjectOnline.next(node);
            });
            this.connection.on('onGetNotice', (node) => {
                console.log(node);
                this.subjectNotice.next(node);
            });
        });
    }
    public GetGUID() {
        let guid = '';
        for (let i = 1; i <= 32; i++) {
            const n = Math.floor(Math.random() * 16.0).toString(16);
            guid += n;
            if ((i === 8) || (i === 12) || (i === 16) || (i === 20)) {
                guid += '-';
            }
        }
        this.currentUserOperaGUID = guid;
        return guid;
    }
}
export enum MessageTypeEnum {
    Defalut,
    Text,
    Audio,
    Video,
    Refuse,
    Accept,
    Exit,
    Close
}
export enum ChatStautsEnum {
    Invitation,
    Confirm,
    Accept,
    Refuse
}
export class OnlineMessageNode {
    constructor(public fromUserId: number, public toUserId: number, public message: string,
        public courseId: string, public messageType: MessageTypeEnum, public isRead: boolean,
        public creationTime: Date, public msgId: number) {
    }
}

