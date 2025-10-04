# 🧪 COOKIE CONSENT TESTING GUIDE

## Quick Testing Instructions

### 🚀 How to Test the Cookie Consent Banner

---

## 1️⃣ FIRST TIME USER TEST

**Steps:**
1. Open your browser in **Incognito/Private mode**
2. Navigate to: `http://localhost:3000/index.html`
3. Wait 1 second

**Expected Result:**
- ✅ Cookie banner should slide up from bottom
- ✅ Banner shows: "🍪 We Value Your Privacy"
- ✅ Two buttons: "Decline" and "Accept All"
- ✅ Cookie icon should bounce gently

---

## 2️⃣ ACCEPT COOKIES TEST

**Steps:**
1. Click "Accept All" button

**Expected Result:**
- ✅ Banner slides down and disappears
- ✅ Toast notification appears (top-right): "Cookie preferences saved! Thank you."
- ✅ Toast has green left border with checkmark icon
- ✅ Toast auto-dismisses after 3 seconds
- ✅ Console log: "✅ Cookies accepted - Analytics enabled"

**Verification:**
1. Press `F12` (open DevTools)
2. Go to **Application** tab → **Cookies**
3. Check for: `deluxe_cookie_consent = accepted`
4. Go to **Application** tab → **Local Storage**
5. Check for: `cookieConsent = accepted`

---

## 3️⃣ DECLINE COOKIES TEST

**Steps:**
1. Clear cookies and localStorage (or use new Incognito window)
2. Reload page, wait for banner
3. Click "Decline" button

**Expected Result:**
- ✅ Banner slides down and disappears
- ✅ Toast notification appears: "You have declined cookies. Some features may be limited."
- ✅ Toast has blue left border with info icon
- ✅ Console log: "❌ Cookies declined - Limited functionality"

**Verification:**
1. Check DevTools → **Cookies**: `deluxe_cookie_consent = declined`
2. Check DevTools → **Local Storage**: `cookieConsent = declined`

---

## 4️⃣ PERSISTENCE TEST

**Steps:**
1. Accept cookies (banner disappears)
2. Navigate to different pages:
   - `/pages/about.html`
   - `/pages/contact.html`
   - `/pages/tours.html`
3. Reload each page

**Expected Result:**
- ✅ Banner should NOT appear again
- ✅ Cookie preference is maintained across pages
- ✅ No banner on page reload

---

## 5️⃣ MOBILE RESPONSIVE TEST

**Steps:**
1. Press `F12` → Click Device Toolbar icon (phone icon)
2. Select device: iPhone 12 Pro or Samsung Galaxy S20
3. Reload page, wait for banner

**Expected Result:**
- ✅ Banner layout is vertical (stacked)
- ✅ Content is centered
- ✅ Buttons are full-width
- ✅ Text is readable
- ✅ Icon is centered above text
- ✅ Easy to tap buttons (large enough)

---

## 6️⃣ PRIVACY POLICY LINK TEST

**Steps:**
1. Clear cookies, reload page
2. Wait for banner to appear
3. Click "Learn more" link

**Expected Result:**
- ⚠️ Should navigate to `/pages/privacy.html`
- ⚠️ **Note:** Privacy page not created yet (optional enhancement)
- ✅ Link is visible and clickable

---

## 7️⃣ CONSOLE API TEST

**Steps:**
1. Press `F12` → Go to **Console** tab
2. Type: `CookieConsent.getStatus()`
3. Press Enter

**Expected Result:**
- ✅ Returns: `"accepted"` or `"declined"` or `null`

**Try other commands:**
```javascript
// Re-show the banner
CookieConsent.showBanner()

// Accept cookies programmatically
CookieConsent.accept()

// Decline cookies programmatically
CookieConsent.decline()

// Check status
CookieConsent.getStatus()
```

---

## 8️⃣ ANIMATION TEST

**Steps:**
1. Clear cookies
2. Reload page
3. Watch the banner carefully

**Expected Result:**
- ✅ Banner slides up smoothly (not instant)
- ✅ Cookie icon bounces up and down
- ✅ Buttons have hover effects (lift up slightly)
- ✅ Toast slides in from right
- ✅ All animations are smooth (no jank)

---

## 9️⃣ CROSS-PAGE TEST

**Test all pages have cookie consent:**

### Pages to Test:
- `http://localhost:3000/index.html` ✅
- `http://localhost:3000/pages/about.html` ✅
- `http://localhost:3000/pages/contact.html` ✅
- `http://localhost:3000/pages/tours.html` ✅
- `http://localhost:3000/pages/terms.html` ✅

**For each page:**
1. Clear cookies
2. Navigate to page
3. Wait 1 second

