import { Component, forwardRef, Renderer2, OnInit, OnDestroy } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { QuillModules, ContentChange } from 'ngx-quill';
import { Subscription } from 'rxjs';
import {ThemeService} from "../../services/theme/theme.service";

@Component({
  selector: 'app-richTextEditor',
  templateUrl: './richTextEditor.component.html',
  styleUrls: ['./richTextEditor.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => RichTextEditorComponent),
      multi: true
    }
  ],
})
export class RichTextEditorComponent implements ControlValueAccessor, OnInit, OnDestroy {
  editorContent: string = '';
  editorConfig: QuillModules = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],
      ['blockquote', 'code-block'],
      [{ 'header': 1 }, { 'header': 2 }],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      [{ 'script': 'sub' }, { 'script': 'super' }],
      [{ 'indent': '-1' }, { 'indent': '+1' }],
      [{ 'direction': 'rtl' }],
      [{ 'size': ['small', false, 'large', 'huge'] }],
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'font': [] }],
      [{ 'align': [] }],
      ['clean'],
      ['link', 'image', 'video']
    ]
  };

  private themeSubscription?: Subscription;

  onChange: any = () => {};
  onTouched: any = () => {};

  constructor(protected themeService: ThemeService, private renderer: Renderer2) {}

  ngOnInit(): void {
    this.themeSubscription = this.themeService.getColorThemeObservable().subscribe(theme => {
      this.updateEditorTheme(theme);
    });
    this.updateEditorTheme(this.themeService.getColorTheme());
  }

  ngOnDestroy(): void {
    if (this.themeSubscription) {
      this.themeSubscription.unsubscribe();
    }
  }

  writeValue(value: any): void {
    this.editorContent = value || '';
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    // Handle disabled state if necessary
  }

  private updateEditorTheme(theme: string) {
    const quillEditor = document.querySelector('quill-editor');
    if (theme === 'dark-theme') {
      this.renderer.addClass(quillEditor, 'dark-theme');
      this.renderer.removeClass(quillEditor, 'light-theme');
    } else {
      this.renderer.addClass(quillEditor, 'light-theme');
      this.renderer.removeClass(quillEditor, 'dark-theme');
    }
  }
}
