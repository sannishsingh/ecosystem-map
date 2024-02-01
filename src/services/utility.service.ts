import { Injectable } from '@angular/core';
import createHmac from 'create-hmac';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UtilityService {

  constructor() { }

  getGlueUpApiHeaderValue(method: string): string {
    const { apiVersion, privateKey, apiAccount } = environment.glueUpApiConfig;
    const timeStamp = new Date().getTime();
    const message = `${this.stringToUpperCase(method)}${apiAccount}${apiVersion}${timeStamp}`;
    const digest = createHmac('sha256', privateKey).update(message).digest('hex');
    const a = `d=${digest};v=${apiVersion};k=${apiAccount};ts=${timeStamp}`;
    return a;
  }

  stringToUpperCase(str: string): string {
    return str.toUpperCase();
  }

  getWidthOfDivInGivenAngle(heightOfDiv: number, angle: number): number {
    if (angle > 45) {
      return 0;
    }
    return Math.floor(heightOfDiv * Math.tan(angle * Math.PI / 180));
  }
  getWidthInAngle(radius: number, angle: number) {
    return Math.floor((angle / 360) * (2 * Math.PI * radius));
  }

  getNumberOfLogoFitsInAFixedWidth(divWidth: number, itemWidth: number): number {
    return Math.floor(divWidth / itemWidth);
  }

  getRadian(angle: number) {
    return angle * (Math.PI / 180);
  }

  shiftArrayClockwise(arr: any) {
    const lastElement = arr[arr.length - 1];
    for (let i = arr.length - 1; i > 0; i--) {
      arr[i] = arr[i - 1];
    }
    arr[0] = lastElement;
  }

  startInterval(intervalId: any, categories: any): any {
    intervalId = setInterval(() => {
      this.shiftArrayClockwise(categories);
    }, 1000);
    return intervalId;
  }

  pauseInterval(intervalId: any) {
    clearInterval(intervalId);
  }

  resumeInterval(intervalId: any, categories: any) {
    clearInterval(intervalId);
    return this.startInterval(intervalId, categories);
  }

  getFirstLetterString(value: string) {
    return Array.from(value)[0];
  }
}
