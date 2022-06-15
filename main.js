const books = [];
const RENDER_EVENT = "render-book";
const SAVED_EVENT = "saved-book";
const STORAGE_KEY = "BOOKSHELF_APPS";

// check if local storage is available
function isStorageExist() {
  if (typeof Storage === undefined) {
    alert("Maaf, browser Anda tidak mendukung local storage!");
    return false;
  }
  return true;
}

// load books from local storage
function loadDataFromLocalStorage() {
  const dataFromLocalStorage = localStorage.getItem(STORAGE_KEY);

  let parsedBookshelfData = JSON.parse(dataFromLocalStorage);

  if (parsedBookshelfData !== null) {
    for (const book of parsedBookshelfData) {
      books.push(book);
    }
  }

  document.dispatchEvent(new Event(RENDER_EVENT));
}

// generate random id
function generateId() {
  return +new Date();
}

// generate book object
function generateBookObject(id, title, author, year, isCompleted) {
  return {
    id,
    title,
    author,
    year,
    isCompleted,
  };
}

// save books to local storage
function saveBookOnLocalStorage() {
  if (isStorageExist()) {
    const parsedBooks = JSON.stringify(books);
    localStorage.setItem(STORAGE_KEY, parsedBooks);
    document.dispatchEvent(new Event(SAVED_EVENT));
  }
}

// find book by id
function findBook(bookId) {
  for (const bookItem of books) {
    if (bookItem.id === bookId) {
      return bookItem;
    }
  }
  return null;
}

// find book index
function findBookIndex(bookId) {
  for (const index in books) {
    if (books[index].id === bookId) {
      return index;
    }
  }
  return -1;
}

// clear form input field
function clearFormInput() {
  document.getElementById("inputBookTitle").value = "";
  document.getElementById("inputBookAuthor").value = "";
  document.getElementById("inputBookYear").value = "";
  document.getElementById("inputBookIsComplete").checked = false;
  document.getElementById("bookSubmitSpan").innerText = "Belum selesai dibaca";
  document.getElementById("searchBookTitle").value = "";
}

// hide and show elements functions
const successMessageSection = document.getElementById("successMessageSection");
function showsuccessMessageSection() {
  successMessageSection.style.display = "block";
}
function hidesuccessMessageSection() {
  successMessageSection.style.display = "none";
}

const inputBookDataSection = document.getElementById("inputBookDataSection");
function showInputBookDataSection() {
  inputBookDataSection.style.display = "block";
}
function hideInputBookDataSection() {
  inputBookDataSection.style.display = "none";
}

const searchBookSection = document.getElementById("searchBookSection");
function showSearchBookSection() {
  searchBookSection.style.display = "block";
}
function hideSearchBookSection() {
  searchBookSection.style.display = "none";
}

const bookshelfIncompleted = document.getElementById("bookshelfIncompleted");
function showBookshelfIncompleted() {
  bookshelfIncompleted.style.display = "block";
}
function hideBookshelfIncompleted() {
  bookshelfIncompleted.style.display = "none";
}

const bookshelfCompleted = document.getElementById("bookshelCompleted");
function showBookshelfCompleted() {
  bookshelfCompleted.style.display = "block";
}
function hideBookshelfCompleted() {
  bookshelfCompleted.style.display = "none";
}

const addBookButton = document.getElementById("addBookButton");
function showAddBookButton() {
  addBookButton.style.display = "block";
}
function hideAddBookButton() {
  addBookButton.style.display = "none";
}

const searchBookButton = document.getElementById("searchBookButton");
function showSearchBookButton() {
  searchBookButton.style.display = "block";
}
function hideSearchBookButton() {
  searchBookButton.style.display = "none";
}

const backToHomeButton = document.getElementById("backToHomeButton");
function showBackToHomeButton() {
  backToHomeButton.style.display = "block";
}
function hideBackToHomeButton() {
  backToHomeButton.style.display = "none";
}

// top button action
addBookButton.addEventListener("click", function () {
  document.getElementById("inputBookFormHeader").innerHTML =
    "Menambahkan Buku Baru";
  showInputBookDataSection();
  showBackToHomeButton();

  hidesuccessMessageSection();
  hideSearchBookSection();
  hideBookshelfIncompleted();
  hideBookshelfCompleted();
  hideAddBookButton();
  hideSearchBookButton();
});

