async function fetchBooks() {
  const response = await fetch("/books"); // Replace with your API endpoint
  const data = await response.json();

  const bookList = document.getElementById("book-list");
  bookList.innerHTML = ""; // Clear existing content before adding new items

  data.forEach((book) => {
    const bookItem = document.createElement("div");
    bookItem.classList.add("book"); // Add a CSS class for styling

    // Create elements for title, author, etc. and populate with book data
    const titleElement = document.createElement("h2");
    titleElement.textContent = book.id + ". " + book.title;

    const authorElement = document.createElement("p");
    authorElement.textContent = `By: ${book.author}`;

    // ... add more elements for other book data (optional)

    bookItem.appendChild(titleElement);
    bookItem.appendChild(authorElement);
    // ... append other elements

    bookList.appendChild(bookItem);
  });
}

fetchBooks(); // Call the function to fetch and display book data initially


const bookForm = document.getElementById('book-form');
const bookList = document.getElementById('book-list');

// Function to display error message
function showError(message) {
  const errorDiv = document.createElement('div');
  errorDiv.classList.add('error');
  errorDiv.textContent = message;
  bookForm.appendChild(errorDiv);

  setTimeout(() => {
    errorDiv.remove();
  }, 3000);
}

bookForm.addEventListener('submit', async (event) => {
  event.preventDefault(); // Prevent default form submission

  const title = document.getElementById('title').value;
  const author = document.getElementById('author').value;

  // Prepare data for POST request
  const data = {
    title,
    author,
  };

  try {
    const response = await fetch('/books', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Error adding book: ${response.statusText}`);
    }

    const newBook = await response.json(); // Parse response as JSON

    // Clear form fields and display success message (implementation based on your preference)
    bookForm.reset();
    console.log('Book added successfully:', newBook);

    // Update book list by calling fetchBooks() again
    fetchBooks();

  } catch (error) {
    showError(error.message);
  }
});

const updateButton = document.getElementById('update-btn');

// Event listener for update button
updateButton.addEventListener('click', async () => {
  const bookId = document.getElementById('inputid').value; // Assuming you have an input for book ID
  const title = document.getElementById('title').value;
  const author = document.getElementById('author').value;

  // Check if a book ID is provided for update
  if (!bookId) {
    showError('Please enter a book ID to update.');
    return;
  }

  // Prepare data for PUT request
  const data = {
    title,
    author,
  };

  try {
    const response = await fetch(`/books/${bookId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Error updating book: ${response.statusText}`);
    }

    // Assuming successful update, refetch and display the updated book list
    fetchBooks();

    console.log('Book updated successfully.');

  } catch (error) {
    showError(error.message);
  }
});

const deleteButton = document.getElementById('delete-btn');

// Event listener for delete button
deleteButton.addEventListener('click', async () => {
  const bookId = document.getElementById('inputid').value; // Assuming you have an input for book ID

  // Check if a book ID is provided for deletion
  if (!bookId) {
    showError('Please enter a book ID to delete.');
    return;
  }

  try {
    const response = await fetch(`/books/${bookId}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' }, // Might not be strictly necessary for DELETE requests
    });

    if (!response.ok) {
      throw new Error(`Error deleting book: ${response.statusText}`);
    }

    // Assuming successful deletion, refetch and display the updated book list
    fetchBooks();

    console.log('Book deleted successfully.');

  } catch (error) {
    showError(error.message);
  }
});
