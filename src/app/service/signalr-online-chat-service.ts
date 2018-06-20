import { Injectable, Inject } from '@angular/core';
import { CourseConfig } from '../../shard/CourseConfig';
import { Subject } from 'rxjs/Subject';
import { RuntimeConfigService } from './runtime-config-service';
@Injectable()
export class SignalrOnlineChatService {

    private subjectReal = new Subject<OnlineMessageNode>();
    public obMessageNodes;
    private connection;
    constructor(runConfig: RuntimeConfigService) {
        this.obMessageNodes = this.subjectReal.asObservable();
        this.initSignalR(runConfig.courseId, runConfig.userId, runConfig.userName);
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
                    node.courseId, node.messageType, node.isRead, node.creationTime));
            });


        });
    }
}
export enum MessageTypeEnum {
    Defalut,
    Text,
    Audio,
    Video,
    Refuse,
    Accept,
    Exit
}

export class OnlineMessageNode {
    constructor(public fromUserId: number, public toUserId: number, public message: string,
        public courseId: string, public messageType: MessageTypeEnum, public isRead: boolean,
        public creationTime: Date) {
    }
}

