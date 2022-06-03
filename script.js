const library = [];
const libraryView = document.querySelector('.library');
let bookId = 0;

// book constructor, also appends it to library //
function book(title, author, pages, read=false) {
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.read = read;
    this.id = bookId;
    bookId++;
    library.push(this);
}

// view book insertion form //
const formView = document.querySelector('.darkened-background')
const showForm = document.querySelector('.view-form');
const formBody = document.querySelector('.insertion-form');
showForm.onclick = () => formView.classList.remove('hidden');
formBody.onclick = (e) => e.stopPropagation();
formView.onclick = (e) => formView.classList.add('hidden');

// read button toggle switch //
const read = document.getElementById('read-button');
read.addEventListener('click', e => {
    e.target.classList.toggle('on');
})

// create a book from user input //
const addButton = document.getElementById('add-book');
addButton.addEventListener('click', e => {
    const title = document.getElementById('title');
    const author = document.getElementById('author');
    const pages = document.getElementById('pages');
    new book(title.value, author.value, pages.value, read.classList.contains('on'));

    // clear the form //
    title.value = '', author.value = '', pages.value = '';
    if (read.classList.contains('on')) read.classList.remove('on');
    // and hide it //
    formView.classList.add('hidden')

    // update the library //
    updateLibraryView();
});

function updateLibraryView() {
    clearLibraryView();
    for (let book of library) {
        const bookElement = createBookElement(book);
        libraryView.appendChild(bookElement);
    }
}

function clearLibraryView() {
    while (libraryView.firstChild) {
        libraryView.removeChild(libraryView.firstChild);
    }
}

function createBookElement(book) {
    const element = document.createElement('div');
    element.classList.add('book-card');
    
    const title = document.createElement('p');
    title.textContent = book.title;

    const author = document.createElement('p');
    author.textContent = book.author;
    
    const pages = document.createElement('p');
    pages.textContent = book.pages;
    
    const read = document.createElement('p');
    read.textContent = book.read ? 'read' : 'not read';
    
    element.append(title, author, pages, read);
    return element;
}

// temporary books to view //
for (let i = 0; i < 10; i++) {
    new book('Title', 'Author', 250, false);
}
updateLibraryView();
