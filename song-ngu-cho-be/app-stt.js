console.log("App.js loaded OK");

// Flag to prevent multiple playback
let isSpeaking = false;
let wordsData = {};
let currentTopic = '';
let currentWords = [];
let currentIndex = 0;
let wrongCount = 0;
let readAttempts = 0;
let currentActivity = '';
let isQuizMode = false;
let quizScore = 0;
let isUserInteracted = false;
let speechVolume = 1.0;
let speechRate = 1.0;
let childName = '';
let speakAttempts = 0;
let lastWordIndex = -1;
let lastCompletedTopic = '';
let isListening = false;
let gamePhase = 0;
let gameWords = [];
let gameIndex = 0;
let reviewIndex = 0;
let correctWord = null;
let activityFlow = [];
let currentActivityIndex = 0;
let gameActive = false;
let guidePlayedThisSession = false; // chỉ phát hướng dẫn cho 7 game ở round đầu tiên
// ---- Gamification System ----
let userCoins = 0;
let userPoints = 0;
let dailyStreak = 0;
let lastLoginDate = '';
let unlockedStickers = [];
let unlockedAvatars = ['default'];
let currentAvatar = 'default';
// ---- Thêm biến mới ----
let currentLearningMode = ''; // 'letters', 'topics', 'review'
let currentLetter = '';
let currentGrade = '';
let hasAnswered = false; // Flag để biết đã có final result chưa
// ---- DOM references (sẽ cập nhật động) ----
let feedback, error, wordDisplay, wordImage, listenBtn, speakBtn, topicSelect, successSound, tryAgainEnSound, quizStartEnSound, starsContainer, bubblesContainer, gameBtn, gameArea, loader, transcriptBox, wordSound, praiseEnSound, stars, bubbles;

function debugGameFlow() {
    console.log(`[GAME FLOW] Phase: ${gamePhase}, GameIndex: ${gameIndex}, Active: ${gameActive}, Words: ${gameWords ? gameWords.length : 0}, CurrentWord: ${correctWord ? correctWord.en : 'none'}`);
}
// ---- CONFIGURATION ----
const SPEECH_THRESHOLD = 0.8; // Ngưỡng chấp nhận đúng
const WRONG_ATTEMPTS_LIMIT = 2; // Số lần thử tối đa trước khi chuyển tiếp
const WRONG_DELAY = 1000; // Thời gian chờ trước khi chuyển (ms)
const CORRECT_DELAY = 1500; // Thời gian chờ khi đúng (ms)

let deferredPrompt = null;

window.addEventListener('beforeinstallprompt', (e) => {
  console.log('[PWA] beforeinstallprompt fired');

  e.preventDefault();   // ⛔ chặn popup mặc định
  deferredPrompt = e;

  // 👉 Hiện nút "Cài ứng dụng"
  const btn = document.getElementById('installAppBtn');
  if (btn) btn.style.display = 'block';
});

function installApp() {
  if (!deferredPrompt) return;

  deferredPrompt.prompt();

  deferredPrompt.userChoice.then(choice => {
    console.log('[PWA] install result:', choice.outcome);
    deferredPrompt = null;
  });
}


function showIOSInstallHint() {
  const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent);
  const isStandalone = window.navigator.standalone === true;

  if (isIOS && !isStandalone) {
    alert(
      "📱 Cài app cho bé:\n" +
      "1. Mở bằng Safari\n" +
      "2. Nhấn nút Chia sẻ\n" +
      "3. Chọn 'Add to Home Screen'"
    );
  }
}

showIOSInstallHint();


function proceedToNextWord() {
    // 🔥 QUAN TRỌNG: Tự động chuyển sang từ tiếp theo
    currentIndex++;
    
    // 🟢 KIỂM TRA NẾU HẾT TỪ
    if (currentIndex >= currentWords.length) {
        if (currentActivity === 'learn' && !isQuizMode) {
            // Chuyển sang activity tiếp theo
            currentActivityIndex++;
            setTimeout(startNextActivity, 500);
        } else if (currentActivity === 'quiz' && isQuizMode) {
            finishQuiz();
        } else if (currentActivity === 'games') {
            // Chuyển game tiếp theo
            setupNextGameTurn();
        }
    } else {
        // Hiển thị từ tiếp theo
        showWord();
    }
    
    // Reset counters
    wrongCount = 0;
    window.answeredLock = false;
}

// ---- Thêm hàm attachButtonListeners ----
function attachButtonListeners() {
    if (listenBtn) {
        if (!listenBtn.dataset.attached) {
            listenBtn.addEventListener('click', async () => {
                console.log('Listen button clicked, currentWords:', currentWords, 'currentIndex:', currentIndex);
                if (!currentWords || currentIndex >= currentWords.length) return;
                const currentWord = currentWords[currentIndex];
                await speak(currentWord.en || '');
            });
            listenBtn.dataset.attached = 'true';
        }
    }

    // 🔥 QUAN TRỌNG: KHÔNG gắn sự kiện click cho speakBtn ở đây
    // Sự kiện speakBtn sẽ được gắn động trong showWord() cho từng mode
    
    if (gameBtn) {
        if (!gameBtn.dataset.attached) {
            gameBtn.addEventListener('click', () => {
                startMiniGame();
            });
            gameBtn.dataset.attached = 'true';
        }
    }
    console.log('[DEBUG] Attached button listeners for current screen');
}

function validateSelectionBeforeStart() {
    const currentScreen = document.querySelector('.screen.active');
    if (!currentScreen) return false;
    
    const activeModeBtn = currentScreen.querySelector('.mode-btn.active');
    if (!activeModeBtn) return false;
    
    const mode = activeModeBtn.dataset.mode;
    
    if (mode === 'alphabet') {
        const alphabetSelect = currentScreen.querySelector('#alphabetSelect');
        return alphabetSelect && alphabetSelect.value;
    } else {
        const topicSelect = currentScreen.querySelector('#topicSelect');
        return topicSelect && topicSelect.value;
    }
}

function showScreen(screenId) {
    // Ẩn tất cả các màn hình khác
    document.querySelectorAll('.screen').forEach(screen => {
        screen.style.display = 'none';
    });

    const target = document.getElementById(screenId);
    if (target) {
        target.style.display = 'block';
        updateDOMReferences(screenId);
        attachButtonListeners();
        attachTopicSelectHandler();
        console.log('[DEBUG] Showed screen:', screenId);

        if (screenId !== 'home') {
            populateTopics();

            // 🟢 Kiểm tra quyền mở khóa (nếu người dùng đã đăng nhập)
            const savedUser = JSON.parse(localStorage.getItem('userData') || '{}');
            const savedEmail = savedUser?.email;
            const savedPassword = savedUser?.password;

            if (savedEmail) {
                console.log('🔍 Kiểm tra trạng thái mở khóa cho:', savedEmail);
                
                // 🟢 THÊM: Xử lý an toàn nếu hàm checkUserUnlockStatus chưa được định nghĩa
                if (typeof checkUserUnlockStatus === 'function') {
                    checkUserUnlockStatus(savedEmail, savedPassword || "").catch(err => {
                        console.warn('⚠️ Không thể kiểm tra trạng thái mở khóa:', err);
                        // Tiếp tục mà không làm crash app
                    });
                } else {
                    console.warn('⚠️ Hàm checkUserUnlockStatus chưa được định nghĩa, sử dụng trạng thái localStorage hiện tại');
                    // 🟢 Vẫn hiển thị UI dựa trên trạng thái đã lưu
                    const isActivated = localStorage.getItem("accountActivated") === "true";
                    console.log('📋 Trạng thái kích hoạt từ localStorage:', isActivated);
                }
            } else {
                console.log('⚠️ Không có thông tin tài khoản — chỉ hiển thị chủ đề miễn phí.');
            }

            // 🟢 Chỉ phát âm hướng dẫn khi từ HOME sang màn học
            const previousScreen = document.querySelector('.screen[style*="display: block"]');
            const cameFromHome = previousScreen && previousScreen.id === 'home';
            
            if (cameFromHome && (screenId === 'learn' || screenId === 'quiz' || screenId === 'games')) {
                setTimeout(async () => {
                    try {
                        await playGuideAudio("cachHocSound");
                    } catch (err) {
                        console.warn('Could not play cachHocSound on screen show:', err);
                    }
                }, 500);
            }
        }
    }
}
function isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth < 768;
}

/* ==========================================================
   🔐 ĐĂNG KÝ & ĐĂNG NHẬP NGƯỜI DÙNG
   Tích hợp với Google Apps Script backend
   ========================================================== */

// 🔹 Link Google Apps Script của bạn (deploy web app → anyone can access)
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyRVyWmDB3PZjglFoqjgi20my008z57IW_qjVRGi0wndzIU-nBeSBMaQgsURxR_3OPH/exec";

// ==========================================
// 🧠 HIỂN THỊ FORM ĐĂNG KÝ (KHI CHƯA CÓ TÀI KHOẢN)
// ==========================================
function showRegisterForm(topic) {
    const user = JSON.parse(localStorage.getItem("userData") || "{}");
    if (user.email && localStorage.getItem("accountActivated") === "true") {
        alert("✅ Tài khoản của bạn đã được kích hoạt. Bạn có thể học ngay!");
        return;
    }

    let overlay = document.getElementById('registerOverlay');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.id = 'registerOverlay';
        overlay.className = 'register-overlay';
        overlay.innerHTML = `
            <div class="register-form">
                <h3>🔓 Đăng ký mở khóa: ${topic}</h3>
                <p>Điền thông tin để admin liên hệ và hướng dẫn</p>
                
                <form id="registerForm">
                    <div class="form-group">
                        <label>👤 Họ tên phụ huynh *</label>
                        <input type="text" id="fullName" required>
                    </div>
                    <div class="form-group">
                        <label>📧 Email *</label>
                        <input type="email" id="email" required>
                    </div>
                    <div class="form-group">
                        <label>📞 Số điện thoại *</label>
                        <input type="tel" id="phone" required>
                    </div>
                    <div class="form-group">
                        <label>🔑 Mật khẩu *</label>
                        <input type="password" id="password" placeholder="Tối thiểu 6 ký tự" required>
                    </div>
                    
                    <!-- 🆕 THÔNG TIN GÓI VÀ GIỚI THIỆU -->
                    <div class="form-group">
                        <label>📦 Chọn gói sử dụng *</label>
                        <select id="packageType" required>
                            <option value="1month">1 tháng - 45.000đ</option>
                            <option value="3months">3 tháng + 15 ngày - 135.000đ</option>
                            <option value="6months">6 tháng + 30 ngày - 270.000đ</option>
                            <option value="1year">1 năm + 75 ngày - 540.000đ</option>
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label>👥 Người giới thiệu (nếu có)</label>
                        <input type="tel" id="referrerPhone" placeholder="Số điện thoại người giới thiệu">
                    </div>
                    
                    <div class="form-footer">
                        <button type="submit" class="btn-primary">📩 Gửi đăng ký</button>
                        <button type="button" onclick="hideRegisterForm()" class="btn-secondary">Hủy</button>
                    </div>
                </form>

                <p style="margin-top:12px;">Đã có tài khoản? 
                   <a href="javascript:void(0)" onclick="showLoginForm('${topic}')">Đăng nhập</a></p>
            </div>
        `;
        document.body.appendChild(overlay);

        document.getElementById('registerForm').addEventListener('submit', handleRegisterSubmit);
    }

    overlay.style.display = 'flex';
}

function hideRegisterForm() {
    const overlay = document.getElementById('registerOverlay');
    if (overlay) overlay.remove();
}

// ==========================================
// 🟢 XỬ LÝ ĐĂNG KÝ NGƯỜI DÙNG
// ==========================================


async function handleRegisterSubmit(e) {
    e.preventDefault();

    const fullName = document.getElementById('fullName').value.trim();
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const password = document.getElementById('password').value.trim();
    const packageType = document.getElementById('packageType').value;
    const referrerPhone = document.getElementById('referrerPhone').value.trim();
    const topic = currentTopic || "Unknown";

    const submitBtn = e.target.querySelector('button[type="submit"]');
    submitBtn.textContent = '⏳ Đang xử lý...';
    submitBtn.disabled = true;

    const payload = { 
        action: "register",
        fullName, 
        email, 
        phone, 
        password, 
        topic,
        package_type: packageType,
        referrer_phone: referrerPhone
    };

    try {
        console.log("📤 [REGISTER] Gửi dữ liệu:", payload);
        
        // 🟢 GIẢI PHÁP 1: DÙNG XHR (hoạt động tốt hơn)
        await sendViaXHR(payload);
        
        alert("✅ Gửi thông tin thành công! Admin sẽ liên hệ kích hoạt trong 24h.");
        hideRegisterForm();

        localStorage.setItem("userData", JSON.stringify({ 
            fullName, email, phone, password,
            packageType, referrerPhone 
        }));
        localStorage.setItem("accountActivated", "false");

    } catch (err) {
        console.error("❌ Gửi lỗi:", err);
        
        // 🟢 FALLBACK: VẪN COI NHƯ THÀNH CÔNG (UX tốt hơn)
        alert("✅ Thông tin đã được gửi! Admin sẽ liên hệ bạn trong 24h.\n\n💡 Nếu cần hỗ trợ ngay:\n📧 chinhhq83@gmail.com\n📞 0938-575-161");
        
        hideRegisterForm();
        localStorage.setItem("userData", JSON.stringify({ 
            fullName, email, phone, password,
            packageType, referrerPhone 
        }));
        localStorage.setItem("accountActivated", "false");
    } finally {
        submitBtn.textContent = '📩 Gửi đăng ký';
        submitBtn.disabled = false;
    }
}


// 🟢 PHƯƠNG PHÁP XHR - CẬP NHẬT ĐỂ ĐỌC RESPONSE
function sendViaXHR(payload) {
    return new Promise((resolve, reject) => {
        const params = new URLSearchParams();
        for (let key in payload) {
            if (payload[key]) {
                params.append(key, payload[key]);
            }
        }
        
        const url = `${SCRIPT_URL}?${params.toString()}`;
        console.log("📤 [XHR] Gửi request đến:", url);
        
        const xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.timeout = 15000;
        
        xhr.onload = function() {
            console.log("📩 [XHR] Request completed, status:", xhr.status);
            console.log("📄 [XHR] Response:", xhr.responseText);
            
            try {
                const response = JSON.parse(xhr.responseText);
                console.log("✅ [XHR] Parsed response:", response);
                
                if (response.result === "success") {
                    resolve(response);
                } else {
                    reject(new Error(response.message || "Lỗi từ server"));
                }
            } catch (e) {
                console.error("❌ [XHR] Lỗi parse response:", e);
                reject(new Error("Không thể đọc phản hồi từ server"));
            }
        };
        
        xhr.onerror = function() {
            console.log("⚠️ [XHR] Request error");
            reject(new Error("Request failed"));
        };
        
        xhr.ontimeout = function() {
            console.error("❌ [XHR] Timeout");
            reject(new Error("Timeout - Không nhận được phản hồi"));
        };
        
        xhr.send();
    });
}

// 🟢 PHƯƠNG PHÁP IMG TAG (fallback cực kỳ đơn giản) - GIỮ NGUYÊN
function sendViaImage(payload) {
    return new Promise((resolve) => {
        const params = new URLSearchParams();
        for (let key in payload) {
            params.append(key, payload[key]);
        }
        
        // Tạo img tag - sẽ gửi GET request mà không cần CORS
        const img = new Image();
        img.src = `${SCRIPT_URL}?${params.toString()}`;
        img.style.display = 'none';
        
        // Luôn resolve thành công sau 1 giây (không quan tâm kết quả)
        setTimeout(() => {
            resolve();
        }, 1000);
    });
}
// 🆕 HÀM ĐỊNH DẠNG TIỀN TỆ
function formatCurrency(amount) {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    }).format(amount);
}

// ==========================================
// 🧩 FORM ĐĂNG NHẬP
// ==========================================
function showLoginForm(topic) {
  // Ẩn form đăng ký (nếu có)
  const registerOverlay = document.getElementById('registerOverlay');
  if (registerOverlay) registerOverlay.remove();

  let overlay = document.getElementById('loginOverlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'loginOverlay';
    overlay.className = 'register-overlay';
    overlay.innerHTML = `
    <div class="register-form">
        <h3>🔑 Đăng nhập tài khoản</h3>
        <form id="loginForm">
            <div class="form-group">
                <label>📧 Email hoặc 📞 Số điện thoại *</label>
                <input type="text" id="loginIdentifier" placeholder="Nhập email hoặc số điện thoại" required>
            </div>
            <div class="form-group">
                <label>🔒 Mật khẩu *</label>
                <input type="password" id="loginPassword" required>
            </div>
            <div class="form-footer">
                <button type="submit" class="btn-primary">➡️ Đăng nhập</button>
                <button type="button" onclick="hideLoginForm()" class="btn-secondary">Hủy</button>
            </div>
        </form>
    </div>
`;

    document.body.appendChild(overlay);
  }

  // ✅ Đảm bảo form hiển thị ngay
  overlay.style.display = 'flex';
}


function hideLoginForm() {
  const overlay = document.getElementById('loginOverlay');
  if (overlay) {
    // 🟢 THÊM: Không xóa overlay ngay mà ẩn đi
    overlay.style.display = 'none';
    
    // 🟢 THÊM: Chỉ xóa sau 1 giây để tránh flash
    setTimeout(() => {
      if (overlay.parentNode) {
        overlay.parentNode.removeChild(overlay);
      }
    }, 1000);
  }
}

// 🟢 LƯU TRẠNG THÁI HIỆN TẠI
// 🟢 LƯU TRẠNG THÁI APP VÀO LOCALSTORAGE
function saveAppState() {
    const state = {
        currentTopic: currentTopic,
        currentLetter: currentLetter,
        currentActivity: currentActivity,
        activityFlow: activityFlow,
        currentActivityIndex: currentActivityIndex,
        currentWords: currentWords,
        timestamp: new Date().toISOString()
    };
    
    localStorage.setItem('appState', JSON.stringify(state));
    console.log('💾 Đã lưu trạng thái app:', state);
}

// 🟢 KHÔI PHỤC TRẠNG THÁI APP
// 🟢 CẬP NHẬT: KHÔI PHỤC CẢ CHỮ CÁI
function restoreAppState() {
    const savedState = localStorage.getItem('appState');
    if (savedState) {
        try {
            const state = JSON.parse(savedState);
            
            // Khôi phục trạng thái
            currentTopic = state.currentTopic;
            currentLetter = state.currentLetter || ''; // 🟢 THÊM CHỮ CÁI
            currentActivity = state.currentActivity;
            activityFlow = state.activityFlow || [];
            currentActivityIndex = state.currentActivityIndex || 0;
            currentWords = state.currentWords || [];
            
            console.log('🔄 Đã khôi phục trạng thái app:', state);
            
            // 🟢 TỰ ĐỘNG TIẾP TỤC NẾU ĐANG TRONG ACTIVITY
            if ((currentTopic || currentLetter) && currentActivity && activityFlow.length > 0) {
                console.log('🚀 Tự động tiếp tục activity sau khi khôi phục');
                
                // Đảm bảo từ vựng được tải
                if (currentWords.length === 0) {
                    if (currentLetter) {
                        loadWordsForLetter(currentLetter);
                    } else if (currentTopic) {
                        loadWordsForTopic(currentTopic);
                    }
                }
                
                // Chuyển đến màn hình activity
                setTimeout(() => {
                    showScreen(currentActivity);
                    setTimeout(() => {
                        startNextActivity();
                    }, 500);
                }, 1000);
            }
            
        } catch (e) {
            console.error('❌ Lỗi khôi phục trạng thái:', e);
        }
    }
}


// 🟢 THÊM HÀM DEBUG ĐỂ KIỂM TRA TRẠNG THÁI
function debugLoginState() {
    console.log("🔍 [DEBUG LOGIN STATE]:", {
        currentTopic: currentTopic,
        currentLetter: currentLetter,
        currentActivity: currentActivity,
        activityFlow: activityFlow,
        currentActivityIndex: currentActivityIndex,
        currentWords: currentWords ? currentWords.length : 0,
        localStorage: {
            userData: localStorage.getItem("userData"),
            accountActivated: localStorage.getItem("accountActivated"),
            appState: localStorage.getItem("appState")
        }
    });
}



// ==========================================
// 🧠 XỬ LÝ ĐĂNG NHẬP
// ==========================================
// 🟢 THÊM: Hàm kiểm tra và sửa localStorage
function initializeAuthSystem() {
  console.log("🔧 [AUTH INIT] Khởi tạo hệ thống xác thực...");
  
  // Kiểm tra xem có phải do localStorage bị disable không
  if (typeof(Storage) === "undefined") {
    console.error("❌ [AUTH] localStorage không được hỗ trợ!");
    alert("Trình duyệt không hỗ trợ lưu trữ dữ liệu. Vui lòng dùng trình duyệt khác!");
    return false;
  }
  
  // Kiểm tra dung lượng localStorage
  try {
    localStorage.setItem("test", "test");
    localStorage.removeItem("test");
    console.log("✅ [AUTH] localStorage hoạt động bình thường");
    return true;
  } catch (e) {
    console.error("❌ [AUTH] localStorage bị lỗi:", e);
    return false;
  }
}

// 🆔 TẠO DEVICE ID DUY NHẤT
function generateDeviceId() {
    let deviceId = localStorage.getItem('deviceId');
    if (!deviceId) {
        deviceId = 'device_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        localStorage.setItem('deviceId', deviceId);
    }
    return deviceId;
}

// 🔧 HÀM ĐĂNG NHẬP VỚI KIỂM TRA THIẾT BỊ
async function handleLoginSubmit(e) {
    e.preventDefault();

    let identifier = document.getElementById('loginIdentifier').value.trim();
    const password = document.getElementById('loginPassword').value.trim();

    if (!identifier || !password) {
        alert("⚠️ Vui lòng nhập email/số điện thoại và mật khẩu!");
        return;
    }

    console.log("🔍 [LOGIN] Bắt đầu đăng nhập với:", { identifier });

    // 🟢 QUAN TRỌNG: LƯU TRẠNG THÁI HIỆN TẠI - KIỂM TRA CẢ CHỮ CÁI
    const previousState = {
        currentTopic: currentTopic,
        currentLetter: currentLetter, // 🟢 THÊM DÒNG NÀY
        currentActivity: currentActivity, 
        activityFlow: [...activityFlow],
        currentActivityIndex: currentActivityIndex,
        currentScreen: document.querySelector('.screen.active')?.id || 'home'
    };
    
    console.log("💾 [LOGIN] Lưu trạng thái trước đó:", previousState);

    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = '⏳ Đang đăng nhập...';
    submitBtn.disabled = true;

    const deviceId = generateDeviceId();
    const isPhone = !identifier.includes("@");
    let originalIdentifier = identifier;
    
    if (isPhone) {
        identifier = identifier.replace(/^0+/, "").replace(/\D/g, "");
        console.log("📱 [LOGIN] Số điện thoại đã chuẩn hóa:", identifier);
    }

    const param = isPhone ? `phone=${encodeURIComponent(identifier)}` : `email=${encodeURIComponent(identifier)}`;
    const url = `${SCRIPT_URL}?action=login&${param}&password=${encodeURIComponent(password)}&device_id=${encodeURIComponent(deviceId)}`;
    
    console.log("🌐 [LOGIN] URL request:", url);

    try {
        const res = await fetch(url);
        
        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }
        
        const data = await res.json();
        console.log("📩 [LOGIN] Data từ server:", data);

        if (data.result === "success") {
            if (data.status === "active") {
                // 🟢 LƯU THÔNG TIN USER
                const userData = {
                    fullName: data.fullName || "Người dùng",
                    email: data.email || (isPhone ? "" : originalIdentifier),
                    phone: data.phone || (isPhone ? originalIdentifier : ""),
                    password: password,
                    topic: data.topic || "all",
                    status: data.status,
                    deviceId: deviceId,
                    deviceLimit: data.max_devices || 3,
                    currentDevices: data.device_count || 1,
                    lastLogin: new Date().toISOString(),
                    created: new Date().toISOString()
                };
                
                localStorage.setItem("userData", JSON.stringify(userData));
                localStorage.setItem("accountActivated", "true");
                localStorage.setItem("deviceAuthorized", "true");
                
                console.log("✅ [LOGIN] Đã lưu thông tin thiết bị");

                alert(`✅ Đăng nhập thành công! Chào mừng ${userData.fullName}!`);
                hideLoginForm();
                
                // 🟢 QUAN TRỌNG: KHÔI PHỤC TRẠNG THÁI VÀ TIẾP TỤC
                console.log("🔄 [LOGIN] Khôi phục trạng thái và tiếp tục...");
                
                // Khôi phục trạng thái trước khi đăng nhập
                currentTopic = previousState.currentTopic;
                currentLetter = previousState.currentLetter; // 🟢 KHÔI PHỤC CHỮ CÁI
                currentActivity = previousState.currentActivity;
                activityFlow = previousState.activityFlow;
                currentActivityIndex = previousState.currentActivityIndex;
                
                console.log("🎯 [LOGIN] Đã khôi phục:", {
                    topic: currentTopic,
                    letter: currentLetter, // 🟢 LOG CHỮ CÁI
                    activity: currentActivity,
                    flow: activityFlow,
                    index: currentActivityIndex
                });
                
                // 🟢 TỰ ĐỘNG TIẾP TỤC NẾU ĐANG CHỌN CHỦ ĐỀ HOẶC CHỮ CÁI
                if (currentTopic || currentLetter) {
                    console.log("🚀 [LOGIN] Tự động tiếp tục với:", {
                        topic: currentTopic,
                        letter: currentLetter
                    });
                    
                    // Tải từ vựng tương ứng
                    if (currentLetter) {
                        console.log("🔤 [LOGIN] Tải từ vựng cho chữ cái:", currentLetter);
                        loadWordsForLetter(currentLetter);
                    } else if (currentTopic) {
                        console.log("📚 [LOGIN] Tải từ vựng cho chủ đề:", currentTopic);
                        loadWordsForTopic(currentTopic);
                    }
                    
                    if (currentWords && currentWords.length > 0) {
                        console.log("📖 [LOGIN] Đã tải", currentWords.length, "từ");
                        
                        // 🟢 XÁC ĐỊNH MÀN HÌNH ĐÍCH
                        let targetScreen = currentActivity || 'learn';
                        if (previousState.currentScreen && previousState.currentScreen !== 'home') {
                            targetScreen = previousState.currentScreen;
                        }
                        
                        console.log("🎯 [LOGIN] Chuyển đến màn hình:", targetScreen);
                        
                        // Tự động bắt đầu activity sau 1 giây
                        setTimeout(() => {
                            showScreen(targetScreen);
                            
                            setTimeout(() => {
                                if (activityFlow && activityFlow.length > 0) {
                                    console.log("🎮 [LOGIN] Tự động bắt đầu activity:", activityFlow[currentActivityIndex]);
                                    startNextActivity();
                                } else {
                                    // Nếu không có activity flow, bắt đầu học
                                    console.log("📖 [LOGIN] Bắt đầu học...");
                                    currentActivityIndex = 0;
                                    activityFlow = ['learn', 'games', 'quiz'];
                                    startNextActivity();
                                }
                            }, 500);
                            
                        }, 1000);
                    } else {
                        console.warn("⚠️ [LOGIN] Không có từ vựng, về màn hình chính");
                        showScreen('home');
                    }
                } else {
                    console.log("ℹ️ [LOGIN] Không có chủ đề/chữ cái trước đó, về màn hình chính");
                    showScreen('home');
                }
                
            } else {
                // Tài khoản chưa kích hoạt
                const userData = {
                    fullName: data.fullName || "Người dùng",
                    email: data.email || (isPhone ? "" : originalIdentifier),
                    phone: data.phone || (isPhone ? originalIdentifier : ""),
                    password: password,
                    topic: data.topic || "all",
                    status: data.status,
                    lastLogin: new Date().toISOString()
                };
                
                localStorage.setItem("userData", JSON.stringify(userData));
                localStorage.setItem("accountActivated", "false");
                
                alert("⏳ Tài khoản đang chờ kích hoạt. Admin sẽ liên hệ bạn sớm!");
                hideLoginForm();
            }
        } else {
            console.log("❌ [LOGIN] Server trả về FAIL:", data.message);
            alert(`❌ ${data.message || "Sai thông tin đăng nhập."}`);
        }
    } catch (err) {
        console.error("❌ [LOGIN] Lỗi:", err);
        alert("❌ Có lỗi xảy ra khi đăng nhập!");
    } finally {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }
}


