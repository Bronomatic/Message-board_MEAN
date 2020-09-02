import { AbstractControl } from '@angular/forms';
import { Observable, Observer, of } from 'rxjs';

export const mimeType = (control: AbstractControl):
Promise<{[key: string]: any}> | Observable<{[key: string]: any}> => {
  // * If value is a string
  if (typeof(control.value) === 'string') {
    // * return promise with null value
    return of(null);
  }
  const file = control.value as File;
  const fileReader = new FileReader();
  // * Create observable.
  const frObs = Observable.create((observer: Observer<{[key: string]: any}>) => {
    // * Add listener to fire when loading is finished.
    fileReader.addEventListener('loadend', () => {
      // * Create new array of 8bit unsigned integers.
      // Used to find patterns in the data to confirm mime-type.
      const arr = new Uint8Array(fileReader.result as ArrayBuffer).subarray(0, 4);
      let header = '';
      let isValid = false;
      for (let i = 0; i < arr.length; i++) {
        // * Build a string of hexadecimal values.
        header += arr[i].toString(16);
      }
      switch (header) {
        case '89504e47': // * PNG
          isValid = true;
          break;
        case 'ffd8ffe0': // * Jpg
        case 'ffd8ffe1':
        case 'ffd8ffe2':
        case 'ffd8ffe3':
        case 'ffd8ffe8':
          isValid = true;
          break;
        default:
          isValid = false; // Or you can use the blob.type as fallback
          break;
      }
      if (isValid) {
        // * Validation success
        observer.next(null);
      } else {
        // * Validation failure
        observer.next({invalidMimeType: true});
      }
      observer.complete();
    });
    fileReader.readAsArrayBuffer(file);
  });
  return frObs;
};
