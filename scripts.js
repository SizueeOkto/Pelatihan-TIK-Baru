// script.js
document.getElementById("sapaButton").addEventListener("click", function() {
  // Cek apakah sudah ada elemen sapaan
  let sapaan = document.querySelector(".pesan-sapaan");

  // Kalau belum ada, buat elemen baru
  if (!sapaan) {
    sapaan = document.createElement("p");
    sapaan.classList.add("pesan-sapaan");
    sapaan.textContent = "👋 Halo! Terima kasih sudah mampir ke profilku 😄";
    document.querySelector(".kartu-profil").appendChild(sapaan);
  }

  // Tambahkan efek animasi muncul
  sapaan.style.opacity = "0";
  setTimeout(() => {
    sapaan.style.transition = "opacity 0.5s ease";
    sapaan.style.opacity = "1";
  }, 100);
});
