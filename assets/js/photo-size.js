const modal = document.getElementById("myModal");
const modalImg = document.getElementById("modalImage");
const captionText = document.getElementById("caption");
let currentImageIndex;
const galleryItems = document.querySelectorAll(".gallery-item img");

function openModal(element) {
    modal.style.display = "block";
    modalImg.src = element.src;
    captionText.innerHTML = element.alt; // Görselin alt metnini başlık olarak kullan

    // Tıklanan görselin index'ini bul
    galleryItems.forEach((img, index) => {
        if (img.src === element.src) {
            currentImageIndex = index;
        }
    });
}

function closeModal() {
    modal.style.display = "none";
}

// Modal açıkken ESC tuşu ile kapatma
document.addEventListener('keydown', function(event) {
    if (event.key === "Escape") {
        closeModal();
    }
});

// Modal dışına tıklayınca kapatma
window.onclick = function(event) {
    if (event.target == modal) {
        closeModal();
    }
}

function plusSlides(n) {
    showSlides(currentImageIndex += n);
}

function showSlides(n) {
    let newIndex = n;
    if (newIndex >= galleryItems.length) {
        newIndex = 0; // Son resimden sonra başa dön
    }
    if (newIndex < 0) {
        newIndex = galleryItems.length - 1; // İlk resimden önce sona git
    }
    currentImageIndex = newIndex; // Global index'i güncelle
    modalImg.src = galleryItems[currentImageIndex].src;
    captionText.innerHTML = galleryItems[currentImageIndex].alt;
}

	function navFunction() {
		var x = document.getElementById('navbar');
		if (x.className === 'nav') {
			x.className += ' responsive';
		} else {
			x.className = 'nav';
		}
	}
// İlk yüklemede navigasyon oklarını gizle/göster (opsiyonel)
// Bu kısım, galeri boşsa veya tek resim varsa okları gizlemek için eklenebilir.
// function checkNavigation() {
//     const prevButton = document.querySelector(".prev");
//     const nextButton = document.querySelector(".next");
//     if (galleryItems.length <= 1) {
//         if(prevButton) prevButton.style.display = "none";
//         if(nextButton) nextButton.style.display = "none";
//     } else {
//         if(prevButton) prevButton.style.display = "block";
//         if(nextButton) nextButton.style.display = "block";
//     }
// }
// window.onload = checkNavigation;