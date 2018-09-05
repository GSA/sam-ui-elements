import { FilesizePipe } from './filesize.pipe';

describe('src/app/opportunity/pipes/filesize.pipe.spec.ts', () => {
  let pipe = new FilesizePipe();

  it('FilesizePipe: adds the proper symbol', () => {
    expect(pipe.transform(1024)).toBe('1 KB');
    expect(pipe.transform(1048576)).toBe('1 MB');
    expect(pipe.transform(1073741824)).toBe('1 GB');
    expect(pipe.transform(1099511627776)).toBe('1 TB');
  });

  // Any size under 1 KB should show as <1 KB
  it('FilesizePipe: shows <1 KB if under 1 KB', () => {
    expect(pipe.transform(-100)).toBe('<1 KB'); //negative and 0 filesizes included
    expect(pipe.transform(0)).toBe('<1 KB');
    expect(pipe.transform(1)).toBe('<1 KB');
    expect(pipe.transform(387)).toBe('<1 KB');
    expect(pipe.transform(501)).toBe('<1 KB');
    expect(pipe.transform(1023.9)).toBe('<1 KB'); //filesizes <1 KB should never get rounded up to 1 KB
  });

  it('FilesizePipe: rounds correctly', () => {
    const kb = 1024;
    const mb = 1048576;
    expect(pipe.transform(1.5 * kb - 1)).toBe('1 KB');
    expect(pipe.transform(1.5 * kb + 1)).toBe('2 KB');
    expect(pipe.transform(5.5 * mb - 1)).toBe('5 MB');
  });
});
