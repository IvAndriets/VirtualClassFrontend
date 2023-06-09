import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { map, Observable } from "rxjs";
import { Pagination, RouterStateService, Status } from "@virtual-class-frontend/virtual-class-core";
import { CoursesService } from "@virtual-class-frontend/virtual-class-store";
import { Course, UserStateService } from "@virtual-class-frontend/virtual-class-web-api-v1";
import { Store } from "@ngrx/store";
import { AuthService } from "@virtual-class-frontend/virtual-class-auth";

@Component({
  selector: 'virtual-class-frontend-courses-list',
  templateUrl: './courses-list.component.html',
  styleUrls: ['./courses-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class CoursesListComponent implements OnInit {
  pagination$!: Observable<Pagination>;
  paginationLimit = 8;
  paginationLimits = [8, 16, 32, 50];

  search$!: Observable<string | null>;
  coursesList$!: Observable<Course[]>;
  userRole$!: Observable<string[] | null>;

  constructor(
    private readonly coursesService: CoursesService,
    private readonly routerState: RouterStateService,
    private readonly userService: UserStateService,
  ){
  }

  ngOnInit(): void {
    this.coursesService.getWithQuery({});
    this.coursesList$ = this.coursesService.entities$;
    this.userRole$ = this.userService.getRoles$();
    // this.status$ = this.coursesService.status$;
    //
    // this.pagination$ = this.getPagination();
  }

  // private getPagination(): Observable<Pagination> {
  //
  //   return this.routerState.getQueryParams$().pipe(
  //     map(queryParams => {
  //       const offset = +(queryParams.offset ?? 0);
  //       const limit = +(queryParams.limit ?? this.paginationLimit);
  //
  //       return {
  //         index: offset / limit,
  //         offset,
  //         limit,
  //       };
  //     }));
  // }
}
