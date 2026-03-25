window.onload = function () {
  checkProfile();
};

function checkProfile() {
  let isLoggedIn = sessionStorage.getItem("isLoggedIn");

  document.getElementById("registration-page").style.display = "none";
  document.getElementById("login-page").style.display = "none";
  document.getElementById("form").style.display = "none";
  document.getElementById("result").style.display = "none";

  if (!isLoggedIn) {
    let isRegistered = localStorage.getItem("isRegistered");
    if (isRegistered) {
      document.getElementById("login-page").style.display = "block";
    } else {
      document.getElementById("registration-page").style.display = "block";
    }
  } else {
    document.getElementById("form").style.display = "block";

    let savedLogo = localStorage.getItem("companyLogo");
    let displayLogo = document.getElementById("display-company-logo");
    if (savedLogo) {
      displayLogo.src = savedLogo;
      displayLogo.style.display = "inline-block";
    } else {
      displayLogo.style.display = "none";
    }

    document.getElementById("name").value = localStorage.getItem("payeeName");
    document.getElementById("upi").value = localStorage.getItem("upiId");
    document.getElementById("welcome-message").innerText = "Welcome, " + (localStorage.getItem("fullname") || localStorage.getItem("contact"));
  }
}



function showRegistration() {
  document.getElementById("login-page").style.display = "none";
  document.getElementById("registration-page").style.display = "block";
  document.getElementById("form").style.display = "none";
}

function showLogin() {
  document.getElementById("login-page").style.display = "block";
  document.getElementById("registration-page").style.display = "none";
  document.getElementById("form").style.display = "none";
}

function saveProfile() {
  let fullname = document.getElementById("reg-fullname").value.trim();
  let contact = document.getElementById("reg-contact").value.trim();
  let pass = document.getElementById("reg-password").value.trim();
  let name = document.getElementById("reg-name").value.trim();
  let upi = document.getElementById("reg-upi").value.trim();
  let logoFile = document.getElementById("reg-logo").files[0];
  let hasError = false;

  document.getElementById("reg-fullname-error").innerText = "";
  document.getElementById("reg-contact-error").innerText = "";
  document.getElementById("reg-password-error").innerText = "";
  document.getElementById("reg-name-error").innerText = "";
  document.getElementById("reg-upi-error").innerText = "";

  if (!fullname) {
    document.getElementById("reg-fullname-error").innerText = "Full Name is required.";
    hasError = true;
  }
  if (!contact) {
    document.getElementById("reg-contact-error").innerText = "Phone Number is required.";
    hasError = true;
  }
  if (!pass) {
    document.getElementById("reg-password-error").innerText = "Password is required.";
    hasError = true;
  } else if (!/^(?=.*[a-zA-Z])(?=.*[0-9]).{6,}$/.test(pass)) {
    document.getElementById("reg-password-error").innerText = "Password must be at least 6 characters, including letters and numbers.";
    hasError = true;
  }
  if (!name) {
    document.getElementById("reg-name-error").innerText = "Payee Name is required.";
    hasError = true;
  } else if (!/^[a-zA-Z\s]+$/.test(name)) {
    document.getElementById("reg-name-error").innerText = "Payee Name should contain only letters and spaces.";
    hasError = true;
  }
  if (!upi) {
    document.getElementById("reg-upi-error").innerText = "UPI ID is required.";
    hasError = true;
  } else if (!/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+$/.test(upi)) {
    document.getElementById("reg-upi-error").innerText = "Please enter a valid UPI ID (e.g., user@bank).";
    hasError = true;
  }

  if (hasError) return;

  localStorage.setItem("fullname", fullname);
  localStorage.setItem("contact", contact);
  localStorage.setItem("password", pass);
  localStorage.setItem("payeeName", name);
  localStorage.setItem("upiId", upi);
  localStorage.setItem("isRegistered", "true");

  logToLocalStorage("Registration", contact, name, upi);

  if (logoFile) {
    let reader = new FileReader();
    reader.onload = function (e) {
      localStorage.setItem("companyLogo", e.target.result);
      finishRegistration();
    };
    reader.readAsDataURL(logoFile);
  } else {
    // If no logo, clear any previous
    localStorage.removeItem("companyLogo");
    finishRegistration();
  }
}