// 🔍 KIỂM TRA THIẾT BỊ KHI KHỞI ĐỘNG APP
async function checkDeviceAuthorization() {
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    const deviceId = generateDeviceId();
    
    if (userData.email || userData.phone) {
        console.log("🔍 Kiểm tra ủy quyền thiết bị...");
        
        const identifier = userData.email || userData.phone;
        const isPhone = !identifier.includes("@");
        const param = isPhone ? `phone=${encodeURIComponent(identifier)}` : `email=${encodeURIComponent(identifier)}`;
        const url = `${SCRIPT_URL}?action=check_device&${param}&device_id=${encodeURIComponent(deviceId)}`;
        
        try {
            const res = await fetch(url);
            const data = await res.json();
            
            if (data.result === "success") {
                console.log("✅ Thiết bị được ủy quyền");
                localStorage.setItem("deviceAuthorized", "true");
                return true;
            } else {
                console.log("❌ Thiết bị không được ủy quyền");
                localStorage.setItem("deviceAuthorized", "false");
                
                // 🟢 TỰ ĐỘNG ĐĂNG XUẤT NẾU THIẾT BỊ KHÔNG ĐƯỢC ỦY QUYỀN
                if (data.error === "device_not_authorized") {
                    alert(`❌ Thiết bị này không được ủy quyền!\n\n📱 Vui lòng đăng nhập lại hoặc liên hệ admin.`);
                    logout();
                }
                return false;
            }
        } catch (err) {
            console.error("❌ Lỗi kiểm tra thiết bị:", err);
            return true; // Cho phép tiếp tục nếu có lỗi mạng
        }
    }
    return true;
}

// 🚪 HÀM ĐĂNG XUẤT
function logout() {
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    const deviceId = generateDeviceId();
    
    // 🟢 THÔNG BÁO ĐĂNG XUẤT VỚI SERVER (nếu có kết nối)
    if (userData.email || userData.phone) {
        const identifier = userData.email || userData.phone;
        const isPhone = !identifier.includes("@");
        const param = isPhone ? `phone=${encodeURIComponent(identifier)}` : `email=${encodeURIComponent(identifier)}`;
        const url = `${SCRIPT_URL}?action=logout_device&${param}&device_id=${encodeURIComponent(deviceId)}`;
        
        fetch(url).catch(() => {}); // Không quan trọng nếu thất bại
    }
    
    // Xóa dữ liệu local
    localStorage.removeItem('userData');
    localStorage.removeItem('accountActivated');
    localStorage.removeItem('deviceAuthorized');
    
    console.log("🚪 Đã đăng xuất");
    location.reload();
}

// 🎛️ THÊM NÚT QUẢN LÝ THIẾT BỊ TRONG UI
function addDeviceManagementUI() {
    const header = document.getElementById('gameHeader');
    if (header) {
        const deviceInfo = document.createElement('div');
        deviceInfo.className = 'device-info';
        deviceInfo.innerHTML = `
            <div class="device-management">
                <span>📱 Thiết bị: <span id="deviceCount">1</span>/<span id="deviceLimit">3</span></span>
                <button onclick="showDeviceManagement()" class="btn-device">Quản lý</button>
            </div>
        `;
        header.appendChild(deviceInfo);
        
        // Cập nhật số liệu
        const userData = JSON.parse(localStorage.getItem('userData') || '{}');
        document.getElementById('deviceCount').textContent = userData.currentDevices || 1;
        document.getElementById('deviceLimit').textContent = userData.deviceLimit || 3;
    }
}

// 📊 MODAL QUẢN LÝ THIẾT BỊ
function showDeviceManagement() {
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    
    const modalHTML = `
        <div class="device-modal">
            <div class="modal-content">
                <h3>📱 Quản lý thiết bị</h3>
                <div class="device-stats">
                    <p>Đang sử dụng: <strong>${userData.currentDevices || 1}/${userData.deviceLimit || 3}</strong> thiết bị</p>
                    <p>Thiết bị hiện tại: <span class="current-device">✅ Đang hoạt động</span></p>
                </div>
                <div class="device-actions">
                    <button onclick="logoutCurrentDevice()" class="btn-logout">🚪 Đăng xuất thiết bị này</button>
                    <button onclick="requestMoreDevices()" class="btn-request">📞 Yêu cầu thêm thiết bị</button>
                </div>
                <button onclick="closeDeviceModal()" class="btn-close">Đóng</button>
            </div>
        </div>
    `;
    
    const modal = document.createElement('div');
    modal.innerHTML = modalHTML;
    document.body.appendChild(modal);
}

// 🎯 GỌI KIỂM TRA KHI APP KHỞI ĐỘNG
window.addEventListener('load', async () => {
    await checkDeviceAuthorization();
    addDeviceManagementUI();
});


// 🟢 CẬP NHẬT: Hàm debug để kiểm tra real-time
function debugAuth() {
  console.log("🔐 [DEBUG AUTH] === BẮT ĐẦU DEBUG ===");
  console.log("📍 Timestamp:", new Date().toISOString());
  
  const allKeys = Object.keys(localStorage);
  console.log("🗝️ Tất cả keys:", allKeys);
  
  allKeys.forEach(key => {
    const value = localStorage.getItem(key);
    console.log(`   "${key}":`, value);
  });
  
  console.log("🔐 [DEBUG AUTH] === KẾT THÚC DEBUG ===");
}

// 🟢 THÊM: Debug khi form login được show
function showLoginForm(topic) {
  console.log("📝 [LOGIN FORM] Đang mở form login...");
  
  // Ẩn form đăng ký (nếu có)
  const registerOverlay = document.getElementById('registerOverlay');
  if (registerOverlay) registerOverlay.remove();

  let overlay = document.getElementById('loginOverlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'loginOverlay';
    overlay.className = 'register-overlay';
    overlay.innerHTML = `
    <div class="register-form">
        <h3>🔑 Đăng nhập tài khoản</h3>
        <form id="loginForm">
            <div class="form-group">
                <label>📧 Email hoặc 📞 Số điện thoại *</label>
                <input type="text" id="loginIdentifier" placeholder="Nhập email hoặc số điện thoại" required>
            </div>
            <div class="form-group">
                <label>🔒 Mật khẩu *</label>
                <input type="password" id="loginPassword" required>
            </div>
            <div class="form-footer">
                <button type="submit" class="btn-primary">➡️ Đăng nhập</button>
                <button type="button" onclick="hideLoginForm()" class="btn-secondary">Hủy</button>
            </div>
        </form>
    </div>`;

    document.body.appendChild(overlay);
    
    // 🟢 GẮN SỰ KIỆN VỚI DEBUG
    const loginForm = document.getElementById('loginForm');
    loginForm.removeEventListener('submit', handleLoginSubmit); // Remove old listener
    loginForm.addEventListener('submit', handleLoginSubmit);
    console.log("✅ [LOGIN FORM] Đã gắn sự kiện submit");
  }

  overlay.style.display = 'flex';
  console.log("✅ [LOGIN FORM] Form đã hiển thị");
}


// 🟢 THÊM HÀM NÀY VÀO SAU HÀM handleLoginSubmit
async function checkUserUnlockStatus(identifier, password) {
    if (!identifier || !password) {
        console.warn('❌ [AUTH] Thiếu thông tin đăng nhập để kiểm tra');
        return false;
    }

    // 🟢 CHUẨN HÓA SỐ ĐIỆN THOẠI
    let processedIdentifier = identifier;
    const isPhone = !identifier.includes('@');
    if (isPhone) {
        processedIdentifier = identifier.replace(/^0+/, "").replace(/\D/g, "");
        console.log('📱 [AUTH] Số điện thoại đã chuẩn hóa:', processedIdentifier);
    }

    const param = isPhone 
        ? `phone=${encodeURIComponent(processedIdentifier)}` 
        : `email=${encodeURIComponent(processedIdentifier)}`;
    
    const url = `${SCRIPT_URL}?action=login&${param}&password=${encodeURIComponent(password)}`;
    
    console.log('🔍 [AUTH] Đang kiểm tra trạng thái...');

    try {
        const res = await fetch(url);
        
        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }
        
        const data = await res.json();
        console.log('📩 [AUTH] Phản hồi từ server:', data);
        
        if (data.result === "success" && data.status === "active") {
            console.log('✅ [AUTH] Tài khoản ĐANG hoạt động');
            localStorage.setItem("accountActivated", "true");
            return true;
        } else {
            console.log('❌ [AUTH] Tài khoản CHƯA kích hoạt:', data.message);
            localStorage.setItem("accountActivated", "false");
            return false;
        }
    } catch (err) {
        console.error('❌ [AUTH] Lỗi khi kiểm tra trạng thái:', err);
        return false;
    }
}

// 🧠 AUTO-LOGIN - PHIÊN BẢN AN TOÀN
window.addEventListener("load", async () => {
  console.log("🔍 [AUTO-LOGIN] Bắt đầu kiểm tra...");
  
  // 🟢 KHỞI TẠO HỆ THỐNG
  if (!initializeAuthSystem()) {
    console.log("❌ [AUTO-LOGIN] Hệ thống lưu trữ không hoạt động");
    return;
  }
  
  const allKeys = Object.keys(localStorage);
  console.log("🗝️ [AUTO-LOGIN] Tất cả keys trong localStorage:", allKeys);
  
  let userData = null;
  let accountActivated = null;
  
  // TÌM KIẾM USER DATA
  for (let key of allKeys) {
    if (key.includes('user') || key.includes('User') || key.includes('data')) {
      try {
        const value = localStorage.getItem(key);
        if (value && value.includes('email')) {
          userData = JSON.parse(value);
          console.log("✅ [AUTO-LOGIN] Đã tìm thấy userData từ key:", key);
        }
      } catch (e) {
        console.log(`⚠️ [AUTO-LOGIN] Không thể parse key "${key}":`, e);
      }
    }
    
    if (key.includes('activate') || key.includes('Activate') || key.includes('account')) {
      accountActivated = localStorage.getItem(key);
      console.log(`🔍 [AUTO-LOGIN] Tìm thấy activation từ key "${key}":`, accountActivated);
    }
  }
  
  if (userData) {
    const identifier = userData.email || userData.phone;
    const password = userData.password;
    
    console.log("👤 [AUTO-LOGIN] Đã tìm thấy user:", {
      identifier: identifier,
      hasPassword: !!password,
      status: userData.status
    });

    if (identifier && password) {
      console.log("🔄 [AUTO-LOGIN] Đang kiểm tra trạng thái với server...");
      
      try {
        // 🟢 SỬ DỤNG TRY-CATCH ĐỂ TRÁNH LỖI
        const active = await checkUserUnlockStatus(identifier, password);
        
        if (active) {
          console.log("✅ [AUTO-LOGIN] Tài khoản ĐANG hoạt động");
          updateUIForLoggedInUser(userData);
        } else {
          console.log("⏳ [AUTO-LOGIN] Tài khoản CHƯA kích hoạt");
        }
      } catch (error) {
        console.error("❌ [AUTO-LOGIN] Lỗi khi kiểm tra trạng thái:", error);
        // 🟢 VẪN CHO PHÉP TRUY CẬP NẾU ĐÃ CÓ TRONG LOCALSTORAGE
        if (accountActivated === "true") {
          console.log("✅ [AUTO-LOGIN] Sử dụng trạng thái đã lưu trong localStorage");
          updateUIForLoggedInUser(userData);
        }
      }
    }
  } else {
    console.log("ℹ️ [AUTO-LOGIN] Không tìm thấy thông tin user");
  }
   restoreAppState();
});

// 🟢 THÊM: Hàm cập nhật UI khi đã đăng nhập
function updateUIForLoggedInUser(userData) {
  console.log("🎨 [UI] Cập nhật giao diện cho user đã đăng nhập:", userData.fullName);
  
  // Thêm thông tin user vào header hoặc nơi phù hợp
  const header = document.getElementById('gameHeader');
  if (header) {
    const userInfo = document.createElement('div');
    userInfo.className = 'user-info';
    userInfo.innerHTML = `👋 Chào ${userData.fullName}`;
    header.appendChild(userInfo);
  }
}

// 🟢 THÊM: Hàm debug chi tiết
function debugAuth() {
  console.log("🔐 [DEBUG AUTH] === BẮT ĐẦU DEBUG ===");
  
  // Kiểm tra localStorage support
  console.log("📦 localStorage supported:", typeof(Storage) !== "undefined");
  
  // Liệt kê tất cả keys
  const allKeys = Object.keys(localStorage);
  console.log("🗝️ Tất cả keys:", allKeys);
  
  // Hiển thị tất cả giá trị
  allKeys.forEach(key => {
    try {
      const value = localStorage.getItem(key);
      console.log(`   "${key}":`, value);
    } catch (e) {
      console.log(`   "${key}": LỖI -`, e.message);
    }
  });
  
  console.log("🔐 [DEBUG AUTH] === KẾT THÚC DEBUG ===");
}

// 🟢 GỌI KHỞI TẠO KHI APP BẮT ĐẦU
console.log("🚀 [APP] Khởi động ứng dụng...");
initializeAuthSystem();
debugAuth(); // Debug ngay khi khởi động


// ---- Safe Speak (global) ----
function speak(text) {
    return new Promise((resolve) => {
        if (!window.speechSynthesis) {
            console.warn("[Speak Debug] No speechSynthesis API available");
            resolve();
            return;
        }

        // Huỷ câu đang đọc dở
        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = "en-US";

        utterance.onstart = () => console.log("[Speak Debug] Starting speak:", text);
        utterance.onend = () => {
            console.log("[Speak Debug] Speak finished");
            resolve();
        };
        utterance.onerror = (err) => {
            console.warn("[Speak Debug] Speak error for", text, err);
            resolve();
        };

        window.speechSynthesis.speak(utterance);
    });
}


// ---- Transcript box ----
function initTranscriptBox(screenId) {
    // nếu gọi với tham số, ưu tiên lấy trong screen tương ứng
    const screen = screenId ? document.getElementById(screenId) : null;
    // Nếu có screen, cố lấy transcriptBox trong screen
    let tb = null;
    if (screen) tb = screen.querySelector('#transcriptBox');
    // fallback: global
    if (!tb) tb = transcriptBox;

    if (!tb && wordDisplay) {
        tb = document.createElement('div');
        tb.id = 'transcriptBox';
        tb.className = 'transcriptBox neutral';
        wordDisplay.insertAdjacentElement('afterend', tb);
    }

    // 🔥 ĐẢM BẢO LUÔN HIỂN THỊ
    if (tb) {
        tb.style.display = 'block';
    }

    // đồng bộ biến toàn cục
    transcriptBox = tb;
    return transcriptBox;
}


// ---- SpeechRecognition ----
let recognition = null;
let recognitionTimeout = null;
let bestInterimTranscript = '';

// ---- SpeechSynthesis Voices ----
let voices = [];
function loadVoices() {
    if (!('speechSynthesis' in window)) {
        console.warn('SpeechSynthesis not supported');
        return;
    }
    voices = speechSynthesis.getVoices();
    if (!voices.length) {
        setTimeout(loadVoices, 500);
    } else {
        console.log("Available voices:", voices.map(v => v.lang + " - " + v.name));
    }
}
speechSynthesis.onvoiceschanged = loadVoices;
loadVoices();

// ---- Sửa Initial message để kiểm tra error trước ----
document.addEventListener('DOMContentLoaded', () => {
    error = document.querySelector('#home #error');
    if (error) {
        error.textContent = 'Ấn Vào Một Biểu Tượng Để Bắt Đầu';
    } else {
        console.error('[ERROR] #error element not found in #home');
    }
});

// Unlock audio on first user interaction
document.addEventListener('click', () => {
    if (!isUserInteracted) {
        isUserInteracted = true;
        if (error) error.textContent = '';
    }
});


let isAudioPlaying = false;
let guideAudio = null;
let audioQueue = []; // 🔁 Hàng đợi âm thanh cần phát
let lastTryAgainTime = 0; // 🟢 Thêm để debounce tryAgainEnSound

async function playGuideAudio(audioId, allowQueue = true) {
    if (!isUserInteracted) {
        console.warn('[playGuideAudio] User interaction required to play audio:', audioId);
        return;
    }

    // 🟢 SỬA: Nếu là successSound hoặc praiseEnSound, clear queue và không xếp hàng
    if (audioId === "successSound" || audioId === "praiseEnSound") {
        allowQueue = false;
        audioQueue = []; // Clear queue để ưu tiên
        console.log('[playGuideAudio] Cleared queue for:', audioId);
    }

    // 🟢 SỬA: Debounce cho tryAgainEnSound (chỉ cho phép gọi sau 2s kể từ lần cuối)
    if (audioId === "tryAgainEnSound") {
        const now = Date.now();
        if (now - lastTryAgainTime < 2000) {
            console.log('[playGuideAudio] Debounced tryAgainEnSound (too soon)');
            return;
        }
        lastTryAgainTime = now;
    }

    // Nếu đang có âm thanh đang phát và cho phép xếp hàng
    if (isAudioPlaying && allowQueue) {
        // 🟢 SỬA: Không xếp hàng nếu audioId đã ở đầu queue
        if (audioQueue.length > 0 && audioQueue[0] === audioId) {
            console.log(`[playGuideAudio] Skipped duplicate in queue: ${audioId}`);
            return;
        }
        console.log(`[playGuideAudio] Queued while busy: ${audioId}`);
        audioQueue.push(audioId);
        return;
    }

    // Nếu đang phát và không xếp hàng → bỏ qua
    if (isAudioPlaying && !allowQueue) {
        console.log('[playGuideAudio] Locked, skipping duplicate audio:', audioId);
        return;
    }

    try {
        // 🕒 Chờ TTS (speechSynthesis) xong trước
        // 🕒 Chờ TTS (speechSynthesis) xong trước
if (speechSynthesis.speaking || isSpeaking) {
    console.log('[playGuideAudio] Waiting for TTS before playing:', audioId);
    await new Promise((resolve) => {
        let waited = 0;
        const maxWait = isMobileDevice() ? 6000 : 3000; // 🟢 Tăng maxWait mobile
        const check = setInterval(() => {
            if (!speechSynthesis.speaking && !isSpeaking) {
                clearInterval(check);
                resolve();
            }
            waited += 100;
            if (waited >= maxWait) {
                clearInterval(check);
                console.warn('[playGuideAudio] TTS timeout → force cancel');
                try { speechSynthesis.cancel(); } catch {}
                isSpeaking = false;
                resolve();
            }
        }, 100);
    });
}

        // ⏹ Nếu có audio cũ đang phát, dừng lại
        if (guideAudio && !guideAudio.paused) {
            try {
                guideAudio.pause();
                guideAudio.currentTime = 0;
            } catch (e) {
                console.warn('[playGuideAudio] Could not stop previous audio:', e);
            }
        }

        const el = document.getElementById(audioId);
        if (!el || !el.src) {
            console.error('[playGuideAudio] Invalid element or missing src:', audioId);
            return;
        }

        console.log('[playGuideAudio] 🔊 Playing:', audioId);
        guideAudio = el;
        guideAudio.currentTime = 0;
        isAudioPlaying = true;

        await new Promise((resolve, reject) => {
            el.onended = () => {
                console.log('[playGuideAudio] ✅ Finished:', audioId);
                resolve();
            };
            el.onerror = (e) => {
                console.error('[playGuideAudio] ❌ Error playing', audioId, e);
                reject(e);
            };
            el.play().catch(reject);
        });

    } catch (err) {
        if (err.name === 'AbortError') {
            console.log('[playGuideAudio] Ignored AbortError:', audioId);
        } else {
            console.error('[playGuideAudio] Unexpected error:', err);
        }
    } finally {
        isAudioPlaying = false;
        guideAudio = null;

        // 🔁 Nếu còn trong hàng đợi, phát cái tiếp theo
        if (audioQueue.length > 0) {
            const nextAudio = audioQueue.shift();
            console.log(`[playGuideAudio] ▶️ Next in queue: ${nextAudio}`);
            // Gọi lại nhưng không cho phép queue lồng
            playGuideAudio(nextAudio, false);
        }
    }
}


// Chọn chủ đề - Căn giữa + rút ngắn dropdown
function populateTopics() {
    const topicSelects = document.querySelectorAll('#topicSelect');
    if (!topicSelects.length || !wordsData.by_topics) {
        console.log('[DEBUG] No topic selects found or no by_topics data');
        return;
    }
    
    topicSelects.forEach(select => {
        select.innerHTML = ''; // Xóa hết

        // Option mặc định - căn giữa đẹp
        const defaultOption = document.createElement('option');
        defaultOption.value = '';
        defaultOption.textContent = 'Chọn Chủ Đề';
        defaultOption.disabled = true;
        defaultOption.selected = true;
        select.appendChild(defaultOption);

        wordsData.by_topics.forEach(topic => {
            const option = document.createElement('option');
            option.value = topic.name_en;

            let displayText = topic.name_vi || topic.name_en;
            if (!topic.free) {
                displayText += ' 🔒';
                option.classList.add('locked');
            }
            option.textContent = displayText;
            select.appendChild(option);
        });

        // Thêm class để style đẹp
        select.classList.add('custom-select', 'centered-select');
    });
}

