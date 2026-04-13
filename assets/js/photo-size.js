document.addEventListener('DOMContentLoaded', function () {
	const modal = document.getElementById('myModal');
	const modalImg = document.getElementById('modalImage');
	const captionText = document.getElementById('caption');

	let currentImageIndex = 0;

	function getGalleryItems() {
		return document.querySelectorAll('.gallery-item img');
	}

	window.openModal = function (element) {
		const galleryItems = getGalleryItems();
		if (!modal || !modalImg || !captionText) return;

		modal.style.display = 'block';
		modalImg.src = element.src;
		captionText.innerHTML = element.alt || '';

		galleryItems.forEach((img, index) => {
			if (img.src === element.src) {
				currentImageIndex = index;
			}
		});
	};

	window.closeModal = function () {
		if (!modal) return;
		modal.style.display = 'none';
	};

	window.plusSlides = function (n) {
		showSlides(currentImageIndex + n);
	};

	function showSlides(n) {
		const galleryItems = getGalleryItems();
		if (!galleryItems.length || !modalImg || !captionText) return;

		let newIndex = n;

		if (newIndex >= galleryItems.length) {
			newIndex = 0;
		}

		if (newIndex < 0) {
			newIndex = galleryItems.length - 1;
		}

		currentImageIndex = newIndex;
		modalImg.src = galleryItems[currentImageIndex].src;
		captionText.innerHTML = galleryItems[currentImageIndex].alt || '';
	}

	document.addEventListener('keydown', function (event) {
		if (event.key === 'Escape') {
			window.closeModal();
		}
	});

	window.addEventListener('click', function (event) {
		if (event.target === modal) {
			window.closeModal();
		}
	});
});
// İlk yüklemede navigasyon oklarını gizle/göster (opsiyonel)
// Bu kısım, galeri boşsa veya tek resim varsa okları gizlemek için
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