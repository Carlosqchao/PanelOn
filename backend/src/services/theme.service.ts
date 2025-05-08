import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private renderer: Renderer2;
  private isDarkMode = false;

  constructor(rendererFactory: RendererFactory2) {
    this.renderer = rendererFactory.createRenderer(null, null);
  }

  toggleTheme(): void {
    this.isDarkMode = !this.isDarkMode;
    const themeClass = 'dark-theme';

    if (this.isDarkMode) {
      this.renderer.addClass(document.body, themeClass);
    } else {
      this.renderer.removeClass(document.body, themeClass);
    }
  }

  isDark(): boolean {
    return this.isDarkMode;
  }
}