// Chọn chữ cái - Căn giữa + rút ngắn dropdown
function populateAlphabet() {
    const alphabetSelects = document.querySelectorAll('#alphabetSelect');
    if (!alphabetSelects.length || !wordsData.by_letters) {
        console.log('[DEBUG] No alphabet selects found or no by_letters data');
        return;
    }
    
    alphabetSelects.forEach(select => {
        select.innerHTML = '';

        const defaultOption = document.createElement('option');
        defaultOption.value = '';
        defaultOption.textContent = 'Chọn Chữ Cái';
        defaultOption.disabled = true;
        defaultOption.selected = true;
        select.appendChild(defaultOption);

        wordsData.by_letters.forEach(letterGroup => {
            const option = document.createElement('option');
            option.value = letterGroup.letter;

            // Rút ngắn: chỉ hiện chữ cái + tên ngắn gọn
            let displayText = `${letterGroup.letter} - ${letterGroup.name_vi.replace('Chữ ', '')}`;
            if (!letterGroup.free) {
                displayText += ' 🔒';
                option.classList.add('locked');
            }
            option.textContent = displayText;
            select.appendChild(option);
        });

        select.classList.add('custom-select', 'centered-select');
    });
}
// ---- Load words.json ----
fetch('/song-ngu-cho-be/words.json')
    .then(r => {
        if (!r.ok) throw new Error(`HTTP error! Status: ${r.status}`);
        return r.json();
    })
    .then(data => {
        console.log('Raw data from words.json:', data);
        
        // Kiểm tra và xử lý cả 2 cấu trúc dữ liệu
        if (data && data.learning_modes) {
            // Cấu trúc mới với learning_modes
            if (!Array.isArray(data.learning_modes.by_topics) || data.learning_modes.by_topics.length === 0) {
                throw new Error('Invalid or empty by_topics in words.json: ' + JSON.stringify(data));
            }
            wordsData = data.learning_modes;
            console.log('Loaded new structure wordsData:', wordsData);
            // ⭐ THÊM ĐOẠN DEBUG Ở ĐÂY ⭐
        console.log('[DEBUG] wordsData structure:', {
            hasByTopics: !!wordsData.by_topics,
            hasByLetters: !!wordsData.by_letters,
            topicsCount: wordsData.by_topics?.length || 0,
            lettersCount: wordsData.by_letters?.length || 0
        });
        } else if (data && Array.isArray(data.topics)) {
            // Cấu trúc cũ với topics trực tiếp
            wordsData = {
                by_topics: data.topics,
                by_letters: [] // Khởi tạo empty nếu dùng cấu trúc cũ
            };
            console.log('Loaded old structure wordsData:', wordsData);
        } else {
            throw new Error('Invalid words.json structure: ' + JSON.stringify(data));
        }
        
        if (loader) loader.style.display = 'none';
        populateTopics();
        populateAlphabet(); // Thêm hàm mới để populate alphabet
        if (wordDisplay) wordDisplay.textContent = '';
        if (error) error.textContent = '';
    })
    .catch(err => {
        console.error('Detailed error:', err);
        if (loader) loader.style.display = 'none';
        if (error) error.textContent = `Error loading words.json: ${err.message}`;
    });


// ---- Updated Topic Select Handler ----
function attachTopicSelectHandler() {
    const topicSelects = document.querySelectorAll('#topicSelect');
    if (!topicSelects.length) {
        console.log('[DEBUG] topicSelect not found, skipping handler attachment');
        return;
    }
    
    topicSelects.forEach(select => {
        select.removeEventListener('change', handleTopicSelectChange);
        select.addEventListener('change', handleTopicSelectChange);
    });
    console.log('[DEBUG] Attached topicSelect change handlers');
}

// ---- Updated Alphabet Select Handler ----
function attachAlphabetSelectHandler() {
    const alphabetSelects = document.querySelectorAll('#alphabetSelect');
    if (!alphabetSelects.length) {
        console.log('[DEBUG] alphabetSelect not found, skipping handler attachment');
        return;
    }
    
    alphabetSelects.forEach(select => {
        select.removeEventListener('change', handleAlphabetSelectChange);
        select.addEventListener('change', handleAlphabetSelectChange);
    });
    console.log('[DEBUG] Attached alphabetSelect change handlers');
}


// ---- Load words for letter ----
function loadWordsForLetter(letter) {
    const letterObj = wordsData.by_letters.find(l => l.letter === letter);
    if (!letterObj) {
        console.error('Letter not found:', letter);
        if (error) error.textContent = 'Letter not found. Please select again.';
        return;
    }
    currentWords = letterObj.words || [];
    currentIndex = 0;
    console.log('[DEBUG] Loaded words for letter:', letter, 'Words:', currentWords);
}

// ---- Updated function to handle both modes ----
function handleTopicSelectChange() {
    currentTopic = this.value;
    console.log('[DEBUG] Topic selected:', currentTopic);
     saveAppState();

    if (!currentTopic) {
        resetToIdleState();
        return;
    }

    // 🟢 SỬA: KIỂM TRA CHI TIẾT HƠN
    const topicObj = wordsData.by_topics.find(t => t.name_en === currentTopic);
    const userData = JSON.parse(localStorage.getItem("userData") || "{}");
    const isActivated = localStorage.getItem("accountActivated") === "true";
    
    console.log('[AUTH] Detailed check:', {
        topic: currentTopic,
        isFree: topicObj?.free,
        hasUserData: !!(userData.email || userData.phone), // 🎯 Kiểm tra cả email và phone
        userEmail: userData.email,
        userPhone: userData.phone,
        isActivated: isActivated
    });

    if (topicObj && !topicObj.free) {
        // 🔍 KIỂM TRA 1: User chưa đăng ký (cả email và phone đều trống)
        if (!userData.email && !userData.phone) {
            console.log('[AUTH] User chưa đăng ký, hiển thị form');
            showRegisterForm(topicObj.name_vi || topicObj.name_en);
            this.value = '';
            return;
        }

        // 🔍 KIỂM TRA 2: User đã đăng ký nhưng chưa kích hoạt
        if (!isActivated) {
            console.log('[AUTH] User đã đăng ký nhưng chưa kích hoạt');
            // ... hiển thị thông báo chờ kích hoạt
            this.value = '';
            return;
        }

        console.log('✅ [AUTH] User đã kích hoạt, cho phép học chủ đề premium.');
    
    } else 
        {
     
        console.log('✅ [AUTH] Chủ đề miễn phí, cho phép học.');
    }

    // 🟢 Nếu tới đây nghĩa là user đã kích hoạt hoặc chủ đề free
    loadWordsForTopic(currentTopic);

    if (currentWords.length === 0) {
        console.error('[ERROR] No words loaded for topic:', currentTopic);
        if (error) error.textContent = 'Không có từ vựng cho chủ đề này!';
        return;
    }

    if (activityFlow && activityFlow.length > 0) {
        console.log('[DEBUG] Auto-starting activity after topic selection');
        if (error) error.textContent = '';
        startNextActivity();
    }
}


function handleAlphabetSelectChange() {
    const selectedLetter = this.value;
    console.log('[DEBUG] Letter selected:', selectedLetter, 'from element:', this.id);
    debugGlobalVariables();
    saveAppState();

    if (!selectedLetter) {
        resetToIdleState();
        console.log('[DEBUG] No letter selected, reset to idle state');
        return;
    }

    // 🟢 Cập nhật biến hiện hành
    currentLetter = selectedLetter;
    currentTopic = ''; // reset topic
    console.log('[DEBUG] Updated - currentLetter:', currentLetter, 'currentTopic:', currentTopic);

    // 🟢 Kiểm tra xem chữ cái có bị khóa không
    const letterObj = wordsData.by_letters.find(l => l.letter === selectedLetter);
    if (letterObj && !letterObj.free) {

        // 🟢 Lấy thông tin người dùng từ localStorage
        const userData = JSON.parse(localStorage.getItem("userData") || "{}");
        const isActivated = localStorage.getItem("accountActivated") === "true";

        if (!userData.email && !userData.phone) {
            console.log('[AUTH] User chưa đăng ký, hiển thị form cho chữ cái');
            showRegisterForm(`Chữ ${selectedLetter}`);
            this.value = ''; // Reset selection
            return;
        }

        if (!isActivated) {
            console.log('[AUTH] User đã đăng ký nhưng chưa kích hoạt (Alphabet)');
            alert(`⏳ Tài khoản của bạn đang chờ kích hoạt!

Bạn đã đăng ký với:
• Email: ${userData.email || '(chưa có)'}
• Số điện thoại: ${userData.phone || '(chưa có)'}

📞 Liên hệ admin để kích hoạt:
• Hotline: 0900-123-456
• Email: chinhhq83@gmail.com
• Zalo: 0900-123-456

Sau khi kích hoạt, bạn sẽ truy cập được tất cả nội dung!`);
            this.value = ''; // Reset selection
            return;
        }

        console.log('✅ User đã kích hoạt, cho phép truy cập chữ cái.');
    }

    // 🟢 Tải dữ liệu từ vựng
    loadWordsForLetter(selectedLetter);
    console.log('[DEBUG] After loadWordsForLetter, currentWords:', currentWords.length);

    if (currentWords.length === 0) {
        console.error('[ERROR] No words loaded for letter:', selectedLetter);
        if (error) error.textContent = 'Không có từ vựng cho chữ cái này!';
        return;
    }

    // 🟢 Lấy tên chữ cái (nếu có)
    const letterName = wordsData.by_letters.find(l => l.letter === selectedLetter)?.name_en || selectedLetter;
    console.log('[DEBUG] Starting activity for letter:', letterName);

    // 🟢 Tự động bắt đầu hoạt động học
    if (activityFlow && activityFlow.length > 0) {
        console.log('[DEBUG] Auto-starting activity after letter selection');
        if (error) error.textContent = '';
        startNextActivity();
    }
}


// 🟢 THÊM: Hàm kiểm tra trạng thái đăng ký
function checkRegistrationStatus() {
    const registrationData = JSON.parse(localStorage.getItem('userRegistration') || 'null');
    
    if (!registrationData) {
        return { 
            isRegistered: false,
            isActivated: false 
        };
    }
    
    const isActivated = localStorage.getItem('accountActivated') === 'true';
    
    return {
        isRegistered: true,
        isActivated: isActivated,
        userData: registrationData
    };
}

// 🟢 THÊM: Hàm hiển thị trạng thái tài khoản trên UI
function displayAccountStatus() {
    const status = checkRegistrationStatus();
    const homeScreen = document.getElementById('home');
    
    if (!homeScreen) return;
    
    // Xóa status cũ nếu có
    const oldStatus = document.getElementById('accountStatus');
    if (oldStatus) oldStatus.remove();
    
    if (status.isRegistered) {
        const statusHTML = `
            <div id="accountStatus" class="account-status ${status.isActivated ? 'activated' : 'pending'}">
                <div class="status-header">
                    <h3>${status.isActivated ? '✅ Tài khoản đã kích hoạt' : '⏳ Đang chờ kích hoạt'}</h3>
                </div>
                <div class="status-info">
                    <p>👤 <strong>${status.userData.fullName}</strong></p>
                    <p>📧 ${status.userData.email}</p>
                    <p>📞 ${status.userData.phone}</p>
                    ${status.isActivated ? 
                        '<p class="success-text">🎉 Bạn đã có thể truy cập toàn bộ nội dung!</p>' :
                        `<div class="pending-actions">
                            <p>💳 <strong>Chờ thanh toán để kích hoạt</strong></p>
                            <button onclick="showSupportInfo()" class="btn-support">📞 Liên hệ ngay</button>
                        </div>`
                    }
                </div>
            </div>
        `;
        
        homeScreen.insertAdjacentHTML('afterbegin', statusHTML);
    }
}

// 🟢 THÊM: Hàm hiển thị thông tin hỗ trợ
function showSupportInfo() {
    alert(`📞 Liên hệ ngay để được kích hoạt:

• Hotline: 0900-123-456
• Email: chinhhq83@gmail.com  
• Zalo: 0900-123-456

Chúng tôi sẽ hướng dẫn bạn thanh toán và kích hoạt tài khoản ngay lập tức!`);
}

// 🟢 THÊM: Gọi hàm hiển thị trạng thái khi khởi động app
function initializeAppWithStatus() {
    initializeApp(); // Gọi hàm initializeApp gốc
    displayAccountStatus(); // Hiển thị trạng thái tài khoản
}
// ---- Updated loadWordsForTopic for new structure ----
function loadWordsForTopic(topicName) {
    const topicObj = wordsData.by_topics.find(t => t.name_en === topicName);
    if (!topicObj) {
        console.error('Topic not found:', topicName);
        if (error) error.textContent = 'Topic not found. Please select again.';
        return;
    }
    currentWords = topicObj.words || [];
    currentIndex = 0;
    console.log('[DEBUG] Loaded words for topic:', topicName, 'Words:', currentWords);
}


// ---- Update DOM references to include alphabet ----
function updateDOMReferences(screenId) {
    console.log('[DEBUG] Updating DOM references for screen:', screenId);
    
    const screen = document.getElementById(screenId);
    if (!screen) {
        console.warn('[DEBUG] Screen element not found:', screenId);
        return;
    }

    // Scoped elements – tìm trong section đang active
    topicSelect   = screen.querySelector('#topicSelect');
    alphabetSelect = screen.querySelector('#alphabetSelect'); // THÊM DÒNG NÀY
    wordDisplay   = screen.querySelector('#word');
    wordImage     = screen.querySelector('#wordImage');
    feedback      = screen.querySelector('#feedback');
    error         = screen.querySelector('#error');
    gameArea      = screen.querySelector('#gameArea');
    transcriptBox = screen.querySelector('#transcriptBox');
    listenBtn     = screen.querySelector('#listenBtn');
    speakBtn      = screen.querySelector('#speakBtn');
    gameBtn       = screen.querySelector('#gameBtn');

    // ⭐ sửa ở đây: gán đúng vào starsContainer/bubblesContainer
    starsContainer   = screen.querySelector('#stars');
    bubblesContainer = screen.querySelector('#bubbles');
    // giữ alias cũ để code khác vẫn chạy được
    stars   = starsContainer;
    bubbles = bubblesContainer;

    successSound    = screen.querySelector('#successSound');
    tryAgainEnSound = screen.querySelector('#tryAgainEnSound');
    quizStartEnSound = screen.querySelector('#quizStartEnSound');

    // Global elements – chỉ có 1 trên toàn app
    wordSound     = document.querySelector('#wordSound');
    praiseEnSound = document.querySelector('#praiseEnSound');
    loader        = document.querySelector('#loader');

    // Gắn handlers cho cả topic và alphabet - THÊM 2 DÒNG NÀY
    attachTopicSelectHandler();
    attachAlphabetSelectHandler();
    
    console.log('[DEBUG] Updated DOM references for', screenId);
}

// ---- Initialize SpeechRecognition (iOS-optimized version) ----
function initRecognitionOnce() {
    if (recognition) return;

    // Kiểm tra hỗ trợ
    const SpeechRecognitionAPI = window.webkitSpeechRecognition || window.SpeechRecognition;
    if (!SpeechRecognitionAPI) {
        console.warn('[STT] SpeechRecognition not supported on this browser');
        if (error) error.textContent = 'Trình duyệt không hỗ trợ nhận diện giọng nói';
        return;
    }

    recognition = new SpeechRecognitionAPI();

    // === CẤU HÌNH TỐI ƯU CHO iOS ===
    recognition.continuous = false;         // Không continuous để tránh treo trên iOS
    recognition.interimResults = true;      // ⚠️ BẬT interim – cực kỳ quan trọng trên iOS để có phản hồi sớm
    recognition.lang = 'en-US';
    recognition.maxAlternatives = 1;

    let handled = false;
    let consecutiveErrors = 0; // Đếm lỗi liên tiếp để fallback nếu cần

    // Hàm chung xử lý khi lỗi hoặc không nhận diện được
    function handleTryAgain() {
        if (handled || !isListening) return;
        handled = true;
        isListening = false;

        // Hiển thị thông báo thân thiện
        if (transcriptBox) {
            transcriptBox.textContent = '💬 Thử nói lại nhé!';
            transcriptBox.className = 'transcript-box neutral';
        }

        // Phát âm thanh hướng dẫn (nếu có)
        playGuideAudio("tryAgainEnSound").catch(() => {});

        // Re-enable nút speak
        if (speakBtn) {
            speakBtn.disabled = false;
            speakBtn.style.opacity = '1';
        }

        console.log('[STT] Đã xử lý try again và mở lại nút speak');
    }

    // === XỬ LÝ LỖI – ĐẶC BIỆT CHÚ Ý iOS ===
    recognition.onerror = (e) => {
        console.error(`[STT Error] ${e.error} | Message: ${e.message || 'No message'}`);

        consecutiveErrors++;
        clearTimeout(recognitionTimeout);
        isListening = false;

        // Các lỗi phổ biến trên iOS
        if (e.error === 'not-allowed' || e.error === 'permission-denied') {
            if (transcriptBox) {
                transcriptBox.textContent = '🚫 Không có quyền truy cập micro. Vui lòng bật trong Cài đặt > Safari > Micro.';
                transcriptBox.className = 'transcript-box warning';
            }
            consecutiveErrors = 0; // Reset vì đây là lỗi quyền, không phải STT
        } 
        else if (e.error === 'network') {
            if (transcriptBox) {
                transcriptBox.textContent = '🌐 Kết nối mạng yếu hoặc bị chặn. Hãy kiểm tra Wi-Fi/Data.';
                transcriptBox.className = 'transcript-box warning';
            }
        }
        else if (e.error === 'service-not-allowed') {
            // Lỗi điển hình khi chạy trong PWA installed trên iOS
            if (transcriptBox) {
                transcriptBox.textContent = '⚠️ Nhận diện giọng nói không hoạt động tốt trong app đã cài. Hãy mở bằng Safari để thử lại!';
                transcriptBox.className = 'transcript-box warning';
            }
        }
        else if (e.error === 'no-speech') {
            console.warn('[STT] Không phát hiện giọng nói');
            handleTryAgain();
            return; // Đã xử lý
        }
        else {
            // Các lỗi khác: aborted, audio-capture, etc.
            if (consecutiveErrors >= 3) {
                if (transcriptBox) {
                    transcriptBox.textContent = '😔 Nhận diện giọng nói đang gặp vấn đề. Hãy thử lại sau hoặc mở bằng Safari.';
                    transcriptBox.className = 'transcript-box warning';
                }
            } else {
                handleTryAgain();
            }
        }

        // Luôn re-enable button
        if (speakBtn) {
            speakBtn.disabled = false;
            speakBtn.style.opacity = '1';
        }

        handled = true;
    };

    recognition.onnomatch = () => {
        console.warn('[STT] Không tìm thấy kết quả phù hợp');
        handleTryAgain();
    };

    recognition.onspeechend = () => {
        console.log('[STT] Phát hiện hết giọng nói → dừng recognition');
        try { recognition.stop(); } catch (err) {}
    };

    recognition.onend = () => {
        console.log('[STT] Recognition ended');
        clearTimeout(recognitionTimeout);
        isListening = false;
        handled = false;

        if (speakBtn) {
            speakBtn.disabled = false;
            speakBtn.style.opacity = '1';
        }
    };

    recognition.onstart = () => {
        console.log('[STT] Recognition started successfully');
        handled = false;
        consecutiveErrors = 0;

        // Timeout dài hơn cho iOS (thường mất 5-10s để kết nối server Apple)
        recognitionTimeout = setTimeout(() => {
            console.warn('[STT] Timeout dài → force stop (iOS common issue)');
            try { recognition.stop(); } catch (err) {}
            if (transcriptBox) {
                transcriptBox.textContent = '⏳ Đang xử lý... (iOS có thể chậm)';
            }
        }, 15000); // 15 giây
    };

    console.log('[STT] SpeechRecognition initialized (iOS-optimized)');
}


function startRecognitionWithTarget(targetSentence, onResult, onError) {
    if (!recognition) initRecognitionOnce();

    // 🔥 Dừng recognition cũ nếu đang chạy
    if (isListening) {
        try {
            recognition.stop();
        } catch (e) {
            console.log("[STT] Could not stop previous recognition:", e);
        }
    }

    // 🟢 THÊM: Định nghĩa currentWordObj
    const currentWordObj = currentWords && currentWords[currentIndex] ? currentWords[currentIndex] : { en: targetSentence };

    recognition.onresult = (event) => {
        if (!event.results || !event.results[0] || !event.results[0][0]) {
            console.warn("[STT Debug] No valid speech result.");
            return;
        }

        // 🔥 Chỉ xử lý nếu là FINAL result
        if (event.results[0].isFinal) {
            const spokenRaw = event.results[0][0].transcript.trim();
            console.log(`[STT Debug] FINAL Spoken: "${spokenRaw}" | Target: "${currentWordObj.en}"`);

            // Set flag hasAnswered
            hasAnswered = true;
            console.log('[STT Debug] Set hasAnswered=true after final result');

            // Clear timeout
            if (recognitionTimeout) {
                clearTimeout(recognitionTimeout);
                console.log('[STT Debug] Cleared timeout after final result');
                recognitionTimeout = null;
            }

            const transcriptBox = document.getElementById("transcriptBox") || initTranscriptBox(currentActivity);
            if (transcriptBox) {
                transcriptBox.textContent = `🗣️ "${spokenRaw}"`;
                transcriptBox.style.backgroundColor = '#fff8c4';
                transcriptBox.style.color = '#333';
            }

            // Gọi onResult
            if (onResult) {
                onResult(spokenRaw);
            } else {
                console.warn("[STT] No onResult callback provided");
            }
        } else {
            console.log('[STT Debug] Ignoring interim result:', event.results[0][0].transcript.trim());
        }
    };

    recognition.onerror = (event) => {
        console.log("[STT Error]", event.error, "| Message:", event.message, "| Lang:", recognition.lang);

        // Clear timeout khi error
        if (recognitionTimeout) {
            clearTimeout(recognitionTimeout);
            console.log('[STT Debug] Cleared timeout after error');
            recognitionTimeout = null;
        }

        if (onError) onError(event.error);
    };

    recognition.onend = () => {
        console.log("[STT Debug] Recognition ended");

        // Clear timeout khi end
        if (recognitionTimeout) {
            clearTimeout(recognitionTimeout);
            console.log('[STT Debug] Cleared timeout after end');
            recognitionTimeout = null;
        }

        isListening = false;
        if (speakBtn) {
            speakBtn.disabled = false;
            speakBtn.style.opacity = "1";
        }
    };

    // 🟢 THÊM: onspeechstart để dừng timeout sớm nếu phát hiện speech
    recognition.onspeechstart = () => {
        console.log('[STT Debug] Speech detected, shortening timeout');
        if (recognitionTimeout) {
            clearTimeout(recognitionTimeout);
            recognitionTimeout = setTimeout(() => {
                console.warn('[STT Timeout] No final result after speech detected → stopping');
                try { recognition.stop(); } catch {}
                handleTryAgain();
            }, isMobileDevice() ? 5000 : 3000); // 5s mobile, 3s desktop sau speech
        }
    };

    try {
        recognition.maxAlternatives = 1; // 🟢 Giảm workload
        recognition.start();
        isListening = true;
        console.log("[STT] Recognition started for:", targetSentence);

        // 🟢 SỬA: Timeout động, giảm trên mobile
        const timeoutDuration = isMobileDevice() ? 8000 : 7000; // 8s mobile, 7s desktop
        console.log(`[STT] Set timeout to ${timeoutDuration}ms (mobile: ${isMobileDevice()})`);
        recognitionTimeout = setTimeout(() => {
            console.warn(`[STT Timeout] No speech detected in ${timeoutDuration/1000}s → stopping`);
            try { recognition.stop(); } catch {}
            handleTryAgain();
        }, timeoutDuration);

    } catch (err) {
        console.error("[STT] Cannot start recognition:", err);
        if (onError) onError(err.message);
    }
}


async function startNextActivity() {
    saveAppState();
    console.log('[DEBUG] === ENTER startNextActivity ===');
    console.log('[DEBUG] currentActivityIndex:', currentActivityIndex, 'activityFlow:', activityFlow, 'currentActivity:', currentActivity);
    
    // 🔒 CẢI THIỆN: Lock chặt chẽ hơn
    if (window.activityLock) {
        console.warn('[WARN] startNextActivity called while previous transition still in progress');
        return;
    }
    window.activityLock = true;
    
    try {
        // ✅ Reset các biến học tập khi chuyển activity
        currentIndex = 0;
        wrongCount = 0;
        readAttempts = 0;
        window.answeredLock = false;
        
        // ✅ Kiểm tra activity flow hợp lệ
        if (!activityFlow || currentActivityIndex >= activityFlow.length) {
            console.log('[IMPROVEMENT] All activities completed or invalid flow, reset to initial screen');
            
            // 🟢 THÊM: Phát âm thanh hoàn thành
            try {
                await playGuideAudio("heroSound");
            } catch (err) {
                console.warn('Could not play hero sound:', err);
            }
            
            resetToIdleState();
            return;
        }

        const activity = activityFlow[currentActivityIndex];
        currentActivity = activity;
        console.log("[DEBUG] Starting next activity:", activity, "Index:", currentActivityIndex, "/", activityFlow.length - 1);

        // 🟢 THÊM: Delay nhỏ để đảm bảo chuyển màn hình mượt
        await new Promise(resolve => setTimeout(resolve, 300));

        // === Từng loại activity ===
        if (activity === 'learn') {
            await setupLearnActivity();
        } else if (activity === 'quiz') {
            await setupQuizActivity();
        } else if (activity === 'games') {
            await setupGamesActivity();
        } else {
            console.error('[ERROR] Unknown activity:', activity);
            resetToIdleState();
        }

    } catch (err) {
        console.error('[ERROR] Exception in startNextActivity:', err);
        resetToIdleState();
    } finally {
        window.activityLock = false;
        console.log('[DEBUG] === EXIT startNextActivity ===');
    }
}

