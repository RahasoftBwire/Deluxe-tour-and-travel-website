# QUICK TEST GUIDE - NEW FEATURES
**Date:** October 4, 2025

---

## 🚀 SERVER IS RUNNING!

**URL:** http://127.0.0.1:3000

---

## ✅ TESTING CHECKLIST

### 1️⃣ TEST DESTINATIONS PAGE (2 minutes)

**Steps:**
1. Go to homepage: http://127.0.0.1:3000
2. Scroll to footer
3. Click "Destinations" in Quick Links section
4. **Expected Result:**
   - ✅ Page loads with 12 destination cards
   - ✅ Hero section with title "Explore Amazing Destinations"
   - ✅ Filter buttons at top (All, Africa, Asia, Europe, Middle East, Islands)

5. **Test Filters:**
   - Click "Africa" → Should show: Masai Mara, Zanzibar, Cairo, Marrakech
   - Click "Asia" → Should show: Bali, Phuket
   - Click "Islands" → Should show: Maldives, Seychelles, Mauritius
   - Click "All" → Shows all 12 destinations

6. **Test Cards:**
   - Hover over any card → Should lift up
   - Click any card → Should go to tours page

**Status:** ✅ PASS / ❌ FAIL

---

### 2️⃣ TEST CANCELLATION POLICY PAGE (2 minutes)

**Steps:**
1. Go to homepage
2. Scroll to footer
3. Click "Cancellation Policy" in Support section
4. **Expected Result:**
   - ✅ Orange gradient hero section
   - ✅ Policy Overview section
   - ✅ Refund table with 6 rows
   - ✅ Info boxes (orange border)
   - ✅ Warning boxes (yellow border)
   - ✅ Contact CTA at bottom

5. **Test Content:**
   - Scroll through all sections
   - Check refund percentages correct
   - Read booking modifications
   - See special circumstances

6. **Test Buttons:**
   - Click "Contact Us" → Should go to contact page
   - Click phone number → Should open dialer

**Status:** ✅ PASS / ❌ FAIL

---

### 3️⃣ TEST AI CHATBOT (5 minutes) ⭐ MAIN FEATURE

**Steps:**

#### A. Opening Chatbot
1. Look at bottom-right corner of any page
2. **Expected:** Orange floating button with chat icon
3. **Expected:** Red notification badge with "1"
4. Click the button
5. **Expected:** 
   - ✅ Chat window slides up
   - ✅ Welcome message from bot
   - ✅ Badge disappears

#### B. Test Thinking Animation 🧠
1. Type: "hello"
2. Click Send or press Enter
3. **CRITICAL - Expected Result:**
   - ✅ Your message appears on right (orange bubble)
   - ✅ **THINKING ANIMATION APPEARS:**
     - Robot avatar on left
     - Brain icon rotating left-right
     - Three dots bouncing in sequence
     - Text: "Analyzing your question..."
   - ✅ Animation lasts ~2 seconds
   - ✅ Bot response appears (white bubble on left)
   - ✅ Response includes greeting

#### C. Test Different Questions
**Type each question and watch the thinking animation:**

1. **"What tours do you offer?"**
   - ✅ Shows thinking animation
   - ✅ Response lists 3 featured tours (Masai Mara, Maldives, Dubai)

2. **"How do I book a tour?"**
   - ✅ Shows thinking animation
   - ✅ Response shows 5-step booking process

3. **"What is your cancellation policy?"**
   - ✅ Shows thinking animation
   - ✅ Response shows refund schedule

4. **"How much do tours cost?"**
   - ✅ Shows thinking animation
   - ✅ Response shows price ranges ($950-$1,900)

5. **"Contact information"**
   - ✅ Shows thinking animation
   - ✅ Response shows phone, email, address

6. **"Tell me about Maldives"**
   - ✅ Shows thinking animation
   - ✅ Response about specific destination

#### D. Test Quick Actions
1. Click "Tours" button at bottom
   - ✅ Auto-fills "What tours do you offer?"
   - ✅ Shows thinking animation
   - ✅ Bot responds

2. Click "Booking" button
   - ✅ Auto-fills booking question
   - ✅ Shows thinking animation
   - ✅ Bot responds

3. Click "Cancellation" button
   - ✅ Shows thinking animation
   - ✅ Bot responds with policy

4. Click "Contact" button
   - ✅ Shows thinking animation
   - ✅ Bot responds with contact info

#### E. Test Chat Features
1. **Scroll Messages:**
   - Send multiple messages
   - Scroll up and down
   - ✅ Scrollbar works smoothly

