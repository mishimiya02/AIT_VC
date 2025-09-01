// avion-loading.js - Versión mejorada
(function() {
    'use strict';
    
    class AvionLoading {
        constructor() {
            this.stylesAdded = false;
            this.loader = null;
            this.init();
        }

        init() {
            this.agregarEstilos();
        }

        mostrar() {
            this.crearLoader();
            document.body.appendChild(this.loader);
            document.body.style.overflow = 'hidden';
            return this;
        }

        ocultar() {
            if (this.loader && this.loader.parentNode) {
                this.loader.parentNode.removeChild(this.loader);
                document.body.style.overflow = '';
            }
            return this;
        }

        crearLoader() {
            this.loader = document.createElement('div');
            this.loader.className = 'avion-loader-container';
            this.loader.innerHTML = `
                <div class="sky-background">
                    <div class="cloud cloud-1"></div>
                    <div class="cloud cloud-2"></div>
                </div>
                
                <div class="avion-loader-content">
                    <h1>Aeropuerto Internacional de Toluca </h1>
                    <p>Cargando...</p>
                    
                    <div class="airplane-container">
                        <div class="airplane">✈️</div>
                    </div>
                    
                    <div class="runway"></div>
                    
                    <div class="progress-container">
                        <div class="progress-bar"></div>
                    </div>
                    
                    <div class="status-text pulse">Cargando sistemas...</div>
                </div>
            `;
        }

        agregarEstilos() {
            if (this.stylesAdded) return;

            const styles = document.createElement('style');
            styles.textContent = this.obtenerEstilos();
            document.head.appendChild(styles);
            
            this.stylesAdded = true;
        }

        obtenerEstilos() {
            return `
                .avion-loader-container {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: linear-gradient(to bottom, #1a2980, #d02626ff);
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    z-index: 9999;
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    color: white;
                }

                .avion-loader-content {
                    text-align: center;
                    background: rgba(0, 0, 0, 0.4);
                    padding: 40px;
                    border-radius: 20px;
                    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
                    position: relative;
                    width: 90%;
                    max-width: 500px;
                }

                .sky-background {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    z-index: -1;
                    overflow: hidden;
                }

                .cloud {
                    position: absolute;
                    background: rgba(255, 255, 255, 0.8);
                    border-radius: 50%;
                    opacity: 0.7;
                }

                .cloud:before, .cloud:after {
                    content: '';
                    position: absolute;
                    background: rgba(255, 255, 255, 0.8);
                    border-radius: 50%;
                }

                .cloud-1 {
                    width: 100px;
                    height: 100px;
                    top: 20px;
                    left: -100px;
                    animation: moveCloud 15s linear infinite;
                }

                .cloud-1:before {
                    width: 200px;
                    height: 140px;
                    top: -20px;
                    left: 10px;
                }

                .cloud-1:after {
                    width: 200px;
                    height: 100px;
                    top: -25px;
                    right: 10px;
                }

                .cloud-2 {
                    width: 100px;
                    height: 400px;
                    top: 80px;
                    right: -120px;
                    animation: moveCloud 18s linear infinite;
                    animation-delay: 2s;
                }

                .cloud-2:before {
                    width: 500px;
                    height: 250px;
                    top: -25px;
                    left: 10px;
                }

                .cloud-2:after {
                    width: 60px;
                    height: 60px;
                    top: -30px;
                    right: 15px;
                }

                .airplane-container {
                    margin: 30px 0;
                    position: relative;
                    height: 80px;
                }

                .airplane {
                    font-size: 50px;
                    animation: fly 2.5s ease-in-out infinite;
                    transform-origin: center;
                }

                .runway {
                    height: 2px;
                    background: rgba(255, 255, 255, 0.5);
                    width: 80%;
                    margin: 0 auto;
                    position: relative;
                    overflow: hidden;
                }

                .runway:after {
                    content: '';
                    position: absolute;
                    height: 100%;
                    width: 30%;
                    background: rgba(255, 255, 255, 0.8);
                    animation: runwayLight 1.5s linear infinite;
                }

                .progress-container {
                    width: 80%;
                    height: 8px;
                    background: rgba(255, 255, 255, 0.2);
                    border-radius: 4px;
                    margin: 30px auto;
                    overflow: hidden;
                }

                .progress-bar {
                    height: 100%;
                    width: 0%;
                    background: linear-gradient(to right, #ff9a00, #ffcc00);
                    border-radius: 4px;
                    animation: loading 4.5s ease-in-out infinite;
                }

                .status-text {
                    margin-top: 20px;
                    font-size: 14px;
                    letter-spacing: 1px;
                }

                .pulse {
                    animation: pulse 1.5s ease-in-out infinite alternate;
                }

                @keyframes fly {
                    0% { transform: translateX(-30px) rotate(5deg); }
                    50% { transform: translateX(30px) rotate(-5deg); }
                    100% { transform: translateX(-30px) rotate(5deg); }
                }

                @keyframes loading {
                    0% { width: 0%; }
                    50% { width: 70%; }
                    100% { width: 100%; }
                }

                @keyframes runwayLight {
                    0% { left: -30%; }
                    100% { left: 100%; }
                }

                @keyframes moveCloud {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(calc(100vw + 200px)); }
                }

                @keyframes pulse {
                    0% { opacity: 0.7; }
                    100% { opacity: 1; }
                }

                h1 {
                    margin-bottom: 30px;
                    font-weight: 900;
                    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
                }

                p {
                    margin-bottom: 5px;
                    opacity: 0.9;
                      font-weight: 300;
                }
            `;
        }
    }

    // Crear instancia global
    window.AvionLoading = new AvionLoading();
    
    // También exponer la clase por si la quieres usar directamente
    window.AvionLoadingClass = AvionLoading;
})();