// 🟢 THÊM: Tách thành các hàm riêng để dễ quản lý
async function setupLearnActivity() {
    console.log('[DEBUG] Setting up LEARN mode...');
    showScreen('learn');
    initGameDOM();
    initTranscriptBox('learn');
    debugGlobalVariables();

    if (listenBtn) listenBtn.style.display = 'inline-block';
    if (speakBtn) speakBtn.style.display = 'inline-block';
    if (gameBtn) gameBtn.style.display = 'none';
    if (wordDisplay) wordDisplay.style.display = 'block';
    if (wordImage) wordImage.style.display = 'block';

    // Kiểm tra dữ liệu
    if (currentWords && currentWords.length > 0) {
        try {
            const mode = getCurrentLearningMode();
            console.log('[DEBUG] setupLearnActivity - Mode:', mode, 'CurrentLetter:', currentLetter, 'CurrentTopic:', currentTopic);
            
            // 🟢 SỬA: Đảm bảo gọi playTopicIntro với tham số đúng
            if (mode === 'alphabet' && currentLetter) {
                console.log('[DEBUG] Calling playTopicIntro for letter:', currentLetter);
                await playTopicIntro(currentLetter);
            } else if (mode === 'topic' && currentTopic) {
                console.log('[DEBUG] Calling playTopicIntro for topic:', currentTopic);
                await playTopicIntro(currentTopic);
            } else {
                console.warn('[DEBUG] No valid topic or letter found for learn intro');
                console.warn('[DEBUG] Fallback data - mode:', mode, 'currentLetter:', currentLetter, 'currentTopic:', currentTopic);
                // Fallback: vẫn thử phát learnGuideViSound
                try {
                    await playGuideAudio("learnGuideViSound");
                } catch (err) {
                    console.warn('Could not play learn guide audio, using TTS fallback:', err);
                    await speak("Let's start learning! Press the listen button to hear the word, then press the speak button to say it.");
                }
            }
            
            setTimeout(showWord, 1200);
        } catch (err) {
            console.error('[ERROR] Intro failed:', err);
            // Fallback: vẫn tiếp tục hiển thị từ
            setTimeout(showWord, 1000);
        }
    } else {
        handleNoWordsError();
    }
}


async function setupQuizActivity() {
    console.log('[DEBUG] Setting up QUIZ mode...');
    showScreen('quiz');
    initGameDOM();
    initTranscriptBox('quiz');

    if (listenBtn) listenBtn.style.display = 'none';
    if (speakBtn) speakBtn.style.display = 'inline-block';
    if (gameBtn) gameBtn.style.display = 'none';
    if (wordDisplay) wordDisplay.style.display = 'block';
    if (wordImage) wordImage.style.display = 'block';
    
    await startQuiz();
}

async function setupGamesActivity() {
    console.log('[DEBUG] Setting up GAMES mode...');
    showScreen('games');
    initGameDOM();
    initTranscriptBox('games');

    if (listenBtn) listenBtn.style.display = 'none';
    if (speakBtn) speakBtn.style.display = 'none';
    if (gameBtn) gameBtn.style.display = 'none';
    if (wordDisplay) wordDisplay.style.display = 'none';
    if (wordImage) wordImage.style.display = 'none';
    if (gameArea) gameArea.style.display = 'block';
    
    await startMiniGame();
}

function handleNoWordsError() {
    const mode = getCurrentLearningMode();
    console.error('[ERROR] No words available for', mode);
    if (error) {
        if (mode === 'alphabet') {
            error.textContent = 'Please select a valid letter to start learning!';
        } else {
            error.textContent = 'Please select a valid topic to start learning!';
        }
    }
    resetToIdleState();
}

async function playTopicIntro(topicName) {
    console.log('[DEBUG] playTopicIntro called for:', topicName);
    console.log('[DEBUG] playTopicIntro - currentLetter:', currentLetter, 'currentTopic:', currentTopic);
    
    const mode = getCurrentLearningMode();
    console.log('[DEBUG] playTopicIntro - detected mode:', mode);
    
    // 🟢 SỬA: Luôn thử phát learnGuideViSound trước, không quan tâm nội dung
    console.log('[DEBUG] Attempting to play learnGuideViSound');
    try {
        await playGuideAudio("learnGuideViSound");
        console.log('[DEBUG] Successfully played learnGuideViSound');
        return; // 🟢 QUAN TRỌNG: return ngay sau khi phát thành công
    } catch (err) {
        console.warn("Could not play learn guide audio, using TTS fallback:", err);
    }
    
    // 🟢 CHỈ dùng TTS nếu không phát được audio
    let introTextEn = '';
    if (mode === 'alphabet' && currentLetter) {
        const letterObj = wordsData.by_letters.find(l => l.letter === currentLetter);
        if (letterObj) {
            introTextEn = `Let's learn words starting with letter ${currentLetter}! ${letterObj.name_en}. Press the listen button to hear the word, then press the speak button to say it. Let's start!`;
        } else {
            introTextEn = `Let's learn words starting with letter ${currentLetter}! Press the listen button to hear the word, then press the speak button to say it. Let's start!`;
        }
    } else if (currentTopic) {
        let topicObj = null;
        if (wordsData.by_topics) {
            topicObj = wordsData.by_topics.find(t => t.name_en === currentTopic);
        } else if (wordsData.topics) {
            topicObj = wordsData.topics.find(t => t.name_en === currentTopic);
        }
        
        if (topicObj) {
            introTextEn = `Today's topic is ${topicObj.name_en}. Press the listen button to hear the word, then press the speak button to say it. Let's start!`;
        } else {
            introTextEn = `Let's learn about ${currentTopic}! Press the listen button to hear the word, then press the speak button to say it. Let's start!`;
        }
    } else {
        introTextEn = "Let's start learning! Press the listen button to hear the word, then press the speak button to say it.";
    }
    
    await speak(introTextEn);
}


// Sửa tương tự cho playQuizIntro
async function playQuizIntro(topicName) {
    console.log('[DEBUG] playQuizIntro called for:', topicName);
    
    const mode = getCurrentLearningMode();
    let introTextEn = '';
    
    if (mode === 'alphabet' && currentLetter) {
        // 🟢 Xử lý cho chế độ chữ cái
        const letterObj = wordsData.by_letters.find(l => l.letter === currentLetter);
        if (!letterObj) {
            console.error("Letter not found:", currentLetter);
            return;
        }
        introTextEn = `Quiz time for letter ${currentLetter}! Press the speak button and say the correct words. Let's begin!`;
        console.log('[DEBUG] Playing quiz intro for letter:', currentLetter);
    } else if (currentTopic) {
        // Xử lý cho chế độ chủ điểm
        let topicObj = null;
        if (wordsData.by_topics) {
            topicObj = wordsData.by_topics.find(t => t.name_en === currentTopic);
        } else if (wordsData.topics) {
            topicObj = wordsData.topics.find(t => t.name_en === currentTopic);
        }
        
        if (!topicObj) {
            console.error("Topic not found:", currentTopic);
            return;
        }
        introTextEn = `Quiz time! Press the speak button and say the correct words. Let's begin!`;
        console.log('[DEBUG] Playing quiz intro for topic:', currentTopic);
    } else {
        // 🟢 THÊM: Fallback khi cả topicName và currentLetter đều không có
        console.warn('[DEBUG] No topic or letter found for quiz intro');
        introTextEn = `Quiz time! Press the speak button and say the correct words. Let's begin!`;
    }
    
    try {
        await playGuideAudio("quizGuideViSound");
        console.log('[DEBUG] Successfully played quizGuideViSound');
    } catch (err) {
        console.warn("Could not play quiz guide audio, using TTS fallback:", err);
        await speak(introTextEn);
    }
}


async function startQuiz() {
    console.log('=== [DEBUG] ENTER startQuiz ===');
    console.log('[DEBUG] Activity index:', currentActivityIndex, '| Current topic:', currentTopic, '| Current letter:', currentLetter);

    // 🔒 Tránh gọi lặp khi quiz đang khởi động
    if (window.startQuizLock) {
        console.warn('[WARN] startQuiz already running, skipping duplicate call');
        return;
    }
    window.startQuizLock = true;

    try {
        // ✅ Kích hoạt chế độ quiz
        isQuizMode = true;
        quizScore = 0;
        currentIndex = 0;
        wrongCount = 0;
        window.answeredLock = false;

        // ✅ Kiểm tra dữ liệu
        if (!currentWords || currentWords.length === 0) {
            console.error('[ERROR] No words found for quiz');
            if (error) error.textContent = 'No words available for quiz. Please restart the topic.';
            resetToIdleState();
            window.startQuizLock = false;
            return;
        }
        
        // ✅ THÊM: Phát intro cho quiz mode - SỬA QUAN TRỌNG
        try {
            const mode = getCurrentLearningMode();
            console.log('[DEBUG] Quiz mode detection:', mode);
            
            if (mode === 'alphabet' && currentLetter) {
                // 🟢 Gọi với currentLetter thay vì currentTopic
                await playQuizIntro(currentLetter);
            } else if (currentTopic) {
                await playQuizIntro(currentTopic);
            } else {
                // 🟢 Fallback: gọi không tham số
                await playQuizIntro();
            }
        } catch (err) {
            console.warn('[startQuiz] Could not play quiz intro, continuing...', err);
        }
        
        // ✅ Hiển thị thông báo khởi động quiz
        if (feedback) {
            const mode = getCurrentLearningMode();
            if (mode === 'alphabet' && currentLetter) {
                feedback.textContent = `🧩 Starting quiz for letter ${currentLetter}! Speak each word correctly!`;
            } else {
                feedback.textContent = '🧩 Starting quiz! Speak each word correctly to earn points!';
            }
            feedback.className = '';
        }
        if (error) error.textContent = '';

        console.log('[DEBUG] Quiz initialized with', currentWords.length, 'words');

        // ✅ Delay nhẹ cho giao diện ổn định
        await new Promise(resolve => setTimeout(resolve, 800));

        // ✅ Bắt đầu hiển thị từ đầu tiên
        console.log('[DEBUG] Calling showWord() for quiz start...');
        showWord();

    } catch (err) {
        console.error('[ERROR] Exception in startQuiz:', err);
        if (error) error.textContent = 'Error starting quiz.';
        resetToIdleState();
    } finally {
        window.startQuizLock = false;
        console.log('=== [DEBUG] EXIT startQuiz ===');
    }
}



function debugAudioPlayback() {
    const mode = getCurrentLearningMode();
    const currentScreen = document.querySelector('.screen.active');
    const activeModeBtn = currentScreen ? currentScreen.querySelector('.mode-btn.active') : null;
    
    console.log('[AUDIO DEBUG]', {
        mode: mode,
        currentLetter: currentLetter,
        currentTopic: currentTopic,
        activeMode: activeModeBtn ? activeModeBtn.dataset.mode : 'none',
        currentWords: currentWords ? currentWords.length : 0,
        activityFlow: activityFlow,
        currentActivityIndex: currentActivityIndex
    });
}



async function finishQuiz() {
    console.log('=== [DEBUG] ENTER finishQuiz ===');
    console.log('[DEBUG] Current topic:', currentTopic, '| Score:', quizScore, '| Activity index:', currentActivityIndex);

    if (window.finishQuizLock) {
        console.warn('[WARN] finishQuiz already in progress, skipping duplicate call');
        return;
    }
    window.finishQuizLock = true;

    try {
        isQuizMode = false;
        lastCompletedTopic = currentTopic;

        // ✅ Reset biến học tập
        currentIndex = 0;
        wrongCount = 0;
        window.answeredLock = false;

        // ✅ Thông báo kết thúc quiz
        if (feedback) {
            feedback.textContent = `🎉 Quiz complete! You scored ${quizScore}/${currentWords.length}.`;
            feedback.className = 'success';
        }

        console.log('[DEBUG] Quiz finished for topic:', currentTopic, '| Score:', quizScore);

        // 🟢 SỬA: Award points trước khi chuyển activity
        const perfectBonus = quizScore === currentWords.length ? 1.5 : 1;
        awardPoints('quiz_perfect', perfectBonus);

        // ✅ Chuẩn bị chuyển sang activity kế tiếp
        currentActivityIndex++;
        console.log('[DEBUG] Incremented currentActivityIndex →', currentActivityIndex, '/', activityFlow.length - 1);

        // 🟢 THÊM: Delay đủ lâu để người dùng thấy kết quả
        await new Promise(resolve => setTimeout(resolve, 2000));

        // ✅ Nếu còn activity kế tiếp → sang tiếp
        if (currentActivityIndex < activityFlow.length) {
            console.log('[DEBUG] Proceeding to next activity...');
            startNextActivity();
        } else {
            console.log('[IMPROVEMENT] All activities completed. Returning to idle screen.');
            if (feedback) feedback.textContent = '🏁 Great job! You\'ve completed all activities!';
            
            // 🟢 THÊM: Phát âm thanh hoàn thành
            try {
                await playGuideAudio("heroSound");
            } catch (err) {
                console.warn('Could not play hero sound, using TTS:', err);
                await speak("Great job! You finished all activities!");
            }
            
            setTimeout(resetToIdleState, 1500);
        }

    } catch (err) {
        console.error('[ERROR] Exception in finishQuiz:', err);
        resetToIdleState();
    } finally {
        window.finishQuizLock = false;
        console.log('=== [DEBUG] EXIT finishQuiz ===');
    }
}

// 🟢 THÊM: Hàm debug để kiểm tra cấu trúc dữ liệu
function debugDataStructure() {
    console.log('[DEBUG] Current data structure:', {
        hasByTopics: !!wordsData.by_topics,
        hasByLetters: !!wordsData.by_letters,
        hasTopics: !!wordsData.topics,
        byTopicsCount: wordsData.by_topics?.length || 0,
        byLettersCount: wordsData.by_letters?.length || 0,
        topicsCount: wordsData.topics?.length || 0,
        currentWords: currentWords?.length || 0,
        currentTopic: currentTopic,
        currentLetter: currentLetter
    });
}

// Gọi hàm debug ở các vị trí quan trọng
debugDataStructure();


async function showWord() {
    if (currentActivity !== 'learn' && currentActivity !== 'quiz') {
        console.log('[DEBUG] showWord called but currentActivity is:', currentActivity, '- skipping');
        return;
    }
    hasAnswered = false; // Reset cho từ mới
    wrongCount = 0; // Đã có
    console.log('[DEBUG] showWord called, currentActivity:', currentActivity, 'currentIndex:', currentIndex, 'currentWords:', currentWords, 'isQuizMode:', isQuizMode);

    // --- Kiểm tra dữ liệu ---
    if (!currentWords || currentWords.length === 0) {
        if (wordDisplay) {
            wordDisplay.innerHTML = 'No words available';
        }
        if (wordImage) wordImage.src = '/song-ngu-cho-be/images/icon-512.png';
        return;
    }

    // --- Nếu vượt quá danh sách từ ---
    if (currentIndex >= currentWords.length) {
        console.log('[Flow] Topic finished. Switching activity...');
        if (currentActivity === 'learn' && !isQuizMode) {
            if (feedback) feedback.textContent = 'Lesson completed! Starting quiz.';
            // 🔥 THAY THẾ TTS BẰNG MP3
            try {
                await playGuideAudio("quizIntroViSound"); // MP3 "bé giỏi lắm, cùng kiểm tra lại nhé"
            } catch (err) {
                console.warn("Could not play quiz intro audio, using TTS fallback:", err);
                await speak("Great job! Now let's start the quiz!");
            }
            currentActivityIndex++;
            setTimeout(startNextActivity, 1200);
        } else if (currentActivity === 'quiz' && isQuizMode) {
            finishQuiz();
        }
        return;
    }

    // --- Lấy từ hiện tại ---
    const currentWord = currentWords[currentIndex];
    if (!currentWord) {
        console.error('Current word is undefined at index', currentIndex);
        return;
    }

    // --- Reset UI ---
    // 🔥 SỬA: Đảm bảo transcript box luôn được khởi tạo và hiển thị
    initTranscriptBox(currentActivity);
    if (transcriptBox) {
        transcriptBox.style.display = 'block'; // Đảm bảo hiển thị
        transcriptBox.textContent = '';
        transcriptBox.style.backgroundColor = '#fff8c4';
        transcriptBox.style.color = '#333';
        transcriptBox.style.padding = '10px';
        transcriptBox.style.borderRadius = '8px';
        transcriptBox.style.margin = '10px 0';
        transcriptBox.style.minHeight = '20px';
    }
    
    if (feedback) feedback.textContent = '';
    if (error) error.textContent = '';

    // --- Cập nhật UI từ ---
    // 🟢 SỬA: Thay thế phần hiển thị từ bằng code hiển thị tiếng Việt
    // THAY THẾ ĐOẠN CODE TRONG showWord()
if (wordDisplay) {
    if (isQuizMode) {
        wordDisplay.innerHTML = ''; // Quiz mode ẩn từ
    } else {
        const englishWord = currentWord.en || '';
        const vietnameseWord = currentWord.vi || '';
        
        if (vietnameseWord) {
            wordDisplay.innerHTML = `
                <div class="english-word" style="font-size: clamp(32px, 8vw, 48px); font-weight: bold; color: #2196F3; margin-bottom: 5px; line-height: 1.2;">
                    ${englishWord}
                </div>
                <div class="vietnamese-word" style="font-size: clamp(24px, 6vw, 32px); color: #FF6B00; font-style: italic; margin-top: 5px; line-height: 1.2;">
                    (${vietnameseWord})
                </div>
            `;
        } else {
            wordDisplay.innerHTML = `
                <div class="english-word" style="font-size: clamp(32px, 8vw, 48px); font-weight: bold; color: #2196F3; line-height: 1.2;">
                    ${englishWord}
                </div>
            `;
        }
    }
}
    
    if (wordImage) wordImage.src = currentWord.image || '/song-ngu-cho-be/images/icon-512.png';

    wrongCount = 0;
    window.answeredLock = false;

    // --- Listen (chỉ trong Learn mode) ---
    if (currentActivity === 'learn' && listenBtn) {
        listenBtn.style.display = 'inline-block';
        listenBtn.onclick = () => {
            console.log("[Learn] Listen button clicked:", currentWord.en);
            speakWordPromise(currentWord.en).catch(err => console.warn("Listen TTS error:", err));
        };
    } else if (listenBtn) {
        listenBtn.style.display = 'none';
    }

    // --- Speak (Learn + Quiz) ---
    if (speakBtn) {
        speakBtn.style.display = 'inline-block';
        let speakClickCount = 0; // Đếm số lần bấm speak cho mỗi từ

        speakBtn.onclick = async () => {
            console.log(`[${currentActivity}] Speak button clicked for word:`, currentWord.en);
            speakClickCount++;

            // Nếu bấm quá 3 lần thì bỏ qua từ này
            if (speakClickCount >= 3) {
                console.warn("[Speak] User clicked 3 times → skipping to next word");
                speakClickCount = 0;
                wrongCount = 0;
                currentIndex++;
                showWord();
                return;
            }

            // Chuẩn bị STT
            if (!recognition) initRecognitionOnce();
            speakBtn.disabled = true;
            speakBtn.style.opacity = "0.5";

            // 🔥 ĐẢM BẢO TRANSCRIPT BOX HIỂN THỊ TRONG QUIZ MODE
            if (transcriptBox) {
                transcriptBox.textContent = "🎤 Listening...";
                transcriptBox.style.color = "#007bff";
                transcriptBox.style.backgroundColor = "#e3f2fd";
            }

            // 🟢 Định nghĩa các hàm callback trước
            const handleCorrect = () => {
                speakBtn.disabled = false;
                speakBtn.style.opacity = "1";
                wrongCount = 0;
                
                // 🟢 THÊM: Cập nhật transcript khi đúng
                if (transcriptBox) {
                    transcriptBox.textContent = `✅ Correct! "${currentWord.en}"`;
                    transcriptBox.style.color = "#2e7d32";
                    transcriptBox.style.backgroundColor = "#e8f5e8";
                }
                
                // 🟢 THÊM: Delay để hiển thị transcript và feedback
                setTimeout(() => {
                    currentIndex++;
                    showWord();
                }, 1500); // Chờ 1.5 giây để người dùng thấy kết quả
            };

            const handleWrong = async () => {
    speakBtn.disabled = false;
    speakBtn.style.opacity = "1";
    
    // 🟢 KIỂM TRA NẾU CẦN CHUYỂN TIẾP NGAY
    if (window.shouldSkipImmediately) {
        console.log("[handleWrong] Skipping immediately due to wrong answer");
        wrongCount = 0;
        
        // 🟢 Cập nhật transcript
        if (transcriptBox) {
            transcriptBox.textContent = "⏭️ Moving to next word...";
            transcriptBox.style.color = "#ff6f00";
            transcriptBox.style.backgroundColor = "#fff3e0";
        }
        
        // 🟢 Chuyển từ ngay lập tức
        setTimeout(() => {
            currentIndex++;
            showWord();
        }, 500);
        return;
    }
    
    // 🟢 LOGIC CŨ NẾU KHÔNG CÓ shouldSkipImmediately
    wrongCount++;
    console.log(`[${currentActivity}] Wrong attempt ${wrongCount}`);

    // Cập nhật transcript khi sai
    if (transcriptBox) {
        transcriptBox.textContent = "❌ Try again!";
        transcriptBox.style.color = "#c62828";
        transcriptBox.style.backgroundColor = "#ffebee";
    }

    // Kiểm tra lock để tránh phát 2 lần
    if (!window.audioLock) {
        window.audioLock = true;
        try {
            await playGuideAudio("tryAgainEnSound");
        } catch (err) {
            console.warn('Error playing try again sound:', err);
        } finally {
            window.audioLock = false;
        }
    }

    if (wrongCount >= 3) {
        console.warn("[Speak] Too many wrong attempts → skip word");
        wrongCount = 0;
        
        // Cập nhật transcript khi skip
        if (transcriptBox) {
            transcriptBox.textContent = "⏭️ Skipping to next word...";
            transcriptBox.style.color = "#ff6f00";
            transcriptBox.style.backgroundColor = "#fff3e0";
        }
        
        // THÊM: Delay trước khi skip
        setTimeout(() => {
            currentIndex++;
            showWord();
        }, 1000);
    }
};
            const handleSTTError = async (error) => {
                console.warn(`[${currentActivity}] STT error:`, error);
                speakBtn.disabled = false;
                speakBtn.style.opacity = "1";
                wrongCount++;

                // 🟢 Cập nhật transcript khi lỗi STT
                if (transcriptBox) {
                    transcriptBox.textContent = "❌ Speech recognition error, please try again";
                    transcriptBox.style.color = "#c62828";
                    transcriptBox.style.backgroundColor = "#ffebee";
                }

                // 🟢 THÊM: Kiểm tra lock để tránh phát 2 lần
                if (!window.audioLock) {
                    window.audioLock = true;
                    try {
                        await playGuideAudio("tryAgainEnSound");
                    } catch (err) {
                        console.warn('Error playing try again sound:', err);
                    } finally {
                        window.audioLock = false;
                    }
                }

                if (wrongCount >= 3) {
                    console.warn("[STT] Too many errors → skip word");
                    wrongCount = 0;
                    
                    if (transcriptBox) {
                        transcriptBox.textContent = "⏭️ Moving to next word...";
                    }
                    
                    currentIndex++;
                    showWord();
                }
            };

            // 🟢 Gọi hàm nhận diện giọng nói
            startRecognitionWithTarget(
                currentWord.en,
                // --- Khi nhận diện thành công ---
                (spokenRaw) => {
                    speakClickCount = 0; // reset click
                    // 🟢 Gọi checkSpokenAnswer với các callback đã định nghĩa
                    checkSpokenAnswer(
                        spokenRaw,
                        currentWord.en,
                        handleCorrect,
                        handleWrong
                    );
                },
                // --- Khi STT lỗi ---
                handleSTTError
            );
        };
    }
}


// ---- Button Event Listeners ----
function attachGlobalButtonListeners() {
    if (listenBtn) {
        listenBtn.addEventListener('click', async () => {
            console.log('Listen button clicked, currentWords:', currentWords, 'currentIndex:', currentIndex);
            if (!currentWords || currentIndex >= currentWords.length) return;
            const currentWord = currentWords[currentIndex];
            await speak(currentWord.en || '');
        });
    }

    // ❌ Không cần addEventListener cho speakBtn ở đây nữa,
    // vì đã được gắn riêng trong showWord() cho từng mode
}

function startListening() {
    console.warn("[DEPRECATED] startListening() is deprecated. Use startRecognitionWithTarget() instead.");
    // Hoặc xóa hoàn toàn hàm này
}

