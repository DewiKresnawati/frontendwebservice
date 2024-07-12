function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
}

document.getElementById("productForm").addEventListener("submit", function (event) {
  event.preventDefault();
  const productData = {
    name: document.getElementById("nama").value,
    price: parseFloat(document.getElementById("price").value),
    description: document.getElementById("description").value,
    category_id: parseInt(document.getElementById("categories").value),
    supplier_id: parseInt(document.getElementById("supplier").value),
  };

  const token = getCookie("token"); // Mengambil token dari cookie

  console.log(productData);

  fetch("https://130.162.195.228/mhs714220002/api/v1/products", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(productData),
  })
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
      throw new Error("Failed to create product");
    })
    .then((data) => {
        Swal.fire({
            icon: "success",
            title: "Product Successful",
            text: "Produk berhasil ditambahkan",
            showConfirmButton: true,
          }).then(() => {
            // Redirect to another page after login
            window.location.href = "./dashboard.html"; // Ubah ke halaman yang diinginkan
          });
      // Optionally, clear the form or redirect to another page
      document.getElementById("productForm").reset();
    })
    .catch((error) => console.error("Error creating product:", error));
});
