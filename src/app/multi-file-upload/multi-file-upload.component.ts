import { Component } from '@angular/core';
import { HttpEvent, HttpEventType } from '@angular/common/http';
import { Observable, Subject, map, takeUntil } from 'rxjs';
import { FileUploadService } from 'src/app/services/file-upload.service';

@Component({
  selector: 'app-multi-file-upload',
  templateUrl: './multi-file-upload.component.html',
  styleUrls: ['./multi-file-upload.component.scss']
})
export class MultiFileUploadComponent {

  uploadedMedia: Array<any> = [];
  selectedFiles: any

  constructor(private fileUploadService: FileUploadService) { }

  onFileBrowse(event: Event) {
    const target = event.target as HTMLInputElement;
    this.selectedFiles = target.files
    this.processFiles(target.files);
  }

  processFiles(files: any) {
    for (const file of files) {
      this.uploadedMedia.push({
        'FileName': file.name,
        'FileType': file.type,
        'FileProgessSize': 0,
        'FileProgress': 0,
        'ngUnsubscribe': new Subject<any>(),
      });

      this.takeFunction(file, this.uploadedMedia[this.uploadedMedia.length - 1])
    }
  }


  async startProgress(file: any, uploadedMedia: any) {

    if (uploadedMedia != null) {
      this.uploadMedia()
        .pipe(takeUntil(uploadedMedia.ngUnsubscribe))
        .subscribe({
          next: (res: any) => {
            if (res) {
              if (res.status === 'progress') {
                let completedPercentage = parseFloat(res.message);
                uploadedMedia.FileProgessSize = completedPercentage
                uploadedMedia.FileProgress = completedPercentage;
              } else if (res.status === 'completed') {
                uploadedMedia.Id = res.Id;
                uploadedMedia.FileProgessSize = file.size;
                uploadedMedia.FileProgress = 100;
              }
            }
          },
          error: err => console.error('file upload error :', err),
          complete: () => console.log('There are no more files to upload.')
        });
    }
  }


  uploadMedia(): Observable<any> {
    return this.fileUploadService.uploadMultiFiles("/upload/media", this.selectedFiles)
      .pipe(
        map((event: HttpEvent<any>) => {
          switch (event.type) {
            case HttpEventType.UploadProgress:
              let progress = 0;
              if (event.total) progress = Math.round((100 * event.loaded) / event?.total);
              return { 'status': 'progress', 'message': progress };

            case HttpEventType.Response:
              return event.body;

            default:
              return `Unhandled event: ${event.type}`;
          }
        })
      );
  }

  removeImage(idx: number) {
    this.uploadedMedia[idx].ngUnsubscribe.next(true)
    this.uploadedMedia[idx].ngUnsubscribe.complete()
    this.uploadedMedia = this.uploadedMedia.filter((u, index) => index !== idx);
  }


  takeFunction(file: any, uploadedMedia: any): void {
    this.fileUploadService.uploadMultiFiles("/upload/media", this.selectedFiles)
      .pipe(
        map((event: HttpEvent<any>) => {
          switch (event.type) {
            case HttpEventType.UploadProgress:
              let progress = 0;
              if (event.total) progress = Math.round((100 * event.loaded) / event?.total);
              return { 'status': 'progress', 'message': progress };

            case HttpEventType.Response:
              return event.body;

            default:
              return `Unhandled event: ${event.type}`;
          }
        })
      ).pipe(takeUntil(uploadedMedia.ngUnsubscribe)).subscribe({
        next: (res: any) => {
          if (res) {
            if (res.status === 'progress') {
              let completedPercentage = parseFloat(res.message);
              uploadedMedia.FileProgessSize = completedPercentage
              uploadedMedia.FileProgress = completedPercentage;
            } else if (res.status === 'completed') {
              uploadedMedia.Id = res.Id;
              uploadedMedia.FileProgessSize = file.size;
              uploadedMedia.FileProgress = 100;
            }
          }
        },
        error: err => console.error('file upload error :', err),
        complete: () => console.log('There are no more files to upload.')
      });
  }
}
