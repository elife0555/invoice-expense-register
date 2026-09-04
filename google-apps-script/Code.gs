const SHEET_NAME = '發票資料';
const HEADERS = ['賣方統一編號','憑證格式','憑證號碼','憑證日期','憑證總金額','會計科目','未稅金額','費用歸屬部門','摘要','登錄者','費用類別','登錄月份','建立時間'];

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const data = JSON.parse(e.postData.contents);
    validate_(data);
    const sheet = getSheet_();
    const invoices = sheet.getLastRow() > 1
      ? sheet.getRange(2, 3, sheet.getLastRow() - 1, 1).getDisplayValues().flat()
      : [];
    if (invoices.includes(String(data.invoice))) {
      return output_({ok: false, duplicate: true, message: '憑證號碼已存在'});
    }
    sheet.appendRow([
      text_(data.seller), text_(data.format), text_(data.invoice), text_(data.date),
      Number(data.total), text_(data.account), Number(data.net), text_(data.department),
      text_(data.summary), text_(data.registrant), text_(data.expenseType),
      text_(data.entryMonth), data.createdAt ? new Date(data.createdAt) : new Date()
    ]);
    return output_({ok: true});
  } catch (error) {
    return output_({ok: false, message: error.message});
  } finally {
    lock.releaseLock();
  }
}

function doGet() {
  return output_({ok: true, service: '發票費用登錄'});
}

function getSheet_() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = spreadsheet.getSheetByName(SHEET_NAME);
  if (!sheet) sheet = spreadsheet.insertSheet(SHEET_NAME);
  if (sheet.getLastRow() === 0) {
    sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]);
    sheet.setFrozenRows(1);
    sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold').setBackground('#0b3d63').setFontColor('#ffffff');
    sheet.getRange('A:D').setNumberFormat('@');
    sheet.getRange('F:F').setNumberFormat('@');
    sheet.getRange('H:H').setNumberFormat('@');
  }
  return sheet;
}

function validate_(data) {
  if (!/^[A-Z]{2}\d{8}$/.test(String(data.invoice || ''))) throw new Error('憑證號碼格式錯誤');
  if (!/^\d{7}$/.test(String(data.date || ''))) throw new Error('憑證日期格式錯誤');
  if (!/^\d{8}$/.test(String(data.seller || ''))) throw new Error('賣方統編格式錯誤');
  if (!Number.isFinite(Number(data.total)) || !Number.isFinite(Number(data.net))) throw new Error('金額格式錯誤');
}

function text_(value) {
  return "'" + String(value == null ? '' : value);
}

function output_(data) {
  return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(ContentService.MimeType.JSON);
}
