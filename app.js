const express = require('express');
const app = express();
const PORT = 3000;

// Servir archivos estáticos (CSS, JS)
app.use(express.static('public'));

// Ruta principal
app.get('/', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html lang="es">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Servidor Express - Pérez</title>
            <style>
                :root {
                    --primary-color: #6c5ce7;
                    --secondary-color: #a8e6cf;
                    --background-dark: #1a1a2e;
                    --card-bg: #16213e;
                    --text-light: #eee;
                    --text-muted: #a0a0a0;
                    --success-color: #00b894;
                    --error-color: #ff4b4b;
                    --scan-gradient: linear-gradient(90deg, transparent, var(--primary-color), transparent);
                }

                * {
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                }

                body {
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    background: linear-gradient(135deg, var(--background-dark) 0%, #0f0f1a 100%);
                    color: var(--text-light);
                    min-height: 100vh;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    padding: 20px;
                }

                .server-container {
                    max-width: 800px;
                    width: 100%;
                    background: var(--card-bg);
                    border-radius: 20px;
                    padding: 40px;
                    box-shadow: 0 20px 60px rgba(0,0,0,0.3);
                    text-align: center;
                }

                .status-badge {
                    display: inline-block;
                    background: var(--success-color);
                    color: white;
                    padding: 5px 15px;
                    border-radius: 20px;
                    font-size: 0.9rem;
                    margin-bottom: 20px;
                    animation: pulse 2s infinite;
                }

                @keyframes pulse {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.7; }
                }

                h1 {
                    font-size: 3rem;
                    margin-bottom: 20px;
                    background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                }

                .info-card {
                    background: rgba(255,255,255,0.05);
                    border-radius: 15px;
                    padding: 20px;
                    margin: 20px 0;
                }

                .server-details {
                    display: grid;
                    gap: 15px;
                    margin-top: 20px;
                }

                .detail-item {
                    display: flex;
                    justify-content: space-between;
                    padding: 10px;
                    border-bottom: 1px solid rgba(255,255,255,0.1);
                }

                .detail-label {
                    font-weight: bold;
                    color: var(--primary-color);
                }

                .detail-value {
                    font-family: monospace;
                    font-size: 1.1rem;
                }

                .endpoint-list {
                    margin-top: 20px;
                    text-align: left;
                }

                .endpoint {
                    background: rgba(108,92,231,0.1);
                    padding: 10px;
                    margin: 10px 0;
                    border-radius: 8px;
                    font-family: monospace;
                    border-left: 3px solid var(--primary-color);
                }

                .endpoint-method {
                    color: var(--success-color);
                    font-weight: bold;
                }

                button {
                    background: linear-gradient(135deg, var(--primary-color), #4a3fb1);
                    color: white;
                    border: none;
                    padding: 12px 30px;
                    border-radius: 25px;
                    font-size: 1rem;
                    cursor: pointer;
                    margin-top: 20px;
                    transition: transform 0.3s, box-shadow 0.3s;
                }

                button:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 10px 20px rgba(108,92,231,0.3);
                }

                .footer {
                    margin-top: 30px;
                    color: var(--text-muted);
                    font-size: 0.9rem;
                }

                .scanning {
                    position: relative;
                    overflow: hidden;
                }

                .scanning::after {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: -100%;
                    width: 100%;
                    height: 100%;
                    background: var(--scan-gradient);
                    animation: scan 2s linear infinite;
                }

                @keyframes scan {
                    0% { left: -100%; }
                    100% { left: 100%; }
                }
            </style>
        </head>
        <body>
            <div class="server-container">
                <div class="status-badge">🟢 SERVIDOR ACTIVO</div>
                <h1>🚀 PEREZ SERVER</h1>
                
                <div class="info-card">
                    <h3>📡 Estado del Servidor</h3>
                    <div class="server-details">
                        <div class="detail-item">
                            <span class="detail-label">Host:</span>
                            <span class="detail-value">localhost</span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">Puerto:</span>
                            <span class="detail-value">${PORT}</span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">Tiempo Activo:</span>
                            <span class="detail-value" id="uptime">Calculando...</span>
                        </div>
                    </div>
                </div>

                <div class="info-card">
                    <h3>🔗 Endpoints Disponibles</h3>
                    <div class="endpoint-list">
                        <div class="endpoint">
                            <span class="endpoint-method">GET</span> / → Página principal
                        </div>
                        <div class="endpoint">
                            <span class="endpoint-method">GET</span> /api/status → Estado del servidor (JSON)
                        </div>
                        <div class="endpoint">
                            <span class="endpoint-method">GET</span> /api/time → Hora del servidor
                        </div>
                    </div>
                </div>

                <button onclick="testAPI()">🔄 Probar Conexión API</button>
                
                <div class="footer">
                    <p>Servidor Express corriendo en PEREZ 🎯</p>
                    <p id="responseTime" style="margin-top: 10px;"></p>
                </div>
            </div>

            <script>
                const startTime = new Date();
                
                // Calcular tiempo activo
                function updateUptime() {
                    const now = new Date();
                    const diff = Math.floor((now - startTime) / 1000);
                    const hours = Math.floor(diff / 3600);
                    const minutes = Math.floor((diff % 3600) / 60);
                    const seconds = diff % 60;
                    document.getElementById('uptime').innerText = 
                        \`\${hours}h \${minutes}m \${seconds}s\`;
                }
                
                setInterval(updateUptime, 1000);
                
                // Función para probar la API
                async function testAPI() {
                    const btn = document.querySelector('button');
                    const originalText = btn.innerText;
                    const container = document.querySelector('.server-container');
                    
                    container.classList.add('scanning');
                    btn.disabled = true;
                    btn.innerText = "⏳ PROBANDO CONEXIÓN...";
                    
                    try {
                        const start = performance.now();
                        const response = await fetch('/api/status');
                        const data = await response.json();
                        const end = performance.now();
                        const responseTime = (end - start).toFixed(2);
                        
                        document.getElementById('responseTime').innerHTML = 
                            \`✅ API respondió en \${responseTime}ms | \${JSON.stringify(data.message)}\`;
                        
                        setTimeout(() => {
                            document.getElementById('responseTime').style.opacity = '0';
                            setTimeout(() => {
                                document.getElementById('responseTime').style.opacity = '1';
                            }, 500);
                        }, 3000);
                        
                    } catch (error) {
                        document.getElementById('responseTime').innerHTML = 
                            \`<span style="color: var(--error-color);">❌ Error: \${error.message}</span>\`;
                    } finally {
                        setTimeout(() => {
                            container.classList.remove('scanning');
                            btn.disabled = false;
                            btn.innerText = originalText;
                        }, 1500);
                    }
                }
            </script>
        </body>
        </html>
    `);
});

// Endpoint de estado (API)
app.get('/api/status', (req, res) => {
    res.json({
        status: 'online',
        server: 'PEREZ Server',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        message: '🚀 Todo funcionando correctamente en PEREZ'
    });
});

// Endpoint de tiempo
app.get('/api/time', (req, res) => {
    res.json({
        serverTime: new Date().toLocaleString(),
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        timestamp: Date.now()
    });
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`
    ╔════════════════════════════════════════╗
    ║     🚀 SERVIDOR PEREZ INICIADO 🚀      ║
    ╠════════════════════════════════════════╣
    ║  📡 URL: http://localhost:${PORT}        ║
    ║  🎯 Estado: ACTIVO                     ║
    ║  💻 Express Server corriendo           ║
    ╚════════════════════════════════════════╝
    `);
});