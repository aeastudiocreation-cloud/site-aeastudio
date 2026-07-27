class RibbonBackground {
    constructor(containerElement) {
        this.container = containerElement;
        this.canvas = document.createElement('canvas');
        this.canvas.className = 'ribbon-canvas';
        this.canvas.style.position = 'absolute';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.width = '100%';
        this.canvas.style.height = '100%';
        this.canvas.style.zIndex = '0';
        this.canvas.style.pointerEvents = 'none';
        
        // Ensure container is positioned
        const pos = getComputedStyle(this.container).position;
        if (pos === 'static') {
            this.container.style.position = 'relative';
        }
        
        this.container.insertBefore(this.canvas, this.container.firstChild);
        this.ctx = this.canvas.getContext('2d');

        this.time = Math.random() * 1000;
        this.resize = this.resize.bind(this);
        this.animate = this.animate.bind(this);
        
        this.init();
        this.animate();
    }
    
    init() {
        // Create canvas
        this.canvas = document.createElement('canvas');
        this.canvas.style.position = 'absolute';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.width = '100%';
        this.canvas.style.height = '100%';
        this.canvas.style.zIndex = '0'; // Put it behind the content but above the background
        this.canvas.style.pointerEvents = 'none'; // Ensure it doesn't block interactions
        
        // A máscara foi removida para que a animação ocupe 100% da área sem espaços em branco no topo

        this.container.appendChild(this.canvas);
        this.ctx = this.canvas.getContext('2d', { alpha: true });
        
        this.resize();
        window.addEventListener('resize', this.resize);
        
        // Use ResizeObserver to catch container size changes without window resize
        this.resizeObserver = new ResizeObserver(() => this.resize());
        this.resizeObserver.observe(this.container);
        
        this.dpr = window.devicePixelRatio || 1;
        this.ribbons = [];
        const numRibbons = 5;
        for (let i = 0; i < numRibbons; i++) {
            this.ribbons.push(this.createRibbon(i, numRibbons));
        }
    }

    resize() {
        this.width = this.container.offsetWidth;
        this.height = this.container.offsetHeight;
        this.canvas.width = this.width * this.dpr;
        this.canvas.height = this.height * this.dpr;
        this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    }
    
    createRibbon(index, total) {
        const points = [];
        const numSegments = 12;
        // Spread evenly across the entire container width to guarantee full coverage
        const sectionWidth = this.width / total;
        const baseX = (sectionWidth * index) + (sectionWidth * Math.random());
        
        for (let j = 0; j <= numSegments; j++) {
            points.push({
                x: baseX + (Math.random() - 0.5) * 150,
                y: (this.height / numSegments) * j + (Math.random() - 0.5) * 80,
                baseX: baseX + (Math.random() - 0.5) * 100,
                baseY: (this.height / numSegments) * j,
                phaseX: Math.random() * Math.PI * 2,
                phaseY: Math.random() * Math.PI * 2,
                speedX: 0.002 + Math.random() * 0.005,
                speedY: 0.002 + Math.random() * 0.005,
                radius: 100 + Math.random() * 200
            });
        }
        
        return {
            points: points,
            colorPhase: Math.random() * Math.PI * 2,
            colorSpeed: 0.005 + Math.random() * 0.01,
            width: 100 + Math.random() * 150
        };
    }
    
    animate() {
        this.time += 1;
        
        // 1. Clear the canvas to make it transparent so the CSS gradient shows through
        this.ctx.clearRect(0, 0, this.width, this.height);
        
        // 2. Draw ribbons with screen blending for that bright glow
        this.ctx.globalCompositeOperation = 'screen';
        this.ctx.globalAlpha = 1.0;
        
        for (let i = 0; i < this.ribbons.length; i++) {
            const ribbon = this.ribbons[i];
            ribbon.colorPhase += ribbon.colorSpeed;
            
            // Update points
            for (let j = 0; j < ribbon.points.length; j++) {
                const p = ribbon.points[j];
                p.phaseX += p.speedX;
                p.phaseY += p.speedY;
                p.x = p.baseX + Math.sin(p.phaseX) * p.radius;
                p.y = p.baseY + Math.cos(p.phaseY) * p.radius;
            }
            
            // Draw triangles
            for (let j = 0; j < ribbon.points.length - 1; j++) {
                const p1 = ribbon.points[j];
                const p2 = ribbon.points[j + 1];
                
                const p3 = {
                    x: p1.x + Math.sin(this.time * 0.01 + j) * ribbon.width,
                    y: p1.y + Math.cos(this.time * 0.01 + j) * ribbon.width
                };
                
                // Vibrant colors: Pink, Gold, Purple, Blue
                const colorVal = ribbon.colorPhase + j * 0.15;
                const r = Math.floor(Math.sin(colorVal) * 127 + 128);
                const g = Math.floor(Math.sin(colorVal + 2) * 100 + 100); 
                const b = Math.floor(Math.sin(colorVal + 4) * 127 + 128);
                
                this.ctx.beginPath();
                this.ctx.moveTo(p1.x, p1.y);
                this.ctx.lineTo(p2.x, p2.y);
                this.ctx.lineTo(p3.x, p3.y);
                this.ctx.closePath();
                
                this.ctx.fillStyle = `rgba(${r}, ${g}, ${b}, 0.35)`;
                this.ctx.fill();
                
                // Opposite triangle
                if (j > 0) {
                    const pPrev = ribbon.points[j - 1];
                    const p3Prev = {
                        x: pPrev.x + Math.sin(this.time * 0.01 + (j - 1)) * ribbon.width,
                        y: pPrev.y + Math.cos(this.time * 0.01 + (j - 1)) * ribbon.width
                    };
                    
                    this.ctx.beginPath();
                    this.ctx.moveTo(p1.x, p1.y);
                    this.ctx.lineTo(p2.x, p2.y);
                    this.ctx.lineTo(p3Prev.x, p3Prev.y);
                    this.ctx.closePath();
                    
                    this.ctx.fillStyle = `rgba(${Math.floor(b*0.8)}, ${Math.floor(r*0.8)}, ${Math.floor(g*0.8)}, 0.2)`;
                    this.ctx.fill();
                }
            }
        }
        
        this.ctx.globalCompositeOperation = 'source-over';
        this.ctx.globalAlpha = 1.0;
        
        requestAnimationFrame(this.animate);
    }
}

// Initialize ribbons on specific sections
(function() {
    function initRibbons() {
        // Target containers by data attribute
        var containers = document.querySelectorAll('[data-ribbon-bg]');
        containers.forEach(function(el) {
            try {
                new RibbonBackground(el);
            } catch (e) {
                console.error('Error initializing ribbon on', el, e);
            }
        });
        console.log('Ribbon backgrounds initialized on', containers.length, 'sections');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initRibbons);
    } else {
        initRibbons();
    }
})();
