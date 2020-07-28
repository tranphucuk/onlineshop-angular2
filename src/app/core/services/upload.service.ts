import { Injectable } from '@angular/core';
import { DataService } from '../services/data.service';
import { urlConstants } from '../services/common/url.constant';
import { UtilityService } from '../services/utility.service'

@Injectable({
  providedIn: 'root'
})
export class UploadService {
  public responseData: any;
  constructor(private dataSer: DataService, private utilitySer: UtilityService) { }

  postWithFile(url: string, postData: any, files: File[]) {
    let formData: FormData = new FormData();
    formData.append('files', files[0], files[0].name);
    if (postData !== '' && postData !== undefined && postData !== null) {
      for (let property in postData) {
        if (postData.hasOwnProperty(postData)) {
          formData.append(property, postData[property]);
        }
      }
    }

    var returnRes = new Promise((resolve, reject) => {
      this.dataSer.postFile(url, formData).subscribe(res => {
        this.responseData = res;
        resolve(this.responseData);
      }, error => this.dataSer.handleError(error));
    })
    return returnRes;
  }
}

