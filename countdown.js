// File: countdown.js

// Dapatkan semua elemen DOM (tetap sama)
const orderButton = document.getElementById('orderButton');
const ctaText = document.querySelector('.cta-text');
const mainHeading = document.getElementById('mainHeading');
const mainDescription = document.getElementById('mainDescription');

// Fungsi untuk mengambil data dari file data.json
async function fetchProductData() {
    try {
        const response = await fetch('data.json');
        if (!response.ok) {
            throw new Error(`Gagal memuat data produk. Status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Error saat fetch data.json:", error);
        // Fallback data jika gagal, termasuk tanggal di masa lalu agar tombol aktif
        return {
            newTitle: "ERROR: Gagal Memuat Judul",
            newDescription: "Cek data.json dan koneksi server.",
            stockStatus: "ready",
            launchDate: "Jan 1, 2020 10:00:00" 
        };
    }
}


// Fungsi yang dipanggil saat countdown selesai (Logika stok/tombol)
async function activateOrderButton(productData) {
    
    // Perbarui Judul dan Deskripsi
    if (productData.newTitle && mainHeading) {
        mainHeading.textContent = productData.newTitle;
    }
    if (productData.newDescription && mainDescription) {
        mainDescription.textContent = productData.newDescription;
    }
    
    // LOGIKA UTAMA: Cek Status Stok
    if (productData.stockStatus === "sold") {
        // Produk HABIS
        orderButton.classList.remove('disabled-link'); 
        orderButton.classList.add('btn-sold-out');
        orderButton.href = '#'; 
        orderButton.textContent = 'SOLD OUT';
        ctaText.textContent = "Produk ini sudah habis terjual. Terima kasih!";
        ctaText.style.color = '#464646ff';
        ctaText.style.fontFamily = 'times new roman, sans-serif';
        ctaText.style.fontSize = '15px';
    } else {
        // Produk TERSEDIA (BUY NOW)
        orderButton.classList.remove('disabled-link'); 
        orderButton.classList.remove('btn-sold-out');
        orderButton.href = 'shoplink.html'; 
        orderButton.textContent = 'Buy Now';
        orderButton.style.backgroundColor = '#5a5a5aff'; 
        orderButton.style.color = '#ffffffff';
        ctaText.textContent = "";
    }
}


// FUNGSI INTI: Memulai Countdown
async function startCountdown() {
    // 1. Ambil semua data, termasuk tanggal peluncuran
    const productData = await fetchProductData();
    const launchDate = new Date(productData.launchDate).getTime(); // Mengambil dan mengubah string tanggal menjadi timestamp
    
    // 2. Jika tanggal tidak valid, hentikan atau berikan pesan error
    if (isNaN(launchDate)) {
        console.error("Tanggal peluncuran dari data.json tidak valid.");
        document.getElementById("countdown").innerHTML = "ERROR: TANGGAL TIDAK VALID";
        return;
    }
    
    // Sembunyikan tombol Buy Now di awal (jika belum habis)
    if (productData.stockStatus !== "sold") {
        orderButton.classList.add('disabled-link');
    }
    
    const x = setInterval(function() {

        const now = new Date().getTime();
        const distance = launchDate - now;

        // Perhitungan waktu
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        // Tampilkan hasilnya
        document.getElementById("days").innerHTML = days.toString().padStart(2, '0');
        document.getElementById("hours").innerHTML = hours.toString().padStart(2, '0');
        document.getElementById("minutes").innerHTML = minutes.toString().padStart(2, '0');
        document.getElementById("seconds").innerHTML = seconds.toString().padStart(2, '0');

        // Jika hitungan mundur selesai (waktu habis)
        if (distance < 0) {
            clearInterval(x); 
            document.getElementById("countdown").innerHTML = "";
            
            // Panggil fungsi aktivasi tombol, kirim data produk yang sudah dimuat
            activateOrderButton(productData); 
        }
    }, 1000);
}

// Panggil fungsi utama untuk memulai semuanya
startCountdown();