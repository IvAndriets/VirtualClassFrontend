import { Injectable } from '@angular/core';
import { EntityCollectionServiceElementsFactory } from '@ngrx/data';
import { BaseEntityCollectionService } from "@virtual-class-frontend/virtual-class-core";
import { Course } from "@virtual-class-frontend/virtual-class-web-api-v1";

@Injectable({ providedIn: 'root' })
export class CoursesService extends BaseEntityCollectionService<Course> {

  constructor(serviceElementsFactory: EntityCollectionServiceElementsFactory) {
    super('Courses', serviceElementsFactory);
  }

}