2. **Close Chat:**
   - Click X button in header
   - ✅ Chat window closes
   - ✅ Badge reappears

3. **Reopen Chat:**
   - Click floating button again
   - ✅ Previous messages still visible
   - ✅ Can continue conversation

#### F. Test on Different Pages
1. **Homepage:** ✅ Chatbot visible
2. **Tours Page:** ✅ Chatbot visible
3. **Contact Page:** ✅ Chatbot visible
4. **Destinations Page:** ✅ Chatbot visible
5. **Cancellation Policy Page:** ✅ Chatbot visible

**Status:** ✅ PASS / ❌ FAIL

---

### 4️⃣ TEST FOOTER LINKS (1 minute)

**Quick Links Section:**
- [ ] Browse Tours → Works
- [ ] **Destinations** → Works (NEW)
- [ ] About Us → Works
- [ ] Contact → Works
- [ ] Login/Register → Works

**Support Section:**
- [ ] Terms & Conditions → Works
- [ ] **Cancellation Policy** → Works (NEW)
- [ ] Help & Support → Works
- [ ] Tour Packages → Works
- [ ] Call Us link → Opens dialer

**Status:** ✅ PASS / ❌ FAIL

---

### 5️⃣ TEST MOBILE RESPONSIVE (2 minutes)

**Steps:**
1. Open browser DevTools (F12)
2. Click device toolbar (Ctrl+Shift+M)
3. Select "iPhone 12 Pro" or similar

**Test:**
- [ ] Destinations page looks good
- [ ] Cancellation policy readable
- [ ] Chatbot:
  - [ ] Button visible bottom-right
  - [ ] Chat window full-width
  - [ ] Messages readable
  - [ ] Input works
  - [ ] Thinking animation displays properly
  - [ ] Quick actions wrap nicely

**Status:** ✅ PASS / ❌ FAIL

---

## 🎯 CRITICAL SUCCESS FACTORS

### Must Work Perfectly:
1. ✅ **Thinking Animation** - Brain rotates, dots bounce, 2-second delay
2. ✅ **Chatbot Responses** - Accurate and helpful
3. ✅ **Destinations Filter** - All categories work
4. ✅ **Footer Links** - Both new pages accessible
5. ✅ **Mobile Responsive** - Everything works on phone

---

## 🐛 COMMON ISSUES & FIXES

### Chatbot Not Appearing
**Problem:** Floating button not visible  
**Fix:** Check browser console (F12) for errors

### Thinking Animation Not Showing
**Problem:** Response appears immediately  
**Fix:** Check chatbot.js loaded, network tab shows file

### Images Not Loading
**Problem:** Destination images broken  
**Fix:** Check internet connection (uses Pexels CDN)

### Footer Links 404
**Problem:** Clicking links gives "Not Found"  
**Fix:** Ensure destinations.html and cancellation-policy.html exist in pages/ folder

---

## 📸 SCREENSHOT OPPORTUNITIES

Take screenshots of:
1. ✅ Destinations page with all 12 cards
2. ✅ Destination filter in action
3. ✅ Cancellation policy refund table
4. ✅ Chatbot floating button
5. ✅ **Chatbot thinking animation** (IMPORTANT!)
6. ✅ Chatbot conversation with responses
7. ✅ Quick action buttons
8. ✅ Mobile view of chatbot

---

## ⏱️ TOTAL TEST TIME: ~12 minutes

**Estimated time per feature:**
- Destinations: 2 min
- Cancellation Policy: 2 min
- Chatbot: 5 min (most important!)
- Footer Links: 1 min
- Mobile: 2 min

---

## 📝 FEEDBACK FORM

After testing, note:

**What Works Well:**
- [ ] Destinations page design
- [ ] Cancellation policy clarity
- [ ] Chatbot thinking animation
- [ ] Chatbot responses accuracy
- [ ] Mobile responsiveness

**What Needs Improvement:**
- [ ] (Write notes here)

**Additional Features Wanted:**
- [ ] (Write suggestions here)

---

## ✅ SIGN-OFF

**Tested By:** _______________  
**Date:** _______________  
**Overall Status:** ✅ APPROVED / ⚠️ NEEDS FIXES / ❌ FAILED  

**Notes:**
_____________________________________________________
_____________________________________________________
_____________________________________________________

---

**Developer:** Khalid Abdikarim (BSCCS/2023/67547)  
**Company:** TriVenta Tech Ltd  
**Implementation Date:** October 4, 2025
