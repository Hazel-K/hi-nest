import { Test, TestingModule } from '@nestjs/testing';
import { MoviesService } from './movies.service';
import { Logger, NotFoundException } from '@nestjs/common';
import exp from 'constants';

describe('MoviesService', () => {
  let service: MoviesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MoviesService],
    }).compile();

    service = module.get<MoviesService>(MoviesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAll', () => {
    it('should return an array.', () => {
      const result = service.getAll();
      expect(result).toBeInstanceOf(Array);
    });
  });

  describe('getOne', () => {
    it('should return a movie.', () => {
      service.create({
        title: 'Test mv',
        genres: ['test'],
        year: 2000,
      });

      const result = service.getOne(1);
      expect(result).toBeDefined();
      expect(result.id).toEqual(1);
    });

    it("should throw 404 error", () => {
      const errNum: number = 999;

      try{
        service.getOne(errNum);
      } catch(e) {
        expect(e).toBeInstanceOf(NotFoundException);
        expect(e.message).toEqual(`Movie with ID ${errNum} not found.`);
      }
    });
  });

  describe('deleteOne', () => {
    it('deletes a movie', () => {
      service.create({
        title: 'Test mv',
        genres: ['test'],
        year: 2000,
      });

      const beforeDelete = service.getAll().length;
      service.deleteOne(1);
      const afterDelete = service.getAll().length;

      expect(afterDelete).toBeLessThan(beforeDelete);
    });

    it("should throw 404 error", () => {
      const errNum: number = 999;

      try{
        service.deleteOne(errNum);
      } catch(e) {
        expect(e).toBeInstanceOf(NotFoundException);
        expect(e.message).toEqual(`Movie with ID ${errNum} not found.`);
      }
    });
  });

  describe('create', () => {
    it('should create a movie', () => {
      const beforeCreate = service.getAll().length;
      service.create({
        title: 'Test mv',
        genres: ['test'],
        year: 2000,
      });

      const afterCreate = service.getAll().length;
      expect(afterCreate).toBeGreaterThan(beforeCreate);
    });
  });

  describe('update', () => {
    it('should update a movie', () => {
      service.create({
        title: 'Test mv',
        genres: ['test'],
        year: 2000,
      });

      service.update(1, {title: 'update',});

      const movie = service.getOne(1);
      expect(movie.title).toEqual('update');
    });

    it("should throw 404 error", () => {
      const errNum: number = 999;

      try{
        service.update(errNum, {});
      } catch(e) {
        expect(e).toBeInstanceOf(NotFoundException);
        expect(e.message).toEqual(`Movie with ID ${errNum} not found.`);
      }
    });
  });
});
