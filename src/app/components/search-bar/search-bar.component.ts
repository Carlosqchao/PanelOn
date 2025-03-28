import { Component, EventEmitter, Output } from '@angular/core';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-search-bar',
  imports: [
    FormsModule,
  ],
  templateUrl: './search-bar.component.html',
  styleUrl: './search-bar.component.scss'
})
export class SearchBarComponent {
  searchQuery: string = '';

  @Output() search = new EventEmitter<string>();
  @Output() filter = new EventEmitter<void>();

  onSearch() {
    this.search.emit(this.searchQuery);
  }

  onFilterClick() {
    this.filter.emit();
  }
}
