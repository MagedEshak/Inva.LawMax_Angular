import { Component, AfterViewInit } from '@angular/core';
import * as AOS from 'aos'; // استيراد مكتبة AOS

@Component({
  standalone: false,
  selector: 'app-root',
  template: `
    <abp-loader-bar></abp-loader-bar>
    <abp-dynamic-layout></abp-dynamic-layout>
  `,
})
export class AppComponent implements AfterViewInit {
  ngAfterViewInit(): void {
    AOS.init({
      duration: 1000, // مدة الأنيميشن
      once: true, // يعمل مرة واحدة فقط
    });
    AOS.refresh();
  }
}
