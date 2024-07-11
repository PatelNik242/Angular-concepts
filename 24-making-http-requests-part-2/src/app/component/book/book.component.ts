import { Component, OnInit } from '@angular/core';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';
import { Book } from 'src/app/interface/book';
import { priceRange } from 'src/app/interface/price-range';
import { BookService } from 'src/app/service/book.service';
import { ErrorService } from 'src/app/service/error.service';

@Component({
  selector: 'app-book',
  templateUrl: './book.component.html',
  styleUrls: ['./book.component.scss'],
})
export class BookComponent implements OnInit {
  public books: Book[] = [];
  public errorMessage: string = '';
  public searchTitle: string = '';
  public selectedCategory: string = '';
  public filteredBooks: Book[] = [];
  public priceRange: { key: string; price: string }[] = priceRange;
  public selectedPriceRange: string = '';
  public searchTitleSubject = new Subject<string>();

  categories: string[] = [
    'Fiction',
    'Non-fiction',
    'Sci-Fi',
    'Fantasy',
    'Mystery',
    'Novel',
  ];

  constructor(
    private bookService: BookService,
    private errorService: ErrorService
  ) {}

  ngOnInit() {
    this.searchTitleSubject
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe((searchTitle) => {
        this.searchTitle = searchTitle;
        this.getBooks();
      });

    this.getBooks();
  }

  public getBooks() {
    this.bookService
      .getBooks(
        this.searchTitle,
        this.selectedCategory,
        this.selectedPriceRange
      )
      .subscribe(
        (res) => {
          this.books = res;
          this.filteredBooks = this.filterBooks();
        },
        (error) => {
          console.log('Error Fetching Book.');
          this.errorService.emitError(
            'Failed to fetch books\n ' + this.getErrorMessage(error)
          );
          alert('Failed Fetching Books');
        }
      );
  }

  private filterBooks(): Book[] {
    let filteredBooks = this.books;

    if (this.searchTitle) {
      filteredBooks = filteredBooks.filter((book) =>
        book.title.toLowerCase().includes(this.searchTitle.toLowerCase())
      );
      console.log('After title filter:', filteredBooks);
    }

    if (this.selectedCategory) {
      filteredBooks = filteredBooks.filter((book) =>
        book.category
          .toLowerCase()
          .includes(this.selectedCategory.toLowerCase())
      );
    }

    if (this.selectedPriceRange) {
      const range: { min: number; max: number } = this.getPriceRange(
        this.selectedPriceRange
      );
      filteredBooks = filteredBooks.filter(
        (book) => book.price >= range.min && book.price <= range.max
      );
    }

    return filteredBooks;
  }

  public getPriceRange(priceRange: string): { min: number; max: number } {
    switch (priceRange) {
      case 'first':
        return { min: 100, max: 500 };
      case 'second':
        return { min: 500, max: 1000 };
      case 'third':
        return { min: 1000, max: 1500 };
      case 'forth':
        return { min: 1500, max: 2000 };
      case 'final':
        return { min: 2000, max: Number.MAX_VALUE };
      default:
        return { min: 0, max: Number.MAX_VALUE };
    }
  }

  public getErrorMessage(error: any): string {
    if (error && error.error && error.error.message) {
      return error.error.message;
    } else if (error && error.message) {
      return error.message;
    } else {
      return 'An error occurred while fetching books.';
    }
  }

  toggleDescription(book: any): void {
    book.expanded = !book.expanded;
  }
}