// Normalize text for comparison
function normalizeForCompare(str) {
    if (!str) return '';
    let s = String(str).replace(/[\u200B-\u200D\uFEFF]/g, '');
    try { s = s.normalize('NFC'); } catch (e) { /* ignore if unsupported */ }
    s = s.trim();
    s = s.replace(/[.,!?;:"'(){}\[\]•…\-—]/g, '');
    s = s.replace(/\s+/g, ' ').toLowerCase();
    return s;
}

function calculateSimilarity(a, b) {
    const m = Array.from({ length: a.length + 1 }, () => Array(b.length + 1).fill(0));
    for (let i = 0; i <= a.length; i++) m[i][0] = i;
    for (let j = 0; j <= b.length; j++) m[0][j] = j;
    for (let i = 1; i <= a.length; i++) {
        for (let j = 1; j <= b.length; j++) {
            const cost = a[i - 1] === b[j - 1] ? 0 : 1;
            m[i][j] = Math.min(
                m[i - 1][j] + 1,
                m[i][j - 1] + 1,
                m[i - 1][j - 1] + cost
            );
        }
    }
    const distance = m[a.length][b.length];
    const maxLen = Math.max(a.length, b.length) || 1;
    return 1 - distance / maxLen;
}



 function handleTryAgain() {
    // 🟢 SỬA: Luôn chuyển tiếp sau 2 lần thử
    wrongCount++;
    console.log(`[TryAgain] Wrong count: ${wrongCount}/2`);
    
    if (wrongCount >= 2) {
        console.warn("[TryAgain] 2 wrong attempts → skip word");
        wrongCount = 0;
        currentIndex++;
        showWord();
    } else {
        playGuideAudio("tryAgainEnSound");
    }
}

function nextWord() {
    currentIndex++;
    showWord();
}


function createStars() {
    if (starsContainer) {
        starsContainer.innerHTML = '';
        for (let i = 0; i < 10; i++) {
            const star = document.createElement('div');
            star.className = 'star';
            star.style.left = `${Math.random() * 100}%`;
            star.style.animationDelay = `${Math.random() * 0.5}s`;
            starsContainer.appendChild(star);
            setTimeout(() => star.remove(), 1000);
        }
    }
}

function createBubbles() {
    if (bubblesContainer) {
        bubblesContainer.innerHTML = '';
        for (let i = 0; i < 15; i++) {
            const bubble = document.createElement('div');
            bubble.className = 'bubble';
            bubble.style.left = `${Math.random() * 100}%`;
            bubble.style.animationDelay = `${Math.random() * 1}s`;
            bubble.style.width = `${10 + Math.random() * 20}px`;
            bubble.style.height = `${10 + Math.random() * 20}px`;
            bubblesContainer.appendChild(bubble);
            setTimeout(() => bubble.remove(), 3000);
        }
    }
}



// ---- Mini-Game ----
function initGameDOM() {
    if (!gameArea) return;
    gameArea.innerHTML = ''; // dọn sạch trước khi thêm
}

async function startMiniGame() {
    console.log('Starting Mini Game... currentWords:', currentWords);
    if (!currentWords || currentWords.length === 0) {
        console.error('[ERROR] No words available for game, currentTopic:', currentTopic);
        if (error) error.textContent = 'No words available for game!';
        return;
    }
    if (!gameArea) {
        console.error('[ERROR] gameArea is not defined in startMiniGame');
        if (error) error.textContent = 'Game area not found!';
        return;
    }

    gameActive = true;
    gamePhase = 0;
    gameIndex = 0;
    reviewIndex = 0;
    gameWords = shuffle([...currentWords]).slice(0, Math.min(5, currentWords.length));
    console.log('Starting Mini Game, Words:', gameWords);

    gameArea.innerHTML = '';
    gameArea.style.display = 'block';
    if (listenBtn) listenBtn.style.display = 'none';
    if (speakBtn) speakBtn.style.display = 'none';
    if (gameBtn) gameBtn.style.display = 'none';
    if (wordDisplay) wordDisplay.style.display = 'none';
    if (wordImage) wordImage.style.display = 'none';
    if (feedback) feedback.textContent = '';
    if (error) error.textContent = '';

    await setupNextGameTurn();
}


// 🔥 CẬP NHẬT: Hàm setupNextGameTurn() với debug
async function setupNextGameTurn() {
    debugGameFlow(); // 🔥 THÊM DEBUG
    
    if (!gameActive) {
        console.log("setupNextGameTurn called but gameActive = false → skipped");
        return;
    }
    
    window.answeredLock = false;

    // --- Biến để kiểm tra có vừa kết thúc Matching Game không ---
    const wasMatchingGame = gamePhase === 8;

    // --- Phase control ---
    if (gamePhase === 0) {
        // Lần đầu tiên khởi động → luôn bắt đầu ở Game 1
        gamePhase = 1;
    } else if (gamePhase < 8) {
        // Nếu đang ở Game 1→7 → tăng phase
        gamePhase++;
    } else if (gamePhase === 8) {
        // Vừa xong Game 8
        gameIndex++;
        if (gameIndex < gameWords.length) {
            gamePhase = 1;
            if (gameIndex === 1) {
                guidePlayedThisSession = true; // tắt guide sau round đầu
            }
        } else {
            // Hết từ → sang review
            gamePhase = 9;
            gameIndex = 0;
            reviewIndex = 0;
            console.log('Switching to Review, Words:', gameWords);
            if (feedback) feedback.textContent = 'Now let\'s review the words!';
            await setupReviewRound();
            return; // 🔥 QUAN TRỌNG: return sau khi chuyển sang review
        }
    }

    // --- PHÁT ÂM THANH NEXT ROUND SAU KHI KẾT THÚC MATCHING GAME ---
    if (wasMatchingGame) {
        try {
            await playGuideAudio("nextRoundSound");
            console.log("[setupNextGameTurn] 🎉 Next round sound played after Matching Game");
        } catch (error) {
            console.warn("[setupNextGameTurn] Could not play next round sound:", error);
        }
    }

    // --- Lấy từ hiện tại ---
    if (gameArea) gameArea.innerHTML = ''; // 🔥 Dọn sạch game area TRƯỚC
    correctWord = gameWords[gameIndex];

    if (!correctWord) {
        console.warn("No correctWord at index", gameIndex, "→ ending game");
        await endMiniGame();
        return;
    }

    const distractors = getDistractors(2, gamePhase === 8); // Game 8 dùng cho missing letter

    console.log(`[GAME SETUP] Setting up Game ${gamePhase} with word: ${correctWord.en}`);

    // --- Game setup với return sau mỗi game ---
    if (!guidePlayedThisSession) {
        // Round đầu tiên: phát hướng dẫn cho tất cả game
        if (gamePhase === 1) {
            await playGuideAudio("game1GuideSound");
            setupGame1(correctWord, distractors);
            return; // 🔥 QUAN TRỌNG: return sau mỗi game
        } else if (gamePhase === 2) {
            await playGuideAudio("game2GuideSound");
            setupGame2(correctWord, distractors);
            return;
        } else if (gamePhase === 3) {
            await playGuideAudio("game3GuideSound");
            setupMissingWordGame(correctWord, distractors);
            return;
        } else if (gamePhase === 4) {
            await playGuideAudio("game4GuideSound");
            setupGame4(correctWord);
            return;
        } else if (gamePhase === 5) {
            await playGuideAudio("game8GuideSound");
            setupGame8(correctWord, distractors);
            return;       
        } else if (gamePhase === 6) {
            await playGuideAudio("game7GuideSound");
            setupStoryMode(correctWord, distractors);
            return; // 🔥 ĐẶC BIỆT QUAN TRỌNG: return sau game 7
        
        } else if (gamePhase === 7) {
            await playGuideAudio("game6GuideSound");
            setupWordHunt(correctWord, distractors);
            return;
        } else if (gamePhase === 8) {
            await playGuideAudio("game5GuideSound");
            setupMatchingGame(correctWord, distractors);
            return;
        }

    } else {
        // Các round tiếp theo: không phát hướng dẫn
        if (gamePhase === 1) {
            setupGame1(correctWord, distractors);
            return;
        } else if (gamePhase === 2) {
            setupGame2(correctWord, distractors);
            return;
        } else if (gamePhase === 3) {
            setupMissingWordGame(correctWord, distractors);
            return;
        } else if (gamePhase === 4) {
            setupGame4(correctWord);
            return;
        } else if (gamePhase === 5) {
            setupGame8(correctWord, distractors);
            return;
        } else if (gamePhase === 6) {
            setupStoryMode(correctWord, distractors);
            return; // 🔥 ĐẶC BIỆT QUAN TRỌNG: return sau game 7
        
        } else if (gamePhase === 7) {
            setupWordHunt(correctWord, distractors);
            return;
        } else if (gamePhase === 8) {
            setupMatchingGame(correctWord, distractors);
            return;
        }
    }
    
    // 🔥 THÊM: Fallback - nếu không vào game nào ở trên
    console.error('[ERROR] No game setup executed for phase:', gamePhase);
    gamePhase++; // Chuyển phase để tránh lặp vô hạn
    setTimeout(setupNextGameTurn, 1000);
}


function shuffle(arr) {
    return [...arr].sort(() => 0.5 - Math.random());
}

function getDistractors(num, forLetters = false) {
    if (!forLetters) {
        // Cho word games - SỬA LẠI ĐOẠN NÀY
        let allWords = [];
        
        // Kiểm tra cả hai cấu trúc dữ liệu
        if (wordsData.by_topics) {
            allWords = wordsData.by_topics.flatMap(t => (t.words || []));
        } else if (wordsData.topics) {
            allWords = wordsData.topics.flatMap(t => (t.words || []));
        }
        
        // Lọc từ hợp lệ
        allWords = allWords.filter(w => {
            if (!w || typeof w !== 'object') return false;
            if (!w.en) {
                console.warn("Invalid word entry in wordsData:", w);
                return false;
            }
            return w.en !== correctWord.en;
        });
        
        return shuffle(allWords).slice(0, num);
    } else {
        // Cho letter game (giữ nguyên)
        const word = correctWord.en;
        let missingIndex;
        if (word.length === 3) {
            const positions = [0, 1, 2];
            missingIndex = positions[Math.floor(Math.random() * positions.length)];
        } else {
            missingIndex = Math.floor(Math.random() * word.length);
        }
        const correctLetter = word[missingIndex].toLowerCase();
        console.log(`Game 8: Word "${word}", Missing letter at index ${missingIndex}: "${correctLetter}"`);
        const allLetters = 'abcdefghijklmnopqrstuvwxyz'.split('');
        
        // Sửa lại phần lấy topicWords
        let topicWords = [];
        if (wordsData.by_topics) {
            topicWords = wordsData.by_topics.flatMap(t => t.words || [])
                .filter(w => w && w.en)
                .map(w => w.en.toLowerCase());
        } else if (wordsData.topics) {
            topicWords = wordsData.topics.flatMap(t => t.words || [])
                .filter(w => w && w.en)
                .map(w => w.en.toLowerCase());
        }
        
        const distractorLetters = allLetters.filter(letter => {
            if (letter === correctLetter) return false;
            const testWord = word.substring(0, missingIndex) + letter + word.substring(missingIndex + 1);
            return !topicWords.includes(testWord);
        });
        return shuffle(distractorLetters).slice(0, num).map(letter => ({ letter }));
    }
}

function setupGame1(correct, distractors) {
  if (!gameArea) return console.error('[ERROR] gameArea not found');

  let selectedWord = null;
  const options = [correct, distractors[Math.floor(Math.random() * distractors.length)]];
  options.sort(() => Math.random() - 0.5);

  // === Wrapper ===
  const wrapper = document.createElement('div');
  wrapper.className = 'game1-wrapper';
  wrapper.style.display = 'flex';
  wrapper.style.flexDirection = 'column';
  wrapper.style.alignItems = 'center';
  wrapper.style.justifyContent = 'center';
  wrapper.style.width = '100%';
  wrapper.style.maxWidth = '480px';
  wrapper.style.margin = '0 auto';
  wrapper.style.padding = 'clamp(5px, 3vw, 10px)';

  // === Grid cho 2 ảnh ===
  const grid = document.createElement('div');
  grid.className = 'game1-grid';
  grid.style.display = 'grid';
  grid.style.gridTemplateColumns = 'repeat(auto-fit, minmax(140px, 1fr))';
  grid.style.gap = 'clamp(10px, 3vw, 16px)';
  grid.style.justifyItems = 'center';
  grid.style.alignItems = 'center';
  grid.style.width = '100%';
  grid.style.maxWidth = '420px';
  grid.style.margin = '0 auto';

  function createImageBlock(opt) {
    const card = document.createElement('div');
    card.className = 'image-card';
    const img = document.createElement('img');
    img.src = opt.image || '/song-ngu-cho-be/images/icon-512.png';
    img.alt = opt.en;
    img.className = 'game1-img';
    const dropZone = document.createElement('div');
    dropZone.className = 'drop-zone';
    dropZone.textContent = 'Drop here';
    dropZone.dataset.word = opt.en;

    // --- Drag/drop & click events ---
    dropZone.addEventListener('dragover', e => e.preventDefault());
    dropZone.addEventListener('drop', e => {
      e.preventDefault();
      handleWordMatch(e.dataTransfer.getData('text/plain'), dropZone.dataset.word);
    });
    dropZone.addEventListener('click', () => {
      if (selectedWord) {
        handleWordMatch(selectedWord, dropZone.dataset.word);
        selectedWord = null;
        document.querySelectorAll('.draggable').forEach(el => el.style.border = '2px dashed #aaa');
      }
    });

    card.appendChild(img);
    card.appendChild(dropZone);
    return card;
  }

  options.forEach(opt => grid.appendChild(createImageBlock(opt)));
  wrapper.appendChild(grid);

  // === Draggable Word ===
  const wordElem = document.createElement('div');
  wordElem.textContent = correct.en;
  wordElem.draggable = true;
  wordElem.className = 'draggable';
  wordElem.dataset.word = correct.en;

  wordElem.addEventListener('dragstart', e => {
    e.dataTransfer.setData('text/plain', wordElem.dataset.word);
  });
  wordElem.addEventListener('click', () => {
    selectedWord = wordElem.dataset.word;
    document.querySelectorAll('.draggable').forEach(el => el.style.border = '2px dashed #aaa');
    wordElem.style.border = '3px solid orange';
  });

  // ✅ Bọc wordElem vào pool, bảo đảm nằm trong khung
  const pool = document.createElement('div');
  pool.className = 'matching-pool';
  pool.style.flexWrap = 'wrap';
  pool.style.justifyContent = 'center';
  pool.style.alignItems = 'center';
  pool.style.gap = 'clamp(6px, 2vw, 10px)';
  pool.style.marginTop = '10px';
  pool.style.width = '100%';
  pool.style.maxWidth = '380px';
  pool.style.boxSizing = 'border-box';
  pool.style.textAlign = 'center';
  pool.appendChild(wordElem);
  wrapper.appendChild(pool);

  // === Render ===
  gameArea.innerHTML = '';
  gameArea.appendChild(wrapper);
  gameArea.style.display = 'block';
  gameArea.style.overflowY = 'auto';
  gameArea.style.maxHeight = '80vh'; // ✅ thêm để tránh tràn mobile

  // === Xử lý kết quả ===
  async function handleWordMatch(word, target) {
    if (word === target) {
      await speak(word);
      if (feedback && !isMobileDevice()) {
        feedback.textContent = 'Well done! 🎉';
        feedback.className = 'success';
      }
      if (isUserInteracted) {
        try {
          successSound?.play();
          praiseEnSound?.play();
        } catch {}
      }
      createStars();
      createBubbles();
      setTimeout(setupNextGameTurn, 1500);
    } else {
      await speak(target);
      if (feedback && !isMobileDevice()) {
        feedback.textContent = 'Try again! ❌';
        feedback.className = 'warning';
      }
      if (isUserInteracted) {
        try {
          tryAgainEnSound?.play();
        } catch {}
      }
    }
  }
}



function setupGame2(correct, distractors) {
    

    let selectedWord = null;

    const imgContainer = document.createElement('div');
    imgContainer.style.display = 'flex';
    imgContainer.style.flexDirection = 'column';
    imgContainer.style.alignItems = 'center';
    imgContainer.style.marginBottom = '20px';

    const img = document.createElement('img');
    img.src = correct.image;
    img.style.width = '200px';
    img.style.height = '200px';
    img.style.objectFit = 'cover';
    img.style.border = '2px solid #ccc';
    img.style.borderRadius = '10px';

    imgContainer.appendChild(img);

    const dropZone = document.createElement('div');
    dropZone.id = 'dropZone';
    dropZone.textContent = 'Drop here';
    dropZone.style.width = '150px';
    dropZone.style.height = '40px';
    dropZone.style.border = '2px solid #ccc';
    dropZone.style.borderRadius = '10px';
    dropZone.style.lineHeight = '40px';
    dropZone.style.color = '#333';
    dropZone.style.fontSize = '18px';
    dropZone.style.textAlign = 'center';
    dropZone.style.background = '#f9f9f9';
    imgContainer.appendChild(dropZone);

    if (gameArea) gameArea.appendChild(imgContainer);

    const optionsContainer = document.createElement('div');
    optionsContainer.style.display = 'flex';
    optionsContainer.style.justifyContent = 'center';
    optionsContainer.style.flexWrap = 'wrap';
    optionsContainer.style.gap = '10px';
    if (gameArea) gameArea.appendChild(optionsContainer);

    const options = [correct, ...distractors].sort(() => 0.5 - Math.random());
    options.forEach(opt => {
        const wordElem = document.createElement('div');
        wordElem.textContent = opt.en;
        wordElem.draggable = true;
        wordElem.className = 'draggable';
        wordElem.dataset.word = opt.en;
        wordElem.style.padding = '12px 20px';
        wordElem.style.border = '2px dashed #aaa';
        wordElem.style.borderRadius = '10px';
        wordElem.style.fontSize = '26px';
        wordElem.style.fontWeight = 'bold';
        wordElem.style.cursor = 'grab';
        wordElem.style.background = '#2196f3';
        wordElem.style.color = '#fff';
        wordElem.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
        wordElem.style.userSelect = 'none';

        wordElem.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('text/plain', wordElem.dataset.word);
        });

        wordElem.addEventListener('click', () => {
            selectedWord = wordElem.dataset.word;
            document.querySelectorAll('.draggable').forEach(el => el.style.border = '2px dashed #aaa');
            wordElem.style.border = '3px solid orange';
        });

        optionsContainer.appendChild(wordElem);
    });

    dropZone.addEventListener('dragover', (e) => e.preventDefault());
    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        handleWordMatch(e.dataTransfer.getData('text/plain'));
    });

    dropZone.addEventListener('click', () => {
        if (selectedWord) {
            handleWordMatch(selectedWord);
            selectedWord = null;
            document.querySelectorAll('.draggable').forEach(el => el.style.border = '2px dashed #aaa');
        }
    });

    async function handleWordMatch(word) {
    const correctText = correct.en;
    if (word === correctText) {
        await speak(correctText);   // ✅ đọc từ đúng
        if (feedback && !isMobileDevice()) { // 🟢 THÊM: !isMobileDevice()
            feedback.textContent = 'Well done! 🎉';
            feedback.className = 'success';
        }


        if (isUserInteracted) {
            try {
                if (successSound) successSound.play();
                new Audio('song-ngu-cho-be/sounds/well_done.mp3').play();
            } catch (err) { 
                console.error('Error playing sound:', err); 
            }
        }

        createStars();
        createBubbles();
        setTimeout(setupNextGameTurn, 1500);

    } else {
        await speak(word);   // ✅ đọc lại từ bé chọn để so sánh
        if (feedback && !isMobileDevice()) { // 🟢 THÊM: !isMobileDevice()
            feedback.textContent = 'Well done! 🎉';
            feedback.className = 'success';
        }


        if (isUserInteracted) {
            try {
                new Audio('song-ngu-cho-be/sounds/please_try_again.mp3').play();
            } catch (err) { 
                console.error('Error playing try again sound:', err); 
            }
        }
    }
}
}

function setupMissingWordGame(correct, distractors) {
    console.log("[Game 3] Setting up Missing Word Game with:", correct.en);
    
    if (!gameArea) {
        console.error('[ERROR] gameArea is not defined in setupMissingWordGame');
        return;
    }

    let selectedWord = null;
    
    // 🟢 SỬA: Sử dụng correct thay vì correctWord
    const sentences = [
        `This is my ${correct.en}`,
        `I see your ${correct.en}`,
        `Look at the ${correct.en}`,
        `Here is the ${correct.en}`,
        `That is his ${correct.en}`,
        `I like this ${correct.en}`,
        `It's a big ${correct.en}`,
        `Can you find the ${correct.en}?`,
        `Where is the ${correct.en}?`,
        `This ${correct.en} is nice`
    ];
    
    const sentenceTemplate = sentences[Math.floor(Math.random() * sentences.length)];
    const blankSentence = sentenceTemplate.replace(correct.en, '_______');

    // Tạo options (từ đúng + từ gây nhiễu)
    const options = [correct, ...distractors].sort(() => Math.random() - 0.5);

    // Tạo giao diện game
    gameArea.innerHTML = '';

    // Hiển thị hình ảnh
    const imgContainer = document.createElement('div');
    imgContainer.style.textAlign = 'center';
    imgContainer.style.marginBottom = '20px';

    const img = document.createElement('img');
    img.src = correct.image || '/song-ngu-cho-be/images/icon-512.png';
    img.style.width = '200px';
    img.style.height = '200px';
    img.style.objectFit = 'cover';
    img.style.border = '2px solid #ccc';
    img.style.borderRadius = '12px';
    imgContainer.appendChild(img);
    gameArea.appendChild(imgContainer);

    // 🟢 SỬA: Tạo container cho câu và dropbox cùng dòng
    const sentenceContainer = document.createElement('div');
    sentenceContainer.style.cssText = `
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 10px;
        margin: 20px 0;
        font-size: 28px;
        font-weight: bold;
        color: #333;
        text-align: center;
        flex-wrap: wrap;
    `;

    // 🟢 SỬA: Tách câu thành phần trước và sau từ thiếu
    const sentenceParts = sentenceTemplate.split(correct.en);
    const beforeText = sentenceParts[0];
    const afterText = sentenceParts[1] || '';

    // Thêm phần trước dropbox
    if (beforeText) {
        const beforeSpan = document.createElement('span');
        beforeSpan.textContent = beforeText;
        beforeSpan.style.fontSize = '28px';
        sentenceContainer.appendChild(beforeSpan);
    }

    // 🟢 SỬA: Drop zone inline thay vì block
    const dropZone = document.createElement('div');
    dropZone.id = 'missingWordDropZone';
    dropZone.className = 'missing-word-dropzone';
    dropZone.textContent = 'Drop word here';
    dropZone.style.cssText = `
        display: inline-block;
        width: 200px;
        height: 50px;
        border: 3px dashed #4caf50;
        border-radius: 10px;
        line-height: 50px;
        color: #666;
        font-size: 18px;
        text-align: center;
        background: #f9f9f9;
        cursor: pointer;
        transition: all 0.3s ease;
        vertical-align: middle;
    `;
    dropZone.dataset.correct = correct.en;
    // 🟢 QUAN TRỌNG: THÊM 2 DÒNG NÀY để lưu phần câu
    dropZone.dataset.beforeText = beforeText;
    dropZone.dataset.afterText = afterText;
    sentenceContainer.appendChild(dropZone);

    // Thêm phần sau dropbox
    if (afterText) {
        const afterSpan = document.createElement('span');
        afterSpan.textContent = afterText;
        afterSpan.style.fontSize = '28px';
        sentenceContainer.appendChild(afterSpan);
    }

    gameArea.appendChild(sentenceContainer);

    // Container cho các từ lựa chọn
    const optionsContainer = document.createElement('div');
    optionsContainer.style.cssText = `
        display: flex;
        justify-content: center;
        flex-wrap: wrap;
        gap: 12px;
        margin-top: 20px;
    `;
    gameArea.appendChild(optionsContainer);

    // Tạo các từ có thể kéo thả (giữ nguyên)
    options.forEach(opt => {
        const wordElem = document.createElement('div');
        wordElem.textContent = opt.en;
        wordElem.draggable = true;
        wordElem.className = 'missing-word-option';
        wordElem.dataset.word = opt.en;
        wordElem.style.cssText = `
            padding: 12px 20px;
            border: 2px solid #2196f3;
            border-radius: 25px;
            font-size: 20px;
            font-weight: bold;
            cursor: grab;
            background: #2196f3;
            color: #fff;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
            user-select: none;
            transition: all 0.2s ease;
        `;

        wordElem.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('text/plain', wordElem.dataset.word);
            wordElem.style.opacity = '0.6';
        });

        wordElem.addEventListener('dragend', () => {
            wordElem.style.opacity = '1';
        });

        wordElem.addEventListener('click', () => {
            selectedWord = wordElem.dataset.word;
            // Bỏ highlight tất cả options
            document.querySelectorAll('.missing-word-option').forEach(el => {
                el.style.background = '#2196f3';
                el.style.transform = 'scale(1)';
            });
            // Highlight option được chọn
            wordElem.style.background = '#ff9800';
            wordElem.style.transform = 'scale(1.05)';
        });

        optionsContainer.appendChild(wordElem);
    });

    // Sự kiện drop zone (giữ nguyên)
    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.style.background = '#e8f5e8';
    });

    dropZone.addEventListener('dragleave', () => {
        dropZone.style.background = '#f9f9f9';
    });

    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.style.background = '#f9f9f9';
        const word = e.dataTransfer.getData('text/plain');
        handleWordSelection(word);
    });

    dropZone.addEventListener('click', () => {
        if (selectedWord) {
            handleWordSelection(selectedWord);
            selectedWord = null;
            // Reset highlight
            document.querySelectorAll('.missing-word-option').forEach(el => {
                el.style.background = '#2196f3';
                el.style.transform = 'scale(1)';
            });
        }
    });

    // 🟢 THÊM: Hàm xử lý khi chọn từ
    async function handleWordSelection(word) {
        console.log(`[Game 3] Word selected: "${word}", Correct: "${dropZone.dataset.correct}"`);
        
        if (word === dropZone.dataset.correct) {
            // ✅ ĐÚNG
            dropZone.textContent = word;
            dropZone.style.border = '3px solid #4caf50';
            dropZone.style.background = '#e8f5e8';
            dropZone.style.color = '#2e7d32';
            dropZone.style.fontWeight = 'bold';

            // 🟢 SỬA: Tạo câu hoàn chỉnh từ dataset
            const beforeText = dropZone.dataset.beforeText || '';
            const afterText = dropZone.dataset.afterText || '';
            const fullSentence = beforeText + word + afterText;

            console.log(`[Game 3] Speaking full sentence: "${fullSentence}"`);
            
            // Chỉ cần phát âm thanh và hiển thị feedback
            await speak(fullSentence);

            if (feedback && !isMobileDevice()) {
                feedback.textContent = 'Excellent! 🎉';
                feedback.className = 'success';
            }

            // Hiệu ứng
            createStars();
            createBubbles();
            
            playSuccessFeedback().catch(err => console.warn('Success feedback error:', err));

            // Chuyển game tiếp theo
            setTimeout(() => {
                setupNextGameTurn();
            }, 1500);  
        } else {
            // ❌ SAI
            dropZone.style.border = '3px solid #f44336';
            dropZone.style.background = '#ffebee';
            dropZone.style.color = '#c62828';
            
            if (feedback) {
                feedback.textContent = 'Try again! ❌';
                feedback.className = 'warning';
            }

            // 🟢 THÊM: Khi sai cũng đọc câu đúng để học
            const beforeText = dropZone.dataset.beforeText || '';
            const afterText = dropZone.dataset.afterText || '';
            const correctWord = dropZone.dataset.correct;
            const correctSentence = beforeText + correctWord + afterText;
            
            console.log(`[Game 3] Wrong answer, speaking correct sentence: "${correctSentence}"`);

            // Phát âm thanh thử lại và đọc câu đúng
            if (isUserInteracted) {
                try {
                    await playGuideAudio("tryAgainEnSound");
                    await speak(correctSentence); // 🟢 Đọc câu đúng
                } catch (err) {
                    console.warn('Error playing try again sound:', err);
                }
            }

            // Reset drop zone sau 1 giây
            setTimeout(() => {
                dropZone.textContent = 'Drop word here';
                dropZone.style.border = '3px dashed #4caf50';
                dropZone.style.background = '#f9f9f9';
                dropZone.style.color = '#666';
                dropZone.style.fontWeight = 'normal';
            }, 1000);
        }
    }
}