function finishRegistration() {
  let isLoggedIn = sessionStorage.getItem("isLoggedIn");
  if (!isLoggedIn) {
    alert("Registration successful! Please login.");
    showLogin();
  } else {
    checkProfile();
  }
}

function login() {
  let c = document.getElementById("login-contact").value.trim();
  let p = document.getElementById("login-password").value.trim();

  document.getElementById("login-contact-error").innerText = "";
  document.getElementById("login-password-error").innerText = "";

  let hasError = false;
  if (!c) {
    document.getElementById("login-contact-error").innerText = "Phone Number is required.";
    hasError = true;
  }
  if (!p) {
    document.getElementById("login-password-error").innerText = "Password is required.";
    hasError = true;
  }
  if (hasError) return;

  if (c !== localStorage.getItem("contact")) {
    document.getElementById("login-contact-error").innerText = "Account not found.";
    return;
  }
  if (p !== localStorage.getItem("password")) {
    document.getElementById("login-password-error").innerText = "Invalid password.";
    return;
  }

  sessionStorage.setItem("isLoggedIn", "true");
  let name = localStorage.getItem("payeeName");
  let upi = localStorage.getItem("upiId");
  logToLocalStorage("Login", c, name, upi);
  checkProfile();
}

function logout() {
  document.getElementById("login-contact").value = "";
  document.getElementById("login-password").value = "";
  sessionStorage.removeItem("isLoggedIn");
  checkProfile();
}

function editProfile() {
  document.getElementById("reg-fullname").value = localStorage.getItem("fullname") || "";
  document.getElementById("reg-contact").value = localStorage.getItem("contact") || "";
  document.getElementById("reg-password").value = localStorage.getItem("password") || "";
  document.getElementById("reg-name").value = localStorage.getItem("payeeName") || "";
  document.getElementById("reg-upi").value = localStorage.getItem("upiId") || "";

  document.getElementById("registration-page").style.display = "block";
  document.getElementById("form").style.display = "none";
}

function newEntry() {
  document.getElementById("result").style.display = "none";
  document.getElementById("form").style.display = "block";

  document.getElementById("client").value = "";
  document.getElementById("client-phone").value = "";

  const productsSection = document.getElementById("products-section");
  productsSection.innerHTML = `
      <div class="product-row">
        <label>Product</label>
        <input class="product" placeholder="Product Name">
        <label>Quantity</label>
        <input class="qty" placeholder="Qty">
        <label>Price</label>
        <input class="price" placeholder="Price" oninput="calculatePending()">
        <button type="button" onclick="removeProductRow(this)">Remove</button>
      </div>
    `;

  document.getElementById("payment-type").value = "clear";
  document.getElementById("advance-fields").style.display = "none";
  document.getElementById("advance-amount").value = "";
  document.getElementById("pending-amount").value = "";

  document.getElementById("back-btn").style.display = "none";

  window.scrollTo(0, 0);
}

function goBack() {
  document.getElementById("result").style.display = "none";
  document.getElementById("form").style.display = "block";
  document.getElementById("back-btn").style.display = "none";
  window.scrollTo(0, 0);
}

function toggleAdvance() {
  let paymentType = document.getElementById("payment-type").value;
  let advanceFields = document.getElementById("advance-fields");
  if (paymentType === "advance") {
    advanceFields.style.display = "block";
  } else {
    advanceFields.style.display = "none";
    document.getElementById("advance-amount").value = "";
  }
  calculatePending();
}

function calculatePending() {
  let total = 0;
  document.querySelectorAll('.product-row').forEach(row => {
    let qty = row.querySelector('.qty').value.trim();
    let price = row.querySelector('.price').value.trim();
    if (qty && price && !isNaN(qty) && !isNaN(price)) {
      total += parseInt(qty) * parseFloat(price);
    }
  });

  let paymentType = document.getElementById("payment-type").value;
  if (paymentType === "advance") {
    let advance = parseFloat(document.getElementById("advance-amount").value) || 0;
    let pending = total - advance;
    document.getElementById("pending-amount").value = pending >= 0 ? pending : 0;
  }
}

function addProductRow() {
  const productsSection = document.getElementById('products-section');
  const newRow = document.createElement('div');
  newRow.className = 'product-row';
  newRow.innerHTML = `
      <label>Product</label>
      <input class="product" placeholder="Product Name">
      <label>Quantity</label>
      <input class="qty" placeholder="Qty">
      <label>Price</label>
      <input class="price" placeholder="Price" oninput="calculatePending()">
      <button type="button" onclick="removeProductRow(this)">Remove</button>
    `;
  productsSection.appendChild(newRow);
}

