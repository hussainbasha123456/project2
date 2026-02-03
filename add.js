if (!localStorage.getItem("currentUser")) {
    window.location.href = "login.html";
  }
  
  document.getElementById("addForm").addEventListener("submit", e => {
    e.preventDefault();
  
    const type = document.getElementById("type").value;
    const item = {
      id: Date.now().toString(),
      name: name.value,
      area: area.value,
      about: about.value,
      fees: fees.value,
      video: video.value,
      lat: parseFloat(lat.value),
      lng: parseFloat(lng.value)
    };
  
    const key = type === "schools" ? "user_schools" : "user_colleges";
    const data = JSON.parse(localStorage.getItem(key)) || [];
  
    data.push(item);
    localStorage.setItem(key, JSON.stringify(data));
  
    alert("Saved successfully");
    window.location.href = "index.html";
  });