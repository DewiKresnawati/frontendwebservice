function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
}

document.addEventListener("DOMContentLoaded", () => {
  const apiUrl = "https://130.162.195.228/mhs714220002/api/v1/products";
  const token = getCookie("token"); // Mengambil token dari cookie

  fetch(apiUrl, {
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
      const tableBody = document.querySelector("#product-table tbody");

      data.forEach((product) => {
        const row = tableBody.insertRow();
        row.innerHTML = `
          <tr>
            <td class="align-middle text-center text-sm">
              <span class="text-xl">${product.ID}</span>
            </td>
            <td class="align-middle text-center text-sm">
              <span class="text-xl">${product.Name}</span>
            </td>
            <td class="align-middle text-center text-sm">
              <span class="text-xl">${product.Description}</span>
            </td>
            <td class="align-middle text-center text-sm">
              <span class="text-xl">${product.Price}</span>
            </td>
            <td class="align-middle text-center text-sm">
              <span class="text-xl">${product.Category.Name}</span>
            </td>
            <td class="align-middle text-center text-sm">
              <span class="text-xl">${product.Supplier.Email}</span>
            </td>
            <td class="align-middle text-center text-sm">
              <a href="./editProduct.html?id=${product.ID}" class="btn btn-sm btn-warning mb-0">Edit</a>
              <button class="btn btn-sm btn-danger delete-button mb-0" data-id="${product.ID}">Delete</button>
            </td>
          </tr>
        `;
      });

      // Add event listeners for delete buttons
      const deleteButtons = document.querySelectorAll(".delete-button");
      deleteButtons.forEach((button) => {
        button.addEventListener("click", handleDelete);
      });
    })
    .catch((error) => {
      console.error("There has been a problem with your fetch operation:", error);
    });
});

function handleDelete(event) {
  const productId = event.target.getAttribute("data-id");
  const token = getCookie("token"); // Mengambil token dari cookie

  Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete it!",
  }).then((result) => {
    if (result.isConfirmed) {
      fetch(`https://130.162.195.228/mhs714220002/api/v1/products/${productId}`, {
        method: "DELETE",
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
          Swal.fire("Deleted!", data.message, "success").then(() => {
            // Remove the deleted row from the table
            event.target.closest("tr").remove();
          });
        })
        .catch((error) => {
          console.error("There has been a problem with your fetch operation:", error);
        });
    }
  });
}