function removeProductRow(button) {
  const row = button.parentElement;
  if (document.querySelectorAll('.product-row').length > 1) {
    row.remove();
    calculatePending();
  } else {
    showFormError('At least one product is required.');
  }
}

function generateQR() {

  // Clear all previous errors
  document.getElementById("name-error").innerText = "";
  document.getElementById("upi-error").innerText = "";
  document.getElementById("client-error").innerText = "";
  document.getElementById("client-phone-error").innerText = "";
  document.getElementById("products-errors").innerText = "";

  let name = document.getElementById("name").value.trim()
  let upi = document.getElementById("upi").value.trim()
  let client = document.getElementById("client").value.trim()
  let clientPhone = document.getElementById("client-phone").value.trim()

  let hasError = false;

  // Validate Payee Name
  if (!name) {
    document.getElementById("name-error").innerText = "Payee Name is required.";
    hasError = true;
  } else if (!/^[a-zA-Z\s]+$/.test(name)) {
    document.getElementById("name-error").innerText = "Payee Name should contain only letters and spaces.";
    hasError = true;
  }

  // Validate UPI ID
  if (!upi) {
    document.getElementById("upi-error").innerText = "UPI ID is required.";
    hasError = true;
  } else if (!/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+$/.test(upi)) {
    document.getElementById("upi-error").innerText = "Please enter a valid UPI ID (e.g., user@bank).";
    hasError = true;
  }

  // Validate Client Name
  if (!client) {
    document.getElementById("client-error").innerText = "Client Name is required.";
    hasError = true;
  } else if (!/^[a-zA-Z\s]+$/.test(client)) {
    document.getElementById("client-error").innerText = "Client Name should contain only letters and spaces.";
    hasError = true;
  }

  // Validate Client Phone
  if (!clientPhone) {
    document.getElementById("client-phone-error").innerText = "Client Phone is required.";
    hasError = true;
  } else if (!/^\d{10}$/.test(clientPhone)) {
    document.getElementById("client-phone-error").innerText = "Client Phone must be a 10-digit number.";
    hasError = true;
  }

  // Collect and validate products
  let products = [];
  let total = 0;
  let productsErrorStr = "";
  const productRows = document.querySelectorAll('.product-row');
  productRows.forEach((row, index) => {
    const product = row.querySelector('.product').value.trim();
    const qty = row.querySelector('.qty').value.trim();
    const price = row.querySelector('.price').value.trim();
    const idx = index + 1;

    if (!product) {
      productsErrorStr += `Row ${idx}: Product is required. `;
      hasError = true;
    }
    if (!qty) {
      productsErrorStr += `Row ${idx}: Quantity is required. `;
      hasError = true;
    } else if (!/^\d+$/.test(qty) || parseInt(qty) <= 0) {
      productsErrorStr += `Row ${idx}: Quantity must be positive. `;
      hasError = true;
    }
    if (!price) {
      productsErrorStr += `Row ${idx}: Price is required. `;
      hasError = true;
    } else if (isNaN(price) || parseFloat(price) <= 0) {
      productsErrorStr += `Row ${idx}: Price must be positive. `;
      hasError = true;
    }

    if (product && qty && price) {
      const itemTotal = parseInt(qty) * parseFloat(price);
      products.push({ product, qty: parseInt(qty), price: parseFloat(price), total: itemTotal });
      total += itemTotal;
    }
  });

  let paymentType = document.getElementById("payment-type").value;
  let advance = 0;
  let pending = total;

  if (!hasError && paymentType === "advance") {
    advance = parseFloat(document.getElementById("advance-amount").value);
    if (isNaN(advance) || advance <= 0 || advance > total) {
      productsErrorStr += `Advance amount must be valid (between 1 and ${total}). `;
      hasError = true;
    } else {
      pending = total - advance;
    }
  }

  if (productsErrorStr) {
    document.getElementById("products-errors").innerText = productsErrorStr;
    document.getElementById("products-errors").style.color = "red";
    document.getElementById("products-errors").style.fontSize = "12px";
    document.getElementById("products-errors").style.marginBottom = "10px";
  }

  if (hasError) {
    return;
  }

  document.getElementById("form").style.display = "none";
  document.getElementById("result").style.display = "block";
  document.getElementById("back-btn").style.display = "inline-block";

  let lastInvoice = localStorage.getItem('lastInvoice') || 0;
  let invoiceNumber = parseInt(lastInvoice) + 1;
  localStorage.setItem('lastInvoice', invoiceNumber);
  let invoice = "INV" + invoiceNumber.toString().padStart(4, '0');

  let date = new Date().toLocaleDateString()

  let qrAmount = paymentType === "advance" ? advance : total;
  let upiLink = `upi://pay?pa=${upi}&pn=${name}&am=${qrAmount}&cu=INR`

  let qrContainer = document.getElementById("qrcode");
  qrContainer.innerHTML = "";
  qrContainer.style.position = "relative";
  qrContainer.style.display = "flex";
  qrContainer.style.justifyContent = "center";
  qrContainer.style.alignItems = "center";

  new QRCode(qrContainer, {
    text: upiLink,
    width: 250,
    height: 250,
    correctLevel: QRCode.CorrectLevel.H
  });

  // Add logo in the center of the QR code
  let logoImg = document.createElement("img");
  let savedLogo = localStorage.getItem("companyLogo");

  logoImg.style.position = "absolute";
  logoImg.style.width = "60px";
  logoImg.style.height = "60px";
  logoImg.style.backgroundColor = "white";
  logoImg.style.padding = "4px";
  logoImg.style.borderRadius = "4px";
  logoImg.style.objectFit = "contain";
  logoImg.style.boxSizing = "border-box";
  logoImg.crossOrigin = "Anonymous";

  if (savedLogo) {
    logoImg.src = savedLogo;
  } else {
    logoImg.src = "./logo.png";
  }

  qrContainer.appendChild(logoImg);

  document.getElementById("rname").innerText = name;
  document.getElementById("rupi").innerText = upi;
  
  let companyNameElem = document.getElementById("rcompany");
  if (companyNameElem) {
      companyNameElem.innerText = name;
  }
  let phoneElem = document.getElementById("rphone");
  let phoneLabelElem = document.getElementById("rphone-label");
  let storedContact = localStorage.getItem("contact");
  if (phoneElem && storedContact) {
      phoneElem.innerText = "+91 " + storedContact;
  }
  let bottomPayee = document.getElementById("bottom-payee");
  if (bottomPayee) {
    if (storedContact.includes("@")) {
          if (phoneLabelElem) phoneLabelElem.innerText = "Email:";
          phoneElem.innerText = storedContact;
      } else {
          if (phoneLabelElem) phoneLabelElem.innerText = "Phone:";
      bottomPayee.innerText = name + " (" + upi + ")";
    }
  }

  let rclientElem = document.getElementById("rclient");
  if (rclientElem) rclientElem.innerText = client;
  
  let rclientPhoneElem = document.getElementById("rclient-phone");
  if (rclientPhoneElem) rclientPhoneElem.innerText = clientPhone;
  document.getElementById("ramount").innerText = total

  if (paymentType === "advance") {
    document.getElementById("radvance-row").style.display = "block";
    document.getElementById("rpending-row").style.display = "block";
    document.getElementById("radvance").innerText = advance;
    document.getElementById("rpending").innerText = pending;
  } else {
    document.getElementById("radvance-row").style.display = "none";
    document.getElementById("rpending-row").style.display = "none";
  }

  document.getElementById("rinvoice").innerText = invoice
  document.getElementById("rdate").innerText = date

  // Render products in table
  const tbody = document.getElementById('invoice-products');
  tbody.innerHTML = '';
  products.forEach(item => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${item.product}</td>
      <td>${item.qty}</td>
      <td>${item.price}</td>
      <td>${item.total}</td>
    `;
    tbody.appendChild(row);
  });

  window.scrollTo(0, 0);

}

function shareWhatsApp() {
  let amount = document.getElementById("ramount").innerText;
  let upi = document.getElementById("rupi").innerText;
  let client = document.getElementById("rclient").innerText;
  let clientPhone = document.getElementById("rclient-phone").innerText;
  let invoice = document.getElementById("rinvoice").innerText;
  let date = document.getElementById("rdate").innerText;
  let company = document.getElementById("rcompany") ? document.getElementById("rcompany").innerText : '';
  let phone = document.getElementById("rphone") ? document.getElementById("rphone").innerText : '';
  let payeeName = document.getElementById("rname").innerText;

  let amountText = `Total Amount: ₹${amount}`;
  let radvanceRow = document.getElementById("radvance-row");
  if (radvanceRow && radvanceRow.style.display !== "none") {
    let advanceAmount = document.getElementById("radvance").innerText;
    let pendingAmount = document.getElementById("rpending").innerText;
    amountText += `\nAdvance Paid: ₹${advanceAmount}\nPending Amount: ₹${pendingAmount}`;
  }

  let msg = `Invoice Payment\n\nCompany: ${company}\nPhone: ${phone}\nInvoice: ${invoice}\nDate: ${date}\nClient: ${client}\nClient Phone: ${clientPhone}\nPayee Name: ${payeeName}\nUPI: ${upi}\n${amountText}`;

  let waPhoneStr = clientPhone.length === 10 ? `91${clientPhone}` : clientPhone;

  html2canvas(document.getElementById("card"), { useCORS: true, scale: 2 }).then(canvas => {
    canvas.toBlob(function (blob) {
      if (!blob) return;
      const file = new File([blob], 'invoice.jpg', { type: 'image/jpeg' });

      const shareData = {
        files: [file],
        title: 'Invoice',
        text: msg
      };

      if (navigator.canShare && navigator.canShare(shareData)) {
        navigator.share(shareData).catch(err => {
          console.error("Error sharing:", err);
          // Fallback if user cancels or there is an issue
          window.open(`https://wa.me/${waPhoneStr}?text=${encodeURIComponent(msg)}`, '_blank');
        });
      } else {
        // Fallback for browsers that don't support file sharing
        window.open(`https://wa.me/${waPhoneStr}?text=${encodeURIComponent(msg)}`, '_blank');
      }
    }, 'image/jpeg', 0.9);
  });
}

