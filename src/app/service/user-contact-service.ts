import { Injectable, Inject } from '@angular/core';
import { CourseConfig } from '../../shard/CourseConfig';
import { Subject } from 'rxjs/Subject';
import { RuntimeConfigService } from './runtime-config-service';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class UserContactService {

    private subjectReal = new Subject<UserModel[]>();
    public obUserNodes;
    private userMap = new Map<number, UserModel>();
    constructor(private runConfig: RuntimeConfigService, private httpClient: HttpClient) {
        this.obUserNodes = this.subjectReal.asObservable();
        this.initData();
    }
    initData() {
        let url = `${CourseConfig.CourseRootUrl}/api/services/app/UserRelationService/GetUserRelations?userId=${this.runConfig.userId}`;
        url += '&courseId=Peer-Peer';
        this.httpClient.get<any>(url).subscribe(data => {
            if (data.success) {
                const nodes = [];
                data.result.items.forEach(item => {
                    const model = new UserModel(item.userIndex, item.userName, item.bio, item.imageUrlMedium, item.imageUrlFull, item.country, item.isOnline);
                    nodes.push(model);
                    if (!this.userMap.has(model.userId)) {
                        this.userMap.set(model.userId, model);
                    } else {
                        this.userMap.get(model.userId).isOnline = model.isOnline;
                    }
                });
                this.subjectReal.next(nodes);
            }
        });

    }
    public getUserSelfInfo(callBack) {
        const find = this.getUserInfoFromCache(this.runConfig.userId);
        if (find) {
            callBack(find);
        } else {
            this.getUserInfoFromHttp(this.runConfig.userId, (model) => {
                this.userMap.set(this.runConfig.userId, model);
                callBack(model);
            });
        }


    }
    public getUserInfoFromHttp(userId: number, callBack) {
        const url = `${CourseConfig.CourseRootUrl}/api/services/app/AuthEdxUserService/GetUserById?userId=${userId}`;
        this.httpClient.get<any>(url).subscribe(data => {
            if (data.success) {
                const model = new UserModel(data.result.userIndex, data.result.userName, data.result.bio,
                    data.result.imageUrlMedium, data.result.imageUrlFull, data.result.country, data.result.isOnline);
                this.userMap.set(model.userId, model);
                if (callBack) {
                    callBack(model);
                }
            }
        });
    }
    public getUserInfoFromCache(userId: number): UserModel {
        if (this.userMap.has(userId)) {
            return this.userMap.get(userId);
        }
        return null;
    }
}
export class UserModel {
    constructor(public userId: number, public userName: string, public bio: string,
        public imageUrlMedium: string, public imageUrlFull: string, public country: string, public isOnline: boolean) {

    }
}
