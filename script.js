// 1. قاعدة بيانات أسعار الخردة والمخلفات (بالجنيه المصري)
const materialsData = [
  {
    id: "copper",
    name: "نحاس أحمر وأصفر",
    price: 380,
    unit: "كيلو",
    icon: "fa-bolt",
    desc: "أسلاك كهرباء مقشرة، مواسير تكييف، وقطع نحاسية صافية."
  },
  {
    id: "aluminum",
    name: "ألومنيوم خردة",
    price: 95,
    unit: "كيلو",
    icon: "fa-layer-group",
    desc: "أواني ألومنيوم، شبابيك ألوميتال، وعلب كانز مضغوطة."
  },
  {
    id: "iron",
    name: "حديد وزهر",
    price: 22,
    unit: "كيلو",
    icon: "fa-gavel",
    desc: "حديد تسليح، أبواب قديمة، هياكل معدنية، وقطع غيار."
  },
  {
    id: "plastic",
    name: "بلاستيك (PET / HDPE)",
    price: 18,
    unit: "كيلو",
    icon: "fa-bottle-water",
    desc: "زجاجات مياه، جراكن، براميل، وصناديق بلاستيك."
  },
  {
    id: "cardboard",
    name: "كرتون وورق دشت",
    price: 9,
    unit: "كيلو",
    icon: "fa-box-open",
    desc: "كراتين تعبئة، كتب ومجلات، وورق مكاتب ومطابع."
  },
  {
    id: "ewaste",
    name: "مخلفات إلكترونية وأجهزة",
    price: 45,
    unit: "كيلو",
    icon: "fa-microchip",
    desc: "بورد كمبيوتر، شاشات، غسالات وثلاجات تالفة، وبطاريات."
  }
];

let cart = [];

// تهيئة الصفحة عند التحميل
document.addEventListener("DOMContentLoaded", () => {
  renderMaterials();
  renderQuickPrices();
  populateCalculatorSelect();
  calculatePrice();
  renderCart();
});

// عرض بطاقات المواد
function renderMaterials() {
  const grid = document.getElementById("materialsGrid");
  grid.innerHTML = materialsData.map(item => `
    <div class="material-card">
      <div>
        <div class="mat-icon"><i class="fa-solid ${item.icon}"></i></div>
        <h3>${item.name}</h3>
        <p>${item.desc}</p>
      </div>
      <div>
        <div class="price-tag">${item.price} جنيه <small>/ ${item.unit}</small></div>
        <button class="add-btn" onclick="addToCart('${item.id}', 5)">
          <i class="fa-solid fa-plus"></i> أضف 5 كيلو للطلب
        </button>
      </div>
    </div>
  `).join("");
}

// عرض ملخص الأسعار في الواجهة
function renderQuickPrices() {
  const list = document.getElementById("quickPricesList");
  list.innerHTML = materialsData.slice(0, 5).map(item => `
    <div class="quick-price-row">
      <span>${item.name}</span>
      <span style="color:#059669">${item.price} ج.م / كجم</span>
    </div>
  `).join("");
}

// تعبئة قائمة الحاسبة
function populateCalculatorSelect() {
  const select = document.getElementById("calcMaterial");
  select.innerHTML = materialsData.map(item => `
    <option value="${item.id}">${item.name} (${item.price} جنيه/كيلو)</option>
  `).join("");
}

// حساب السعر في الحاسبة
function calculatePrice() {
  const matId = document.getElementById("calcMaterial").value;
  const weight = parseFloat(document.getElementById("calcWeight").value) || 0;
  const material = materialsData.find(m => m.id === matId);
  const total = material ? material.price * weight : 0;
  document.getElementById("calcTotal").innerText = `${total.toLocaleString()} جنيه`;
}

// إضافة من الحاسبة للسلة
function addFromCalculator() {
  const matId = document.getElementById("calcMaterial").value;
  const weight = parseFloat(document.getElementById("calcWeight").value) || 1;
  addToCart(matId, weight);
  toggleCart(true);
}

