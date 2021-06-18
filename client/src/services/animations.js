function startAnims() {
    const buttons = document.querySelectorAll('.buttonwave');
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {

            const x = e.clientX - e.target.offsetLeft;
            const y = e.clientY - e.target.offsetTop;
            
            const ripples = document.createElement('span');
            ripples.style.left = x + 'px';
            ripples.style.top = y + 'px';
            this.appendChild(ripples);

            setTimeout(() => {
                ripples.remove();
            }, 1000);
        })
    });
}

module.exports = { startAnims }