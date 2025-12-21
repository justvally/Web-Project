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
