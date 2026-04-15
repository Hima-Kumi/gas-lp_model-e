// js/pwa-install.js

let deferredPrompt;
const installBanner = document.getElementById('android-install-banner');
const btnInstall = document.getElementById('btn-install');
const btnClose = document.getElementById('btn-close');

// ローカルストレージのキー名と抑制時間（ミリ秒）
const STORAGE_KEY = 'pwa_install_prompt_last_closed';
const DISMISS_DURATION = 24 * 60 * 60 * 1000; // 24時間

window.addEventListener('beforeinstallprompt', (e) => {
    // ブラウザ標準のバナーを抑止
    e.preventDefault();
    deferredPrompt = e;

    // 現在時刻と最後に閉じた時刻を取得
    const lastClosed = localStorage.getItem(STORAGE_KEY);
    const now = Date.now();

    // 1. 最後に閉じた記録がない、または
    // 2. 最後に閉じてから24時間以上経過している場合のみ表示
    if (!lastClosed || (now - parseInt(lastClosed)) > DISMISS_DURATION) {
        installBanner.style.display = 'block';
    }
});

// インストール実行ボタンの処理
btnInstall.addEventListener('click', async () => {
    if (!deferredPrompt) return;

    // インストールダイアログを表示
    deferredPrompt.prompt();

    const { outcome } = await deferredPrompt.userChoice;
    console.log(`ユーザーの選択: ${outcome}`);

    // どちらの結果でもイベントをクリアし、バナーを隠す
    deferredPrompt = null;
    installBanner.style.display = 'none';
});

// 「閉じる」ボタンの処理
btnClose.addEventListener('click', () => {
    installBanner.style.display = 'none';

    // 現在のタイムスタンプを保存（これにより24時間のカウントがスタート）
    localStorage.setItem(STORAGE_KEY, Date.now().toString());
    
    console.log('バナーを閉じました。24時間は再表示されません。');
});

// インストール完了時の処理
window.addEventListener('appinstalled', () => {
    console.log('PWAがインストールされました。');
    installBanner.style.display = 'none';
});