searchBookButton.addEventListener("click", function () {
  showSearchBookSection();
  showBookshelfIncompleted();
  showBookshelfCompleted();
  showBackToHomeButton();

  hidesuccessMessageSection();
  hideInputBookDataSection();
  hideAddBookButton();
  hideSearchBookButton();
});

backToHomeButton.addEventListener("click", function () {
  clearFormInput();

  showBookshelfIncompleted();
  showBookshelfCompleted();

  hidesuccessMessageSection();
  hideInputBookDataSection();
  hideSearchBookSection();

  document.dispatchEvent(new Event(RENDER_EVENT));
});

// submit book button text
const checkBox = document.getElementById("inputBookIsComplete");
checkBox.addEventListener("click", function () {
  if (checkBox.checked) {
    document.getElementById("bookSubmitSpan").innerText = "Selesai dibaca";
  } else {
    document.getElementById("bookSubmitSpan").innerText =
      "Belum selesai dibaca";
  }
});

// update book data
let bookToBeUpdated;

function updateBookData(bookId) {
  document.getElementById("inputBookFormHeader").innerHTML =
    "Memperbarui Data Buku";

  const bookTarget = findBookIndex(bookId);

  document.getElementById("inputBookTitle").value = books[bookTarget].title;
  document.getElementById("inputBookAuthor").value = books[bookTarget].author;
  document.getElementById("inputBookYear").value = books[bookTarget].year;
  document.getElementById("inputBookIsComplete").checked =
    books[bookTarget].isCompleted;

  const spanText = document.getElementById("bookSubmitSpan");
  if (checkBox.checked) {
    spanText.innerText = "Selesai dibaca";
  } else {
    spanText.innerText = "Belum selesai dibaca";
  }
  bookToBeUpdated = bookTarget;
}

// add book to bookshelf
function addBook(bookIndex) {
  bookIndex = bookToBeUpdated;

  const bookTitle = document.getElementById("inputBookTitle").value;
  const bookAuthor = document.getElementById("inputBookAuthor").value;
  const bookYear = document.getElementById("inputBookYear").value;

  let isCompleted = false;

  const isChecked = document.getElementById("inputBookIsComplete");
  if (isChecked.checked) {
    isCompleted = true;
  }

  if (bookIndex >= 0) {
    books[bookIndex].title = bookTitle;
    books[bookIndex].author = bookAuthor;
    books[bookIndex].year = bookYear;
    books[bookIndex].isCompleted = isCompleted;

    clearFormInput();
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveBookOnLocalStorage();
  } else {
    const generatedBookId = generateId();

    const bookObject = generateBookObject(
      generatedBookId,
      bookTitle,
      bookAuthor,
      bookYear,
      isCompleted
    );

    books.push(bookObject);

    clearFormInput();
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveBookOnLocalStorage();
  }
  bookToBeUpdated = -1;
}

// delete book from bookshelf
function deleteBookFromBookshelf(bookId) {
  const bookTarget = findBookIndex(bookId);

  if (bookTarget === -1) return;

  if (confirm("Hapus buku dari rak?")) {
    books.splice(bookTarget, 1);
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveBookOnLocalStorage();
  }
}

// mark book as completed
function markBookAsCompleted(bookId) {
  const bookTarget = findBook(bookId);
  if (bookTarget === null) return;

  bookTarget.isCompleted = true;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveBookOnLocalStorage();
}

// unmarked book as completed
function unmarkBookAsCompleted(bookId) {
  const bookTarget = findBook(bookId);
  if (bookTarget === null) return;

  bookTarget.isCompleted = false;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveBookOnLocalStorage();
}

