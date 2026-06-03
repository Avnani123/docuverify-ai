```markdown
# DocuVerify AI

An automated document verification and intelligent OCR extraction pipeline built to parse and audit academic transcripts, credentials, certificates, and research publications. By coupling an intuitive, live React dashboard with the Gemini Multimodal Vision API, DocuVerify AI automatically extracts key academic metrics, processes large multi-format assets seamlessly, and allows administrators to cross-check records in real time.

---

## 🚀 Key Features

### 📄 Intelligent Hybrid Document Scanning (PDF, PNG, JPG)
* **Text-Based Extraction:** Integrates a clean, modern PDF parsing engine (`pdf-parse-fork`) to read raw native text layouts instantly, saving on API token overhead.
* **Multimodal Vision OCR:** For scanned copies, flat image documents (PNG, JPEG), or PDFs with broken font structures, the application automatically triggers base64 asset conversions and passes the raw binary into the Gemini Vision layer to maintain uninterrupted analysis.

### 🧠 Production-Grade Gemini AI Orchestration
* **Gemini 2.5 Flash Engine:** Powered by the modern `@google/genai` SDK to evaluate visual layout semantics, verify timestamps, and extract structure from raw data.
* **Smart Structured Fallbacks:** Built-in network defense triggers if your Gemini API free-tier quota (20 requests/day) finishes. Instead of throwing crashes or blank pages, the backend handles the error gracefully and feeds structured fallback layouts to keep your app operational and beautiful while developing.

### 🛡️ Defensively Engineered Infrastructure
* **High-Capacity File Processing:** Custom file handling layer powered by Multer configured with up to **50MB** payload buffers to comfortably digest multi-page documents without degrading node loop responsiveness.
* **Smart Account Continuity Tracking:** Every document log automatically binds the uploading account user profile directly to its record. The dashboard tracks explicitly who uploaded what, displaying authentic account profiles or clean admin context states over random mocked names.
* **Flexible Development Auth Bypass:** Includes a relaxed local authentication interceptor layer that allows rapid testing of upload forms and dashboard updates even if users aren't fully registered or logged in.

### 📊 Real-Time Administrative Audit Tools
* **Dynamic Action States:** Allows system operators to shift verification status rows across clean Mongoose-enforced states (`Pending`, `Verified`, `Rejected`, `Flagged`).
* **Direct Asset Download Pipe:** Features a dedicated background binary routing mechanism to quickly download the originally uploaded PDF or image file from local server storage straight to your desktop.

---

## 🛠️ The Tech Stack

* **Frontend:** React.js, TailwindCSS, Lucide Icons
* **Backend:** Node.js, Express.js (REST API Runtime Architecture)
* **Database:** MongoDB, Mongoose ODM
* **AI Core Engine:** `@google/genai` (Gemini Multimodal API) & `pdf-parse-fork`

---

## 📁 Project Structure

```text
docuverify-ai/
├── backend/
│   ├── middleware/        # Authentication validation filters & bypasses
│   ├── models/            # Mongoose schemas (User.js, Document.js)
│   ├── uploads/           # Dedicated local storage for processed binaries
│   ├── .env               # Backend runtime environmental keys (Git-ignored)
│   └── server.js          # Core Express pipeline engine configuration
└── frontend/              # React SPA UI layout architecture

```

---

## 🏁 Getting Started

### Prerequisites

* **Node.js:** v18 or higher recommended
* **MongoDB:** An instance running locally (`mongodb://127.0.0.1:27017`) or an Atlas Cloud Connection String

### 1. Set Up the Backend

Navigate to the backend directory:

```bash
cd backend

```

Install the project dependencies:

```bash
npm install

```

Create a `.env` file in the root of your `backend/` directory and configure your variables:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/docuverify
GEMINI_API_KEY=your_actual_gemini_api_key_here
JWT_SECRET=your_fallback_jwt_secret_token

```

Start your backend API server:

```bash
node server.js

```

### 2. Set Up the Frontend

Open a new terminal window or tab, and navigate to the frontend folder:

```bash
cd ../frontend

```

Install the client application packages:

```bash
npm install

```

Fire up the React development workspace:

```bash
npm start

```

Your browser will automatically launch your live interface at `http://localhost:3000`.

---

## 📡 Core API Integration Contracts

The backend enforces a unified JSON shape output between the live Gemini models and the fallback container layers. This ensures your dashboard cards, text summaries, and metrics lists render reliably:

```json
{
  "document_type": "Official Academic Transcript",
  "doc_classification": "Official Academic Transcript",
  "extracted_name": "Student Full Name",
  "student_name": "Student Full Name",
  "institution": "Issuing University Name",
  "issuing_entity": "Issuing University Name",
  "passing_year": "2026",
  "graduation_year": "2026",
  "gpa_metric": "9.4 CGPA",
  "calculated_grade": "9.4 CGPA",
  "confidence_score": "95%",
  "summary_text": "Clean concise sentence summary detailing contents of this file."
}

```

---

## 🔑 Administrative Credentials

The core authentication engine ships pre-configured with a master developer role designed for debugging and log auditing out of the box:

* **Admin Username:** `avani@gmail.com`
* **Secure Passkey:** `inava`

```

```
