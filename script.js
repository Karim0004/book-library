const library = [];
const libraryView = document.querySelector('.library');
let bookId = 0;
const searchText = document.querySelector('.nav > input');

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

// insertion form read button toggle switch //
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
    
    // error checking if title or author are empty //
    if (!title.value || !author.value) {
        if (!title.value) title.classList.add('form-error');
        if (!author.value) author.classList.add('form-error');
        return;
    }
    new book(title.value, author.value, Number(pages.value), read.classList.contains('on'));

    // clear the form //
    title.value = '', author.value = '', pages.value = '';
    if (read.classList.contains('on')) read.classList.remove('on');
    // and hide it //
    formView.classList.add('hidden');

    // update the library //
    updateLibraryView();
});

// error checking required form inputs //
const inputs = document.querySelectorAll('.required');
for (let input of inputs) {
    input.addEventListener('keyup', (e) => {
        if (!e.target.value && !e.target.classList.contains('form-error')) {
            e.target.classList.add('form-error');
        } else if (e.target.classList.contains('form-error')){
            e.target.classList.remove('form-error');
        }
    })
}


function updateLibraryView() {
    clearLibraryView();
    for (let bookKey in library) {
        if ( searchText.value
            && library[bookKey].title.toLowerCase().search(searchText.value.toLowerCase()) === -1) {
            continue;
        }
        const bookElement = createBookElement(library[bookKey]);
        // give the book element its array key as a data attribute //
        bookElement.setAttribute('data-book-id', bookKey);
        libraryView.appendChild(bookElement);
    }
    updateSidebar();
}

function clearLibraryView() {
    while (libraryView.firstChild) {
        libraryView.removeChild(libraryView.firstChild);
    }
}

// take data from array and return book card DOM node //
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
    }, 150); 
}

function changeRead (event) {
    event.target.parentNode.classList.toggle('read');
    const id = event.target.parentNode.getAttribute('data-book-id');
    library[id].read ? library[id].read = false : library[id].read = true;
    setTimeout(updateLibraryView, 300);

}

// sidebar information //
const sidebarElements = document.querySelectorAll('.sidebar-info > p > span');
let bookCount = 0, readBooks = 0, unreadBooks = 0, totalPages = 0;

function updateSidebar () {
    bookCount = 0, readBooks = 0, unreadBooks = 0, totalPages = 0;
    for (let id in library) {
        bookCount += 1;
        library[id].read ? readBooks+= 1 : unreadBooks += 1;
        totalPages+= library[id].pages;
    }
    sidebarElements[0].textContent = bookCount;
    sidebarElements[1].textContent = readBooks;
    sidebarElements[2].textContent = unreadBooks;
    sidebarElements[3].textContent = totalPages;
}


// temporary books to view //
new book('Preview Title', 'Author Name', 374, false);
new book('The Art of War', 'Sun Tzu', 260, true)
updateLibraryView();


// page color control //
const colorButtons = document.querySelectorAll('.color-buttons > button');
const root = document.querySelector(':root');
for (let button of colorButtons) {
    button.onclick = () => {
        root.className =`${button.id}`
    
        for (let colorButton of colorButtons) {
            colorButton.classList.remove('color-on');
        }

        button.classList.add('color-on');
    }
}

// update library view when typing in filter box //
searchText.addEventListener('keyup', updateLibraryView);