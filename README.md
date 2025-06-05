🐦 Twitter (X) Clone

A full-stack social media application inspired by Twitter (X), built using Next.js 15, Tailwind CSS, TanStack Query, MongoDB, Cloudinary, and Node.js/Express. It supports authentication, posting tweets, image uploads, user profiles, and more.

⸻

🚀 Features
	•	🔐 Authentication with NextAuth.js
	•	📝 Tweet posting, liking, retweeting, and commenting
	•	🧵 Threaded conversations
	•	👤 User profiles with image upload (via Cloudinary)
	•	🔄 Real-time data fetching with TanStack Query
	•	📱 Responsive design using Tailwind CSS
	•	🗂️ API Routes using Next.js App Router
	•	☁️ Image upload support with Cloudinary
	•	🌐 Server-side rendering (SSR) for SEO and performance

⸻

🛠️ Tech Stack
	•	Frontend: Next.js 15 (App Router), Tailwind CSS, TanStack Query
	•	Backend: Node.js, Express.js
	•	Database: MongoDB with Mongoose
	•	Authentication: NextAuth.js (Credentials provider)
	•	File Uploads: Cloudinary
	•	State Management: TanStack Query
	•	Deployment: Vercel / Render

⸻

🧑‍💻 Getting Started

1. Clone the repository

git clone https://github.com/your-username/twitter-x-clone.git
cd twitter-x-clone

2. Install dependencies

npm install

3. Set up environment variables

Create a .env.local file and add the following:

MONGODB_URI=your_mongodb_connection_string
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:8000
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

4. Run the development server

npm run dev

Visit http://localhost:8000 to view the app.

⸻

🧪 Development Notes
	•	Main logic is built under the app/ directory using the App Router
	•	API routes are defined in app/api/...
	•	MongoDB models are in the app/models directory
	•	Auth setup is handled in app/api/auth/[...nextauth]/route.ts
	•	Cloudinary upload logic is encapsulated in a reusable utility

⸻

☁️ Deployment

You can easily deploy this app using:
	•	Vercel (Recommended for Next.js)
	•	Render (for Node.js API if needed separately)

Refer to the Next.js Deployment Docs for details.

⸻

📄 License

This project is licensed under the MIT License.

⸻

Let me know if you’d like to add images, badges (e.g., build passing, deployed on Vercel), or auto-deployment instructions.