// make book card element
function makeBook(bookObject) {
  const bookCover = document.createElement("div");
  bookCover.classList.add("book_cover");

  const bookTitle = document.createElement("h3");
  bookTitle.innerText = bookObject.title;

  const bookAuthor = document.createElement("p");
  bookAuthor.innerText = bookObject.author;

  const bookYear = document.createElement("p");
  bookYear.innerText = bookObject.year;

  const updateBookButton = document.createElement("button");
  updateBookButton.classList.add("update_icon");

  updateBookButton.addEventListener("click", function () {
    updateBookData(bookObject.id);

    showInputBookDataSection();
    showBackToHomeButton();

    hideSearchBookSection();
    hideBookshelfIncompleted();
    hideBookshelfCompleted();
    hideAddBookButton();
    hideSearchBookButton();
  });

  const deleteBookButton = document.createElement("button");
  deleteBookButton.classList.add("delete_icon");
  deleteBookButton.addEventListener("click", function () {
    deleteBookFromBookshelf(bookObject.id);
  });

  const actionButtonsWrapper = document.createElement("div");
  actionButtonsWrapper.classList.add("action_buttons_wrapper");

  actionButtonsWrapper.append(updateBookButton, deleteBookButton);

  const authorYearWrapper = document.createElement("div");
  authorYearWrapper.classList.add("author_year_wrapper");
  authorYearWrapper.append(bookAuthor, bookYear);

  const bookDescriptionWrapper = document.createElement("div");
  bookDescriptionWrapper.classList.add("book_description_wrapper");
  bookDescriptionWrapper.append(
    bookTitle,
    authorYearWrapper,
    actionButtonsWrapper
  );

  const container = document.createElement("div");
  container.classList.add("book_item");

  container.append(bookCover, bookDescriptionWrapper);
  container.setAttribute("id", `book-${bookObject.id}`);

  if (bookObject.isCompleted) {
    const incompleteButton = document.createElement("button");
    incompleteButton.classList.add("marked_icon");

    incompleteButton.addEventListener("click", function () {
      unmarkBookAsCompleted(bookObject.id);
    });
    actionButtonsWrapper.prepend(incompleteButton);
  } else {
    const completeButton = document.createElement("button");
    completeButton.classList.add("unmarked_icon");

    completeButton.addEventListener("click", function () {
      markBookAsCompleted(bookObject.id);
    });
    actionButtonsWrapper.prepend(completeButton);
  }

  return container;
}

// search book by title
const warningMessageWrapper = document.querySelectorAll(
  ".warning_message_wrapper"
);

const searchButton = document.getElementById("searchSubmit");

searchButton.addEventListener("click", function (event) {
  let keyword = document.getElementById("searchBookTitle").value.toLowerCase();

  const incompleteBookshelfList = document
    .getElementById("incompleteBookshelfList")
    .querySelectorAll(".book_item");

  const completeBookshelfList = document
    .getElementById("completeBookshelfList")
    .querySelectorAll(".book_item");

  event.preventDefault();

  const booksFoundOnIncompleteBookshelf = [];
  const booksFoundOnCompleteBookshelf = [];

  if (keyword.length > 0 && keyword !== " ") {
    for (const book of incompleteBookshelfList) {
      const bookTitle = book
        .getElementsByTagName("h3")[0]
        .innerText.toLowerCase();
      if (bookTitle.includes(keyword)) {
        book.style.display = "flex";

        booksFoundOnIncompleteBookshelf.push(book);
      } else {
        book.style.display = "none";
      }
    }

    const emptySearchFieldMessage = document.getElementById(
      "emptySearchFieldMessage"
    );
    emptySearchFieldMessage.style.display = "none";

    const bookNotFoundOnIncompleteBookshelfMesssageWrapper =
      document.getElementById(
        "bookNotFoundOnIncompleteBookshelfMesssageWrapper"
      );
    bookNotFoundOnIncompleteBookshelfMesssageWrapper.style.display = "none";

    const bookNotFoundOnIncompleteBookshelf = document.getElementById(
      "bookNotFoundOnIncompleteBookshelfMesssage"
    );
    bookNotFoundOnIncompleteBookshelf.innerHTML = "";

    const bookNotFoundOnCompleteBookshelfMesssageWrapper =
      document.getElementById("bookNotFoundOnCompleteBookshelfMesssageWrapper");
    bookNotFoundOnCompleteBookshelfMesssageWrapper.style.display = "none";
    const bookNotFoundOnCompleteBookshelf = document.getElementById(
      "bookNotFoundOnCompleteBookshelfMesssage"
    );
    bookNotFoundOnCompleteBookshelf.innerHTML = "";

    const bookNotFoundMessage =
      "Buku tidak ditemukan, masukkan kata kunci lain!";

    if (booksFoundOnIncompleteBookshelf.length === 0) {
      setTimeout(() => {
        bookNotFoundOnIncompleteBookshelfMesssageWrapper.style.display =
          "block";
        bookNotFoundOnIncompleteBookshelf.innerHTML = bookNotFoundMessage;
      }, 500);
    }

    for (const book of completeBookshelfList) {
      const bookTitle = book
        .getElementsByTagName("h3")[0]
        .innerText.toLowerCase();
      if (bookTitle.includes(keyword)) {
        book.style.display = "flex";
        booksFoundOnCompleteBookshelf.push(book);
      } else {
        book.style.display = "none";
      }
    }

    if (booksFoundOnCompleteBookshelf.length === 0) {
      setTimeout(() => {
        bookNotFoundOnCompleteBookshelfMesssageWrapper.style.display = "block";
        bookNotFoundOnCompleteBookshelf.innerHTML = bookNotFoundMessage;
      }, 500);
    }
  } else {
    const emptySearchFieldMessage = document.getElementById(
      "emptySearchFieldMessage"
    );
    emptySearchFieldMessage.style.display = "block";
  }

  clearFormInput();
});

