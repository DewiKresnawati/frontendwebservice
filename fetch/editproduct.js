function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
  }
  
  document.addEventListener("DOMContentLoaded", () => {
    const apiUrl = "https://130.162.195.228/mhs714220002/api/v1/products";
    const productForm = document.getElementById("productForm");
    const urlParams = new URLSearchParams(window.location.search);
    const idUrl = urlParams.get("id");
    const token = getCookie("token"); // Mengambil token dari cookie
  
    // Fetch product details
    fetch(`${apiUrl}/${idUrl}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      }
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        console.log(data); // Debugging line to check the response data
        if (data.Name && data.Price && data.Description && data.CategoryID && data.SupplierID) {
          document.getElementById("nama").value = data.Name || "";
          document.getElementById("price").value = data.Price || "";
          document.getElementById("description").value = data.Description || "";
          
          // Set CategoryID and SupplierID after fetching the options
          fetchCategories(data.CategoryID);
          fetchSuppliers(data.SupplierID);
        } else {
          console.error("Invalid data structure:", data);
        }
      })
      .catch((error) => {
        console.error("There has been a problem with your fetch operation:", error);
      });
  
    productForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const productData = {
        Name: document.getElementById("nama").value,
        Price: parseFloat(document.getElementById("price").value), // Pastikan harga adalah float
        Description: document.getElementById("description").value,
        CategoryID: parseInt(document.getElementById("categories").value), // Pastikan ID kategori adalah int
        SupplierID: parseInt(document.getElementById("supplier").value), // Pastikan ID supplier adalah int
      };
  
      fetch(`${apiUrl}/${idUrl}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(productData),
      })
        .then((response) => {
          if (!response.ok) {
            return response.json().then((data) => {
              throw new Error(data.message || "Network response was not ok");
            });
          }
          return response.json();
        })
        .then((data) => {
          Swal.fire({
            icon: "success",
            title: "Berhasil",
            text: "Data Berhasil Diubah",
            showConfirmButton: true,
          }).then(() => {
            window.location.href = "./dashboard.html";
          });
        })
        .catch((error) => {
          console.error("There has been a problem with your fetch operation:", error);
        });
    });
  
    function fetchCategories(selectedCategoryId) {
      fetch("https://130.162.195.228/mhs714220002/api/v1/categories", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        }
      })
        .then((response) => response.json())
        .then((data) => {
          if (Array.isArray(data)) {
            const categorySelect = document.getElementById("categories");
            categorySelect.innerHTML = ""; // Clear current options
            data.forEach((category) => {
              const option = document.createElement("option");
              option.value = category.id;
              option.textContent = category.name;
              if (category.id === selectedCategoryId) {
                option.selected = true; // Select the correct category
              }
              categorySelect.appendChild(option);
            });
          } else {
            console.error("Failed to fetch categories");
          }
        })
        .catch((error) => console.error("Error fetching categories:", error));
    }
  
    function fetchSuppliers(selectedSupplierId) {
      fetch("https://130.162.195.228/mhs714220002/api/v1/suppliers", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        }
      })
        .then((response) => response.json())
        .then((data) => {
          if (Array.isArray(data)) {
            const supplierSelect = document.getElementById("supplier");
            supplierSelect.innerHTML = ""; // Clear current options
            data.forEach((supplier) => {
              const option = document.createElement("option");
              option.value = supplier.ID;
              option.textContent = supplier.Email;
              if (supplier.id === selectedSupplierId) {
                option.selected = true; // Select the correct supplier
              }
              supplierSelect.appendChild(option);
            });
          } else {
            console.error("Failed to fetch suppliers");
          }
        })
        .catch((error) => console.error("Error fetching suppliers:", error));
    }
  });
  