// 🟢 ĐỔI TÊN: setupGame3 → setupGame8
function setupGame8(correct, distractors) {
    // 🔥 THÊM: Kiểm tra game còn active không
    if (!gameActive) {
        console.log("[Missing Letter] Game not active, skipping setup");
        return;
    }
    
    // 🟢 SỬA: Kiểm tra phase hợp lệ (5)
    const validPhases = [5];
    if (!validPhases.includes(gamePhase)) {
        console.log("[Missing Letter] Invalid phase for game:", gamePhase);
        return;
    }
    
    console.log(`[Missing Letter] Setting up game for phase ${gamePhase} with word: ${correct.en}`);

    let selectedLetter = null;
    
    const word = correct.en;
    const missingIndex = Math.floor(Math.random() * word.length);
    const correctLetter = word[missingIndex].toLowerCase();

    // 🔥 ĐẢM BẢO: Dọn sạch game area
    if (gameArea) gameArea.innerHTML = '';

    // Tạo từ hiển thị với chữ cái thiếu - GIẢM KÍCH THƯỚC
const wordDisplay = document.createElement('div');
wordDisplay.className = 'word-display';
wordDisplay.style.fontSize = '38px'; /* 48px × 0.8 = 38.4px */
wordDisplay.style.textAlign = 'center';
wordDisplay.style.marginBottom = '16px'; /* 20px × 0.8 = 16px */
wordDisplay.style.fontWeight = 'bold';
const before = word.substring(0, missingIndex);
const after = word.substring(missingIndex + 1);
wordDisplay.innerHTML = `${before}<span id="letterDropZone" style="display: inline-block; min-width: 48px; height: 48px; border: 2.4px dashed #ccc; border-radius: 8px; line-height: 48px; background: #f0f0f0; margin: 0 4px;">_</span>${after}`; /* Giảm tất cả 0.8x */
if (gameArea) gameArea.appendChild(wordDisplay);

const dropZone = document.getElementById('letterDropZone');
dropZone.dataset.letter = correctLetter;

    // Hiển thị hình ảnh
    const img = document.createElement('img');
    img.src = correct.image || '/song-ngu-cho-be/images/icon-512.png';
    img.style.width = '200px';
    img.style.height = '200px';
    img.style.objectFit = 'cover';
    img.style.border = '2px solid #ccc';
    img.style.borderRadius = '12px';
    img.style.display = 'block';
    img.style.margin = '0 auto 20px';
    if (gameArea) gameArea.appendChild(img);

   // Container options - giảm spacing
const optionsContainer = document.createElement('div');
optionsContainer.style.display = 'flex';
optionsContainer.style.justifyContent = 'center';
optionsContainer.style.flexWrap = 'wrap';
optionsContainer.style.gap = '12px'; /* 15px × 0.8 = 12px */
optionsContainer.style.marginTop = '16px'; /* 20px × 0.8 = 16px */
if (gameArea) gameArea.appendChild(optionsContainer);
    // 🟢 SỬA: Tạo 3 chữ cái (1 đúng + 2 sai)
    let letterOptions = [];
    
    // Thêm chữ cái đúng
    letterOptions.push(correctLetter);
    
    // 🟢 SỬA: Tạo distractors từ alphabet nếu không có
    const alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('').filter(l => l !== correctLetter);
    const shuffledAlphabet = shuffle(alphabet);
    
    // Thêm 2 chữ cái sai từ alphabet
    for (let i = 0; i < 2 && i < shuffledAlphabet.length; i++) {
        letterOptions.push(shuffledAlphabet[i]);
    }
    
    // 🟢 Đảm bảo có đủ 3 chữ cái
    while (letterOptions.length < 3) {
        const randomChar = String.fromCharCode(97 + Math.floor(Math.random() * 26)); // a-z
        if (!letterOptions.includes(randomChar)) {
            letterOptions.push(randomChar);
        }
    }
    
    // Xáo trộn thứ tự
    letterOptions = shuffle(letterOptions);
    
    console.log(`[Missing Letter] Word: "${word}", Missing: "${correctLetter}", Options: ${letterOptions.join(', ')}`);

    // 🟢 TẠO CÁC NÚT CHỮ CÁI - GIẢM KÍCH THƯỚC
letterOptions.forEach(letter => {
    const letterBtn = document.createElement('div');
    letterBtn.textContent = letter.toUpperCase();
    letterBtn.draggable = true;
    letterBtn.className = 'letter-option';
    letterBtn.dataset.letter = letter;
    letterBtn.style.cssText = `
        padding: 12px 16px; /* 15px 20px → 12px 16px */
        border: 2px solid #2196f3; /* 3px → 2px */
        border-radius: 12px; /* 15px → 12px */
        font-size: 24px; /* 32px → 24px */
        font-weight: bold;
        cursor: grab;
        background: #2196f3;
        color: white;
        box-shadow: 0 3px 6px rgba(0,0,0,0.15); /* 4px 8px → 3px 6px */
        user-select: none;
        transition: all 0.2s ease;
        min-width: 55px; /* 70px → 55px */
        text-align: center;
    `;

        // Drag events
        letterBtn.addEventListener('dragstart', (e) => {
            console.log(`[Drag] Started: ${letter}`);
            e.dataTransfer.setData('text/plain', letter);
            e.dataTransfer.effectAllowed = 'copy';
            letterBtn.style.opacity = '0.6';
        });

        letterBtn.addEventListener('dragend', () => {
            letterBtn.style.opacity = '1';
        });

        // Click events (cho mobile)
        letterBtn.addEventListener('click', () => {
            console.log(`[Click] Selected: ${letter}`);
            handleLetterMatch(letter);
        });

        optionsContainer.appendChild(letterBtn);
    });

    // 🟢 DRAG & DROP EVENTS CHO DROP ZONE
    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'copy';
        if (!dropZone.classList.contains('filled')) {
            dropZone.style.background = '#e3f2fd';
            dropZone.style.borderColor = '#2196F3';
        }
    });

    dropZone.addEventListener('dragleave', () => {
        if (!dropZone.classList.contains('filled')) {
            dropZone.style.background = '#f0f0f0';
            dropZone.style.borderColor = '#ccc';
        }
    });

    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        const letter = e.dataTransfer.getData('text/plain');
        console.log(`[Drop] Received: ${letter}`);
        handleLetterMatch(letter);
    });

    // 🟢 CLICK CHO DROP ZONE (cho mobile)
    dropZone.addEventListener('click', () => {
        console.log('[DropZone] Clicked, but no letter selected yet');
    });

    // 🟢 HÀM XỬ LÝ KHI CHỌN CHỮ CÁI
    async function handleLetterMatch(letter) {
        console.log(`[Match] Checking: ${letter} vs ${correctLetter}`);
        
        if (letter.toLowerCase() === correctLetter.toLowerCase()) {
            // ✅ ĐÚNG
            console.log('[Match] Correct!');
            dropZone.textContent = letter.toUpperCase();
            dropZone.classList.add('filled');
            dropZone.style.border = '3px solid #4caf50';
            dropZone.style.background = '#e8f5e8';
            dropZone.style.color = '#2e7d32';

            // Hiển thị từ hoàn chỉnh
            wordDisplay.textContent = word;
            wordDisplay.style.color = '#4caf50';

            if (feedback && !isMobileDevice()) { // 🟢 THÊM: !isMobileDevice()
            feedback.textContent = 'Well done! 🎉';
            feedback.className = 'success';
        }


            // Phát âm thanh và hiệu ứng
            await speak(word);
            await playSuccessFeedback();
            createStars();
            createBubbles();
            
            awardPoints('word_correct', 2);
            
            // Chuyển game sau 2 giây
            setTimeout(() => {
                if (gameActive) {
                    setupNextGameTurn();
                }
            }, 2000);

        } else {
            // ❌ SAI
            console.log('[Match] Wrong!');
            if (feedback) {
                feedback.textContent = 'Try again! ❌';
                feedback.className = 'warning';
            }

            // Hiệu ứng sai
            dropZone.style.border = '3px solid #f44336';
            dropZone.style.background = '#ffebee';
            setTimeout(() => {
                if (!dropZone.classList.contains('filled')) {
                    dropZone.style.border = '3px dashed #ccc';
                    dropZone.style.background = '#f0f0f0';
                    dropZone.textContent = '_';
                }
            }, 800);

            try {
                await playGuideAudio("tryAgainEnSound");
                await speak(`Try again! The word is ${word}`);
            } catch (err) {
                console.warn("[Missing Letter] Audio error:", err);
            }
        }
    }

    // 🟢 THÊM: Auto-focus và debug info
    console.log(`[Missing Letter] Setup complete. Looking for ${correctLetter} in "${word}"`);
    console.log(`[Missing Letter] Available letters: ${letterOptions.join(', ')}`);
}

function setupGame4(correct) {
    let selectedPart = null;

    const word = correct.en;
    console.log('[Game 4] Target word:', word);
    

    const len = word.length;
    const part1 = word.slice(0, Math.ceil(len / 3));
    const part2 = word.slice(Math.ceil(len / 3), Math.ceil(2 * len / 3));
    const part3 = word.slice(Math.ceil(2 * len / 3));
    const parts = [part1, part2, part3].filter(p => p.length > 0);

    const shuffled = parts.sort(() => Math.random() - 0.5);

    // 🔎 Hiển thị từ đầy đủ (gợi ý)
    const hint = document.createElement('div');
    hint.textContent = word;
    hint.style.fontSize = '32px';
    hint.style.fontWeight = 'bold';
    hint.style.color = '#4caf50';
    hint.style.textAlign = 'center';
    hint.style.margin = '15px auto';
    hint.style.padding = '8px 16px';
    hint.style.border = '2px solid #4caf50';
    hint.style.borderRadius = '8px';
    hint.style.display = 'inline-block';
    if (gameArea) gameArea.appendChild(hint);

    // 🧩 Container cho drop zones
    const dropZoneContainer = document.createElement('div');
    dropZoneContainer.style.display = 'flex';
    dropZoneContainer.style.justifyContent = 'center';
    dropZoneContainer.style.alignItems = 'center';
    dropZoneContainer.style.gap = '8px';
    dropZoneContainer.style.margin = '15px auto';
    dropZoneContainer.style.flexWrap = 'wrap';
    if (gameArea) gameArea.appendChild(dropZoneContainer);

    const dropZones = [];
    parts.forEach((_, i) => {
        const dz = document.createElement('div');
        dz.className = 'game4-drop';
        dz.dataset.index = i;
        dropZoneContainer.appendChild(dz);
        dropZones.push(dz);

        dz.addEventListener('dragover', (e) => e.preventDefault());
        dz.addEventListener('drop', (e) => {
            e.preventDefault();
            const draggedPart = e.dataTransfer.getData('text/plain');
            dz.textContent = draggedPart;
            dz.dataset.value = draggedPart;
            checkCompletion();
        });
        dz.addEventListener('click', () => {
            if (selectedPart) {
                dz.textContent = selectedPart;
                dz.dataset.value = selectedPart;
                selectedPart = null;
                document.querySelectorAll('.part').forEach(el => el.style.border = '2px solid #ccc');
                checkCompletion();
            }
        });
    });

    // 🧱 Container cho các phần kéo thả
    const partsContainer = document.createElement('div');
    partsContainer.style.display = 'flex';
    partsContainer.style.justifyContent = 'center';
    partsContainer.style.gap = '10px';
    partsContainer.style.flexWrap = 'wrap';
    if (gameArea) gameArea.appendChild(partsContainer);

    shuffled.forEach(p => {
        const partElem = document.createElement('div');
        partElem.textContent = p;
        partElem.className = 'part';
        partElem.draggable = true;
        partElem.dataset.value = p;
        partElem.style.padding = '12px 20px';
        partElem.style.border = '2px solid #ccc';
        partElem.style.borderRadius = '12px';
        partElem.style.fontSize = '26px';
        partElem.style.fontWeight = 'bold';
        partElem.style.color = '#fff';
        partElem.style.background = '#2196f3';
        partElem.style.cursor = 'grab';
        partElem.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
        partsContainer.appendChild(partElem);

        partElem.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('text/plain', p);
        });
        partElem.addEventListener('click', () => {
            selectedPart = p;
            document.querySelectorAll('.part').forEach(el => el.style.border = '2px solid #ccc');
            partElem.style.border = '3px solid orange';
        });
    });

    // ✅ Kiểm tra hoàn thành
    async function checkCompletion() {
        const filled = dropZones.map(dz => dz.dataset.value || '').join('');
        if (filled.length === word.length) {
            if (filled === word) {
                await speak(word);
                if (feedback && !isMobileDevice()) {
                    feedback.textContent = 'Well done! 🎉';
                    feedback.className = 'success';
                    feedback.style.fontSize = '28px';
                    feedback.style.fontWeight = 'bold';
                }

                if (isUserInteracted) {
                    try {
                        if (successSound) successSound.play();
                        new Audio('song-ngu-cho-be/sounds/well_done.mp3').play();
                    } catch (err) {
                        console.error('Error playing sound:', err);
                    }
                }
                createStars();
                createBubbles();
                setTimeout(setupNextGameTurn, 1500);
            } else {
                if (feedback) {
                    feedback.textContent = 'Wrong, try again! ❌';
                    feedback.className = 'warning';
                    feedback.style.fontSize = '24px';
                }
                if (isUserInteracted) {
                    try {
                        new Audio('song-ngu-cho-be/sounds/please_try_again.mp3').play();
                    } catch (err) {
                        console.error('Error playing try again sound:', err);
                    }
                }
                // reset lại
                dropZones.forEach(dz => {
                    dz.textContent = '';
                    dz.dataset.value = '';
                });
            }
        }
    }
}

function setupMatchingGame(currentWord) {
  console.log("[Game 8] setupMatchingGame called, currentWord:", currentWord);

  if (!gameArea) return;
  gameArea.innerHTML = '';
  if (feedback) feedback.textContent = '';

  // 🔹 Lấy từ hiện tại & từ trước đó
  const wordToFind = typeof currentWord === 'string' ? currentWord : currentWord.en;
  const repeatedWord = currentWords.find(w => w.en === wordToFind);
  if (!repeatedWord) {
    console.error("No repeated word found in currentWords!", currentWord);
    return;
  }

  const previousWords = currentWords.filter(w => w.en !== repeatedWord.en);
  if (previousWords.length === 0) {
    console.error("Not enough previous words to select from!");
    return;
  }

  const randomPreviousWord = previousWords[Math.floor(Math.random() * previousWords.length)];
  const wordsForRound = [repeatedWord, randomPreviousWord];
  wordsForRound.sort(() => Math.random() - 0.5);

  // 🔹 Vùng chứa chính
  const container = document.createElement('div');
  container.className = 'matching-container';
  container.style.display = 'flex';
  container.style.flexDirection = 'column';
  container.style.alignItems = 'center';
  container.style.justifyContent = 'center';
  container.style.width = '100%';
  container.style.maxWidth = '480px';
  container.style.margin = '0 auto';
  container.style.padding = 'clamp(5px, 3vw, 10px)';

  // 🔹 Grid hiển thị 2 ảnh song song (giống Game 1)
  const imagesGrid = document.createElement('div');
  imagesGrid.className = 'matching-grid';
  imagesGrid.style.display = 'grid';
  imagesGrid.style.gridTemplateColumns = 'repeat(auto-fit, minmax(140px, 1fr))';
  imagesGrid.style.gap = 'clamp(8px, 3vw, 12px)';
  imagesGrid.style.justifyItems = 'center';
  imagesGrid.style.alignItems = 'center';
  imagesGrid.style.width = '100%';
  imagesGrid.style.maxWidth = '420px';
  imagesGrid.style.margin = '0 auto';
  imagesGrid.style.boxSizing = 'border-box';
  imagesGrid.style.textAlign = 'center';

  let matchedCount = 0;

  wordsForRound.forEach(w => {
    const card = document.createElement('div');
    card.className = 'image-card';

    const img = document.createElement('img');
    img.src = w.image || '/song-ngu-cho-be/images/icon-512.png';
    img.alt = w.en;
    card.appendChild(img);

    const dropZone = document.createElement('div');
    dropZone.className = 'image-dropzone';
    dropZone.dataset.word = w.en;
    dropZone.textContent = 'Drop here';

    // --- Sự kiện kéo thả / click ---
    dropZone.addEventListener('dragover', e => e.preventDefault());
    dropZone.addEventListener('drop', e => {
      e.preventDefault();
      const dragged = e.dataTransfer.getData('text/plain');
      const tileEl = document.querySelector(`.pool-word[data-word="${dragged}"]`);
      handleMatch(dragged, dropZone, tileEl);
    });
    dropZone.addEventListener('click', () => {
      const sel = document.querySelector('.pool-word.selected');
      if (sel) handleMatch(sel.dataset.word, dropZone, sel);
    });

    card.appendChild(dropZone);
    imagesGrid.appendChild(card);
  });

  // 🔹 Pool chứa từ (nằm giữa, luôn wrap khi hẹp)
  const pool = document.createElement('div');
  pool.className = 'matching-pool';
  pool.style.display = 'flex';
  pool.style.flexWrap = 'wrap';
  pool.style.justifyContent = 'center';
  pool.style.alignItems = 'center';
  pool.style.gap = 'clamp(6px, 2vw, 10px)';
  pool.style.marginTop = '10px';
  pool.style.width = '100%';
  pool.style.maxWidth = '380px';
  pool.style.boxSizing = 'border-box';
  pool.style.textAlign = 'center';

  shuffle([...wordsForRound]).forEach(w => {
    const tile = document.createElement('div');
    tile.className = 'pool-word';
    tile.draggable = true;
    tile.dataset.word = w.en;
    tile.textContent = w.en;

    tile.addEventListener('dragstart', (e) => {
      e.dataTransfer.setData('text/plain', w.en);
    });

    tile.addEventListener('click', () => {
      document.querySelectorAll('.pool-word').forEach(el => el.classList.remove('selected'));
      if (!tile.classList.contains('matched')) tile.classList.add('selected');
    });

    pool.appendChild(tile);
  });

  container.appendChild(imagesGrid);
  container.appendChild(pool);
  gameArea.appendChild(container);

  // --- Logic kiểm tra đúng / sai ---
  async function handleMatch(word, dropZoneEl, tileEl) {
    const target = dropZoneEl.dataset.word;
    if (word === target) {
      dropZoneEl.classList.add('matched');
      dropZoneEl.textContent = word;

      if (tileEl) {
        tileEl.classList.add('matched');
        tileEl.draggable = false;
        tileEl.classList.remove('selected');
      }

      await speak(word);

      if (feedback && !isMobileDevice()) {
        feedback.textContent = 'Great! 🎉';
        feedback.className = 'success';
      }

      playSuccessFeedback?.().catch(err => console.warn('Success feedback error:', err));

      matchedCount++;
      if (matchedCount === wordsForRound.length) {
        setTimeout(() => {
          setTimeout(setupNextGameTurn, 1200);
        }, 800);
      }

    } else {
      if (feedback) {
        feedback.textContent = 'Try again ❌';
        feedback.className = 'warning';
      }
      try {
        if (tryAgainEnSound) tryAgainEnSound.play();
      } catch (e) {
        console.error("Error playing tryAgainEnSound:", e);
      }
      await speak(target);
    }
  }
}


function setupWordHunt(correct, distractors) {
    console.log("[Game 7] setupWordHunt called with:", correct, distractors);

    if (gameArea) gameArea.innerHTML = '';

    gameArea.innerHTML = `
  <div class="songngu-container">
    <div class="wordhunt-container"></div>

    <div class="wordhunt-controls">
      <button id="wordHuntSpeakBtn" class="speak-btn">🎤 Speak</button>
    </div>

    <div id="wordHuntTranscript" class="transcript-box"></div>
  </div>
`;

    const container = gameArea.querySelector(".wordhunt-container");
    const speakBtnWH = document.getElementById("wordHuntSpeakBtn");
    const transcriptWH = document.getElementById("wordHuntTranscript");

    // 🔧 THÊM: Biến đếm số lần ấn nút Speak
    let speakPressCount = 0;
    const MAX_SPEAK_PRESSES = 3;

    // 🔧 Giảm còn 2 hình ảnh (1 đúng + 1 sai ngẫu nhiên)
    let safeDistractors = Array.isArray(distractors) ? distractors : [];
    let options = [correct, safeDistractors[Math.floor(Math.random() * safeDistractors.length)]].filter(Boolean);
    options = shuffle(options);

    // 🖼️ Tạo cards hiển thị - SỬA: XÓA inline style ghi đè CSS
    options.forEach(opt => {
        const card = document.createElement("div");
        card.className = "wordhunt-card";
        const img = document.createElement("img");
        img.src = opt.image || opt.img || "/song-ngu-cho-be/images/icon-512.png";
        img.alt = opt.en;
        const label = document.createElement("div");
        label.textContent = opt.en;
        label.className = "wordhunt-label";
        card.appendChild(img);
        card.appendChild(label);
        container.appendChild(card);
    });

    // 🔊 Nút Speak logic - SỬA: Thêm đếm số lần ấn
    if (speakBtnWH) {
        let isListening = false;
        let wrongCount = 0;

        speakBtnWH.onclick = async () => {
            console.log("[WordHunt] Speak button clicked for:", correct.en, "Wrong count:", wrongCount, "Speak press count:", speakPressCount);

            // 🔥 THÊM: Tăng biến đếm số lần ấn nút
            speakPressCount++;
            
            // 🔥 THÊM: Kiểm tra nếu đã ấn đủ 3 lần
            if (speakPressCount >= MAX_SPEAK_PRESSES) {
                console.log("[WordHunt] 3 speak button presses → moving to next word");
                if (transcriptWH) {
                    transcriptWH.textContent = "✅ Completed! Moving to next word...";
                    transcriptWH.className = "transcript-box correct";
                }
                
                // Phát âm thanh khen ngợi (tùy chọn)
                try {
                    await playGuideAudio("praiseEnSound");
                } catch(e) {}
                
                setTimeout(() => {
                    if (gameActive) {
                        setupNextGameTurn();
                    }
                }, 1500);
                return;
            }

            if (wrongCount >= 2) {
                console.log("[WordHunt] 2 wrong attempts → moving to next word");
                if (transcriptWH) {
                    transcriptWH.textContent = "⏭️ Moving to next word...";
                    transcriptWH.className = "transcript-box neutral";
                }
                wrongCount = 0;
                speakPressCount = 0; // Reset counter
                setTimeout(() => {
                    if (gameActive) {
                        setupNextGameTurn();
                    }
                }, 1000);
                return;
            }

            if (isListening) return;
            if (!recognition) initRecognitionOnce();

            isListening = true;
            speakBtnWH.disabled = true;
            speakBtnWH.style.opacity = "0.5";
            speakBtnWH.textContent = "🎤 Listening...";

            const safetyTimeout = setTimeout(() => unlockButton(), 10000);

            function unlockButton() {
                clearTimeout(safetyTimeout);
                isListening = false;
                speakBtnWH.disabled = false;
                speakBtnWH.style.opacity = "1";
                speakBtnWH.textContent = "🎤 Speak";
                try { if (recognition && recognition.state === 'recording') recognition.stop(); } catch(e) {}
            }

            [...container.children].forEach(card => card.classList.add("wordhunt-listening"));

            startRecognitionWithTarget(
                correct.en,
                async (spokenRaw) => {
                    [...container.children].forEach(card => card.classList.remove("wordhunt-listening"));
                    const correctCard = [...container.children].find(c => c.querySelector("img").alt === correct.en);
                    if (correctCard) correctCard.classList.add('wordhunt-correct');

                    const spokenNormalized = normalizeForCompare(spokenRaw);
                    const targetNormalized = normalizeForCompare(correct.en);
                    const similarity = calculateSimilarity(spokenNormalized, targetNormalized);

                    if (similarity >= 0.8) {
                        try {
                            await playGuideAudio("praiseEnSound");
                        } catch(e) {}
                        createStars();
                        awardPoints('word_correct', 2);
                        wrongCount = 0;
                        
                        if (transcriptWH) {
                            transcriptWH.textContent = `✅ Correct! "${spokenRaw}" (${speakPressCount}/3)`;
                            transcriptWH.className = "transcript-box correct";
                        }
                        
                        setTimeout(() => { 
                            unlockButton(); 
                            if (gameActive) setupNextGameTurn(); 
                        }, 1000);
                    } else {
                        // ❌ SAI: Phát âm thanh tryAgainEnSound và chuyển tiếp ngay
                        console.log(`[WordHunt] Wrong attempt, moving to next word`);
                        
                        try {
                            await playGuideAudio("tryAgainEnSound");
                        } catch(e) {
                            console.warn('Could not play tryAgainEnSound:', e);
                        }
                        
                        if (transcriptWH) {
                            transcriptWH.textContent = "💬 Good try! Let's continue...";
                            transcriptWH.className = "transcript-box neutral";
                        }
                        
                        // 🔥 CHUYỂN TIẾP NGAY SAU KHI PHÁT ÂM THANH
                        setTimeout(() => {
                            unlockButton();
                            if (gameActive) {
                                setupNextGameTurn();
                            }
                        }, 500); // Chờ 0.5 giây để phát xong âm thanh
                    }
                },
                async (error) => {
                    console.error("[WordHunt] STT Error:", error);
                    [...container.children].forEach(card => card.classList.remove("wordhunt-listening"));
                    
                    // ❌ LỖI STT: Cũng phát tryAgainEnSound và chuyển tiếp
                    try {
                        await playGuideAudio("tryAgainEnSound");
                    } catch(e) {
                        console.warn('Could not play tryAgainEnSound for error:', e);
                    }
                    
                    if (transcriptWH) {
                        transcriptWH.textContent = "💬 Let's continue...";
                        transcriptWH.className = "transcript-box neutral";
                    }
                    
                    // 🔥 CHUYỂN TIẾP NGAY
                    setTimeout(() => {
                        unlockButton();
                        if (gameActive) {
                            setupNextGameTurn();
                        }
                    }, 500);
                }
            );
        };
    }

    console.log("[Game 7] Word Hunt setup complete");
}



