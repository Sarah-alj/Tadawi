import { fetchData } from '../js/api.js';

document.addEventListener('DOMContentLoaded', init);

async function init() {
  const fetchResponse = await fetchData('/api/labs');
  if (!fetchResponse.isOk) {
    alert(fetchResponse.error);
    return;
  }
  const labs = fetchResponse.data;

  if (labs.length === 0) {
    document.getElementById('labs-table-body').innerHTML = "<tr><td colspan='5'>No labs found.</td></tr>";
    return;
  }

  const labsTableBody = document.getElementById('labs-table-body');
  labs.forEach((lab) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${lab.patient.name}</td>
      <td>${lab.labName}</td>
      <td>${new Date(lab.bookingDateTime).toLocaleDateString()}</td>
      <td>${new Date(lab.bookingDateTime).toLocaleTimeString()}</td>
      <td>${lab.testType}</td>
    `;
    labsTableBody.appendChild(row);
  });
}
