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
    formView.classList.add('hidden');

    // update the library //
    updateLibraryView();
});

function updateLibraryView() {
    clearLibraryView();
    for (let bookKey in library) {
        const bookElement = createBookElement(library[bookKey]);
        bookElement.setAttribute('data-book-id', bookKey);
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
    title.classList.add('book-title');
    title.textContent = book.title;

    const author = document.createElement('p');
    author.classList.add('book-author');
    author.textContent = book.author;
    
    const pages = document.createElement('div');
    pages.classList.add('book-pages');
    const pagesText = document.createElement('p');
    pagesText.textContent = 'Pages';
    const pagesNumber = document.createElement('p');
    pagesNumber.textContent = book.pages;
    pages.append(pagesNumber, pagesText);

    const removeButton = document.createElement('img');
    removeButton.classList.add('remove-button');
    removeButton.setAttribute('src', 'assets/exit-icon.svg');
    removeButton.addEventListener('click', e => removeBook(e));

    const readButton = document.createElement('img');
    readButton.classList.add('read-button');
    readButton.setAttribute('src', 'assets/read-icon.svg');
    readButton.addEventListener('click', e => changeRead(e));

    if (book.read) element.classList.add('read');
    
    const readBlock = document.createElement('div');
    readBlock.classList.add('read-block');
    
    element.append(readBlock, removeButton, readButton, title, author, pages);
    return element;
}

function removeBook (event) {
    event.target.parentNode.style.opacity = '0';
    setTimeout(() => {
        library.splice(event.target.parentNode.getAttribute('data-book-id'), 1);
        updateLibraryView();
    }, 150) 


}

function changeRead (event) {
    event.target.parentNode.classList.toggle('read');
    const id = event.target.parentNode.getAttribute('data-book-id');
    library[id].read ? library[id].read = false : library[id].read = true;

}

// temporary books to view //
for (let i = 0; i < 20; i++) {
    new book(`Title ${i}`, 'Author', 250, false);
}
updateLibraryView();
