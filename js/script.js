document.addEventListener("DOMContentLoaded", function () {
    const submitForm = document.getElementById("inputBook");
  
    submitForm.addEventListener("submit", function (event) {
      event.preventDefault();
      addBook();
    });
  
    const submitSearch = document.getElementById("searchBook");
    submitSearch.addEventListener("submit", function (event) {
      event.preventDefault();
      searchBook();
    });
  
    if (isStorageExist()) {
      loadDataFromStorage();
    }
  });
  
  document.addEventListener("ondatasaved", () => {
    console.log("Data telah disimpan.");
  });
  document.addEventListener("ondataloaded", () => {
    refreshDataFromBooks();
  });