// إدارة سلة طلب البيع
function addToCart(matId, weight) {
  const material = materialsData.find(m => m.id === matId);
  if (!material) return;

  const existing = cart.find(c => c.id === matId);
  if (existing) {
    existing.weight += weight;
  } else {
    cart.push({ ...material, weight });
  }
  renderCart();
}

function removeFromCart(matId) {
  cart = cart.filter(c => c.id !== matId);
  renderCart();
}

function renderCart() {
  const container = document.getElementById("cartItems");
  const countEl = document.getElementById("cartCount");
  const totalEl = document.getElementById("cartTotal");

  countEl.innerText = cart.length;

  if (cart.length === 0) {
    container.innerHTML = `<p style="text-align:center;color:#64748b;margin-top:30px;">لا توجد أصناف مضافة بعد.<br>اختر من قائمة الأسعار أو الحاسبة.</p>`;
    totalEl.innerText = "0 جنيه";
    return;
  }

  let grandTotal = 0;
  container.innerHTML = cart.map(item => {
    const subTotal = item.price * item.weight;
    grandTotal += subTotal;
    return `
      <div class="cart-item">
        <div>
          <strong>${item.name}</strong><br>
          <small>${item.weight} كيلو × ${item.price} ج.م = <b>${subTotal} ج.م</b></small>
        </div>
        <button onclick="removeFromCart('${item.id}')" style="background:none;border:none;color:#ef4444;cursor:pointer;">
          <i class="fa-solid fa-trash"></i>
        </button>
      </div>
    `;
  }).join("");

  totalEl.innerText = `${grandTotal.toLocaleString()} جنيه`;
}

function toggleCart(forceOpen = null) {
  const drawer = document.getElementById("cartDrawer");
  if (forceOpen === true) drawer.classList.add("open");
  else drawer.classList.toggle("open");
}

function submitOrder(e) {
  e.preventDefault();
  if (cart.length === 0) {
    alert("من فضلك أضف صنف واحد على الأقل من الخردة أولاً!");
    return;
  }
  const name = document.getElementById("custName").value;
  const phone = document.getElementById("custPhone").value;
  alert(`تم استلام طلبك بنجاح يا أستاذ ${name}! 🎉\nسيتواصل معك مندوبنا على رقم (${phone}) خلال ساعتين لتأكيد موعد الاستلام.`);
  cart = [];
  renderCart();
  document.getElementById("orderForm").reset();
  toggleCart();
}

// ==========================================
// 2. نظام الشات بوت الذكي بقاعدة بيانات محلية شاملة
// ==========================================
const botKnowledgeBase = [
  {
    keywords: ["سعر", "أسعار", "بكام", "الكيلو", "نحاس", "حديد", "بلاستيك", "كرتون", "ألومنيوم", "الومنيوم"],
    reply: () => {
      const pricesText = materialsData.map(m => `• <b>${m.name}:</b> ${m.price} جنيه/كيلو`).join("<br>");
      return `أسعار الخردة المحدثة النهاردة في إيكو سكراب:<br>${pricesText}<br><br>تقدر تحسب كميتك بدقة من <b>حاسبة الأرباح</b> في الصفحة!`;
    }
  },
  {
    keywords: ["مندوب", "استلام", "طلب", "عنوان", "تيجو", "البيت", "موعد"],
    reply: () => `نوصلك لحد باب البيت مجاناً! 🚚<br>فقط اضغط على <b>"أضف للطلب"</b> بجانب نوع الخردة، ثم افتح <b>"طلب البيع"</b> بالأعلى واكتب اسمك وعنوانك ورقم موبايلك، والمندوب هيوصلك خلال 24 ساعة.`
  },
  {
    keywords: ["أقل", "كمية", "وزن", "حد أدنى"],
    reply: () => `الحد الأدنى لطلب مندوب الاستلام المنزلي هو <b>15 كيلو</b> إجمالي (ممكن يكونوا مشكلين من أكتر من نوع). ولو الكمية أقل تقدر تشرفنا في أقرب فرع ليك!`
  },
  {
    keywords: ["دفع", "فلوس", "كاش", "انستا", "فودافون", "تحويل"],
    reply: () => `بنوفرلك 3 طرق للدفع الفوري بمجرد الوزن أمامك:<br>1️⃣ <b>كاش فوري</b> مع المندوب.<br>2️⃣ تحويل لحظي على <b>InstaPay</b>.<br>3️⃣ تحويل <b>فودافون كاش</b> أو أي محفظة إلكترونية.`
  },
  {
    keywords: ["فرع", "فروع", "مكان", "عنوانكم", "فين", "العاشر", "القاهرة", "الجيزة"],
    reply: () => `مراكز التجميع الرئيسية متاحة يومياً:<br>📍 <b>العاشر من رمضان:</b> المنطقة الصناعية الثالثة.<br>📍 <b>القاهرة:</b> جسر السويس - المنطقة الصناعية.<br>📍 <b>الجيزة:</b> 6 أكتوبر - المنطقة الصناعية الرابعة.`
  },
  {
    keywords: ["أجهزة", "ثلاجة", "غسالة", "تكييف", "كمبيوتر", "إلكترونية", "شاشة"],
    reply: () => `نشتري جميع الأجهزة الكهربائية التالفة والمخلفات الإلكترونية بمتوسط <b>45 جنيه للكيلو</b> أو بتقييم فوري للقطعة بالكامل حسب حالتها.`
  },
  {
    keywords: ["سلام", "اهلا", "أهلا", "صباح", "مساء", "ازيك", "عامل ايه"],
    reply: () => `أهلاً بيك يا فندم في منصة إيكو سكراب! 🌿 تحت أمرك، اسألني عن الأسعار، طرق الدفع، أو كيفية طلب مندوب.`
  },
  {
    keywords: ["شكرا", "تسلم", "متشكر"],
    reply: () => `العفو يا فندم! يسعدنا خدمتك دائماً في إيكو سكراب. ♻️`
  }
];

