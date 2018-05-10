import { Pipe, PipeTransform } from '@angular/core';

// Transforms a filesize in bytes to a human readable decimal filesize using SI prefixes
@Pipe({name: 'filesize'})
export class FilesizePipe implements PipeTransform {

  transform(size: number): string {
    if (typeof size !== 'number') {
      return '0';
    }

    const symbols = ['B', 'KB', 'MB', 'GB', 'TB'];
    const sizes = [1, 2 ** 10, 2 ** 20, 2 ** 30, 2 ** 40, 2 ** 50];

    let symbol = symbols[0];
    let base = sizes[0];

    if (size < sizes[1]) {
      return '<1 KB';
    } else if (size < sizes[2]) {
      symbol = symbols[1];
      base = sizes[1];
    } else if (size < sizes[3]) {
      symbol = symbols[2];
      base = sizes[2];
    } else if (size < sizes[4]) {
      symbol = symbols[3];
      base = sizes[3];
    } else if (size < sizes[5]) {
      symbol = symbols[4];
      base = sizes[4];
    } else {
      console.warn('file size symbol not supported');
    }

    const rounded = Math.round(size / base);
    return `${rounded} ${symbol}`;
  }
}

