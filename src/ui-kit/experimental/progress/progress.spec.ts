import { ProgressComponent, ProgressIndicatorType } from "./progress.component";

describe('The SAM Progress Bar Component', () => {
  let component: ProgressComponent;
  
  beforeEach(() => {
    const component = new ProgressComponent();
    component.min = 0;
    component.max = 100;
    component.label = 'Loading...'
    component.type = ProgressIndicatorType.Percent;
  });

  it('should calculate percent string as percent of max', () => {
    component.value = -10;
    expect(component.calculateWidth()).toBe('0%');

    component.value = 1;
    expect(component.calculateWidth()).toBe('1%');

    component.value = 100;
    expect(component.calculateWidth()).toBe('100%');
  })
});
