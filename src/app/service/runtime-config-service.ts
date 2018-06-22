import { Injectable, Inject } from '@angular/core';
import { URLSearchParams } from '@angular/http';
import { TranslateService } from '@ngx-translate/core';
@Injectable()
export class RuntimeConfigService {
    public courseId: string;
    public courseName: string;
    public userId: number;
    public userName: string;
    public language = 'en';
    public isTeacher = false;
    constructor(public translateService: TranslateService) {
        const params = new URLSearchParams(window.location.search.substring(1));
        this.courseId = decodeURIComponent(params.get('courseId') || 'course-v1:MIT+MIT045+2018_t6');
        this.language = params.get('language') || 'en';
        this.userName = params.get('userName') || 'UserName';
        this.courseName = decodeURIComponent(params.get('courseName') || 'Live Lecture');
        this.userId = parseInt(params.get('userId') || '7', 0);
        this.toString();
        if (this.language.indexOf('zh') !== -1) {
            this.translateService.use('zh');
        } else {
            this.translateService.use('en');
        }

    }

    private toString() {
        console.log(`courseId:${this.courseId},courseName:${this.courseName},userId:${this.userId},userName:${this.userName},language:${this.language}`);
    }
}
