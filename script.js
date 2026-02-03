/***********************
 * DATA
 ***********************/
const schools = [
  {
    id: "psbb_tnagar",
    name: "PSBB Senior Secondary School",
    area: "T Nagar",
    fees: "₹45,000 – ₹70,000",
    lat: 13.0418,
    lng: 80.2337
  },
  {
    id: "dav_boys_gopalapuram",
    name: "DAV Boys Senior Secondary School",
    area: "Gopalapuram",
    fees: "₹40,000 – ₹65,000",
    lat: 13.0476,
    lng: 80.2587
  },
  {
    id: "dav_girls_gopalapuram",
    name: "DAV Girls Senior Secondary School",
    area: "Gopalapuram",
    fees: "₹38,000 – ₹60,000",
    lat: 13.0469,
    lng: 80.2581
  }
];

const colleges = [
  {
    id: "saveetha_thandalam",
    name: "Saveetha Engineering College",
    area: "Thandalam",
    fees: "₹1,00,000 – ₹2,00,000",
    lat: 13.0219,
    lng: 80.0215
  },
  {
    id: "ssn_kalavakkam",
    name: "SSN College of Engineering",
    area: "Kalavakkam",
    fees: "₹1,50,000 – ₹2,50,000",
    lat: 12.7904,
    lng: 80.2153
  }
];
// ===== LOAD USER-ADDED DATA =====
const userSchools = JSON.parse(localStorage.getItem("user_schools")) || [];
const userColleges = JSON.parse(localStorage.getItem("user_colleges")) || [];

// merge with default data
schools.push(...userSchools);
colleges.push(...userColleges);

/***********************
 * SAVE DATA FOR DETAILS PAGE
 ***********************/
localStorage.setItem("all_schools", JSON.stringify(schools));
localStorage.setItem("all_colleges", JSON.stringify(colleges));

/***********************
 * STATE
 ***********************/
let currentType = "schools";
let markers = [];

/***********************
 * MAP
 ***********************/
const map = L.map("map").setView([13.0827, 80.2707], 12);
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "© OpenStreetMap"
}).addTo(map);

/***********************
 * HELPERS
 ***********************/
function getCurrentData() {
  return currentType === "schools" ? schools : colleges;
}

/***********************
 * SEARCH
 ***********************/
document.getElementById("searchInput").addEventListener("input", function () {
  const q = this.value.toLowerCase();
  const filtered = getCurrentData().filter(item =>
    item.name.toLowerCase().includes(q) ||
    item.area.toLowerCase().includes(q)
  );
  renderList(filtered);
});

/***********************
 * RENDER
 ***********************/
function renderList(data) {
  const listDiv = document.getElementById("schoolList");
  listDiv.innerHTML = "";

  markers.forEach(m => map.removeLayer(m));
  markers = [];

  data.forEach(item => {
    // marker
    const marker = L.marker([item.lat, item.lng]).addTo(map);
    marker.bindPopup(`<b>${item.name}</b><br>${item.area}`);
    markers.push(marker);

    // card
    const card = document.createElement("div");
    card.className = "school-card";
    card.innerHTML = `
      <div class="school-name">${item.name}</div>
      <div class="school-info">${item.area} • ${item.fees}</div>
      <button class="dir-btn">Get Directions</button>
      <button class="details-btn">Details</button>
    `;

    // card click = zoom
    card.addEventListener("click", () => {
      map.setView([item.lat, item.lng], 15);
      marker.openPopup();
    });

    // directions
    card.querySelector(".dir-btn").addEventListener("click", e => {
      e.stopPropagation();
      getDirections(item.lat, item.lng);
    });

    // details
    card.querySelector(".details-btn").addEventListener("click", e => {
      e.stopPropagation();
      window.location.href =
        `details.html?id=${item.id}&type=${currentType}`;
    });

    listDiv.appendChild(card);
  });
}

/***********************
 * GPS DIRECTIONS
 ***********************/
function getDirections(destLat, destLng) {
  if (!navigator.geolocation) {
    alert("Geolocation not supported");
    return;
  }

  navigator.geolocation.getCurrentPosition(pos => {
    const uLat = pos.coords.latitude;
    const uLng = pos.coords.longitude;
    const url =
      `https://www.openstreetmap.org/directions?engine=fossgis_osrm_car&route=${uLat},${uLng};${destLat},${destLng}`;
    window.open(url, "_blank");
  });
}

/***********************
 * TOGGLE
 ***********************/
document.getElementById("schoolsBtn").onclick = () => {
  currentType = "schools";
  renderList(schools);
};

document.getElementById("collegesBtn").onclick = () => {
  currentType = "colleges";
  renderList(colleges);
};

/***********************
 * INITIAL LOAD
 ***********************/
renderList(schools);
localStorage.setItem("all_schools", JSON.stringify(schools));
localStorage.setItem("all_colleges", JSON.stringify(colleges));