import { Component } from '@angular/core';
import {HeaderComponent} from "../../components/header/header.component";
import {FooterComponent} from '../../components/footer/footer.component';
import {SearchBarComponent} from '../../components/search-bar/search-bar.component';

@Component({
  selector: 'app-search-page',
  imports: [
    HeaderComponent,
    FooterComponent,
    SearchBarComponent
  ],
  templateUrl: './search-page.component.html',
  styleUrl: './search-page.component.scss'
})
export class SearchPageComponent {
  handleSearch(query: string) {
    console.log('Search query:', query);
  }

  handleFilter() {
    console.log('Filter clicked');
  }
}
