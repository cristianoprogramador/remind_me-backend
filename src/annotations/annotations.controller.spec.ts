import { Test, TestingModule } from '@nestjs/testing';
import { AnnotationsController } from './annotations.controller';

describe('AnnotationsController', () => {
  let controller: AnnotationsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AnnotationsController],
    }).compile();

    controller = module.get<AnnotationsController>(AnnotationsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
