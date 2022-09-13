const INCOMPLETED_BOOK = "incompleteBookshelfList";
const COMPLETED_BOOK = "completeBookshelfList";
const BOOK_ITEMID = "bookId";
const STORAGE_KEY = "BOOKSHELF";

let books = [];
function addBook() {
  const incompletedBookList = document.getElementById(INCOMPLETED_BOOK);
  const completedBookList = document.getElementById(COMPLETED_BOOK);

  const book_title = document.getElementById("inputBookTitle").value;
  const book_author = document.getElementById("inputBookAuthor").value;
  const book_year = parseInt(document.getElementById("inputBookYear").value);
  const isCompleted = document.getElementById("inputBookIsComplete").checked;

  const book = makeBook(book_title, book_author, book_year, isCompleted);
  const bookObject = bookFill(book_title, book_author, book_year, isCompleted);

  book[BOOK_ITEMID] = bookObject.id;
  books.push(bookObject);
  if (isCompleted) {
    completedBookList.append(book);
  } else {
    incompletedBookList.append(book);
  }
  updateDataToStorage();
}

function makeBook(book_title, book_author, book_year, isCompleted) {
  const textTitle = document.createElement("h3");
  textTitle.classList.add("title");
  textTitle.innerText = book_title;

  const textAuthor = document.createElement("p");
  textAuthor.innerHTML = `Penulis : <span class="author">${book_author}</span>`;

  const textYear = document.createElement("p");
  textYear.innerHTML = `Tahun : <span class="year">${book_year}</span>`;

  const container = document.createElement("article");
  container.classList.add("book_item");
  container.append(textTitle, textAuthor, textYear);

  if (isCompleted) {
    container.append(undoButton(), trashButton());
  } else {
    container.append(finishButton(), trashButton());
  }

  return container;
}

function createButton(buttonTypeClass, buttonText, eventListener) {
  const button = document.createElement("button");
  button.classList.add(buttonTypeClass);
  button.innerText = buttonText;
  button.addEventListener("click", function (event) {
    eventListener(event);
  });
  return button;
}

function addBookToCompleted(taskElement) {
  const bookTitle = taskElement.querySelector("h3").innerText;
  const bookAuthor = taskElement.querySelector(".author").innerText;
  const bookYear = taskElement.querySelector(".year").innerText;
  const completed = document.getElementById(COMPLETED_BOOK);

  const newBook = makeBook(bookTitle, bookAuthor, bookYear, true);

  const book = findBook(taskElement[BOOK_ITEMID]);
  book.isCompleted = true;
  newBook[BOOK_ITEMID] = book.id;

  completed.append(newBook);
  taskElement.remove();
  updateDataToStorage();
}

function removeBook(taskElement) {
  if (confirm("Yakin anda ingin menghapus buku ini?")) {
    const bookPosition = findBookIndex(taskElement[BOOK_ITEMID]);
    books.splice(bookPosition, 1);
    taskElement.remove();
  }
  updateDataToStorage();
}

function undoBookFromCompleted(taskElement) {
  const bookTitle = taskElement.querySelector("h3").innerText;
  const bookAuthor = taskElement.querySelector(".author").innerText;
  const bookYear = taskElement.querySelector(".year").innerText;
  const incompleted = document.getElementById(INCOMPLETED_BOOK);

  const newBook = makeBook(bookTitle, bookAuthor, bookYear, false);
  const book = findBook(taskElement[BOOK_ITEMID]);
  book.isCompleted = false;
  newBook[BOOK_ITEMID] = book.id;

  incompleted.append(newBook);
  taskElement.remove();
  updateDataToStorage();
}

function finishButton() {
  return createButton("green", "Selesai dibaca", function (event) {
    addBookToCompleted(event.target.parentElement);
  });
}

function trashButton() {
  return createButton("red", "Hapus Buku", function (event) {
    removeBook(event.target.parentElement);
  });
}

function undoButton() {
  return createButton("green", "Belum selesai dibaca", function (event) {
    undoBookFromCompleted(event.target.parentElement);
  });
}

function searchBook() {
  const searchTitle = document.getElementById("searchBookTitle").value;
  const searchLower = searchTitle.toLowerCase();
  let bookList = document.querySelectorAll(".book_item");

  bookList.forEach((book) => {
    const bookTitle = book.firstChild.textContent.toLowerCase();

    if (bookTitle.indexOf(searchLower) != -1) {
      book.setAttribute("style", "display: block;");
    } else {
      book.setAttribute("style", "display: none !important;");
    }
  });
}
function isStorageExist() /* boolean */ {
    if (typeof Storage === undefined) {
      alert("Browser kamu tidak mendukung local storage");
      return false;
    }
    return true;
  }
  
  function saveData() {
    const parsed = JSON.stringify(books);
    localStorage.setItem(STORAGE_KEY, parsed);
    document.dispatchEvent(new Event("ondatasaved"));
  }
  
  function loadDataFromStorage() {
    const serializedData = localStorage.getItem(STORAGE_KEY);
  
    let data = JSON.parse(serializedData);
  
    if (data !== null) books = data;
  
    document.dispatchEvent(new Event("ondataloaded"));
  }
  
  function updateDataToStorage() {
    if (isStorageExist()) saveData();
  }
  
  function bookFill(book_title, book_author, book_year, isCompleted) {
    return {
      id: +new Date(),
      book_title,
      book_author,
      book_year,
      isCompleted,
    };
  }
  
  function findBook(bookId) {
    for (book of books) {
      if (book.id === bookId) return book;
    }
    return null;
  }
  
  function findBookIndex(bookId) {
    let index = 0;
    for (book of books) {
      if (book.id === bookId) return index;
  
      index++;
    }
  
    return -1;
  }
  
  function refreshDataFromBooks() {
    const incompleted = document.getElementById(INCOMPLETED_BOOK);
    let completed = document.getElementById(COMPLETED_BOOK);
  
    for (book of books) {
      const newBook = makeBook(
        book.book_title,
        book.book_author,
        book.book_year,
        book.isCompleted
      );
      newBook[BOOK_ITEMID] = book.id;
  
      if (book.isCompleted) {
        completed.append(newBook);
      } else {
        incompleted.append(newBook);
      }
    }
  }