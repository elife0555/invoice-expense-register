# 發票費用登錄

手機掃描台灣電子發票左右 QR Code，自動整理為 `pay.xls` 的會計欄位。網頁不使用 GPT，也不需要 GPT 登入。

## 建立 Google 試算表資料庫

1. 新增一份 Google 試算表。
2. 開啟「擴充功能 → Apps Script」。
3. 將 `google-apps-script/Code.gs` 全部貼入並儲存。
4. 選擇「部署 → 新增部署作業 → 網頁應用程式」。
5. 執行身分選「我」，存取權選「所有人」。
6. 完成授權後，複製以 `/exec` 結尾的網址。

## 設定掃描網頁

開啟網站，在「Google 試算表資料庫設定」貼上 Apps Script 網址並儲存。每台手機只需設定一次。

## 發布到 GitHub Pages

1. 建立 GitHub repository，將本專案上傳。
2. Repository 的 Settings → Pages。
3. Source 選 `GitHub Actions`。
4. 推送檔案後會自動發布 `dist` 資料夾，再使用 GitHub 提供的網址。

## 欄位規則

- 會計科目固定 `621310`
- 費用歸屬部門固定 `03900`
- 摘要格式：`登錄者＋加油費用/停車費用－民國年月`
- 未連接試算表時，資料保存在該手機瀏覽器，仍可匯出 `pay.xls`
