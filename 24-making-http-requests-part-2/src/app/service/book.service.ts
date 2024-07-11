import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Book } from '../interface/book';
import { Observable, catchError, map, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BookService {
  private url: string =
    'https://social-media-post-1b69d-default-rtdb.firebaseio.com/books.json';

  constructor(private httpClient: HttpClient) {}

  public addBook(post: Book): any {
    const headers = new HttpHeaders({
      'book-header': 'Niksha',
    });
    // const headers=new HttpHeaders().set()
    return this.httpClient.post(this.url, post, {
      headers,
      params: new HttpParams().set('service', 'book'),
      observe: 'response',
    });
  }

  public getBooks(
    title?: string,
    category?: string,
    price?: string
  ): Observable<Book[]> {
    let params = new HttpParams();

    // Set title parameter if provided
    if (title) {
      params = params.set('title', title);
    }

    // Set category parameter if provided
    if (category) {
      params = params.set('category', category);
    }

    const headers = new HttpHeaders({
      'book-header': 'Niksha',
    });

    return this.httpClient
      .get<{ [key: string]: Book }>(this.url, { headers, params })
      .pipe(
        map((res) => {
          let books: Book[] = [];
          for (let key in res) {
            // Filter books based on title if provided
            if (!category || res[key].category === category) {
              books.push({ ...res[key], key });
            }
          }
          return books;
        }),
        catchError((error) => throwError(error))
      );
  }
}