function setupStoryMode(correctWord, distractors) {
    // 🔥 THÊM: Kiểm tra game còn active không
    if (!gameActive) {
        console.log("[Game 6] Game not active, skipping setup");
        return;
    }
    
    console.log("[Game 6] Starting Sentence Builder with correctWord:", correctWord, "distractors:", distractors);

    if (!correctWord || !correctWord.en) {
        console.error("[Game 6] Invalid correctWord");
        return;
    }

    // 🔥 ĐẢM BẢO: Dọn sạch game area trước
    if (gameArea) gameArea.innerHTML = '';

    // 🔥 SỬA: Tạo câu có ý nghĩa với từ chính
    const sentences = [
    `This is my ${correctWord.en}`,
    `I see your ${correctWord.en}`,
    `Look at the ${correctWord.en}`,
    `Here is the ${correctWord.en}`,
    `I like this ${correctWord.en}`,
    `It's a big ${correctWord.en}`,
    `Where is the ${correctWord.en}?`,
    `This ${correctWord.en} is nice`
];
    
    const targetSentence = sentences[Math.floor(Math.random() * sentences.length)];
    const sentenceWords = targetSentence.split(' ');

    // 🔥 SỬA: Giao diện đơn giản, chữ to, không đóng khung
    gameArea.innerHTML = `
        <div class="target-sentence" style="font-size: 32px; font-weight: bold; color: #2196F3; text-align: center; margin: 10px 0; padding: 10px;">
            ${targetSentence}
        </div>
        <div class="sentence-container" id="sentenceContainer" style="text-align: center; margin: 15px 0; font-size: 28px; min-height: 60px;"></div>
        <div class="words-container" id="wordsContainer" style="text-align: center; margin: 10px 0; display: flex; justify-content: center; flex-wrap: wrap; gap: 8px;"></div>
        <div class="action-buttons" style="text-align: center; margin: 15px 0;">
            <button id="storyListenBtn" class="btn listen-btn" style="font-size: 20px; padding: 12px 20px; margin: 5px;">🔊 Listen</button>
            <button id="storySpeakBtn" class="btn speak-btn" style="font-size: 20px; padding: 12px 20px; margin: 5px;">🎤 Speak</button>
        </div>
        <div id="storyTranscriptText" class="transcript-box" style="font-size: 18px; margin: 10px auto; text-align: center;"></div>
    `;

    const sentenceContainer = document.getElementById("sentenceContainer");
    const wordsContainer = document.getElementById("wordsContainer");
    const listenBtn = document.getElementById("storyListenBtn");
    const speakBtn = document.getElementById("storySpeakBtn");
    const transcriptBox = document.getElementById("storyTranscriptText");

    console.log("[Game 6] Game setup complete - guide audio already played in setupNextGameTurn");

    // 🔥 SỬA QUAN TRỌNG: Container cho dropbox - cho phép cuộn ngang trên mobile
    sentenceContainer.style.cssText = `
    text-align: center;
    margin: 15px auto; /* 🟢 SỬA: auto thay vì 0 */
    font-size: 28px;
    min-height: 60px;
    display: flex;
    flex-wrap: nowrap;
    justify-content: center; /* 🟢 SỬA QUAN TRỌNG: center thay vì flex-start */
    align-items: center;
    overflow-x: auto;
    gap: 8px;
    padding: 10px 5px;
    -webkit-overflow-scrolling: touch;
    width: 100%; /* 🟢 THÊM: Chiếm toàn bộ chiều rộng */
    max-width: 100%; /* 🟢 THÊM: Giới hạn chiều rộng */
    box-sizing: border-box; /* 🟢 THÊM: Đảm bảo padding tính trong width */
`;

    // 🔥 SỬA: Tạo các ô trống với kích thước nhỏ gọn hơn cho mobile
    sentenceWords.forEach((word, index) => {
        const dropZone = document.createElement("span");
        dropZone.className = "sentence-drop-zone";
        dropZone.dataset.expected = word;
        dropZone.dataset.index = index;
        dropZone.style.cssText = `
            display: inline-block;
            min-width: 70px; /* 🔥 GIẢM kích thước cho mobile */
            max-width: 100px;
            height: 40px; /* 🔥 GIẢM chiều cao */
            border: 2px dashed #bbb;
            border-radius: 6px;
            background: #fafafa;
            vertical-align: middle;
            margin: 0 2px; /* 🔥 GIẢM margin */
            line-height: 40px; /* 🔥 Cập nhật theo chiều cao mới */
            text-align: center;
            color: #666;
            font-size: 14px; /* 🔥 GIẢM font size */
            cursor: pointer;
            transition: all 0.3s ease;
            flex-shrink: 0; /* 🔥 QUAN TRỌNG: Không bị co lại */
        `;
        
        // 🟢 SỬA: TẤT CẢ các từ đều hiển thị là ô trống
        dropZone.textContent = "___";
        dropZone.title = `Position for: ${word}`; // Tooltip gợi ý
        
        sentenceContainer.appendChild(dropZone);
        
        // 🔥 SỬA: KHÔNG thêm khoảng trắng dưới dạng span nữa
        // Thay vào đó dùng gap của container
    });

    // 🔥 SỬA: Tạo các từ có thể kéo - kích thước nhỏ gọn hơn cho mobile
    const shuffledWords = shuffle([...sentenceWords]);
    
    shuffledWords.forEach(word => {
        const wordElement = document.createElement("div");
        wordElement.className = "draggable-word";
        wordElement.textContent = word;
        wordElement.draggable = true;
        wordElement.dataset.word = word;
        wordElement.style.cssText = `
            display: inline-block;
            padding: 10px 15px; /* 🔥 GIẢM padding cho mobile */
            margin: 3px; /* 🔥 GIẢM margin */
            border-radius: 12px;
            background: #4CAF50;
            color: white;
            font-weight: bold;
            cursor: grab;
            user-select: none;
            min-width: 60px; /* 🔥 GIẢM min-width */
            text-align: center;
            font-size: 18px; /* 🔥 GIẢM font size */
            box-shadow: 0 2px 4px rgba(0,0,0,0.2);
            transition: all 0.2s ease;
            flex-shrink: 0; /* 🔥 QUAN TRỌNG: Không bị co lại */
        `;

        wordElement.addEventListener("dragstart", (e) => {
            e.dataTransfer.setData("text/plain", word);
            wordElement.style.opacity = "0.7";
            wordElement.style.transform = "scale(0.95)";
        });

        wordElement.addEventListener("dragend", () => {
            wordElement.style.opacity = "1";
            wordElement.style.transform = "scale(1)";
        });

        wordsContainer.appendChild(wordElement);
    });

    // 🔥 THÊM: Media query CSS động cho các kích thước màn hình khác nhau
    const style = document.createElement('style');
    style.textContent = `
        @media (max-width: 480px) {
            .sentence-container {
                gap: 4px !important;
                padding: 8px 2px !important;
            }
            .sentence-drop-zone {
                min-width: 60px !important;
                height: 35px !important;
                font-size: 12px !important;
                line-height: 35px !important;
                margin: 0 1px !important;
            }
            .draggable-word {
                padding: 8px 12px !important;
                font-size: 16px !important;
                min-width: 50px !important;
            }
        }
        
        @media (max-width: 360px) {
            .sentence-drop-zone {
                min-width: 50px !important;
                height: 30px !important;
                font-size: 11px !important;
                line-height: 30px !important;
            }
            .draggable-word {
                padding: 6px 10px !important;
                font-size: 14px !important;
                min-width: 45px !important;
            }
        }
    `;
    document.head.appendChild(style);
    // 🔥 DRAG & DROP LOGIC
    let selectedWord = null;

    sentenceContainer.querySelectorAll(".sentence-drop-zone").forEach(dropZone => {
        dropZone.addEventListener("dragover", (e) => {
            e.preventDefault();
            if (!dropZone.classList.contains("filled")) {
                dropZone.style.color = "#2196F3";
                dropZone.style.textDecoration = "underline wavy #2196F3";
            }
        });

        dropZone.addEventListener("dragleave", () => {
            if (!dropZone.classList.contains("filled")) {
                dropZone.style.color = "#666";
                dropZone.style.textDecoration = "underline";
            }
        });

        dropZone.addEventListener("drop", (e) => {
            e.preventDefault();
            const word = e.dataTransfer.getData("text/plain");
            handleWordPlacement(word, dropZone);
        });

        // 🔥 CLICK SUPPORT FOR MOBILE
        dropZone.addEventListener("click", () => {
            if (selectedWord) {
                handleWordPlacement(selectedWord, dropZone);
                selectedWord = null;
                // Reset all word selections
                wordsContainer.querySelectorAll(".draggable-word").forEach(w => {
                    w.style.background = "#4CAF50";
                    w.style.transform = "scale(1)";
                });
            }
        });
    });

    // 🔥 CLICK TO SELECT WORDS (MOBILE)
    wordsContainer.querySelectorAll(".draggable-word").forEach(wordElement => {
        wordElement.addEventListener("click", () => {
            selectedWord = wordElement.dataset.word;
            // Highlight selected word
            wordsContainer.querySelectorAll(".draggable-word").forEach(w => {
                w.style.background = "#4CAF50";
                w.style.transform = "scale(1)";
            });
            wordElement.style.background = "#FF9800";
            wordElement.style.transform = "scale(1.1)";
        });
    });

    // 🔥 HÀM XỬ LÝ ĐẶT TỪ
    function handleWordPlacement(word, dropZone) {
        const expectedWord = dropZone.dataset.expected;
        
        if (word === expectedWord) {
            // ✅ ĐÚNG
            dropZone.textContent = word;
            dropZone.classList.add("filled", "correct");
            dropZone.style.color = "#2e7d32";
            dropZone.style.fontWeight = "bold";
            dropZone.style.fontSize = "32px";
            dropZone.style.textDecoration = "none";

            // Ẩn từ đã sử dụng
            const usedWord = wordsContainer.querySelector(`[data-word="${word}"]`);
            if (usedWord) {
                usedWord.style.visibility = "hidden";
            }

            // Kiểm tra xem câu đã hoàn thành chưa
            checkSentenceCompletion();
        } else {
            // ❌ SAI
            dropZone.style.color = "#f44336";
            setTimeout(() => {
                if (!dropZone.classList.contains("filled")) {
                    dropZone.style.color = "#666";
                }
            }, 500);
        }
    }

    // 🔥 KIỂM TRA CÂU HOÀN THÀNH
    let sentenceCompleted = false;
    
    function checkSentenceCompletion() {
        const dropZones = sentenceContainer.querySelectorAll(".sentence-drop-zone");
        const allFilled = Array.from(dropZones).every(zone => zone.classList.contains("filled"));
        
        if (allFilled && !sentenceCompleted) {
            sentenceCompleted = true;
            const builtSentence = Array.from(dropZones).map(zone => zone.textContent).join(' ');
            const isCorrect = builtSentence === targetSentence;
            
            if (isCorrect) {
                if (speakBtn) {
                    speakBtn.disabled = false;
                    speakBtn.style.opacity = "1";
                }
                if (transcriptBox) {
                    transcriptBox.textContent = "✅ Perfect! Now press Speak to practice!";
                    transcriptBox.className = "transcript-box correct";
                }
                
                // 🔥 HIỆU ỨNG THÀNH CÔNG
                createStars();
                
                // 🔥 PHÁT ÂM THANH HƯỚNG DẪN
                async function playCompletionGuide() {
                    try {
                        await playGuideAudio("storyGuideViSound");
                        console.log("[Game 6] Completion guide audio played");
                    } catch (error) {
                        console.warn("[Game 6] Could not play completion guide audio:", error);
                    }
                }
                
                playCompletionGuide();
            }
        }
    }

    // 🔊 LISTEN BUTTON
    if (listenBtn) {
        listenBtn.onclick = async () => {
            await speak(targetSentence);
        };
    }

    // 🎤 SPEAK BUTTON - LUÔN CHUYỂN GAME SAU KHI STT PHẢN HỒI
    if (speakBtn) {
        speakBtn.onclick = () => {
            if (!recognition) initRecognitionOnce();

            speakBtn.disabled = true;
            speakBtn.style.opacity = "0.5";
            transcriptBox.textContent = "🎤 Listening... Say the complete sentence!";
            transcriptBox.className = "transcript-box neutral";

            let hasPlayedFeedback = false;
            let recognitionCompleted = false;

            startRecognitionWithTarget(
                targetSentence,
                (spokenRaw) => {
                    if (recognitionCompleted) return;
                    recognitionCompleted = true;
                    
                    if (hasPlayedFeedback) return;
                    hasPlayedFeedback = true;

                    console.log(`[Sentence Builder] Spoken: "${spokenRaw}", Target: "${targetSentence}"`);
                    
                    const spokenNormalized = normalizeForCompare(spokenRaw);
                    const targetNormalized = normalizeForCompare(targetSentence);
                    const similarity = calculateSimilarity(spokenNormalized, targetNormalized);
                    
                    if (similarity >= 0.8) {
                        transcriptBox.textContent = `✅ Excellent! "${spokenRaw}"`;
                        transcriptBox.className = "transcript-box correct";
                        awardPoints('word_correct', 3);
                    } else {
                        transcriptBox.textContent = `💬 Good try! Let's continue...`;
                        transcriptBox.className = "transcript-box neutral";
                    }
                    
                    setTimeout(() => {
                        if (gameActive) {
                            setupNextGameTurn();
                        }
                    }, 1500);
                },
                (error) => {
                    if (recognitionCompleted) return;
                    recognitionCompleted = true;
                    
                    transcriptBox.textContent = "💬 Let's continue to next game...";
                    transcriptBox.className = "transcript-box neutral";
                    
                    setTimeout(() => {
                        if (gameActive) {
                            setupNextGameTurn();
                        }
                    }, 1500);
                    
                    console.error("[Sentence Builder] STT Error:", error);
                }
            );
        };
    }

    // 🔥 AUTO-ENABLE SPEAK BUTTON SAU 5 GIÂY
    setTimeout(() => {
        if (speakBtn && speakBtn.disabled) {
            const dropZones = sentenceContainer.querySelectorAll('.sentence-drop-zone');
            const allFilled = Array.from(dropZones).every(zone => zone.classList.contains('filled'));
            
            if (allFilled && !sentenceCompleted) {
                sentenceCompleted = true;
                speakBtn.disabled = false;
                speakBtn.style.opacity = "1";
                if (transcriptBox) {
                    transcriptBox.textContent = "✅ Sentence complete! Press Speak to continue.";
                    transcriptBox.className = "transcript-box correct";
                }
                
                async function playAutoCompletionGuide() {
                    try {
                        await playGuideAudio("storyGuideViSound");
                        console.log("[Game 6] Auto-completion guide audio played");
                    } catch (error) {
                        console.warn("[Game 6] Could not play auto-completion guide audio:", error);
                    }
                }
                
                playAutoCompletionGuide();
            }
        }
    }, 5000);
}


function setupReviewRound() {
    if (!gameActive) {
        console.log("setupReviewRound called but gameActive = false → skipped");
        return;
    }

    if (reviewIndex >= gameWords.length) {
        endMiniGame();
        return;
    }

    if (gameArea) gameArea.innerHTML = '';
    const word = gameWords[reviewIndex];
    const wordText = word.en;

    const wordDisplay = document.createElement('div');
    wordDisplay.className = 'review-word';
    wordDisplay.textContent = wordText;
    if (gameArea) gameArea.appendChild(wordDisplay);

    const img = document.createElement('img');
    img.src = word.image;
    img.style.width = '250px';
    img.style.height = '250px';
    img.style.objectFit = 'cover';
    img.style.border = '2px solid #ccc';
    img.style.borderRadius = '12px';

    if (gameArea) gameArea.appendChild(img);

    if (feedback) feedback.textContent = 'Review the word!';
    if (feedback) feedback.className = '';

    console.log(`Review: Showing word "${wordText}" with image ${word.image}`);
    speak(wordText);

    reviewIndex++;
    setTimeout(setupReviewRound, 2000);
}

async function endMiniGame() {
    // 🔥 THÊM: Thông báo chuyển tiếp nếu sắp sang Quiz
    const nextActivity = activityFlow[currentActivityIndex + 1];
    if (nextActivity === 'quiz') {
        if (feedback) feedback.textContent = '🎉 Great job with games! Now let\'s test your knowledge!';
        try {
            await speak("Excellent! You're ready for the quiz! Let's see how much you remember!");
        } catch (err) {
            console.warn('TTS error in transition:', err);
        }
    } else {
        await speak('Game complete! Great job!');
    }
    
    gameActive = false;
    if (gameArea) {
        gameArea.innerHTML = '';
        gameArea.style.display = 'none';
    }
    console.log('[DEBUG] endMiniGame: Cleared gameArea, display:', gameArea ? gameArea.style.display : 'undefined');

    if (topicSelect) topicSelect.style.display = 'none';
    if (gameBtn) gameBtn.style.display = 'none';
    if (listenBtn) listenBtn.style.display = 'none';
    if (speakBtn) speakBtn.style.display = 'none';
    if (wordDisplay) wordDisplay.style.display = 'none';
    if (wordImage) wordImage.style.display = 'none';
    if (feedback) feedback.textContent = '';
    if (transcriptBox) transcriptBox.textContent = '';
    if (error) error.textContent = '';

    // Chuyển về màn hình home hoặc tiếp tục flow nếu cần
    console.log('[DEBUG] endMiniGame: currentActivityIndex:', currentActivityIndex, 'activityFlow:', activityFlow);
    currentActivityIndex++;
    
    // 🔥 THÊM: Delay để người dùng thấy thông báo chuyển tiếp
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    if (currentActivityIndex < activityFlow.length) {
        console.log('[DEBUG] Proceeding to next activity:', activityFlow[currentActivityIndex]);
        startNextActivity();
    } else {
        console.log('[IMPROVEMENT] All activities completed, returning to home screen');

        // 👉 Phát hero.mp3 trước khi reset
        const heroSound = document.getElementById("heroSound");
        if (heroSound) {
            heroSound.currentTime = 0;
            try {
                await new Promise((resolve) => {
                    heroSound.play().then(() => {
                        heroSound.onended = resolve; // chỉ resolve khi phát xong
                    }).catch(err => {
                        console.warn("Hero sound play failed:", err);
                        resolve(); // nếu lỗi vẫn tiếp tục về home
                    });
                });
            } catch (err) {
                console.error("Error playing hero sound:", err);
            }
        }
        
        // 🔥 AWARD POINTS - di chuyển lên trước reset
        awardPoints('game_complete', 1);
        resetToIdleState(); // về màn hình home sau khi phát xong
    }
}


// ---- Reset to idle state ----
function resetToIdleState() {
    console.log('[DEBUG] Resetting to idle state');
    currentTopic = '';
    currentWords = [];
    currentIndex = 0;
    wrongCount = 0;
    readAttempts = 0;
    quizScore = 0;
    currentActivity = '';
    isQuizMode = false;
    gameActive = false;
    activityFlow = [];
    currentActivityIndex = 0;

    showScreen('home');
    if (error) error.textContent = 'Ấn Vào Một Biểu Tượng Để Bắt Đầu';
    if (feedback) feedback.textContent = '';
    if (wordDisplay) wordDisplay.textContent = '';
    if (wordImage) {
        wordImage.src = '/song-ngu-cho-be/images/icon-512.png';
        wordImage.style.display = 'block';
    }
    if (topicSelect) topicSelect.style.display = 'none';
    if (listenBtn) listenBtn.style.display = 'none';
    if (speakBtn) speakBtn.style.display = 'none';
    if (gameBtn) gameBtn.style.display = 'none';
    if (gameArea) gameArea.style.display = 'block';
    if (transcriptBox) transcriptBox.textContent = '';

    speak('Select an activity to continue!');
}

// ---- Initialize application ----
function initializeApp() {
    console.log('[DEBUG] Initializing app');
    // 🟢 THÊM: Tự động kiểm tra đăng nhập khi khởi động app
    const savedUser = JSON.parse(localStorage.getItem('userData') || '{}');
    const savedEmail = savedUser?.email;
    const savedPassword = savedUser?.password;
    
    if (savedEmail && savedPassword) {
        console.log('[AUTH] Found saved credentials, checking unlock status...');
        checkUserUnlockStatus(savedEmail, savedPassword).then(isActive => {
            if (isActive) {
                console.log('[AUTH] ✅ Account is active, unlocking all content');
                localStorage.setItem('accountActivated', 'true');
            } else {
                console.log('[AUTH] ⏳ Account not activated yet');
                localStorage.setItem('accountActivated', 'false');
            }
        });
    }
    restoreAppState();
    updateDOMReferences('home');
    attachButtonListeners();
    showScreen('modeSelect'); // 🔥 HIỂN THỊ MÀN HÌNH CHỌN MODE ĐẦU TIÊN
    if (loader) loader.style.display = 'block';
    
    // 🎯 Khởi tạo gamification
    initGamification();
}

// ---- Hàm chọn cách học ----
function selectLearningMode(mode) {
    console.log('[DEBUG] Learning mode selected:', mode);
    currentLearningMode = mode;
    
    if (mode === 'letters') {
        // Học theo chữ cái
        showScreen('letters');
        populateLetters();
        speak("Bé hãy chọn một chữ cái để bắt đầu học!");
        
    } else if (mode === 'topics') {
        // Học theo chủ đề (giữ nguyên flow cũ)
        showScreen('home');
        if (error) error.textContent = 'Ấn Vào Một Biểu Tượng Để Bắt Đầu';
        speak("Chọn hoạt động để bắt đầu học theo chủ đề!");
        
    } else if (mode === 'review') {
        // Ôn tập (có thể implement sau)
        showScreen('review');
        speak("Chọn từ vựng để ôn tập!");
    }
}



// 🟢 THÊM: Hàm phát âm thanh cho mode mặc định
function playDefaultModeSound() {
    // Chỉ phát nếu user đã tương tác và chưa phát trong 5 giây gần đây
    if (!isUserInteracted) return;
    
    if (!window.lastModeSoundPlayed || Date.now() - window.lastModeSoundPlayed > 5000) {
        window.lastModeSoundPlayed = Date.now();
        playGuideAudio("introTopicSound").catch(err => {
            console.warn('Could not play default mode sound:', err);
        });
    }
}


