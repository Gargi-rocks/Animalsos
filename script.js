document.addEventListener("DOMContentLoaded", () => {
    const sosForm = document.getElementById("sosForm");
    const reportsContainer = document.getElementById("reports");
  
    // Handle form submissior 
    sosForm.addEventListener("submit", (event) => {
      event.preventDefault();
  
      const animalType = document.getElementById("animalType").value;
      const location = document.getElementById("location").value;
      const description = document.getElementById("description").value;
  
      if (animalType && location && description) {
        fetch('http://localhost:3000/addReport', { // URL of your backend
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            animalType,
            location,
            description,
          }),
        })
        
          .then(response => response.json())
          .then(data => {
            if (data.message) {
              alert(data.message); // Success message
              document.getElementById("sosForm").reset();
            } else {
              alert('Error: ' + data.error);
            }
          })
          .catch(err => console.error('Error:', err));
      } else {
        alert('Please fill in all fields.');
      }
    });
  
    // Function to add a new report to the list
    function addReport(animalType, location, description) {
      const reportItem = document.createElement("div");
      reportItem.classList.add("report-item");
  
      reportItem.innerHTML = `
        <h3>${animalType}</h3>
        <p><strong>Location:</strong> ${location}</p>
        <p>${description}</p>
      `;
  
      reportsContainer.appendChild(reportItem);
    }
  });
  