// DOM content loaded event
document.addEventListener("DOMContentLoaded", function () {
  const submitBookForm = document.getElementById("inputBook");
  submitBookForm.addEventListener("submit", function (event) {
    event.preventDefault();
    addBook();
  });

  if (isStorageExist()) {
    loadDataFromLocalStorage();
  }
});

// saved event
document.addEventListener(SAVED_EVENT, function () {
  const successMessage = document.getElementById("successMessage");
  successMessage.innerHTML = "Sukses! Rak buku telah diperbarui!";
  showsuccessMessageSection();

  hideAddBookButton();
  hideSearchBookButton();
  hideBookshelfIncompleted();
  hideBookshelfCompleted();

  setTimeout(() => {
    showAddBookButton();
    showSearchBookButton();
    showBookshelfIncompleted();
    showBookshelfCompleted();

    hidesuccessMessageSection();
  }, 2000);
});

// render event
document.addEventListener(RENDER_EVENT, function () {
  const completeBookList = document.getElementById("completeBookshelfList");
  completeBookList.innerHTML = "";

  const incompleteBookList = document.getElementById("incompleteBookshelfList");
  incompleteBookList.innerHTML = "";

  document.getElementById(
    "bookNotFoundOnIncompleteBookshelfMesssage"
  ).innerHTML = "";
  document.getElementById("bookNotFoundOnCompleteBookshelfMesssage").innerHTML =
    "";

  for (const bookItem of books) {
    const bookElement = makeBook(bookItem);

    if (bookItem.isCompleted) {
      completeBookList.append(bookElement);
    } else {
      incompleteBookList.append(bookElement);
    }
  }

  const incompletedBooks = [];
  const completedBooks = [];

  for (const book of books) {
    if (book.isCompleted) {
      completedBooks.push(book);
    } else {
      incompletedBooks.push(book);
    }
  }

  const emptyIncompletedBookshelfMessageWrapper = document.getElementById(
    "emptyIncompletedBookshelfMessageWrapper"
  );
  const emptyBookshelfMessage = "Rak kosong, masukkan buku ke dalam rak!";
  const emptyIncompletedBookshelfMessage = document.getElementById(
    "emptyIncompletedBookshelfMessage"
  );

  warningMessageWrapper.forEach((wrapper) => {
    wrapper.style.display = "none";
  });

  if (incompletedBooks.length > 0) {
    emptyIncompletedBookshelfMessageWrapper.style.display = "none";
    emptyIncompletedBookshelfMessage.innerHTML = "";
  } else {
    emptyIncompletedBookshelfMessageWrapper.style.display = "block";
    emptyIncompletedBookshelfMessage.innerHTML = emptyBookshelfMessage;
  }

  const emptyCompletedBookshelfMessageWrapper = document.getElementById(
    "emptyCompletedBookshelfMessageWrapper"
  );
  const emptyCompletedBookshelfMessage = document.getElementById(
    "emptyCompletedBookshelfMessage"
  );

  if (completedBooks.length > 0) {
    emptyCompletedBookshelfMessageWrapper.style.display = "none";
    emptyCompletedBookshelfMessage.innerHTML = "";
  } else {
    emptyCompletedBookshelfMessageWrapper.style.display = "block";
    emptyCompletedBookshelfMessage.innerHTML = emptyBookshelfMessage;
  }

  showBookshelfIncompleted();
  showBookshelfCompleted();
  showAddBookButton();
  showSearchBookButton();

  hidesuccessMessageSection();
  hideInputBookDataSection();
  hideSearchBookSection();
  hideBackToHomeButton();

  clearFormInput();
});
