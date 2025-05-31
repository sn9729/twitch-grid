// Twitch OAuth Configuration
const TWITCH_CLIENT_ID = 'mjfj4xuxfbzqtj5ca04nzzgezbks1y';
const REDIRECT_URI = 'https://twitch-grid.vercel.app';
const SCOPE = 'user:read:email';

// Elements
const loginBtn = document.getElementById('login-btn');
const loginBtn2 = document.getElementById('login-btn-2');
const logoutBtn = document.getElementById('logout-btn');
const userInfo = document.getElementById('user-info');
const userNameElem = document.getElementById('user-name');
const userAvatar = document.getElementById('user-avatar');
const loginPrompt = document.getElementById('login-prompt');
const appContent = document.getElementById('app-content');
const streamGrid = document.getElementById('stream-grid');
const loadingIndicator = document.getElementById('loading');
const errorContainer = document.getElementById('error-container');
const loadStreamsBtn = document.getElementById('load-streams-btn');

// Access token storage key
const ACCESS_TOKEN_KEY = 'twitch_access_token';

// Helper: Extract access token from URL fragment after OAuth redirect
function extractAccessTokenFromUrl() {
    const hash = window.location.hash.substring(1);
    const params = new URLSearchParams(hash);
    return params.get('access_token');
}

// Save access token to session storage
function saveAccessToken(token) {
    sessionStorage.setItem(ACCESS_TOKEN_KEY, token);
}

// Retrieve access token from session storage
function getAccessToken() {
    return sessionStorage.getItem(ACCESS_TOKEN_KEY);
}

// Remove access token from storage (logout)
function clearAccessToken() {
    sessionStorage.removeItem(ACCESS_TOKEN_KEY);
}

// OAuth login
function loginWithTwitch() {
    const authUrl = `https://id.twitch.tv/oauth2/authorize?response_type=token&client_id=${TWITCH_CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=${encodeURIComponent(SCOPE)}&force_verify=true`;
    window.location.href = authUrl;
}

// Logout
function logout() {
    clearAccessToken();
    window.location.reload();
}

// Fetch user info from Twitch API
async function fetchUserInfo(token) {
    const response = await fetch('https://api.twitch.tv/helix/users', {
        headers: {
            'Client-ID': TWITCH_CLIENT_ID,
            'Authorization': `Bearer ${token}`
        }
    });

    if (!response.ok) {
        throw new Error('Failed to fetch user info');
    }
    const data = await response.json();
    return data.data[0];
}

// Show user info and adjust UI accordingly
function showUserInfo(user) {
    userAvatar.src = user.profile_image_url;
    userNameElem.textContent = user.display_name;
    userInfo.classList.remove('hidden');
    loginBtn.classList.add('hidden');
    if (loginBtn2) loginBtn2.classList.add('hidden');
    loginPrompt.classList.add('hidden');
    appContent.classList.remove('hidden');
}

// Hide user info and reset UI
function hideUserInfo() {
    userInfo.classList.add('hidden');
    loginBtn.classList.remove('hidden');
    if (loginBtn2) loginBtn2.classList.remove('hidden');
    loginPrompt.classList.remove('hidden');
    appContent.classList.add('hidden');
}

// Fetch stream embed URL
function getStreamEmbedUrl(channelName) {
    // Twitch embed URL with autoplay muted to prevent auto audio play issues
    return `https://player.twitch.tv/?channel=${channelName}&parent=${window.location.hostname}&autoplay=false&muted=true`;
}

// Load streams for given streamer names
async function loadStreams() {
    errorContainer.innerHTML = '';
    streamGrid.innerHTML = '';
    loadingIndicator.classList.remove('hidden');

    // Collect streamer names
    const streamers = [
        document.getElementById('streamer1').value.trim().toLowerCase(),
        document.getElementById('streamer2').value.trim().toLowerCase(),
        document.getElementById('streamer3').value.trim().toLowerCase(),
        document.getElementById('streamer4').value.trim().toLowerCase()
    ].filter(name => name !== '');

    if (streamers.length === 0) {
        loadingIndicator.classList.add('hidden');
        errorContainer.innerHTML = '<div class="error-message">Please enter at least one streamer username.</div>';
        return;
    }

    try {
        // Validate streamers by checking if they exist using Twitch API
        const validStreamers = await validateStreamers(streamers);
        if (validStreamers.length === 0) {
            loadingIndicator.classList.add('hidden');
            errorContainer.innerHTML = '<div class="error-message">No valid streamers found. Please check the usernames.</div>';
            return;
        }

        // Display streams
        validStreamers.forEach(streamer => {
            const container = document.createElement('div');
            container.className = 'stream-container';

            const titleBar = document.createElement('div');
            titleBar.className = 'stream-controls';
            const title = document.createElement('span');
            title.className = 'stream-title';
            title.textContent = streamer.display_name;
            titleBar.appendChild(title);

            const iframe = document.createElement('iframe');
            iframe.setAttribute('src', getStreamEmbedUrl(streamer.login));
            iframe.setAttribute('allowfullscreen', '');
            iframe.setAttribute('scrolling', 'no');
            iframe.setAttribute('frameborder', '0');

            container.appendChild(titleBar);
            container.appendChild(iframe);

            streamGrid.appendChild(container);
        });
    } catch (err) {
        errorContainer.innerHTML = `<div class="error-message">Error loading streams: ${err.message}</div>`;
    } finally {
        loadingIndicator.classList.add('hidden');
    }
}

// Validate streamers existence and get user info from Twitch API
async function validateStreamers(usernames) {
    const token = getAccessToken();
    if (!token) throw new Error('User not authenticated');

    const params = usernames.map(u => `login=${encodeURIComponent(u)}`).join('&');
    const url = `https://api.twitch.tv/helix/users?${params}`;

    const response = await fetch(url, {
        headers: {
            'Client-ID': TWITCH_CLIENT_ID,
            'Authorization': `Bearer ${token}`
        }
    });

    if (!response.ok) {
        throw new Error('Failed to fetch streamer info');
    }

    const data = await response.json();
    return data.data; // array of user objects
}

// Initialization on page load
async function initialize() {
    // Check if access token is in URL fragment (after OAuth redirect)
    const tokenFromUrl = extractAccessTokenFromUrl();

    if (tokenFromUrl) {
        saveAccessToken(tokenFromUrl);
        // Remove token from URL fragment to clean URL
        history.replaceState(null, null, window.location.pathname + window.location.search);
    }

    const token = getAccessToken();
    if (token) {
        try {
            const user = await fetchUserInfo(token);
            showUserInfo(user);
        } catch (err) {
            console.error('Error fetching user info:', err);
            clearAccessToken();
            hideUserInfo();
        }
    } else {
        hideUserInfo();
    }
}

// Attach event listeners
if (loginBtn) loginBtn.addEventListener('click', loginWithTwitch);
if (loginBtn2) loginBtn2.addEventListener('click', loginWithTwitch);
if (logoutBtn) logoutBtn.addEventListener('click', logout);
if (loadStreamsBtn) loadStreamsBtn.addEventListener('click', loadStreams);

// Run initialization
initialize();
