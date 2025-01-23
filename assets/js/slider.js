const slideTrack = document.querySelector('.slide-track');

slideTrack.addEventListener('mouseover', () => {
  slideTrack.style.animationPlayState = 'paused';
});

slideTrack.addEventListener('mouseout', () => {
  slideTrack.style.animationPlayState = 'running';
});