function downloadJPG() {

  html2canvas(document.getElementById("card"), { useCORS: true, scale: 2 }).then(canvas => {

    let link = document.createElement("a")
    link.download = "invoice.jpg"
    link.href = canvas.toDataURL()
    link.click()

  })

}

function downloadPDF() {

  let printDate = prompt("Enter print date:", new Date().toLocaleDateString());
  if (!printDate) return;
  html2canvas(document.getElementById("card"), { useCORS: true, scale: 2 }).then(canvas => {
    const { jsPDF } = window.jspdf;
    let pdf = new jsPDF();
    let img = canvas.toDataURL("image/png");
    pdf.addImage(img, 'PNG', 10, 10, 180, 0);
    pdf.setFontSize(12);
    pdf.text("Print Date: " + printDate, 10, 290);
    pdf.save("invoice.pdf");
  });

}

function showFormError(message) {
  var errorDiv = document.getElementById('form-error');
  errorDiv.innerText = message;
  errorDiv.style.display = 'block';
  setTimeout(() => { errorDiv.style.display = 'none'; }, 3000);
}



function logToLocalStorage(action, username, payeeName, upiId) {
  let records = JSON.parse(localStorage.getItem("app_records") || "[]");
  records.push({
    timestamp: new Date().toLocaleString(),
    action: action,
    username: username,
    payeeName: payeeName || "",
    upiId: upiId || ""
  });
  localStorage.setItem("app_records", JSON.stringify(records));
}

function clearAllAccounts() {
  if (confirm("Are you sure you want to delete all accounts and data? This cannot be undone.")) {
    localStorage.clear();
    sessionStorage.clear();
    alert("All accounts have been deleted. Starting fresh!");
    location.reload();
  }
}

function downloadAllDataCSV() {
  let records = JSON.parse(localStorage.getItem("app_records") || "[]");
  if (records.length === 0) {
    alert("No data available to download.");
    return;
  }

  let csvContent = "Timestamp,Action,Username,Payee Name,UPI ID\n";

  records.forEach(function (rowArray) {
    let row = `"${rowArray.timestamp}","${rowArray.action}","${rowArray.username}","${rowArray.payeeName}","${rowArray.upiId}"`;
    csvContent += row + "\n";
  });

  let blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  let url = URL.createObjectURL(blob);

  let link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", "user_data_auto_update.csv");
  document.body.appendChild(link); // Required for FF

  link.click();
  document.body.removeChild(link);
}
