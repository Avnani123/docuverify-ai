# DocuVerify AI

An automated document verification and OCR pipeline built to parse academic transcripts, certificates, and reports. By combining a web dashboard with the Gemini Multimodal Vision API, DocuVerify AI extracts key academic metrics, handles large multi-format files seamlessly, and allows administrators to review and update records in real time.

## Features

* **Intelligent AI Processing:** Integrates Google's gemini-2.5-flash model to analyze document text and structure, extracting clean structured metadata automatically.
* **Smart Content Extractor:** Native, fallback-supported parser that effortlessly unpacks both text-heavy PDFs and visual image formats like JPEG and PNG.
* **Fault-Tolerant File Management:** Custom file-handling engine powered by Multer configured to accept single asset payloads up to 50MB without breaking server connectivity.
* **Robust Database Integration:** Enforces structured validation states (Pending, Verified, Rejected, Flagged) using strict Mongoose schema validation.
* **Dual-View Operational Registry:** Features an administrator view for processing Live Verification Logs alongside a streamlined student and user workspace dashboard.

## The Tech Stack

* **Frontend:** React, TailwindCSS
* **Backend:** Node.js, Express.js
* **Database:** MongoDB, Mongoose ODM
* **AI Core Engine:** @google/genai (Gemini Multimodal API) and pdf-parse-fork


## Project Structure

```text
docuverify-ai/
├── backend/
│   ├── middleware/       # Auth validation filters
│   ├── models/           # Mongoose schemas (User, Document)
│   ├── uploads/          # Local staging area for processed binaries
│   ├── .env              # Backend runtime environment keys
│   └── server.js         # Core pipeline engine configuration
└── frontend/             # React SPA layout architecture

## Getting Started

### Prerequisites

* Node.js (v18 or higher recommended)
* MongoDB instance running locally or via Atlas Cloud

### 1. Set Up the Backend

Navigate to the backend directory:

```bash
cd backend

```

Install the project dependencies:

```bash
npm install

```

Create a .env file in the root of the backend/ folder and insert your credentials:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/docuverify
GEMINI_API_KEY=your_actual_gemini_api_key_here
JWT_SECRET=your_fallback_jwt_secret_token

```

Start the local API engine server:

```bash
node server.js

```

### 2. Set Up the Frontend

Open a new terminal window and navigate to the frontend directory:

```bash
cd ../frontend

```

Install the client application packages:

```bash
npm install

```

Fire up the React development environment:

```bash
npm start

```

Your browser should automatically spin up your live workspace at http://localhost:3000.

## Administrative Credentials

The core authentication engine ships with built-in master roles designed for systemic review testing logs:

* **Admin User:** avani@gmail.com
* **Passkey System:** inava
