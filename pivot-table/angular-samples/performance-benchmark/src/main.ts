import 'zone.js';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { PerformanceAppModule } from './app/performance.module';

platformBrowserDynamic().bootstrapModule(PerformanceAppModule).catch((err) => console.error(err));
