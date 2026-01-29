// Tab switching functionality
function switchTab(tabName) {
    // Hide all tab content
    const tabContents = document.querySelectorAll('.tab-content');
    tabContents.forEach(content => {
        content.classList.remove('active');
    });
    
    // Remove active class from all buttons
    const tabButtons = document.querySelectorAll('.tab-button');
    tabButtons.forEach(button => {
        button.classList.remove('active');
    });
    
    // Show the selected tab content
    const selectedTab = document.getElementById(tabName);
    if (selectedTab) {
        selectedTab.classList.add('active');
    }
    
    // Add active class to the clicked button
    const clickedButton = Array.from(tabButtons).find(btn => 
        btn.onclick.toString().includes(tabName) || btn.textContent.includes(tabName)
    );
    if (clickedButton) {
        clickedButton.classList.add('active');
    }
    
    // Load content for the selected tab
    switch(tabName) {
        case 'epics':
            loadEpics();
            break;
        case 'cron':
            loadCron();
            break;
        case 'news':
            loadNews();
            break;
        case 'system':
            loadSystem();
            break;
    }
}

// News functionality - Using RSS feeds with CORS proxy
async function loadNews() {
    try {
        const container = document.getElementById('news-container');
        container.innerHTML = '<div class="loading">Loading news...</div>';
        
        // Try to fetch from RSS feed using CORS proxy
        const corsProxy = 'https://api.allorigins.win/raw?url=';
        const rssUrl = 'https://www.rtp.pt/noticias/rss';
        
        try {
            const response = await fetch(corsProxy + encodeURIComponent(rssUrl));
            
            if (!response.ok) {
                throw new Error(`RSS fetch error: ${response.status}`);
            }
            
            const rssText = await response.text();
            
            // Parse the RSS XML
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(rssText, "text/xml");
            
            // Check for parsing errors
            const parserError = xmlDoc.querySelector("parsererror");
            if (parserError) {
                throw new Error("RSS parsing error: Invalid XML");
            }
            
            // Extract items from RSS
            const items = xmlDoc.getElementsByTagName("item");
            let newsItems = [];
            
            for (let i = 0; i < Math.min(items.length, 10); i++) {
                const item = items[i];
                const title = item.getElementsByTagName("title")[0]?.textContent || "No title";
                const description = item.getElementsByTagName("description")[0]?.textContent || "No description";
                const pubDate = item.getElementsByTagName("pubDate")[0]?.textContent || "Unknown date";
                const link = item.getElementsByTagName("link")[0]?.textContent || "#";
                
                // Extract image from description if available
                const imgMatch = description.match(/<img[^>]+src="([^">]+)"/);
                const image = imgMatch ? imgMatch[1] : null;
                
                // Format date
                const date = new Date(pubDate);
                const formattedDate = date.toLocaleDateString('pt-PT', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                });
                
                newsItems.push({
                    title: title,
                    description: description.replace(/<[^>]*>/g, '').substring(0, 200) + '...',
                    date: formattedDate,
                    link: link,
                    image: image
                });
            }
            
            // Generate HTML for news
            let newsHtml = '<div class="news-list">';
            newsItems.forEach(item => {
                // Clean up any HTML entities in the description
                const cleanDescription = item.description.replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&amp;/g, '&');
                
                newsHtml += `
                    <div class="news-item">
                        ${item.image ? `<img src="${item.image}" alt="${item.title}" class="news-image" onerror="this.parentElement.removeChild(this);" onload="this.style.display='block';">` : ''}
                        <div class="news-title"><a href="${item.link}" target="_blank" rel="noopener noreferrer">${item.title}</a></div>
                        <div class="news-date">${item.date}</div>
                        <div class="news-description">${cleanDescription}</div>
                    </div>
                `;
            });
            newsHtml += '</div>';
            
            container.innerHTML = newsHtml;
            
        } catch (rssError) {
            console.warn('RSS fetch failed, falling back to local data:', rssError.message);
            
            // Fallback to local JSON file
            const response = await fetch('data/latest_news.json');
            let newsItems = [];
            
            if (response.ok) {
                newsItems = await response.json();
            } else {
                // Final fallback to sample data
                newsItems = [
                    {
                        title: "Portugal mantém-se como destino turístico em alta",
                        description: "Dados revelam aumento de 15% nas reservas para o próximo verão.",
                        date: "29 Jan 2026, 10:30",
                        link: "https://rtp.pt/noticias",
                        image: "https://via.placeholder.com/300x150/4a90e2/ffffff?text=Turismo"
                    },
                    {
                        title: "Novo centro tecnológico inaugurado em Lisboa",
                        description: "Investimento de 50 milhões de euros promete criar 1000 novos empregos.",
                        date: "29 Jan 2026, 09:15",
                        link: "https://rtp.pt/noticias",
                        image: "https://via.placeholder.com/300x150/50c878/ffffff?text=Tecnologia"
                    },
                    {
                        title: "Campeões nacionais de futebol definidos",
                        description: "Final emocionante termina com vitória por 2-1 após prolongamento.",
                        date: "28 Jan 2026, 21:45",
                        link: "https://rtp.pt/noticias",
                        image: "https://via.placeholder.com/300x150/ff6b6b/ffffff?text=Desporto"
                    },
                    {
                        title: "Cimeira europeia sobre clima termina com compromissos",
                        description: "Líderes europeus concordam em aumentar metas de redução de emissões.",
                        date: "28 Jan 2026, 18:20",
                        link: "https://rtp.pt/noticias",
                        image: "https://via.placeholder.com/300x150/f39c12/ffffff?text=Clima"
                    },
                    {
                        title: "Mercado imobiliário mostra sinais de estabilização",
                        description: "Preços registam primeira descida em dois anos na região de Lisboa.",
                        date: "28 Jan 2026, 15:10",
                        link: "https://rtp.pt/noticias",
                        image: "https://via.placeholder.com/300x150/9b59b6/ffffff?text=Imóveis"
                    }
                ];
            }
            
            // Generate HTML for news
            let newsHtml = '<div class="news-list">';
            newsItems.forEach(item => {
                // Clean up any HTML entities in the description
                const cleanDescription = item.description.replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&amp;/g, '&');
                
                newsHtml += `
                    <div class="news-item">
                        ${item.image ? `<img src="${item.image}" alt="${item.title}" class="news-image" onerror="this.parentElement.removeChild(this);" onload="this.style.display='block';">` : ''}
                        <div class="news-title"><a href="${item.link}" target="_blank" rel="noopener noreferrer">${item.title}</a></div>
                        <div class="news-date">${item.date}</div>
                        <div class="news-description">${cleanDescription}</div>
                    </div>
                `;
            });
            newsHtml += '</div>';
            
            container.innerHTML = newsHtml;
        }
        
    } catch (error) {
        console.error('Error loading news:', error);
        document.getElementById('news-container').innerHTML = `
            <div class="error">
                Error loading news: ${error.message}
                <br>Falling back to sample data.
            </div>
        `;
    }
}