function toggleChat() {
  document.getElementById("chatWindow").classList.toggle("open");
}

function openChat() {
  document.getElementById("chatWindow").classList.add("open");
}

function sendQuick(text) {
  document.getElementById("chatInput").value = text;
  handleChatSubmit(new Event("submit"));
}

function handleChatSubmit(e) {
  e.preventDefault();
  const input = document.getElementById("chatInput");
  const userText = input.value.trim();
  if (!userText) return;

  appendMessage(userText, "user");
  input.value = "";

  setTimeout(() => {
    const botReply = getSmartReply(userText);
    appendMessage(botReply, "bot");
  }, 400);
}

function appendMessage(htmlText, sender) {
  const box = document.getElementById("chatMessages");
  const div = document.createElement("div");
  div.className = `msg ${sender}`;
  div.innerHTML = htmlText;
  box.appendChild(div);
  box.scrollTop = box.scrollHeight;
}

function getSmartReply(query) {
  const cleanQuery = query.toLowerCase();

  // حساب تلقائي إذا كتب المستخدم رقم مع اسم خامة (مثلا: 20 كيلو نحاس)
  const weightMatch = cleanQuery.match(/(\d+)/);
  if (weightMatch) {
    const weight = parseFloat(weightMatch[1]);
    for (const mat of materialsData) {
      const shortName = mat.name.split(" ")[0];
      if (cleanQuery.includes(shortName)) {
        const total = weight * mat.price;
        return `سعر <b>${weight} كيلو ${mat.name}</b> هو <b>${total.toLocaleString()} جنيه</b> (بسعر ${mat.price} ج.م للكيلو). تحب تضيفهم لطلب البيع؟`;
      }
    }
  }

  // البحث في قاعدة المعرفة
  for (const item of botKnowledgeBase) {
    if (item.keywords.some(kw => cleanQuery.includes(kw))) {
      return item.reply();
    }
  }

  // رد افتراضي ذكي بدون أي أخطاء
  return `سؤال ممتاز! إحنا في <b>إيكو سكراب</b> بنشتري كل أنواع الخردة (نحاس، ألومنيوم، حديد، بلاستيك، كرتون، وأجهزة إلكترونية) بأعلى سعر في السوق.<br>تقدر تسألني مثلاً: <i>"سعر 15 كيلو نحاس كام؟"</i> أو <i>"إزاي أطلب مندوب؟"</i>.`;
}
