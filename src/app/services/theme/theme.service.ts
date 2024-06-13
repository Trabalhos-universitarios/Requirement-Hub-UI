import {Injectable, Renderer2, RendererFactory2} from '@angular/core';
import {BehaviorSubject, Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  private renderer: Renderer2;
  private colorTheme: string = 'light-theme';
  private themeSubject: BehaviorSubject<string> = new BehaviorSubject(this.colorTheme);

  constructor(rendererFactory: RendererFactory2) {
    this.renderer = rendererFactory.createRenderer(null, null);
  }

  initTheme() {
    this.getColorTheme();
    this.renderer.addClass(document.body, this.colorTheme);
    this.themeSubject.next(this.colorTheme);
  }

  update(theme: 'dark-theme' | 'light-theme') {
    this.setColorTheme(theme);
    const previousColorTheme = (theme === 'dark-theme' ? 'light-theme' : 'dark-theme');
    this.renderer.removeClass(document.body, previousColorTheme);
    this.renderer.addClass(document.body, theme);
    this.themeSubject.next(theme);
  }

  isDarkMode() {
    return this.colorTheme === 'dark-theme';
  }

  private setColorTheme(theme: string) {
    this.colorTheme = theme;
    localStorage.setItem('user-theme', theme);
  }

  getColorTheme(): string {
    const theme = localStorage.getItem('user-theme');
    if (theme) {
      this.colorTheme = theme;
    } else {
      this.colorTheme = 'light-theme'; // ou 'dark-theme', dependendo do seu tema padrão
      localStorage.setItem('user-theme', this.colorTheme);
    }
    this.themeSubject.next(this.colorTheme);
    return this.colorTheme; // Adiciona a linha para retornar a string
  }

  getColorThemeObservable(): Observable<string> {
    return this.themeSubject.asObservable();
  }
}
