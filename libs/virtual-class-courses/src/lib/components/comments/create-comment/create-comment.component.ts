import { Component, Input, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from "@angular/forms";
import { CommentsService } from "@virtual-class-frontend/virtual-class-store";

@Component({
  selector: 'virtual-class-frontend-create-comment',
  templateUrl: './create-comment.component.html',
  styleUrls: ['./create-comment.component.scss'],
})
export class CreateCommentComponent  implements OnInit {
  @Input() lecture = '';
  form!: UntypedFormGroup;

  constructor(
    private readonly fb: UntypedFormBuilder,
    private readonly commentsService: CommentsService,
  ) {
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      comment: ['', [Validators.required]],
    });
  }

  onSubmit() {
    console.error('onSubmit');
    if (this.form.valid) {
      console.error('this.form.value');

      this.commentsService.add({...this.form.value, lecture: this.lecture});
    } else {
      console.error('not valid')
    }
  }
}