**Expected Result:**
- ✅ Cookie banner appears on ALL pages
- ✅ Banner design is consistent
- ✅ Accept/Decline works on all pages

---

## 🔟 COOKIE EXPIRY TEST

### Accept Expiry (365 days):
**Manual Verification:**
1. Accept cookies
2. Check DevTools → **Cookies**
3. Look at `deluxe_cookie_consent` cookie
4. Expiry should be: **~365 days from now**

### Decline Expiry (30 days):
**Manual Verification:**
1. Decline cookies
2. Check DevTools → **Cookies**
3. Look at `deluxe_cookie_consent` cookie
4. Expiry should be: **~30 days from now**

---

## 🐛 TROUBLESHOOTING

### Banner doesn't appear:
**Check:**
1. Open DevTools → Console
2. Look for errors
3. Verify `cookie-consent.js` is loaded
4. Check if cookie already exists (clear it)
5. Verify `#cookie-consent` div exists in HTML

**Fix:**
```javascript
// In Console:
localStorage.clear();
document.cookie = "deluxe_cookie_consent=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
location.reload();
```

### Banner appears every time:
**Check:**
1. Cookies might be blocked by browser
2. LocalStorage might be disabled
3. Browser in strict privacy mode

**Fix:**
- Enable cookies in browser settings
- Disable strict privacy mode
- Use regular (not Incognito) mode

### Toast doesn't show:
**Check:**
1. Look at top-right corner
2. Check if it's hidden behind something
3. Verify `z-index: 10000` in CSS

### Buttons don't work:
**Check:**
1. Console for JavaScript errors
2. Event listeners might not be attached
3. Verify `cookie-consent.js` is loaded

---

## ✅ TESTING CHECKLIST

### Functionality:
- [ ] Banner appears after 1 second
- [ ] "Accept All" button works
- [ ] "Decline" button works
- [ ] Toast notifications appear
- [ ] Cookie is set correctly
- [ ] LocalStorage is set correctly
- [ ] Banner doesn't show again after consent
- [ ] Privacy link is clickable
- [ ] Console API works

### Visual:
- [ ] Banner design matches site theme
- [ ] Cookie icon bounces
- [ ] Slide-up animation is smooth
- [ ] Buttons have hover effects
- [ ] Toast slides in correctly
- [ ] Text is readable
- [ ] Colors match brand (gold accents)

### Mobile:
- [ ] Layout is stacked vertically
- [ ] Content is centered
- [ ] Buttons are full-width
- [ ] Text size is appropriate
- [ ] Easy to tap buttons
- [ ] Toast adapts to screen width

### Cross-Browser:
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile Safari (iOS)
- [ ] Chrome Mobile (Android)

---

## 📱 MOBILE DEVICE TESTING

### Real Device Testing:

**iOS Safari:**
1. Open Safari on iPhone
2. Navigate to site
3. Test accept/decline
4. Check persistence

**Chrome Mobile (Android):**
1. Open Chrome on Android
2. Navigate to site
3. Test accept/decline
4. Check persistence

**Expected Mobile Behavior:**
- ✅ Banner covers bottom portion (not full screen)
- ✅ Easy to tap buttons (44px min height)
- ✅ No horizontal scroll
- ✅ Text is legible
- ✅ Animation is smooth

---

## 🎯 SUCCESS CRITERIA

**All tests pass if:**
1. ✅ Banner appears only once per user
2. ✅ Accept/Decline both work correctly
3. ✅ Cookies persist across pages
4. ✅ Mobile layout is usable
5. ✅ No JavaScript errors in console
6. ✅ Toast notifications appear
7. ✅ Privacy link works
8. ✅ Animations are smooth
9. ✅ Design matches site theme
10. ✅ Works on all major browsers

---

## 📊 FINAL VERIFICATION

### Quick Test Sequence:
```
1. Clear all data → Banner appears ✅
2. Click Accept → Toast shows, banner hides ✅
3. Reload page → Banner doesn't appear ✅
4. Check mobile → Layout is stacked ✅
5. Test other pages → Banner doesn't appear ✅
6. Console API → Returns "accepted" ✅
7. Clear data → Banner appears again ✅
8. Click Decline → Toast shows, banner hides ✅
```

**If all steps pass: 🎉 Cookie consent is working perfectly!**

---

## 🚀 LIVE TESTING COMMAND

**Start your server:**
```powershell
cd "c:\Users\Afronic\Desktop\Deluxe tour and travel website\frontend"
python -m http.server 3000
```

**Then open:**
- http://localhost:3000/index.html

**First test:**
1. Press `Ctrl + Shift + N` (Incognito)
2. Navigate to the site
3. Wait 1 second
4. Banner should appear!

---

*Happy Testing! 🧪🍪*
