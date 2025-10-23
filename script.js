[19.51, 23/10/2025] oktoo🥴: document.getElementById("sapaButton").addEventListener("click", function() {
  let sapaan = document.querySelector(".pesan-sapaan");

  // Kalau belum ada, buat elemen baru
  if (!sapaan) {
    sapaan = document.createElement("p");
    sapaan.classList.add("pesan-sapaan");
    sapaan.textContent = "👋 Halo! Terima kasih sudah mampir ke profilku 😄";
    document.querySelector(".kartu-profil").appendChild(sapaan);
  }

  // Tambahkan efek animasi
  sapaan.style.opacity = "0";
  setTimeout(() => {
    sapaan.style.transition = "opacity 0.5s ease";
    sapaan.style.opacity = "1";
  }, 100);
});
[19.54, 23/10/2025] oktoo🥴: window.addEventListener("DOMContentLoaded", () => {
  const tombol = document.getElementById("sapaButton");

  tombol.addEventListener("click", () => {
    let sapaan = document.querySelector(".pesan-sapaan");

    if (!sapaan) {
      sapaan = document.createElement("p");
      sapaan.className = "pesan-sapaan";
      sapaan.textContent = "👋 Halo! Terima kasih sudah mampir ke profilku 😄";
      document.querySelector(".kartu-profil").appendChild(sapaan);
    }

    sapaan.style.opacity = "0";
    setTimeout(() => {
      sapaan.style.transition = "opacity 0.5s ease";
      sapaan.style.opacity = "1";
    }, 100);
  });
});
