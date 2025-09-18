import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Editor, NgxEditorModule } from 'ngx-editor';

@Component({
  selector: 'app-add-post',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    NgxEditorModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './add-post.component.html',
  styleUrl: './add-post.component.scss',
})
export class AddPostComponent implements OnInit, OnDestroy {
  editor!: Editor;
  fb = inject(FormBuilder);
  form!: FormGroup;

  ngOnInit(): void {
    this.editor = new Editor();
    this.form = this.fb.group({
      title: [''],
      content: [''],
      tags: [''],
    });
  }

  savePost() {
    console.log(this.form.value);
  }

  ngOnDestroy(): void {
    this.editor.destroy();
  }
}