// Epics dashboard functionality
async function loadEpics() {
    try {
        const container = document.getElementById('epics-container');
        container.innerHTML = '<div class="loading">Loading epics...</div>';
        
        // Try to load from various sources in order of preference
        let epics = [];
        
        // First, try to load from localStorage (for persistent data between sessions)
        const storedEpics = localStorage.getItem('moltbot-epics-data');
        if (storedEpics) {
            try {
                epics = JSON.parse(storedEpics);
                console.log('Loaded epics from localStorage');
            } catch (parseError) {
                console.warn('Failed to parse localStorage epics:', parseError);
            }
        }
        
        // If no data in localStorage, try to load from static JSON file
        if (epics.length === 0) {
            try {
                const response = await fetch('data/epics.json');
                if (response.ok) {
                    epics = await response.json();
                    console.log('Loaded epics from static data file');
                    
                    // Store in localStorage for future use
                    localStorage.setItem('moltbot-epics-data', JSON.stringify(epics));
                }
            } catch (fetchError) {
                console.warn('Failed to fetch from static file:', fetchError);
            }
        }
        
        // If still no data, use default sample data
        if (epics.length === 0) {
            epics = [
                {
                    title: "Bob Proctor Transcription Project",
                    description: "Complete transcription of Bob Proctor's 'You Were Born Rich' series with detailed teaching materials",
                    progress: 95,
                    status: "in-progress",
                    tasksCompleted: 19,
                    totalTasks: 20,
                    priority: "high",
                    owner: "Personal Development Team",
                    dueDate: "Feb 15, 2026",
                    persistentMemory: true,
                    memoryLocation: "memory/bob_proctor_transcription.json",
                    lastUpdated: new Date().toISOString()
                },
                {
                    title: "Moltbot Mini App v3.2.7",
                    description: "Enhanced dashboard with real-time data connections and improved UI/UX",
                    progress: 100,
                    status: "completed",
                    tasksCompleted: 28,
                    totalTasks: 28,
                    priority: "high",
                    owner: "Development Team",
                    dueDate: "Jan 29, 2026",
                    persistentMemory: true,
                    memoryLocation: "memory/moltbot_mini_app_v3_2_7.json",
                    lastUpdated: new Date().toISOString()
                },
                {
                    title: "Property Monitoring Agent",
                    description: "Automated system to monitor idealista.pt for new property listings matching criteria",
                    progress: 75,
                    status: "in-progress",
                    tasksCompleted: 15,
                    totalTasks: 20,
                    priority: "medium",
                    owner: "Real Estate Team",
                    dueDate: "Mar 1, 2026",
                    persistentMemory: true,
                    memoryLocation: "memory/property_monitoring_agent.json",
                    lastUpdated: new Date().toISOString()
                },
                {
                    title: "Security Enhancement Protocol",
                    description: "Implement additional security measures for API access and data protection",
                    progress: 40,
                    status: "in-progress",
                    tasksCompleted: 8,
                    totalTasks: 20,
                    priority: "high",
                    owner: "Security Team",
                    dueDate: "Feb 28, 2026",
                    persistentMemory: true,
                    memoryLocation: "memory/security_enhancement.json",
                    lastUpdated: new Date().toISOString()
                }
            ];
            console.log('Using default epic data');
        }
        
        // Generate HTML for epics
        let epicsHtml = '<div class="epic-grid">';
        
        epics.forEach(epic => {
            // Determine status badge class
            let statusClass = 'status-info';
            if (epic.status === 'completed') statusClass = 'status-success';
            if (epic.status === 'in-progress') statusClass = 'status-warning';
            
            // Determine priority class
            let priorityClass = 'priority-medium';
            if (epic.priority === 'high') priorityClass = 'priority-high';
            if (epic.priority === 'low') priorityClass = 'priority-low';
            
            // Calculate completion percentage
            const completionPercentage = Math.round((epic.tasksCompleted / epic.totalTasks) * 100);
            
            // Format the last updated date
            const lastUpdated = new Date(epic.lastUpdated);
            const formattedDate = lastUpdated.toLocaleDateString('pt-PT', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
            
            epicsHtml += `
                <div class="epic-card">
                    <div class="epic-header">
                        <h3 class="epic-title">${epic.title}</h3>
                        <span class="epic-status-badge ${statusClass}">${epic.status.toUpperCase()}</span>
                    </div>
                    
                    <div class="epic-description">
                        ${epic.description}
                    </div>
                    
                    <div class="epic-meta">
                        <div><strong>Progress:</strong> ${completionPercentage}% (${epic.tasksCompleted}/${epic.totalTasks})</div>
                        <div><strong>Due:</strong> ${epic.dueDate}</div>
                        <div><strong>Owner:</strong> ${epic.owner}</div>
                        <div><strong>Priority:</strong> <span class="${priorityClass}">${epic.priority.toUpperCase()}</span></div>
                    </div>
                    
                    <div class="epic-stats">
                        <div>Completion: ${completionPercentage}%</div>
                        <div>Tasks: ${epic.tasksCompleted}/${epic.totalTasks}</div>
                    </div>
                    
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${completionPercentage}%"></div>
                    </div>
                    
                    <div class="timestamp">
                        Last updated: ${formattedDate}
                    </div>
                    
                    <div class="memory-status">
                        ${epic.persistentMemory ? '💾 Persistent Memory: ' + epic.memoryLocation : '⏳ Temporary Memory'}
                    </div>
                </div>
            `;
        });
        
        epicsHtml += '</div>';
        
        container.innerHTML = epicsHtml;
        
    } catch (error) {
        console.error('Error loading epics:', error);
        document.getElementById('epics-container').innerHTML = `
            <div class="error">
                Error loading epic projects: ${error.message}
                <br>Using sample data instead.
            </div>
        `;
    }
}

// System dashboard functionality
async function loadSystem() {
    try {
        const container = document.getElementById('system-container');
        container.innerHTML = '<div class="loading">Loading system info...</div>';
        
        // Get current timestamp
        const now = new Date();
        
        // Simulate system data - in a real implementation this would come from a backend
        const systemData = {
            timestamp: now.toISOString(),
            uptime: "7 days, 3 hours, 24 minutes",
            memory: {
                used: 2.4, // GB
                total: 16.0, // GB
                percent: 15
            },
            cpu: {
                usage: 23, // %
                cores: 8,
                model: "Apple M2 Pro"
            },
            disk: {
                used: 234, // GB
                total: 512, // GB
                percent: 46
            },
            network: {
                download: "45.2 Mbps",
                upload: "12.8 Mbps",
                status: "connected"
            },
            services: [
                { name: "Moltbot Core", status: "running", uptime: "7 days" },
                { name: "Weather Proxy", status: "running", uptime: "7 days" },
                { name: "News Aggregator", status: "running", uptime: "7 days" },
                { name: "Memory Manager", status: "running", uptime: "7 days" },
                { name: "Task Scheduler", status: "running", uptime: "7 days" },
                { name: "Security Monitor", status: "running", uptime: "7 days" }
            ],
            status: "operational"
        };
        
        // Generate HTML for system dashboard
        const systemHtml = `
            <div class="system-grid">
                <div class="system-card">
                    <div class="system-title">📊 System Overview</div>
                    <div class="system-items">
                        <div class="system-item">
                            <div class="system-item-header">
                                <div class="status-text">Status: <span class="status-active">● Operational</span></div>
                            </div>
                            <div class="system-item-details">
                                <div><strong>Uptime:</strong> ${systemData.uptime}</div>
                                <div><strong>Last Update:</strong> ${now.toLocaleString('pt-PT')}</div>
                                <div><strong>Platform:</strong> macOS (Apple Silicon)</div>
                            </div>
                        </div>
                        
                        <div class="system-item">
                            <div class="system-item-header">
                                <div class="status-text">Memory</div>
                            </div>
                            <div class="system-item-details">
                                <div><strong>Used:</strong> ${systemData.memory.used} GB</div>
                                <div><strong>Total:</strong> ${systemData.memory.total} GB</div>
                                <div><strong>Usage:</strong> ${systemData.memory.percent}%</div>
                            </div>
                            <div class="progress-bar" style="margin-top: 10px;">
                                <div class="progress-fill" style="width: ${systemData.memory.percent}%"></div>
                            </div>
                        </div>
                        
                        <div class="system-item">
                            <div class="system-item-header">
                                <div class="status-text">CPU</div>
                            </div>
                            <div class="system-item-details">
                                <div><strong>Usage:</strong> ${systemData.cpu.usage}%</div>
                                <div><strong>Cores:</strong> ${systemData.cpu.cores}</div>
                                <div><strong>Model:</strong> ${systemData.cpu.model}</div>
                            </div>
                            <div class="progress-bar" style="margin-top: 10px;">
                                <div class="progress-fill" style="width: ${systemData.cpu.usage}%"></div>
                            </div>
                        </div>
                        
                        <div class="system-item">
                            <div class="system-item-header">
                                <div class="status-text">Disk</div>
                            </div>
                            <div class="system-item-details">
                                <div><strong>Used:</strong> ${systemData.disk.used} GB</div>
                                <div><strong>Total:</strong> ${systemData.disk.total} GB</div>
                                <div><strong>Usage:</strong> ${systemData.disk.percent}%</div>
                            </div>
                            <div class="progress-bar" style="margin-top: 10px;">
                                <div class="progress-fill" style="width: ${systemData.disk.percent}%"></div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="system-card">
                    <div class="system-title">🌐 Network & Services</div>
                    <div class="system-items">
                        <div class="system-item">
                            <div class="system-item-header">
                                <div class="status-text">Network</div>
                            </div>
                            <div class="system-item-details">
                                <div><strong>Download:</strong> ${systemData.network.download}</div>
                                <div><strong>Upload:</strong> ${systemData.network.upload}</div>
                                <div><strong>Status:</strong> ${systemData.network.status}</div>
                            </div>
                        </div>
                        
                        <div class="system-item">
                            <div class="system-item-header">
                                <div class="status-text">Services</div>
                            </div>
                            <div class="system-item-details">
                                ${systemData.services.map(service => `
                                    <div style="display: flex; justify-content: space-between; width: 100%;">
                                        <span>${service.name}</span>
                                        <span style="color: #4CAF50;">${service.status}</span>
                                    </div>
                                    <div style="grid-column: span 2; font-size: 0.8em; color: #aaa;">Uptime: ${service.uptime}</div>
                                `).join('')}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        container.innerHTML = systemHtml;
        
    } catch (error) {
        console.error('Error loading system info:', error);
        document.getElementById('system-container').innerHTML = `
            <div class="error">
                Error loading system information: ${error.message}
                <br>Using sample data instead.
            </div>
        `;
    }
}

// Cron dashboard functionality
async function loadCron() {
    try {
        const container = document.getElementById('cron-container');
        container.innerHTML = '<div class="loading">Loading cron jobs...</div>';
        
        // Simulate cron job data - in a real implementation this would come from a backend
        const cronData = {
            jobs: [
                {
                    id: "weather_update",
                    name: "Weather Data Update",
                    schedule: "Every 15 minutes",
                    lastRun: "2026-01-29 15:45:22",
                    status: "success",
                    nextRun: "2026-01-29 15:59:59",
                    executions: 1247
                },
                {
                    id: "news_refresh",
                    name: "News Feed Refresh",
                    schedule: "Every 30 minutes",
                    lastRun: "2026-01-29 15:30:15",
                    status: "success",
                    nextRun: "2026-01-29 16:00:00",
                    executions: 832
                },
                {
                    id: "memory_cleanup",
                    name: "Memory Cleanup",
                    schedule: "Daily at 02:00",
                    lastRun: "2026-01-29 02:00:05",
                    status: "success",
                    nextRun: "2026-01-30 02:00:00",
                    executions: 29
                },
                {
                    id: "backup_system",
                    name: "System Backup",
                    schedule: "Weekly on Sunday 01:00",
                    lastRun: "2026-01-25 01:00:12",
                    status: "success",
                    nextRun: "2026-02-01 01:00:00",
                    executions: 4
                },
                {
                    id: "heartbeat_check",
                    name: "Heartbeat Monitor",
                    schedule: "Every 5 minutes",
                    lastRun: "2026-01-29 15:55:03",
                    status: "success",
                    nextRun: "2026-01-29 16:00:00",
                    executions: 3741
                }
            ],
            stats: {
                totalJobs: 5,
                activeJobs: 5,
                lastRunJob: "heartbeat_check",
                nextRunJob: "weather_update"
            }
        };
        
        // Generate HTML for cron dashboard
        let cronHtml = `
            <div class="system-grid">
                <div class="system-card">
                    <div class="system-title">📋 Cron Job Statistics</div>
                    <div class="system-items">
                        <div class="system-item">
                            <div class="system-item-header">
                                <div class="status-text">Overview</div>
                            </div>
                            <div class="system-item-details">
                                <div><strong>Total Jobs:</strong> ${cronData.stats.totalJobs}</div>
                                <div><strong>Active Jobs:</strong> ${cronData.stats.activeJobs}</div>
                                <div><strong>Last Executed:</strong> ${cronData.stats.lastRunJob}</div>
                                <div><strong>Next Job:</strong> ${cronData.stats.nextRunJob}</div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="system-card">
                    <div class="system-title">⏰ Active Cron Jobs</div>
                    <div class="system-items">
        `;
        
        cronData.jobs.forEach(job => {
            let statusClass = 'status-active';
            if (job.status === 'failed') statusClass = 'status-inactive';
            if (job.status === 'warning') statusClass = 'status-warning';
            
            cronHtml += `
                        <div class="system-item">
                            <div class="system-item-header">
                                <div class="status-text">${job.name}</div>
                                <div class="status-indicator ${statusClass}"></div>
                            </div>
                            <div class="system-item-details">
                                <div><strong>ID:</strong> ${job.id}</div>
                                <div><strong>Schedule:</strong> ${job.schedule}</div>
                                <div><strong>Last Run:</strong> ${job.lastRun}</div>
                                <div><strong>Next Run:</strong> ${job.nextRun}</div>
                                <div><strong>Executions:</strong> ${job.executions}</div>
                                <div><strong>Status:</strong> <span style="color: ${job.status === 'success' ? '#4CAF50' : job.status === 'warning' ? '#FF9800' : '#F44336'}">${job.status.toUpperCase()}</span></div>
                            </div>
                        </div>
            `;
        });
        
        cronHtml += `
                    </div>
                </div>
            </div>
        `;
        
        container.innerHTML = cronHtml;
        
    } catch (error) {
        console.error('Error loading cron jobs:', error);
        document.getElementById('cron-container').innerHTML = `
            <div class="error">
                Error loading cron jobs: ${error.message}
                <br>Using sample data instead.
            </div>
        `;
    }
}

// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
    // Load the active tab content
    loadEpics(); // Default to epics tab since it's first
    
    // Set up auto-refresh (would be implemented with real API)
    // setInterval(loadEpics, 300000); // Refresh every 5 minutes
});

// Handle window resize for responsive design
window.addEventListener('resize', function() {
    // Adjust layout as needed
    if (window.innerWidth < 768) {
        // Mobile adjustments
        const tabButtons = document.querySelectorAll('.tab-button');
        tabButtons.forEach(button => {
            button.style.margin = '5px 0';
            button.style.width = '100%';
        });
    }
});