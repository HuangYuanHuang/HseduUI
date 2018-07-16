import { Injectable, Inject } from '@angular/core';
import { CourseConfig } from '../../shard/CourseConfig';
import { Subject } from 'rxjs/Subject';
@Injectable()
export class AgoraServiceService {
  private client: any;
  private localStream: any;
  private readonly TeachStreamPre = 88888888;
  private PeerStreamPre = 6666666;
  public localVideo: AgoraVideoNode;
  public subjectVideo = new Subject<SubjectVideo>();

  public changeVideOb;
  constructor() {
    this.changeVideOb = this.subjectVideo.asObservable();
  }

  agoraInit(userId: any, courseId: string, audio: boolean, video: boolean, is_teacher: boolean, is_peer: boolean) {
    let stream = userId;
    if (is_teacher) {
      stream = this.TeachStreamPre + userId;
    } else if (is_peer) {
      stream = this.PeerStreamPre + userId;
    }
    this.client = AgoraRTC.createClient({ mode: 'interop' });
    this.client.init(CourseConfig.AgoraId, () => {
      this.client.join(null, courseId, stream, (uid) => {
        console.log('User ' + uid + ' join channel successfully');
        this.localStream = AgoraRTC.createStream({ streamID: uid, audio: audio, video: video, screen: false });
        this.localStream.setVideoProfile('240P');
        this.localStream.init(() => {
          console.log('localStram init');
          const videoNode = new AgoraVideoNode(this.localStream);
          this.localVideo = videoNode;
          this.subjectVideo.next(new SubjectVideo(videoNode, AgoraEnum.Connect, is_teacher, true, is_peer));
          this.client.publish(this.localStream, (err) => console.log(err));
        });

      });
    });
    this.agoraEventInit();
  }
  agoraEventInit() {
    this.client.on('stream-published', (d) => console.log('Publish local stream successfully'));
    this.client.on('stream-added', (evt) => {
      const stream = evt.stream;
      console.log('New stream added: ' + stream.getId());
      this.client.subscribe(stream, function (err) {
        console.log('Subscribe stream failed', err);
      });
    });

    this.client.on('stream-removed', (evt) => this.streamRemove(evt));
    this.client.on('peer-leave', (evt) => this.streamRemove(evt));
    this.client.on('stream-subscribed', (evt) => {
      const stream = evt.stream;
      console.log('Subscribe remote stream successfully: ' + stream.getId());
      if (stream.getId() === this.localStream.getId()) {
        return;
      }
      const videoNode = new AgoraVideoNode(stream);
      const isTeacher = stream.getId() >= this.TeachStreamPre;
      let isPeer = false;
      if (!isTeacher && stream.getId() >= this.PeerStreamPre) {
        isPeer = true;
      }
      this.subjectVideo.next(new SubjectVideo(videoNode, AgoraEnum.Connect, isTeacher, false, isPeer));
    });

  }

  private streamRemove(evt) {
    const stream = evt.stream;

    stream.stop();
    const videoNode = new AgoraVideoNode(stream);
    const isTeacher = stream.getId() >= this.TeachStreamPre;
    const isLocal = stream.getId() === this.localStream.getId();
    let isPeer = false;
    if (!isTeacher && stream.getId() >= this.PeerStreamPre) {
      isPeer = true;
    }
    this.subjectVideo.next(new SubjectVideo(videoNode, AgoraEnum.DisConnect, isTeacher, isLocal, isPeer));
    console.log('Remote stream is removed ' + stream.getId());


  }
}

export class AgoraVideoNode {
  public userDetail: any;
  public isPlayVideo = true;
  public isPlayAudio = true;
  public videoBtnClass = 'btn-primary';
  public audioBtnClass = 'btn-primary';
  public videoIonClass = 'fa-video';
  public audioIonClass = 'fa-microphone';
  constructor(public stream: any) {

  }

  getStreamId() {
    return this.stream.getId();
  }

  playVideo() {
    this.isPlayVideo = !this.isPlayVideo;
    if (this.isPlayVideo) {
      this.stream.enableVideo();
      this.videoBtnClass = 'btn-primary';
      this.videoIonClass = 'fa-video';
    } else {
      this.stream.disableVideo();
      this.videoBtnClass = 'btn-danger';
      this.videoIonClass = 'fa-video-slash';
    }
  }
  playAudio() {
    this.isPlayAudio = !this.isPlayAudio;
    if (this.isPlayAudio) {
      this.stream.enableAudio();
      this.audioBtnClass = 'btn-primary';
      this.audioIonClass = 'fa-microphone';
    } else {
      this.audioBtnClass = 'btn-danger';
      this.audioIonClass = 'fa-microphone-slash';
      this.stream.disableAudio();
    }
  }

  play() {
    console.log('stream is play');
    setTimeout(() => {
      this.stream.play(this.getStreamId());
    }, 2000);
  }
  stop() {
    console.log('stream is stop');
    this.stream.stop();
    this.stream.close();
  }
}

export class SubjectVideo {
  constructor(public videNode: AgoraVideoNode, public aogra: AgoraEnum,
    public is_teacher: boolean, public is_local: boolean, public is_peer: boolean) { }
}

export enum AgoraEnum {
  Connect,
  DisConnect
}
