import { Component } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';
import { Book } from 'src/app/interface/book';
import { BookService } from 'src/app/service/book.service';
import { ErrorService } from 'src/app/service/error.service';

@Component({
  selector: 'app-add-book',
  templateUrl: './add-book.component.html',
  styleUrls: ['./add-book.component.scss'],
})
export class AddBookComponent {
  bookForm!: FormGroup;
  public submittedData!: Book;
  public url: string = '';
  categories: string[] = [
    'Fiction',
    'Non-fiction',
    'Sci-Fi',
    'Fantasy',
    'Mystery',
    'novel',
  ];

  constructor(
    private fb: FormBuilder,
    private bookService: BookService,
    private router: Router,
    private errorService: ErrorService
  ) {
    this.createForm();
  }

  ngOnInit(): void {
    this.createForm();
  }

  createForm(): void {
    this.bookForm = new FormGroup({
      title: new FormControl([], Validators.required),
      author: new FormControl([], Validators.required),
      description: new FormControl([], Validators.required),
      price: new FormControl([], [Validators.required, Validators.min(0)]),
      category: new FormControl([], Validators.required),
      file: new FormControl([], Validators.required),
    });
  }

  public onFileInput(event: any) {
    const files: FileList = event.target.files;

    if (files.length === 0) {
      this.url = '';
      return;
    }

    const file: File = files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      this.url = reader.result as string;
      console.log('heheh');
    };
  }

  onSubmit(): void {
    const submittedData = this.bookForm.value;
    submittedData.file = this.url;

    if (this.bookForm.valid) {
      const newBook: Book = this.bookForm.value;
      this.bookService.addBook(newBook).subscribe(
        () => {
          alert('Book Added Successfully');
          this.bookForm.reset();
          this.router.navigate(['/book']);
        },
        (error: string) => {
          alert(this.errorService.emitError('Failed to add book: ' + error));
        }
      );
    } else {
      this.bookForm.markAllAsTouched();
    }
  }
}
