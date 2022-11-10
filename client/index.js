document.addEventListener("DOMContentLoaded", function () {
  fetch("http://localhost:5000/getAll")
    .then((response) => response.json())
    .then((data) => loadHTMLTable(data["data"]));
});

document
  .querySelector("table tbody")
  .addEventListener("click", function (event) {
    if (event.target.className === "delete-row-btn") {
      deleteRowById(event.target.dataset.id);
    }
    if (event.target.className === "edit-row-btn") {
      handleEditRow(event.target.dataset.id);
    }
  });

const updateBtn = document.querySelector("#update-row-btn");
const searchBtn = document.querySelector("#search-btn");

searchBtn.onclick = function () {
  const searchValue = document.querySelector("#search-input").value;

  fetch("http://localhost:5000/search/" + searchValue)
    .then((response) => response.json())
    .then((data) => loadHTMLTable(data["data"]));
};

function deleteRowById(id) {
  fetch("http://localhost:5000/delete/" + id, {
    method: "DELETE",
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        location.reload();
      }
    });
}

function handleEditRow(id) {
  const updateSection = document.querySelector("#update-row");
  updateSection.hidden = false;
  document.querySelector("#update-name-input").dataset.id = id;
}

updateBtn.onclick = function () {
  const updateNameInput = document.querySelector("#update-name-input");
  const updateAddressInput = document.querySelector("#update-address-input");
  const updateAgeInput = document.querySelector("#update-age-input");
  const updateDobInput = document.querySelector("#update-dob-input");
  const updateRollnoInput = document.querySelector("#update-rollno-input");
  const updateBloodInput = document.querySelector("#update-blood-input");

  console.log(updateNameInput);

  fetch("http://localhost:5000/update", {
    method: "PATCH",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify({
      id: updateNameInput.dataset.id,
      name: updateNameInput.value,
      address: updateAddressInput.value,
      age: updateAgeInput.value,
      dob: updateDobInput.value,
      rollno: updateRollnoInput.value,
      blood: updateBloodInput.value,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        location.reload();
      }
    });
};

const addBtn = document.querySelector("#add-name-btn");

addBtn.onclick = function () {
  const nameInput = document.querySelector("#name-input");
  const addressInput = document.querySelector("#address-input");
  const ageInput = document.querySelector("#age-input");
  const dobInput = document.querySelector("#dob-input");
  const rollnoInput = document.querySelector("#rollno-input");
  const bloodInput = document.querySelector("#blood-input");

  const name = nameInput.value;
  const address = addressInput.value;
  const age = ageInput.value;
  const dob = dobInput.value;
  const rollno = rollnoInput.value;
  const blood = bloodInput.value;
  nameInput.value = "";

  fetch("http://localhost:5000/insert", {
    headers: {
      "Content-type": "application/json",
    },
    method: "POST",
    body: JSON.stringify({
      name: name,
      address: address,
      age: age,
      dob: dob,
      rollno: rollno,
      blood: blood,
    }),
  })
    .then((response) => response.json())
    .then((data) => insertRowIntoTable(data["data"]));
};

function insertRowIntoTable(data) {
  console.log(data);
  const table = document.querySelector("table tbody");
  const isTableData = table.querySelector(".no-data");

  let tableHtml = "<tr>";

  for (var key in data) {
    if (data.hasOwnProperty(key)) {
      if (key === "dateAdded") {
        data[key] = new Date(data[key]).toLocaleString();
      }
      tableHtml += `<td>${data[key]}</td>`;
    }
  }

  tableHtml += `<td><button class="delete-row-btn" data-id=${data.id}>Delete</td>`;
  tableHtml += `<td><button class="edit-row-btn" data-id=${data.id}>Edit</td>`;

  tableHtml += "</tr>";

  if (isTableData) {
    table.innerHTML = tableHtml;
  } else {
    const newRow = table.insertRow();
    newRow.innerHTML = tableHtml;
  }
}

function loadHTMLTable(data) {
  const table = document.querySelector("table tbody");

  if (data.length === 0) {
    table.innerHTML = "<tr><td class='no-data' colspan='6'>No Data</td></tr>";
    return;
  }

  let tableHtml = "";

  data.forEach(function ({
    id,
    name,
    address,
    age,
    dob,
    rollno,
    blood,
    date_added,
  }) {
    tableHtml += "<tr>";
    tableHtml += `<td>${id}</td>`;
    tableHtml += `<td>${name}</td>`;
    tableHtml += `<td>${address}</td>`;
    tableHtml += `<td>${age}</td>`;
    tableHtml += `<td>${dob}</td>`;
    tableHtml += `<td>${rollno}</td>`;
    tableHtml += `<td>${blood}</td>`;
    tableHtml += `<td>${new Date(date_added).toLocaleString()}</td>`;
    tableHtml += `<td><button class="delete-row-btn" data-id=${id}>Delete</td>`;
    tableHtml += `<td><button class="edit-row-btn" data-id=${id}>Edit</td>`;
    tableHtml += "</tr>";
  });

  table.innerHTML = tableHtml;
}