// ---- Populate letters for alphabet learning ----
function populateLetters() {
    const lettersContainer = document.getElementById('lettersContainer');
    if (!lettersContainer || !wordsData.learning_modes.by_letters) return;
    
    lettersContainer.innerHTML = '';
    
    wordsData.learning_modes.by_letters.forEach(letterData => {
        const letterCard = document.createElement('div');
        letterCard.className = 'letter-card';
        letterCard.innerHTML = `
            <div class="letter-char">${letterData.letter}</div>
            <div class="letter-info">
                <div class="letter-name">${letterData.name_en}</div>
                <div class="letter-grade">${letterData.grade}</div>
                <div class="letter-words">${letterData.words.length} từ</div>
            </div>
        `;
        
        letterCard.addEventListener('click', () => {
            selectLetter(letterData);
        });
        
        lettersContainer.appendChild(letterCard);
    });
}

function selectLetter(letterData) {
    console.log('[DEBUG] Letter selected:', letterData.letter);
    currentLetter = letterData.letter;
    currentGrade = letterData.grade;
    currentWords = letterData.words;
    
    // Chuyển sang màn hình chọn activity (giữ nguyên flow)
    showScreen('home');
    if (error) error.textContent = `Đã chọn chữ ${letterData.letter}. Chọn hoạt động để bắt đầu!`;
    
    const introText = `Bé đã chọn chữ ${letterData.letter}. Có ${letterData.words.length} từ để học. Chọn hoạt động để bắt đầu!`;
    speak(introText);
}



// Thêm vào DOMContentLoaded hoặc initialization
document.addEventListener('DOMContentLoaded', function() {
    const modeButtons = document.querySelectorAll('.mode-btn');
    
    modeButtons.forEach(button => {
    button.addEventListener('click', async function() {
        const screen = this.closest('.screen');
        const mode = this.dataset.mode;
        
        console.log('[DEBUG] Mode button clicked:', mode, 'in screen:', screen.id);
        
        // 🟢 SỬA: Chỉ phát âm thanh khi thực sự cần
        // Không phát khi đang trong quá trình chuyển đổi
        if (!window.modeChanging) {
            window.modeChanging = true;
            try {
                await playGuideAudio("introTopicSound");
            } catch (err) {
                console.warn('Could not play introTopicSound:', err);
            } finally {
                window.modeChanging = false;
            }
        }
        
        // Update active button
        screen.querySelectorAll('.mode-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        this.classList.add('active');
        
        // Show/hide appropriate select element
        const topicSelect = screen.querySelector('#topicSelect');
        const alphabetSelect = screen.querySelector('#alphabetSelect');
        
        if (mode === 'topic') {
            if (topicSelect) {
                topicSelect.style.display = 'block';
                topicSelect.value = '';
            }
            if (alphabetSelect) {
                alphabetSelect.style.display = 'none';
                alphabetSelect.value = '';
            }
            console.log('[DEBUG] Showing topic select, hiding alphabet select');
        } else if (mode === 'alphabet') {
            if (topicSelect) {
                topicSelect.style.display = 'none';
                topicSelect.value = '';
            }
            if (alphabetSelect) {
                alphabetSelect.style.display = 'block';
            }
            console.log('[DEBUG] Showing alphabet select, hiding topic select');
        }
        
        // 🟢 THÊM: Reset UI khi chuyển mode
        if (wordDisplay) wordDisplay.textContent = '';
        if (wordImage) wordImage.src = '/song-ngu-cho-be/images/icon-512.png';
        if (feedback) feedback.textContent = '';
        if (error) error.textContent = '';
        if (gameArea) gameArea.style.display = 'none';
    });
  });
});


// ---- Handle window load to ensure all resources are ready ----
window.addEventListener('load', () => {
    console.log('[DEBUG] Window load event fired');
    // Đảm bảo các sự kiện được gắn lại nếu cần
    const activityIcons = document.querySelectorAll('.activity-icon');
    if (activityIcons.length === 0) {
        console.error('[ERROR] No .activity-icon elements found in DOM');
        if (error) error.textContent = 'Error: Activity icons not found. Please refresh the page.';
        return;
    }
    activityIcons.forEach(icon => {
        // Xóa sự kiện cũ để tránh trùng lặp
        icon.removeEventListener('click', handleActivityIconClick);
        icon.addEventListener('click', handleActivityIconClick);
    });
});

// ---- Hàm xử lý click cho activity icons ----
let isProcessingClick = false;

async function handleActivityIconClick() {
    if (isProcessingClick) {
        console.log('[DEBUG] Click already processing, ignoring duplicate click');
        return;
    }
    
    isProcessingClick = true;
    
    try {
        isUserInteracted = true;
        console.log('[DEBUG] User interacted, isUserInteracted set to true');

        try {
            await playGuideAudio("cachHocSound");
        } catch (err) {
            console.warn('Could not play cachHocSound:', err);
        }

        currentActivity = this.dataset.activity;
        console.log('[DEBUG] Icon clicked, currentActivity:', currentActivity);

        // 🟢 THÊM: Debug trước khi chuyển màn hình
        console.log('[DEBUG] Before screen change - currentLetter:', currentLetter, 'currentTopic:', currentTopic);

        // 🟢 LUÔN chuyển màn hình trước
        showScreen(currentActivity);

        const currentScreen = document.querySelector('.screen.active');
        let learningMode = 'topic';
        let isValidSelection = false;
        
        if (currentScreen) {
            const activeModeBtn = currentScreen.querySelector('.mode-btn.active');
            if (activeModeBtn) {
                learningMode = activeModeBtn.dataset.mode;
                console.log('[DEBUG] Active learning mode:', learningMode);
            } else {
                console.warn('[DEBUG] No active mode button found');
            }

            // 🟢 KIỂM TRA SELECTION
            if (learningMode === 'alphabet') {
                const alphabetSelect = currentScreen.querySelector('#alphabetSelect');
                isValidSelection = alphabetSelect && alphabetSelect.value;
                console.log('[DEBUG] Alphabet selection valid:', isValidSelection, 'Value:', alphabetSelect ? alphabetSelect.value : 'none');
            } else {
                const topicSelect = currentScreen.querySelector('#topicSelect');
                isValidSelection = topicSelect && topicSelect.value;
                console.log('[DEBUG] Topic selection valid:', isValidSelection, 'Value:', topicSelect ? topicSelect.value : 'none');
            }
        }

        // 🟢 QUAN TRỌNG: LUÔN SET ACTIVITY FLOW
currentActivityIndex = 0;

if (currentActivity === 'learn') {
    activityFlow = ['learn', 'games', 'quiz'];
} else if (currentActivity === 'games') {
    activityFlow = ['games', 'quiz'];
} else if (currentActivity === 'quiz') {
    activityFlow = ['quiz'];
}

console.log('[DEBUG] Activity flow set:', activityFlow, 'Selection valid:', isValidSelection);

if (isValidSelection) {
    // 🟢 CÓ SELECTION: Bắt đầu activity ngay
    console.log('[DEBUG] Starting activity immediately');
    if (error) error.textContent = '';
    startNextActivity();
}
// 🟢 CHƯA CÓ SELECTION: Không làm gì cả, không hiển thị thông báo

} finally {
    isProcessingClick = false;
}
}


async function checkQuizAnswer(spoken, correctWord, onCorrect, onWrong) {
    if (!spoken) {
        if (feedback) {
            feedback.textContent = 'Please try again ❌';
            feedback.className = 'warning';
        }
        try {
            await playGuideAudio("tryAgainEnSound");
        } catch (err) {
            console.warn('[checkQuizAnswer] Failed to play try again audio:', err);
        }
        if (typeof onWrong === 'function') onWrong();
        return;
    }

    // ✅ SỬA: Dùng normalizeForCompare thay vì normalize
    if (normalizeForCompare(spoken) === normalizeForCompare(correctWord)) {
        if (feedback) {
            feedback.textContent = `Yes! It's ${correctWord}! 🎉`;
            feedback.className = 'success';
        }
        try {
            await playGuideAudio("successSound");
        } catch (err) {
            console.warn('[checkQuizAnswer] Failed to play success audio:', err);
        }
        createStars();
        createBubbles();
        if (typeof onCorrect === 'function') onCorrect();
    } else {
        if (feedback) {
            feedback.textContent = 'Please try again ❌';
            feedback.className = 'warning';
        }
        try {
            await playGuideAudio("tryAgainEnSound");
        } catch (err) {
            console.warn('[checkQuizAnswer] Failed to play try again audio:', err);
        }
        if (typeof onWrong === 'function') onWrong();
    }
}

async function speakWordPromise(text) {
    return new Promise((resolve, reject) => {
        if (!text) return reject('No text to speak');
        try {
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = 'en-US';
            utterance.rate = 0.9;

            utterance.onstart = () => {
                console.log('[speakWordPromise] 🔊 Speaking:', text);
                isSpeaking = true;
            };
            utterance.onend = () => {
                console.log('[speakWordPromise] ✅ Finished:', text);
                isSpeaking = false;
                resolve();
            };
            utterance.onerror = (e) => {
                console.error('[speakWordPromise] ❌ Error:', e);
                isSpeaking = false;
                if (e.error === 'canceled' || e.error === 'aborted') {
                    console.log('[TTS] Ignored cancel/abort error');
                    resolve(); // Ignore và resolve để tiếp tục
                } else {
                    reject(e);
                }
            };

            speechSynthesis.cancel();
            speechSynthesis.speak(utterance);
        } catch (err) {
            reject(err);
        }
    });
}


// ✅ Hiệu ứng khen thưởng đồng bộ (praiseEnSound + successSound + bubbles)
async function playSuccessFeedback() {
    try {
        console.log('[Feedback] 🎉 Playing success feedback (praise + success + bubbles)');
        createStars();
        createBubbles();

        // Phát cả hai cùng lúc
        const successEl = document.getElementById("successSound");
        const praiseEl = document.getElementById("praiseEnSound");
        
        if (successEl && successEl.src) {
            const successClone = successEl.cloneNode(true);
            successClone.volume = 0.8;
            successClone.play().catch(e => console.log('Success sound play failed:', e));
        }
        
        if (praiseEl && praiseEl.src) {
            const praiseClone = praiseEl.cloneNode(true);
            praiseClone.volume = 0.8;
            praiseClone.play().catch(e => console.log('Praise sound play failed:', e));
        }

    } catch (err) {
        console.warn('[Feedback] Error playing success feedback:', err);
    }
}

// ----------------- checkSpokenAnswer -----------------
async function checkSpokenAnswer(spokenRaw, targetWord, onCorrect, onWrong) {
    const spoken = normalizeForCompare(spokenRaw);
    const target = normalizeForCompare(targetWord);
    const similarity = calculateSimilarity(spoken, target);

    console.log(`[STT Check] spoken="${spoken}", target="${target}", similarity=${similarity}`);

    if (window.answeredLock) {
        console.log("[STT] Feedback already given, ignoring further responses.");
        return;
    }

    window.answeredLock = true;

    const transcriptBox = document.getElementById("transcriptBox") || initTranscriptBox(currentActivity);
    if (transcriptBox) {
        transcriptBox.textContent = spokenRaw ? `🗣️ "${spokenRaw}"` : "Listening...";
        transcriptBox.style.backgroundColor = '#fff8c4';
        transcriptBox.style.color = '#333';
    }

    try {
        if (similarity >= 0.8) {
            // ✅ TRẢ LỜI ĐÚNG
            readAttempts = 0;
            wrongCount = 0;
            if (isQuizMode) quizScore++;

            // 🎉 Phát hiệu ứng chung (praise + success) - KHÔNG CHỜ
            playSuccessFeedback().catch(console.warn);

            // 🟢 THÊM: Award points
            const difficulty = currentActivity === 'quiz' ? 2 : 1;
            awardPoints('word_correct', difficulty);

            // 🟢 THÊM: Cập nhật feedback trước khi chuyển
            if (feedback && !isMobileDevice()) {
                feedback.textContent = 'Correct! ✅';
                feedback.className = 'success';
            }

            // 🟢 THÊM: Delay nhỏ để hiển thị transcript và feedback
            setTimeout(() => {
                if (typeof onCorrect === 'function') {
                    onCorrect(spokenRaw);
                }
                // 🟢 ĐẢM BẢO MỞ KHÓA SAU KHI XỬ LÝ XONG
                setTimeout(() => {
                    window.answeredLock = false;
                }, 500);
            }, 1500);

        } else {
            // ❌ TRẢ LỜI SAI - CHUYỂN TIẾP NGAY
            console.log(`[checkSpokenAnswer] Wrong answer (similarity: ${similarity})`);
            
            // 🟢 HIỂN THỊ THÔNG BÁO NHẸ NHÀNG
            if (transcriptBox) {
                transcriptBox.textContent = "💬 Good try! Let's continue...";
                transcriptBox.className = "transcript-box neutral";
            }
            
            if (feedback && !isMobileDevice()) {
                feedback.textContent = 'Good try! Moving to next word...';
                feedback.className = '';
            }

            // 🟢 Phát âm thanh tryAgainEnSound
            try {
                await playGuideAudio("tryAgainEnSound");
            } catch (err) {
                console.warn('[checkSpokenAnswer] Failed to play tryAgainEnSound:', err);
            }

            // 🟢 CHUYỂN TIẾP SAU KHI PHÁT XONG ÂM THANH
            setTimeout(() => {
                // 🔥 QUAN TRỌNG: Reset các biến đếm
                wrongCount = 0;
                
                // 🔥 THAY VÌ TỰ CHUYỂN TỪ, CHÚNG TA GỌI onWrong VỚI MỘT CÁCH XỬ LÝ ĐẶC BIỆT
                if (typeof onWrong === 'function') {
                    // 🟢 THÊM: Đánh dấu đặc biệt để onWrong biết đây là "chuyển tiếp ngay"
                    window.shouldSkipImmediately = true;
                    onWrong(spokenRaw);
                    window.shouldSkipImmediately = false;
                } else {
                    // 🟢 FALLBACK: Tự chuyển nếu không có onWrong
                    currentIndex++;
                    if (currentIndex >= currentWords.length) {
                        if (currentActivity === 'learn' && !isQuizMode) {
                            currentActivityIndex++;
                            setTimeout(startNextActivity, 500);
                        } else if (currentActivity === 'quiz' && isQuizMode) {
                            finishQuiz();
                        }
                    } else {
                        showWord();
                    }
                }
                
                // 🟢 ĐẢM BẢO MỞ KHÓA
                window.answeredLock = false;
            }, 800); // Delay 0.8 giây để phát xong âm thanh
        }
    } catch (err) {
        console.error('[checkSpokenAnswer] Error:', err);
        // 🟢 ĐẢM BẢO MỞ KHÓA KHI CÓ LỖI
        window.answeredLock = false;
    }
}


function initGamification() {
    // Load từ localStorage
    const savedData = localStorage.getItem('kidEnglishGameData');
    if (savedData) {
        try {
            const data = JSON.parse(savedData);
            userCoins = data.coins || 0;
            userPoints = data.points || 0;
            dailyStreak = data.streak || 0;
            lastLoginDate = data.lastLogin || '';
            unlockedStickers = data.stickers || [];
            unlockedAvatars = data.avatars || ['default'];
            currentAvatar = data.currentAvatar || 'default';
            
            // Check daily streak
            checkDailyStreak();
        } catch (e) {
            console.error('Error loading game data:', e);
        }
    }
    
    updateCoinDisplay();
}

function updateCoinDisplay() {
    const coinCount = document.getElementById('coinCount');
    const pointCount = document.getElementById('pointCount');
    const streakCount = document.getElementById('streakCount');
    const gameHeader = document.getElementById('gameHeader');
    
    if (coinCount) coinCount.textContent = userCoins;
    if (pointCount) pointCount.textContent = userPoints;
    if (streakCount) streakCount.textContent = dailyStreak;
    
    // Hiển thị header khi có dữ liệu
    if (gameHeader && (userCoins > 0 || userPoints > 0 || dailyStreak > 0)) {
        gameHeader.style.display = 'block';
    }
}

function awardPoints(type, difficulty = 1) {
    let coinsEarned = 0;
    let pointsEarned = 0;
    
    switch(type) {
        case 'word_correct':
            coinsEarned = 2 * difficulty;
            pointsEarned = 10 * difficulty;
            break;
        case 'quiz_perfect':
            coinsEarned = 20 * difficulty;
            pointsEarned = 50 * difficulty;
            break;
        case 'game_complete':
            coinsEarned = 15 * difficulty;
            pointsEarned = 30 * difficulty;
            break;
        case 'daily_login':
            coinsEarned = 5 + (dailyStreak * 2);
            pointsEarned = 20;
            break;
    }
    
    userCoins += coinsEarned;
    userPoints += pointsEarned;
    
    // Hiển thị hiệu ứng
    showRewardAnimation(coinsEarned, pointsEarned);
    updateCoinDisplay();
    saveGameData();
    
    // 🟢 SỬA: Tạm thời bỏ checkForUnlocks để tránh lỗi
    // checkForUnlocks();
    
    return { coins: coinsEarned, points: pointsEarned };
}


function checkForUnlocks() {
    // Kiểm tra và mở khóa thành tựu
    const achievements = [
        { points: 100, type: 'first_100', message: "First 100 Points! 🎉" },
        { points: 500, type: 'expert_learner', message: "Expert Learner! 🌟" },
        { coins: 50, type: 'rich_kid', message: "Rich Kid! 💰" },
        { streak: 7, type: 'weekly_streak', message: "7-Day Streak! 🔥" }
    ];

    achievements.forEach(achievement => {
        if ((achievement.points && userPoints >= achievement.points) ||
            (achievement.coins && userCoins >= achievement.coins) ||
            (achievement.streak && dailyStreak >= achievement.streak)) {
            
            if (!window.unlockedAchievements) window.unlockedAchievements = [];
            if (!window.unlockedAchievements.includes(achievement.type)) {
                window.unlockedAchievements.push(achievement.type);
                showRewardAnimation(0, 0, achievement.message);
            }
        }
    });
}


function showRewardAnimation(coins, points, message = '') {
    const animationHTML = `
        <div class="reward-animation">
            <h3>🎉 Great Job! 🎉</h3>
            ${message ? `<div style="color: #ff6b00; margin-bottom: 15px; font-size: 20px;">${message}</div>` : ''}
            <div class="reward-stats">
                ${coins > 0 ? `
                <div class="reward-item coin-reward">
                    <span>🪙</span>
                    <span>+${coins} Coins</span>
                </div>
                ` : ''}
                ${points > 0 ? `
                <div class="reward-item point-reward">
                    <span>⭐</span>
                    <span>+${points} Points</span>
                </div>
                ` : ''}
            </div>
        </div>
    `;
    
    const animationDiv = document.createElement('div');
    animationDiv.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(255,255,255,0.98);
        padding: 30px;
        border-radius: 20px;
        box-shadow: 0 10px 40px rgba(0,0,0,0.3);
        z-index: 10000;
        text-align: center;
        font-size: 24px;
        font-weight: bold;
        animation: popIn 0.6s ease-out;
        border: 4px solid #ffd700;
        max-width: 300px;
        width: 90%;
    `;
    animationDiv.innerHTML = animationHTML;
    
    document.body.appendChild(animationDiv);
    
    // Tự động ẩn sau 2 giây
    setTimeout(() => {
        animationDiv.style.animation = 'popOut 0.5s ease-in forwards';
        setTimeout(() => {
            if (animationDiv.parentNode) {
                animationDiv.parentNode.removeChild(animationDiv);
            }
        }, 500);
    }, 2000);
}

// Thêm CSS animation
const style = document.createElement('style');
style.textContent = `
    @keyframes popIn {
        0% { transform: translate(-50%, -50%) scale(0.5); opacity: 0; }
        100% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
    }
    @keyframes popOut {
        0% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
        100% { transform: translate(-50%, -50%) scale(0.5); opacity: 0; }
    }
`;
document.head.appendChild(style);



function checkDailyStreak() {
    const today = new Date().toDateString();
    
    if (!lastLoginDate) {
        // First time login
        dailyStreak = 1;
    } else if (lastLoginDate !== today) {
        const lastLogin = new Date(lastLoginDate);
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        
        if (lastLogin.toDateString() === yesterday.toDateString()) {
            // Consecutive login
            dailyStreak++;
        } else {
            // Broken streak
            dailyStreak = 1;
        }
        
        // Award daily login bonus
        awardPoints('daily_login');
    }
    
    lastLoginDate = today;
    saveGameData();
}

function showShop() {
    const shopHTML = `
        <div class="shop-screen">
            <h2>🎁 Reward Shop</h2>
            <div class="shop-balance">
                <div>Your Coins: 🪙 ${userCoins}</div>
            </div>
            <div class="shop-items">
                <div class="shop-item" onclick="buyItem('sticker1', 10)">
                    <div>🐶 Sticker Pack 1</div>
                    <div>🪙 10 coins</div>
                </div>
                <div class="shop-item" onclick="buyItem('avatar1', 30)">
                    <div>🦁 Cool Avatar</div>
                    <div>🪙 30 coins</div>
                </div>
                <div class="shop-item" onclick="buyItem('sticker2', 20)">
                    <div>🚀 Space Stickers</div>
                    <div>🪙 20 coins</div>
                </div>
            </div>
            <button onclick="closeShop()">Close</button>
        </div>
    `;
    
    // Hiển thị shop (cần thêm CSS)
    const shopDiv = document.createElement('div');
    shopDiv.innerHTML = shopHTML;
    shopDiv.className = 'shop-overlay';
    document.body.appendChild(shopDiv);
}

function buyItem(itemId, cost) {
    if (userCoins >= cost) {
        userCoins -= cost;
        
        if (itemId.startsWith('sticker')) {
            unlockedStickers.push(itemId);
            showRewardAnimation(0, 0, `Unlocked ${itemId}!`);
        } else if (itemId.startsWith('avatar')) {
            unlockedAvatars.push(itemId);
            currentAvatar = itemId;
            showRewardAnimation(0, 0, `New Avatar Unlocked!`);
        }
        
        updateCoinDisplay();
        saveGameData();
    } else {
        alert("Not enough coins! Keep learning to earn more! 🎯");
    }
}

function saveGameData() {
    const gameData = {
        coins: userCoins,
        points: userPoints,
        streak: dailyStreak,
        lastLogin: lastLoginDate,
        stickers: unlockedStickers,
        avatars: unlockedAvatars,
        currentAvatar: currentAvatar
    };
    
    localStorage.setItem('kidEnglishGameData', JSON.stringify(gameData));
}

function resetGameData() {
    if (confirm('Reset all progress and coins?')) {
        localStorage.removeItem('kidEnglishGameData');
        userCoins = 0;
        userPoints = 0;
        dailyStreak = 0;
        unlockedStickers = [];
        unlockedAvatars = ['default'];
        updateCoinDisplay();
    }
}

function initializeApp() {
    console.log('[DEBUG] Initializing app');
    updateDOMReferences('home');
    attachButtonListeners();
    attachTopicSelectHandler();
    
    // 🎯 THÊM: Khởi tạo gamification
    initGamification();
    
    showScreen('home');
    if (error) error.textContent = 'Ấn Vào Một Biểu Tượng Để Bắt Đầu';
    if (loader) loader.style.display = 'block';
}

function shareProgress() {
    const shareText = `I've earned ${userPoints} points and ${userCoins} coins in English Learning! 🎉⭐`;
    
    if (navigator.share) {
        navigator.share({
            title: 'My English Learning Progress',
            text: shareText,
            url: window.location.href
        });
    } else {
        // Fallback: copy to clipboard
        navigator.clipboard.writeText(shareText);
        alert('Progress copied to clipboard! 📋 Share it with your parents!');
    }
}


// 🟢 THÊM: Hàm kiểm tra và xác định learning mode hiện tại
 function getCurrentLearningMode() {
    const currentScreen = document.querySelector('.screen.active');
    
    // 🟢 SỬA: ƯU TIÊN kiểm tra dữ liệu thực tế trước UI
    if (currentLetter) {
        console.log('[DEBUG] getCurrentLearningMode: alphabet mode detected from currentLetter:', currentLetter);
        return 'alphabet';
    } else if (currentTopic) {
        console.log('[DEBUG] getCurrentLearningMode: topic mode detected from currentTopic:', currentTopic);
        return 'topic';
    }
    
    // Fallback: kiểm tra UI
    if (currentScreen) {
        const activeModeBtn = currentScreen.querySelector('.mode-btn.active');
        if (activeModeBtn) {
            console.log('[DEBUG] getCurrentLearningMode: Active UI mode:', activeModeBtn.dataset.mode);
            return activeModeBtn.dataset.mode;
        }
    }
    
    console.log('[DEBUG] getCurrentLearningMode: Defaulting to topic');
    return 'topic';
}

// 🟢 THÊM: Hàm debug biến toàn cục
function debugGlobalVariables() {
    console.log('[GLOBAL DEBUG]', {
        currentLetter: currentLetter,
        currentTopic: currentTopic,
        currentWords: currentWords ? currentWords.length : 0,
        currentActivity: currentActivity,
        currentActivityIndex: currentActivityIndex,
        activityFlow: activityFlow,
        isQuizMode: isQuizMode
    });
}
