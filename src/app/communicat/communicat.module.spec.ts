import { CommunicatModule } from './communicat.module';

describe('CommunicatModule', () => {
  let communicatModule: CommunicatModule;

  beforeEach(() => {
    communicatModule = new CommunicatModule();
  });

  it('should create an instance', () => {
    expect(communicatModule).toBeTruthy();
  });
});
