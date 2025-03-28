import {Component, OnInit} from '@angular/core';
import {HeaderComponent} from "../../components/header/header.component";
import {FooterComponent} from '../../components/footer/footer.component';
import {SearchBarComponent} from '../../components/search-bar/search-bar.component';
import {ComicCardComponent} from "../../components/comic-card/comic-card.component";
import {NgForOf, SlicePipe} from "@angular/common";
import {takeUntil} from 'rxjs/operators';
import {AppService} from '../../app.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-search-page',
    imports: [
        HeaderComponent,
        FooterComponent,
        SearchBarComponent,
        ComicCardComponent,
        NgForOf,
        SlicePipe
    ],
  templateUrl: './search-page.component.html',
  styleUrl: './search-page.component.scss'
})
export class SearchPageComponent implements OnInit {
  handleSearch(query: string) {
    const containers = document.querySelectorAll<HTMLDivElement>("app-comic-card");
    console.log(containers[0]);
    containers.forEach(container => {
      // @ts-ignore
      if (container.textContent.toLowerCase().includes(query.toLowerCase()) || container.className.includes(query)) {
        container.style.display = "block";
      } else {
        container.style.display = "none";
      }
    });
  }

  handleFilter() {
    console.log('Filter clicked');
  }

  comics: any[] = [];
  constructor(private appService: AppService, private router: Router) {}

  ngOnInit(): void {
    this.appService.getComics().pipe(
    ).subscribe({
      next: (comics: any[]) => {
        this.comics = comics;
        console.log('Cómics cargados desde Firestore:');
      },
      error: (err: any) => {
        console.error('Error al cargar los cómics desde Firestore:', err);
      }
    });
  }
}
