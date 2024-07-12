function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
  }
  
  document.addEventListener("DOMContentLoaded", () => {
    const apiUrl = "https://130.162.195.228/mhs714220002/api/v1/suppliers";
    const token = getCookie("token"); // Mengambil token dari cookie
  
    fetch(apiUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        const tableBody = document.querySelector("#supplier-table tbody");
  
        data.forEach((supplier) => {
          const row = tableBody.insertRow();
          row.innerHTML = `
              <tr>
                <td class="align-middle text-center text-sm">
                  <span class="text-xl">${supplier.ID}</span>
                </td>
                <td class="align-middle text-center text-sm">
                  <span class="text-xl">${supplier.Name}</span>
                </td>
                <td class="align-middle text-center text-sm">
                  <span class="text-xl">${supplier.Email}</span>
                </td>
              </tr>
            `;
        });
      })
      .catch((error) => {
        console.error("There has been a problem with your fetch operation:", error);
      });
  });
  