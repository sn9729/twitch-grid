
# 🎥 TwitchGrid

**TwitchGrid** is a modern, responsive multi-stream viewer for Twitch. Log in with your Twitch account and watch up to four Twitch streams at once, all in a beautiful grid layout. Perfect for esports fans, multi-game viewers, and anyone who wants to keep an eye on several streamers simultaneously.

---

## 🚀 Features

- **🎮 Twitch OAuth Login**: Securely log in with your Twitch account.
- **🖥️ Multi-Stream Viewing**: Watch up to 4 Twitch streams side by side.
- **🔍 Easy Stream Selection**: Enter Twitch usernames to load their streams instantly.
- **📱 Mobile-Friendly**: Fully responsive design for desktop, tablet, and mobile devices.
- **🌈 Modern UI**: Clean, visually appealing interface.

---

## 🌐 Live Demo

👉 [https://twitch-grid.vercel.app](https://twitch-grid.vercel.app)

---

## 🛠️ Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/twitch-grid.git
cd twitch-grid
```

### 2. Configure Twitch OAuth

- Go to the [Twitch Developer Console](https://dev.twitch.tv/console/apps).
- Register your application or select an existing app.
- Add your deployment URL (e.g., `https://twitch-grid.vercel.app`) to the **OAuth Redirect URLs**.
- Copy your **Client ID** and update it in `script.js` if needed.

---

### 3. Deploy

You can deploy this project as a static site using **Vercel**, **Netlify**, **GitHub Pages**, or any static hosting provider.

**For Vercel**:

- Push your code to GitHub.
- Import your repo in Vercel.
- Deploy — no extra configuration needed!

---

### 4. Run Locally

Using Python 3:

```bash
python -m http.server 3000
```

Or use any static server like `live-server` or `serve`.

Then open your browser and go to: [http://localhost:3000](http://localhost:3000)

> **Note**: If testing locally, add `http://localhost:3000` as an OAuth Redirect URL in your Twitch Developer Console.

---

## 📄 License

This project is licensed under the **MIT License**.

---

## 🙏 Acknowledgements

- [Twitch API Documentation](https://dev.twitch.tv/docs/)
- Vercel for easy static deployments

---

Enjoy multi-streaming with **TwitchGrid**! 🎉
