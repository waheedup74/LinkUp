import { TestBed } from '@angular/core/testing';
import { UsersService } from './users.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { USERS } from '../models/users';

describe('UsersService', () => {
  let service: UsersService;
  let httpTestController: HttpTestingController;

  beforeEach(() => {
    // const commService = jasmine.createSpyObj('CommunicatorService', ['emitNormalSubject']); 

    TestBed.configureTestingModule({
      providers: [UsersService, {
       
      }],

      imports: [HttpClientTestingModule]
    });

    service = TestBed.inject(UsersService);
    httpTestController = TestBed.inject(HttpTestingController);
  });

  it('should call service function', () => {
    // spyOn(commService, 'emitNormalSubject').and.callThrough();
    const result = service.whatItSay('hello unit');
    expect(result).toBe('hello unit');
  });

  it('should get single user', () => {
    service.getUsers(1).subscribe(users => {
      expect(users).toBeTruthy();
      expect(users.id).toBe(1);
    });
    const mockReq = httpTestController.expectOne('https://dummyjson.com/users/1');
    expect(mockReq.request.method).toEqual('GET');
    mockReq.flush(USERS);
  });

  afterEach(() => {
    httpTestController.verify();
  });

});
