import { Injectable, Inject } from '@angular/core';
import { CourseConfig } from '../../shard/CourseConfig';
import { Subject } from 'rxjs/Subject';
import { RuntimeConfigService } from './runtime-config-service';
@Injectable()
export class SignalrChatService {

    public subjectReal = new Subject<RealModel>();
    public obRealNodes;
    private connection;
    constructor(private runConfig: RuntimeConfigService) {
        this.obRealNodes = this.subjectReal.asObservable();
        this.initSignalR(runConfig.courseId, runConfig.userId, runConfig.userName, runConfig.isTeacher);
    }
    initSignalR(courseId: string, userId: any, userName: string, isTeach: boolean) {
        let signalrUrl = `${CourseConfig.signalRRootUrl}/hubs-groupChatHub?groupId=${encodeURIComponent(courseId)}`;
        signalrUrl += `&userId=${userId}&userName=${userName}&isTeacher=${isTeach}`;
        console.log(signalrUrl);
        abp.signalr.startConnection(signalrUrl, (connection) => {
            this.connection = connection;
            console.log('Connection is  start');
            this.connection.on('getMessage', (nodes) => {
                const messgaes = [];
                nodes.forEach(item => {
                    messgaes.push(new MessageNode(item.userName, item.messageContext, item.messageType));
                });
                this.subjectReal.next(new RealModel(ReceiveStausEnum.Message, messgaes));
            });
            this.connection.on('getOnlineNum', (users) => {
                this.subjectReal.next(new RealModel(ReceiveStausEnum.OnlineNum, users));
            });
            this.connection.on('getMediaOpera', (toUserId, type) => {
                this.subjectReal.next(new RealModel(type, toUserId));
            });
            setTimeout(() => {
                this.connection.invoke('getGroupMessage').then(d => {
                    console.log('load groupMessage');
                }).catch(err => console.error);
            }, 1000);

        });
    }
    sendMessage(message: string, callback) {
        this.connection.invoke('SendMessage', message, ReceiveStausEnum.Message).then(d => {
            callback();
        }).catch(err => console.error);
    }
    sendMediaOpera(toUserId: number, type: ReceiveStausEnum, callback) {
        this.connection.invoke('SendMediaOpera', toUserId, type).then(d => {
            callback();
        }).catch(err => console.error);
    }
}
export enum ReceiveStausEnum {
    Message,
    OnlineNum,
    VideoOpera,
    AudioOpera
}

export class RealModel {
    constructor(public type: ReceiveStausEnum, public data: any) {

    }
}

export class MessageNode {
    constructor(public userName: string, public message: string, public messageType: ReceiveStausEnum) {
    }
}

