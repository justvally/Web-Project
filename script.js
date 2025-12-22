const track = document.querySelector('.ad-track');
const slides = document.querySelectorAll('.ad-track img');

let index = 0;

function slideLeft() {
    index++;
    track.style.transition = 'transform 0.8s ease-in-out';
    track.style.transform = `translateX(-${index * 100}vw)`;

    // If we're on the clone slide
    if (index === slides.length - 1) {
        setTimeout(() => {
            track.style.transition = 'none'; // remove animation
            index = 0;
            track.style.transform = 'translateX(0)';
        }, 800); // same as transition duration
    }
}

setInterval(slideLeft, 5000);

document.addEventListener("DOMContentLoaded", () => {
    const filterBtn = document.querySelector(".action-btn:not(.outline)");
    const personalizeBtn = document.querySelector(".action-btn.outline");
    const filterModal = document.getElementById("filterModal");
    const personalizeModal = document.getElementById("personalizeModal");
    const closeBtns = document.querySelectorAll(".close-btn");

    // Open modals
    filterBtn.addEventListener("click", () => {
        filterModal.style.display = "flex";
    });

    personalizeBtn.addEventListener("click", () => {
        personalizeModal.style.display = "flex";
    });

    // Close modals
    closeBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            filterModal.style.display = "none";
            personalizeModal.style.display = "none";
        });
    });

    // Click outside modal to close
    window.addEventListener("click", (e) => {
        if (e.target === filterModal) filterModal.style.display = "none";
        if (e.target === personalizeModal) personalizeModal.style.display = "none";
    });
});

const tabs = document.querySelectorAll('.tab');
const allProducts = document.querySelectorAll('.catalog-products'); // selects all catalog-product containers

const perfumeTab = allProducts[0]; // first container = PERFUME
const cologneTab = allProducts[1]; // second container = COLOGNE

tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        // Remove active class from all tabs
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        // Show/hide containers
        if(tab.textContent === "PERFUME") {
            perfumeTab.style.display = 'flex';  // or 'block', depending on your layout
            cologneTab.style.display = 'none';
        } else if(tab.textContent === "COLOGNE") {
            perfumeTab.style.display = 'none';
            cologneTab.style.display = 'flex';
        }
    });
});
