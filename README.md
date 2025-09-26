# 🚉 Journey Planner – Mumbai Rail + Bus + Last Mile

A full-stack **Journey Planner** for Mumbai built using **React (frontend)** and **OpenTripPlanner (backend)**.
The app helps users find the **best 3 routes** between two stations with support for:

* ✅ Multi-mode transport (Rail + Bus).
* ✅ Last-mile options (Walk, Auto, Ola/Uber).
* ✅ Best route tagging (Fastest, Cheapest, Least Transfers).
* ✅ Step-by-step journey details with map visualization.
* ✅ Mumbai-specific fare estimation (local trains).

---

## 📌 Features

* **Interactive Map (Leaflet.js):** Visualize routes, stations, and journeys.
* **Multi-Mode Routing:** Combine Rail and Bus seamlessly.
* **Custom Fare Engine:**

  * Local train fares estimated using distance slabs.
  * Last-mile Auto/Uber/Walk adjustments applied.
* **Best 3 Routes:**

  * 🟦 *Fastest*
  * 🟩 *Cheapest*
  * 🟧 *Least Transfers*
* **Sidebar Journey Details:** Step-by-step instructions for each route.
* **Legend & Color-Coding:** Clear transport mode colors on the map.

---

## 🛠️ Tech Stack

**Frontend**

* React + Vite
* React-Leaflet (OpenStreetMap integration)
* react-select (station dropdowns)

**Backend**

* [OpenTripPlanner (OTP) 2.x](https://www.opentripplanner.org/)
* GTFS data (Mumbai rail & bus feeds)
* Java 17+

---

## 📂 Project Structure

```
journey-planner/
│
├── frontend/          # React app
│   ├── src/
│   │   ├── components/  # MapView, Sidebar, etc.
│   │   ├── utils/       # polyline decoder, helpers
│   │   └── App.jsx
│   └── package.json
│
├── backend/           # OpenTripPlanner setup
│   ├── graphs/        # Prebuilt OTP graphs
│   ├── gtfs/          # Transit feeds
│   ├── router-config.json
│   └── start.sh       # Script to launch OTP
│
└── README.md
```

---

## ⚙️ Setup Instructions

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/yourusername/journey-planner.git
cd journey-planner
```

---

### 2️⃣ Backend (OpenTripPlanner)

1. Download the OTP JAR (v2.5.0 or latest stable).
   👉 [Releases](https://github.com/opentripplanner/OpenTripPlanner/releases)

2. Place the JAR in the `backend/` folder.

3. Add GTFS data to `backend/gtfs/` (Mumbai Rail & Bus).

4. Build OTP graph:

```bash
cd backend
java -Xmx2G -jar otp-2.5.0-shaded.jar --build ./graphs
```

5. Start OTP server:

```bash
./start.sh
```

This runs OTP on **[http://localhost:8080](http://localhost:8080)**.

---

### 3️⃣ Frontend (React App)

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on **[http://localhost:5173](http://localhost:5173)**.

---

## 🚀 Usage

1. Select **From** and **To** stations.
2. Choose modes (**Rail, Bus**) and last-mile option (**Walk, Auto, Ola/Uber**).
3. Click **Find Routes**.
4. View:

   * Routes on the map.
   * Best 3 route cards in sidebar.
   * Step-by-step journey details.

---

## 📖 Configuration

* `backend/router-config.json` → OTP routing preferences.
* `stations.json` → List of station coordinates for dropdowns.
* Fare logic → Implemented in `Sidebar.js`.

---

## 🤝 Contributing

1. Fork the repo.
2. Create a new branch (`feature-x`).
3. Commit changes.
4. Open a Pull Request.

---
## Authors

- [@Rishabh Sharma](https://github.com/Rishabh-thebuilder)
- [@Tarang Gaur](https://github.com/Rishabh-thebuilder)
- [@Ajaz Gulfrosh](https://github.com/Rishabh-thebuilder)
