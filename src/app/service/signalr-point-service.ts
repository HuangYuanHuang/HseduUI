import { Injectable, Inject } from '@angular/core';
import { CourseConfig } from '../../shard/CourseConfig';
import { Subject } from 'rxjs/Subject';
import { RuntimeConfigService } from './runtime-config-service';
@Injectable()
export class SignalrPointService {
    private subjectReal = new Subject<CoursePointModel>();
    public obRealNodes;
    private connection;

    private subjectMaster = new Subject<string[]>();
    private subjectSlave = new Subject<string>();
    public obMasterNodes;
    public obSlaveNodes;
    constructor(private runConfig: RuntimeConfigService) {
        this.obRealNodes = this.subjectReal.asObservable();
        this.obMasterNodes = this.subjectMaster.asObservable();
        this.obSlaveNodes = this.subjectSlave.asObservable();
        this.initSignalR();
    }
    initSignalR() {
        const courseId = encodeURIComponent(this.runConfig.courseId);
        abp.signalr.startConnection(`${CourseConfig.signalRRootUrl}/hubs-coursePointHub?groupId=${courseId}`, (connection) => {
            this.connection = connection;
            connection.on('onGetConvertLog', (node) => { // Register for incoming messages
                console.log('[received log]= ' + JSON.stringify(node));
                this.subjectReal.next(new CoursePointModel(node.fileId, node.message, node.total, node.success, node.progress));
            });
            connection.on('onGetPlayImage', (url) => { // Register for incoming messages
                console.log('[received imageUrl]= ' + url);
                this.subjectSlave.next(url);
            });
        }).then(function (connection) {
            console.log('Connected to coursePointHub server!');
        });
    }
    shareImage(url: string, callback) {
        this.connection.invoke('PlayImage', url).then(d => {
            callback();
        });
    }
    pushImages(arr: string[]) {
        this.subjectMaster.next(arr);
    }
    convertFile(path: string, callback) {
        this.connection.invoke('Convert', path).then(d => {
            callback();
        }).catch(err => console.error);
    }
}

export class CoursePointModel {

    constructor(public fileId: string,
        public message: string,
        public total: number,
        public success: boolean,
        public progress: number) {

    }
}



