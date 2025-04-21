// ======= ИНИЦИАЛИЗАЦИЯ СТРАНИЦЫ =======
document.addEventListener('DOMContentLoaded', function() {
    // Генерация навигационного меню
    generateNavMenu();
    
    // Генерация блоков команд 
    generateCommandBlocks();
    
    // Добавление правого блока навигации
    generateRightNav();
    
    // Добавление обработчиков событий
    setupEventListeners();
    
    // Анимация при загрузке страницы
    animateOnLoad();

    // Проверка hash в URL и прокрутка к соответствующему элементу
    handleInitialNavigation();
    
    // Инициализация секции версий ПО
    initSoftwareVersions();
    
    // Инициализация файловой системы
    initFileSystem();
    
    // Важно: немедленно показать все команды при загрузке страницы
    showAllCommands();
    
    // Инициализируем API для внешнего управления
    initCommandAPI();
    
    // Добавляем переключатель для мобильного меню
    setupMobileMenu();
    
    // Добавляем новые инициализации
    initScrollProgress();
    initQuickToolbar();
    initKeyboardShortcuts();
    initCodeHighlighting();
    enhanceRightNavigation();
    
    // Инициализируем улучшенное поведение FAQ
    initFaqSection();
    
    // Handle resources section checklist button
    const showChecklistBtn = document.getElementById('show-checklist');
    if (showChecklistBtn) {
        showChecklistBtn.addEventListener('click', function(e) {
            e.preventDefault();
            alert('Контрольный список безопасности сервера Debian:\n\n' +
                  '✓ Регулярно обновляйте систему\n' +
                  '✓ Используйте сильные пароли\n' +
                  '✓ Настройте брандмауэр (iptables/ufw)\n' +
                  '✓ Установите и настройте fail2ban\n' +
                  '✓ Отключите ненужные сервисы\n' +
                  '✓ Используйте SSH-ключи вместо паролей\n' +
                  '✓ Регулярно проверяйте логи системы\n' +
                  '✓ Создавайте резервные копии важных данных\n' +
                  '✓ Проводите аудит безопасности');
        });
    }
    
    // Инициализация архитектуры системы
    initSystemArchitecture();
    
    // Инициализация файловой системы
    initFileSystemStructure();
});

// ======= ГЕНЕРАЦИЯ НАВИГАЦИИ С ИКОНКАМИ И КАТЕГОРИЯМИ =======
function generateNavMenu() {
    const navMenu = document.getElementById('nav-menu');
    
    // Добавляем заголовок навигации
    const navTitle = document.createElement('div');
    navTitle.className = 'nav-title';
    navTitle.textContent = 'Руководство по Debian';
    navMenu.parentElement.insertBefore(navTitle, navMenu);
    
    // Создаем список для правой навигации
    const rightNavItemIds = ['intro', 'command-reference', 'software-versions', 'logs-data-info', 'faq-section', 'resources-section'];
    
    navItems.forEach(item => {
        // Пропускаем элементы, которые будут в правой навигации
        if (rightNavItemIds.includes(item.id)) {
            return;
        }
        
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.href = `#${item.id}`;
        
        // Добавление иконок и категорий
        if (item.icon) {
            const icon = document.createElement('i');
            icon.className = item.icon;
            a.appendChild(icon);
        }
        
        const span = document.createElement('span');
        span.textContent = item.title;
        a.appendChild(span);
        
        // Добавление категории как атрибута для стилизации
        if (item.category) {
            a.dataset.category = item.category;
        } else {
            // Автоматическое определение категории по ID
            if (item.id.includes('postgres') || item.id.includes('mysql') || item.id.includes('sql')) {
                a.dataset.category = 'database';
            } else if (item.id.includes('security') || item.id.includes('tpm') || item.id.includes('luks')) {
                a.dataset.category = 'security';
            } else if (item.id.includes('nginx') || item.id.includes('web')) {
                a.dataset.category = 'web';
            } else if (item.id.includes('raid') || item.id.includes('storage')) {
                a.dataset.category = 'storage';
            } else if (item.id.includes('asterisk')) {
                a.dataset.category = 'telephony';
            } else {
                a.dataset.category = 'system';
            }
        }
        
        if (window.location.hash === `#${item.id}`) {
            a.classList.add('active');
        }
        
        li.appendChild(a);
        navMenu.appendChild(li);
    });
}

// Новая функция для генерации правого блока навигации
function generateRightNav() {
    // Проверяем, существует ли уже блок правой навигации
    if (document.querySelector('.right-nav')) {
        return;
    }
    
    // Создаем блок правой навигации
    const rightNav = document.createElement('div');
    rightNav.className = 'right-nav';
    
    // Добавляем заголовок
    const rightNavTitle = document.createElement('div');
    rightNavTitle.className = 'right-nav-title';
    rightNavTitle.textContent = 'Важные разделы';
    rightNav.appendChild(rightNavTitle);
    
    // Создаем список для навигации
    const navList = document.createElement('ul');
    
    // Массив ID элементов, которые должны быть в правой навигации
    const rightNavItemIds = ['intro', 'command-reference', 'software-versions', 'logs-data-info', 'system-architecture', 'faq-section', 'resources-section'];
    
    // Находим элементы для правой навигации
    rightNavItemIds.forEach(id => {
        const item = navItems.find(item => item.id === id) || 
                     {id: 'faq-section', title: 'Часто задаваемые вопросы', icon: 'fa-solid fa-question-circle'} ||
                     {id: 'resources-section', title: 'Полезные ресурсы', icon: 'fa-solid fa-link'};
        
        if (item) {
            const li = document.createElement('li');
            const a = document.createElement('a');
            a.href = `#${item.id}`;
            
            // Добавление иконок
            if (item.icon) {
                const icon = document.createElement('i');
                icon.className = item.icon;
                a.appendChild(icon);
            } else {
                // Дефолтные иконки для специальных разделов с улучшенным дизайном
                if (item.id === 'command-reference') {
                    const icon = document.createElement('i');
                    icon.className = 'fa-solid fa-book';
                    icon.style.color = '#7066ef';
                    a.appendChild(icon);
                } else if (item.id === 'software-versions') {
                    const icon = document.createElement('i');
                    icon.className = 'fa-solid fa-code-branch';
                    icon.style.color = '#10b981';
                    a.appendChild(icon);
                } else if (item.id === 'intro') {
                    const icon = document.createElement('i');
                    icon.className = 'fa-solid fa-home';
                    icon.style.color = '#3b82f6';
                    a.appendChild(icon);
                } else if (item.id === 'logs-data-info') {
                    const icon = document.createElement('i');
                    icon.className = 'fa-solid fa-folder-tree';
                    icon.style.color = '#f59e0b';
                    a.appendChild(icon);
                } else if (item.id === 'faq-section') {
                    const icon = document.createElement('i');
                    icon.className = 'fa-solid fa-question-circle';
                    icon.style.color = '#d946ef'; // Фиолетовый для FAQ
                    a.appendChild(icon);
                } else if (item.id === 'resources-section') {
                    const icon = document.createElement('i');
                    icon.className = 'fa-solid fa-link';
                    icon.style.color = '#0891b2'; // Синий для ресурсов
                    a.appendChild(icon);
                }
            }
            
            const span = document.createElement('span');
            span.textContent = item.title;
            a.appendChild(span);
            
            // Улучшенные стили для специальных разделов с более яркими цветами
            if (item.id === 'intro') {
                a.style.borderLeft = '3px solid #3b82f6';
                a.dataset.sectionColor = '#3b82f6';
            } else if (item.id === 'command-reference') {
                a.style.borderLeft = '3px solid #7066ef';
                a.dataset.sectionColor = '#7066ef';
            } else if (item.id === 'software-versions') {
                a.style.borderLeft = '3px solid #10b981';
                a.dataset.sectionColor = '#10b981';
            } else if (item.id === 'logs-data-info') {
                a.style.borderLeft = '3px solid #f59e0b';
                a.dataset.sectionColor = '#f59e0b';
            } else if (item.id === 'faq-section') {
                a.style.borderLeft = '3px solid #d946ef';
                a.dataset.sectionColor = '#d946ef';
            } else if (item.id === 'resources-section') {
                a.style.borderLeft = '3px solid #0891b2';
                a.dataset.sectionColor = '#0891b2';
            }
            
            if (window.location.hash === `#${item.id}`) {
                a.classList.add('active');
            }
            
            li.appendChild(a);
            navList.appendChild(li);
        }
    });
    
    rightNav.appendChild(navList);
    document.body.appendChild(rightNav);
    
    // Добавляем обработчики событий для правой навигации с анимацией и визуальными эффектами
    rightNav.querySelectorAll('a').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                // Удаляем активный класс у всех секций
                document.querySelectorAll('#intro, #command-reference, #software-versions, #logs-data-info, #faq-section, #resources-section')
                    .forEach(section => section.classList.remove('section-active'));
                
                // Добавляем активный класс текущей секции с небольшой задержкой
                setTimeout(() => {
                    targetElement.classList.add('section-active');
                }, 100);
                
                window.scrollTo({
                    top: targetElement.offsetTop - 70,
                    behavior: 'smooth'
                });
                
                history.pushState(null, null, this.getAttribute('href'));
                updateActiveLinks(targetId);
                
                // Добавляем визуальный эффект нажатия
                this.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    this.style.transform = '';
                }, 200);
            }
        });
        
        // Добавляем эффект при наведении
        anchor.addEventListener('mouseenter', function() {
            const color = this.dataset.sectionColor || '#7066ef';
            this.style.boxShadow = `0 0 0 1px ${color}40`;
        });
        
        anchor.addEventListener('mouseleave', function() {
            this.style.boxShadow = '';
        });
    });
}

// ======= ГЕНЕРАЦИЯ БЛОКОВ КОМАНД =======
function generateCommandBlocks() {
    const commandsContainer = document.getElementById('commands-container');
    
    commandBlocks.forEach(block => {
        // Создаем секцию блока
        const section = document.createElement('section');
        section.className = 'command-block';
        section.id = block.id;
        
        // Создаем заголовок
        const heading = document.createElement('h3');
        heading.innerHTML = `<i class="${block.icon}"></i> ${block.title}`;
        section.appendChild(heading);
        
        // Создаем список шагов
        const stepsList = document.createElement('div');
        stepsList.className = 'command-steps';
        
        block.steps.forEach((step, index) => {
            const stepItem = document.createElement('div');
            stepItem.className = 'step-item';
            
            // Заголовок шага
            const stepHeader = document.createElement('div');
            stepHeader.className = 'step-header';
            stepHeader.textContent = step.description;
            stepItem.appendChild(stepHeader);
            
            // Терминал с командой
            const terminal = document.createElement('div');
            terminal.className = 'terminal';
            
            // Заголовок терминала
            const terminalHeader = document.createElement('div');
            terminalHeader.className = 'terminal-header';
            
            const terminalDots = document.createElement('div');
            terminalDots.className = 'terminal-dots';
            
            ['red', 'yellow', 'green'].forEach(color => {
                const dot = document.createElement('div');
                dot.className = `dot dot-${color}`;
                terminalDots.appendChild(dot);
            });
            
            const terminalTitle = document.createElement('div');
            terminalTitle.className = 'terminal-title';
            terminalTitle.textContent = 'Terminal';
            
            terminalHeader.appendChild(terminalDots);
            terminalHeader.appendChild(terminalTitle);
            terminal.appendChild(terminalHeader);
            
            // Содержимое терминала
            const terminalContent = document.createElement('div');
            terminalContent.className = 'terminal-content';
            
            // Обрабатываем команды с переносами строк
            const commands = step.command.split('\n');
            
            commands.forEach(cmd => {
                const terminalLine = document.createElement('div');
                terminalLine.innerHTML = `<span class="terminal-prompt">$</span><span class="terminal-command">${escapedHtml(cmd)}</span>`;
                terminalContent.appendChild(terminalLine);
            });
            
            if (step.comment) {
                const commentLine = document.createElement('div');
                commentLine.className = 'command-comment';
                commentLine.textContent = `# ${step.comment}`;
                terminalContent.appendChild(commentLine);
            }
            
            terminal.appendChild(terminalContent);
            
            // Кнопка копирования
            const copyBtn = document.createElement('button');
            copyBtn.className = 'copy-btn';
            copyBtn.innerHTML = '<i class="fa-regular fa-clipboard"></i>';
            copyBtn.dataset.commands = step.command;
            copyBtn.title = 'Копировать команду';
            terminal.appendChild(copyBtn);
            
            stepItem.appendChild(terminal);
            
            // Добавляем шаг в список
            stepsList.appendChild(stepItem);
        });
        
        section.appendChild(stepsList);
        
        // Добавляем общее описание блока
        if (block.description) {
            const description = document.createElement('div');
            description.className = 'command-description';
            
            const descriptionTitle = document.createElement('div');
            descriptionTitle.className = 'description-title';
            descriptionTitle.textContent = 'Что делает этот блок команд:';
            
            const descriptionText = document.createElement('p');
            descriptionText.textContent = block.description;
            
            description.appendChild(descriptionTitle);
            description.appendChild(descriptionText);
            section.appendChild(description);
        }
        
        // Добавляем примечания, если они есть
        if (block.notes) {
            const notes = document.createElement('div');
            notes.className = 'info-box';
            
            const notesIcon = document.createElement('i');
            notesIcon.className = 'fa-solid fa-circle-info info-icon';
            
            const notesContent = document.createElement('div');
            const notesTitle = document.createElement('h4');
            notesTitle.textContent = 'Примечание';
            
            const notesText = document.createElement('p');
            notesText.textContent = block.notes;
            
            notesContent.appendChild(notesTitle);
            notesContent.appendChild(notesText);
            
            notes.appendChild(notesIcon);
            notes.appendChild(notesContent);
            
            section.appendChild(notes);
        }
        
        // Добавляем предупреждения, если они есть
        if (block.warnings) {
            const warnings = document.createElement('div');
            warnings.className = 'warning-box';
            
            const warningsIcon = document.createElement('i');
            warningsIcon.className = 'fa-solid fa-triangle-exclamation warning-icon';
            
            const warningsContent = document.createElement('div');
            const warningsTitle = document.createElement('h4');
            warningsTitle.textContent = 'Внимание!';
            
            const warningsText = document.createElement('p');
            warningsText.textContent = block.warnings;
            
            warningsContent.appendChild(warningsTitle);
            warningsContent.appendChild(warningsText);
            
            warnings.appendChild(warningsIcon);
            warnings.appendChild(warningsContent);
            
            section.appendChild(warnings);
        }
        
        if (block.id === 'logs-data-info') {
            const fileTreeContainer = document.createElement('div');
            fileTreeContainer.className = 'file-tree-container';
            
            const fileTree = createFileTree();
            fileTreeContainer.appendChild(fileTree);
            
            section.appendChild(fileTreeContainer);
        }
        
        // Добавляем блок в контейнер
        commandsContainer.appendChild(section);
    });
}

// Функция для экранирования HTML
function escapedHtml(text) {
    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

// ======= НАСТРОЙКА ОБРАБОТЧИКОВ СОБЫТИЙ =======
function setupEventListeners() {
    // Обработчик для кнопок копирования
    document.querySelectorAll('.copy-btn').forEach(button => {
        button.addEventListener('click', function() {
            const commandText = this.dataset.commands;
            copyToClipboard(commandText);
            showNotification();
            
            // Анимация кнопки при клике
            this.classList.add('copied');
            setTimeout(() => {
                this.classList.remove('copied');
            }, 500);
        });
    });
    
    // Обработчик для плавной прокрутки при клике на ссылки навигации
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 70, // Учитываем высоту фиксированной навигации
                    behavior: 'smooth'
                });
                
                // Обновляем URL без перезагрузки страницы
                history.pushState(null, null, this.getAttribute('href'));
                
                // Обновляем активные ссылки
                updateActiveLinks(targetId);
            }
        });
    });
    
    // Выделение активного пункта навигации при прокрутке
    window.addEventListener('scroll', highlightActiveNavItemEnhanced);
    
    // Анимация появления терминалов при скроллинге
    window.addEventListener('scroll', animateOnScroll);
    
    // Обработка изменения хэша в URL
    window.addEventListener('hashchange', function() {
        const targetId = window.location.hash.substring(1);
        if (targetId) {
            updateActiveLinks(targetId);
        }
    });
    
    // Добавляем инициализацию справочника команд
    generateCommandReference();
    
    // Fix command filters
    document.querySelectorAll('.filter-btn').forEach(button => {
        button.addEventListener('click', function() {
            const filter = this.dataset.filter;
            
            // Remove active class from all buttons
            document.querySelectorAll('.filter-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Clear the command list
            const commandList = document.getElementById('command-list');
            commandList.innerHTML = '';
            
            // Filter and display commands
            const filteredCommands = filter === 'all' 
                ? commandReference 
                : commandReference.filter(cmd => cmd.category === filter);
            
            // Create cards for filtered commands
            filteredCommands.forEach(cmd => {
                const card = createCommandCard(cmd);
                commandList.appendChild(card);
            });
        });
    });
}

// Обновление активных ссылок
function updateActiveLinks(targetId) {
    document.querySelectorAll('#nav-menu a').forEach(link => {
        link.classList.remove('active');
        
        if (link.getAttribute('href') === `#${targetId}`) {
            link.classList.add('active');
        }
    });
}

// Обработка начальной навигации с добавлением анимации активной секции
function handleInitialNavigation() {
    const hash = window.location.hash;
    if (hash) {
        const targetId = hash.substring(1);
        const targetElement = document.getElementById(targetId);
        
        if (targetElement) {
            // Добавляем небольшую задержку, чтобы все успело прогрузиться
            setTimeout(() => {
                window.scrollTo({
                    top: targetElement.offsetTop - 70,
                    behavior: 'smooth'
                });
                
                // Подсвечиваем активный пункт меню
                document.querySelectorAll('#nav-menu a, .right-nav a').forEach(link => {
                    link.classList.remove('active');
                    
                    if (link.getAttribute('href') === `#${targetId}`) {
                        link.classList.add('active');
                    }
                });
                
                // Анимируем активную секцию
                const importantSections = ['intro', 'command-reference', 'software-versions', 'logs-data-info', 'faq-section', 'resources-section'];
                if (importantSections.includes(targetId)) {
                    targetElement.classList.add('section-active');
                }
            }, 300);
        }
    }
}

// ======= ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ =======
// Расширенная функция для выделения активных элементов в обоих навигационных меню
function highlightActiveNavItemEnhanced() {
    const scrollPosition = window.scrollY + 100;
    
    // Проверяем блок "Введение"
    const intro = document.getElementById('intro');
    if (intro && scrollPosition < intro.offsetTop + intro.offsetHeight) {
        setActiveNavItem('intro');
        animateSection('intro');
        return;
    }
    
    // Проверяем блок "Справочник команд"
    const reference = document.getElementById('command-reference');
    if (reference && scrollPosition >= reference.offsetTop && 
        scrollPosition < reference.offsetTop + reference.offsetHeight) {
        setActiveNavItem('command-reference');
        animateSection('command-reference');
        return;
    }
    
    // Проверяем блок "Версии ПО"
    const versions = document.getElementById('software-versions');
    if (versions && scrollPosition >= versions.offsetTop && 
        scrollPosition < versions.offsetTop + versions.offsetHeight) {
        setActiveNavItem('software-versions');
        animateSection('software-versions');
        return;
    }
    
    // Проверяем блок "Файлы и логи"
    const logs = document.getElementById('logs-data-info');
    if (logs && scrollPosition >= logs.offsetTop && 
        scrollPosition < logs.offsetTop + logs.offsetHeight) {
        setActiveNavItem('logs-data-info');
        animateSection('logs-data-info');
        return;
    }
    
    // Проверяем блок "FAQ"
    const faq = document.getElementById('faq-section');
    if (faq && scrollPosition >= faq.offsetTop && 
        scrollPosition < faq.offsetTop + faq.offsetHeight) {
        setActiveNavItem('faq-section');
        animateSection('faq-section');
        return;
    }
    
    // Проверяем блок "Ресурсы"
    const resources = document.getElementById('resources-section');
    if (resources && scrollPosition >= resources.offsetTop && 
        scrollPosition < resources.offsetTop + resources.offsetHeight) {
        setActiveNavItem('resources-section');
        animateSection('resources-section');
        return;
    }
    
    // Находим текущий активный блок команд
    let activeBlock = null;
    
    document.querySelectorAll('.command-block').forEach(block => {
        if (scrollPosition >= block.offsetTop && 
            scrollPosition < block.offsetTop + block.offsetHeight) {
            activeBlock = block.id;
        }
    });
    
    if (activeBlock) {
        setActiveNavItem(activeBlock);
    }
    
    // Добавляем плавное появление подсказок при наведении
    document.querySelectorAll('#nav-menu a, .right-nav a').forEach(link => {
        // Создаем подсказку при наведении
        link.addEventListener('mouseenter', function() {
            // Получаем текст из ссылки
            const text = this.querySelector('span').textContent;
            
            // Создаем элемент подсказки если его еще нет
            if (!document.querySelector('.tooltip-hint')) {
                const tooltip = document.createElement('div');
                tooltip.className = 'tooltip-hint';
                tooltip.textContent = text;
                document.body.appendChild(tooltip);
                
                // Позиционируем подсказку
                const rect = this.getBoundingClientRect();
                tooltip.style.position = 'fixed';
                tooltip.style.left = rect.right + 10 + 'px';
                tooltip.style.top = rect.top + (rect.height / 2) - 15 + 'px';
                tooltip.style.backgroundColor = 'rgba(0,0,0,0.8)';
                tooltip.style.color = 'white';
                tooltip.style.padding = '8px 12px';
                tooltip.style.borderRadius = '5px';
                tooltip.style.fontSize = '0.9rem';
                tooltip.style.zIndex = '1000';
                tooltip.style.opacity = '0';
                tooltip.style.transition = 'opacity 0.3s ease';
                
                // Анимируем появление
                setTimeout(() => {
                    tooltip.style.opacity = '1';
                }, 50);
            }
        });
        
        // Удаляем подсказку при уходе курсора
        link.addEventListener('mouseleave', function() {
            const tooltip = document.querySelector('.tooltip-hint');
            if (tooltip) {
                tooltip.style.opacity = '0';
                setTimeout(() => {
                    tooltip.remove();
                }, 300);
            }
        });
    });
}

// Установка активного пункта навигации в обоих меню
function setActiveNavItem(id) {
    // Обновляем активные элементы в левом меню
    document.querySelectorAll('#nav-menu a').forEach(link => {
        link.classList.remove('active');
        
        if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
        }
    });
    
    // Обновляем активные элементы в правом меню
    document.querySelectorAll('.right-nav a').forEach(link => {
        link.classList.remove('active');
        
        if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
        }
    });
}

// Анимация секции при переходе к ней
function animateSection(id) {
    const importantSections = ['intro', 'command-reference', 'software-versions', 'logs-data-info', 'faq-section', 'resources-section'];
    
    // Удаляем класс активности у всех секций
    importantSections.forEach(sectionId => {
        const section = document.getElementById(sectionId);
        if (section) {
            section.classList.remove('section-active');
        }
    });
    
    // Добавляем класс активности к текущей секции
    const currentSection = document.getElementById(id);
    if (currentSection && importantSections.includes(id)) {
        currentSection.classList.add('section-active');
    }
}

// ======= ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ =======
// Копирование в буфер обмена
function copyToClipboard(text) {
    navigator.clipboard.writeText(text)
        .catch(err => {
            console.error('Не удалось скопировать текст в буфер обмена:', err);
            // Запасной вариант для старых браузеров
            const textarea = document.createElement('textarea');
            textarea.value = text;
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
        });
}

// Показ уведомления о копировании
function showNotification(message = 'Скопировано в буфер обмена') {
    const notification = document.getElementById('notification');
    notification.classList.remove('hidden');
    notification.classList.add('show');
    notification.textContent = message;
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.classList.add('hidden');
        }, 300);
    }, 2000);
}

// Анимация при загрузке страницы
function animateOnLoad() {
    document.querySelectorAll('.command-block').forEach((block, index) => {
        setTimeout(() => {
            block.style.opacity = '0';
            block.style.transform = 'translateY(20px)';
            
            // Плавное появление с задержкой
            setTimeout(() => {
                block.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                block.style.opacity = '1';
                block.style.transform = 'translateY(0)';
            }, 100);
        }, index * 150);
    });
    
    // Анимация для справочника команд
    const commandRef = document.getElementById('command-reference');
    if (commandRef) {
        setTimeout(() => {
            commandRef.style.opacity = '0';
            commandRef.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                commandRef.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                commandRef.style.opacity = '1';
                commandRef.style.transform = 'translateY(0)';
            }, 100);
        }, commandBlocks.length * 150 + 100);
    }
}

// Анимация при скроллинге
function animateOnScroll() {
    const terminals = document.querySelectorAll('.terminal');
    
    terminals.forEach(terminal => {
        const terminalPosition = terminal.getBoundingClientRect();
        
        // Если терминал видим на экране
        if (terminalPosition.top < window.innerHeight - 100 && terminalPosition.bottom > 0) {
            if (!terminal.classList.contains('animate-in')) {
                terminal.classList.add('animate-in');
            }
        }
    });
    
    // Анимация карточек команд
    const commandCards = document.querySelectorAll('.command-card');
    
    commandCards.forEach(card => {
        const cardPosition = card.getBoundingClientRect();
        
        if (cardPosition.top < window.innerHeight - 50 && cardPosition.bottom > 0) {
            if (!card.classList.contains('animate-in')) {
                card.classList.add('animate-in');
                card.style.animation = 'fadeInUp 0.5s ease forwards';
            }
        }
    });
}

// Новая функция для немедленного отображения всех команд
function showAllCommands() {
    const commandList = document.getElementById('command-list');
    if (commandList) {
        commandList.innerHTML = '';
        
        // Устанавливаем активный фильтр на "Все команды"
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        const allCommandsBtn = document.querySelector('.filter-btn[data-filter="all"]');
        if (allCommandsBtn) {
            allCommandsBtn.classList.add('active');
        }
        
        // Создаем карточки для всех команд
        commandReference.forEach(cmd => {
            const card = createCommandCard(cmd);
            commandList.appendChild(card);
        });
    }
}

// Функция для инициализации секции версий ПО
function initSoftwareVersions() {
    const softwareList = document.getElementById('software-list');
    const categoryButtons = document.querySelectorAll('.category-btn');
    
    if (!softwareList || !categoryButtons.length) return;
    
    // Добавляем header-banner для лучшего выделения раздела
    const softwareSection = document.getElementById('software-versions');
    if (softwareSection) {
        const headerBanner = document.createElement('div');
        headerBanner.className = 'section-header-banner software-banner';
        headerBanner.innerHTML = `
            <i class="fa-solid fa-code-branch"></i>
            <span>Версии программного обеспечения</span>
        `;
        softwareSection.insertBefore(headerBanner, softwareSection.firstChild);
    }
    
    // Обработчики для кнопок категорий
    categoryButtons.forEach(button => {
        button.addEventListener('click', () => {
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            const category = button.dataset.category;
            displaySoftware(category);
        });
    });
    
    // Первоначальное отображение всего ПО
    // Убедимся, что кнопка "Все" активна
    const allButton = document.querySelector('.category-btn[data-category="all"]');
    if (allButton) {
        allButton.classList.add('active');
    }
    
    displaySoftware('all');
}

// Функция отображения карточек ПО
function displaySoftware(category = 'all') {
    const softwareList = document.getElementById('software-list');
    if (!softwareList) return;
    
    softwareList.innerHTML = '';
    
    // Добавляем системную информацию
    if (category === 'all' || category === 'base') {
        addSoftwareCard(softwareVersions.system);
    }
    
    // Добавляем веб-сервер
    if (category === 'all' || category === 'web') {
        addSoftwareCard(softwareVersions.webServer);
    }
    
    // Добавляем PHP
    if (category === 'all' || category === 'programming') {
        addSoftwareCard(softwareVersions.php);
        addSoftwareCard(softwareVersions.php74);
    }
    
    // Добавляем базы данных
    if (category === 'all' || category === 'database') {
        softwareVersions.database.forEach(db => addSoftwareCard(db));
    }
    
    // Добавляем утилиты
    softwareVersions.utils.forEach(util => {
        if (category === 'all' || util.category === category) {
            addSoftwareCard(util);
        }
    });
    
    // Проверяем, есть ли результаты
    if (softwareList.children.length === 0) {
        const noResults = document.createElement('div');
        noResults.className = 'no-results';
        noResults.textContent = 'Не найдено программного обеспечения в этой категории.';
        softwareList.appendChild(noResults);
    }
}

// Функция создания карточки ПО
function addSoftwareCard(software) {
    const softwareList = document.getElementById('software-list');
    
    const card = document.createElement('div');
    card.className = `software-card ${software.category}`;
    
    const header = document.createElement('div');
    header.className = 'software-card-header';
    header.innerHTML = `
        <span>${software.name}</span>
        <span class="software-version">${software.version}</span>
    `;
    
    const body = document.createElement('div');
    body.className = 'software-card-body';
    
    const description = document.createElement('div');
    description.className = 'software-description';
    description.textContent = software.description;
    
    body.appendChild(description);
    
    if (software.details) {
        const details = document.createElement('div');
        details.className = 'software-details';
        details.textContent = software.details;
        body.appendChild(details);
    }
    
    if (software.modules) {
        const modules = document.createElement('div');
        modules.className = 'software-modules';
        software.modules.forEach(module => {
            const tag = document.createElement('span');
            tag.className = 'module-tag';
            tag.textContent = module;
            modules.appendChild(tag);
        });
        body.appendChild(modules);
    }
    
    card.appendChild(header);
    card.appendChild(body);
    softwareList.appendChild(card);
}

// Функция фильтрации ПО по категории
function filterSoftware(category) {
    const cards = document.querySelectorAll('.software-card');
    
    cards.forEach(card => {
        if (category === 'all' || card.classList.contains(category)) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

// ======= ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ =======
// Добавляем новую функцию для обработки справочника команд
function generateCommandReference() {
    const commandList = document.getElementById('command-list');
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    // Добавляем header-banner для лучшего выделения раздела
    const commandRefSection = document.getElementById('command-reference');
    if (commandRefSection) {
        const headerBanner = document.createElement('div');
        headerBanner.className = 'section-header-banner';
        headerBanner.innerHTML = `
            <i class="fa-solid fa-book-open"></i>
            <span>Полный справочник команд Linux</span>
        `;
        commandRefSection.insertBefore(headerBanner, commandRefSection.firstChild);
    }
    
    // Обработчик для фильтров
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filter = this.dataset.filter;
            
            // Убираем активный класс со всех кнопок
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Добавляем активный класс текущей кнопке
            this.classList.add('active');
            
            // Очищаем список команд
            commandList.innerHTML = '';
            
            // Фильтруем и отображаем команды
            let filteredCommands = commandReference;
            if (filter !== 'all') {
                filteredCommands = commandReference.filter(cmd => cmd.category === filter);
            }
            
            // Создаем карточки для каждой команды
            filteredCommands.forEach(cmd => {
                const card = createCommandCard(cmd);
                commandList.appendChild(card);
            });
        });
    });
    
    // Поиск команд
    const searchInput = document.getElementById('command-search');
    const searchButton = document.getElementById('search-button');
    
    function performSearch() {
        const searchTerm = searchInput.value.toLowerCase();
        
        // Определяем активный фильтр
        const activeFilter = document.querySelector('.filter-btn.active');
        const filterType = activeFilter ? activeFilter.dataset.filter : 'all';
        
        // Фильтруем команды
        let filteredCommands = commandReference;
        if (filterType !== 'all') {
            filteredCommands = filteredCommands.filter(cmd => cmd.category === filterType);
        }
        
        // Применяем поисковый фильтр
        if (searchTerm) {
            filteredCommands = filteredCommands.filter(cmd => 
                cmd.command.toLowerCase().includes(searchTerm) ||
                cmd.description.toLowerCase().includes(searchTerm) ||
                cmd.tags.some(tag => tag.toLowerCase().includes(searchTerm))
            );
        }
        
        // Обновляем список
        commandList.innerHTML = '';
        filteredCommands.forEach(cmd => {
            const card = createCommandCard(cmd);
            commandList.appendChild(card);
        });
        
        if (filteredCommands.length === 0) {
            const noResults = document.createElement('div');
            noResults.className = 'no-results';
            noResults.textContent = 'Команды не найдены. Попробуйте изменить поисковый запрос.';
            commandList.appendChild(noResults);
        }
    }
    
    if (searchInput) {
        searchInput.addEventListener('input', performSearch);
    }
    
    if (searchButton) {
        searchButton.addEventListener('click', performSearch);
    }
}

// Функция создания карточки команды
function createCommandCard(command) {
    const card = document.createElement('div');
    card.className = 'command-card';
    
    card.innerHTML = `
        <div class="command-card-header">
            <span>${command.command}</span>
            <i class="fa-solid fa-terminal"></i>
        </div>
        <div class="command-card-body">
            <div class="command-syntax">
                <code>${command.syntax}</code>
                <button class="copy-btn" data-command="${command.syntax.replace(/"/g, '&quot;')}">
                    <i class="fa-regular fa-clipboard"></i>
                </button>
            </div>
            <div class="command-explanation">
                <p>${command.description}</p>
                ${command.usage ? `<p><strong>Использование:</strong> ${command.usage}</p>` : ''}
            </div>
            ${command.options && command.options.length > 0 ? `
                <div class="command-options">
                    <h4>Опции:</h4>
                    <ul>
                        ${command.options.map(opt => `
                            <li><code>${opt.option}</code> - ${opt.description}</li>
                        `).join('')}
                    </ul>
                </div>
            ` : ''}
            ${command.examples && command.examples.length > 0 ? `
                <div class="command-example">
                    <h4>Примеры:</h4>
                    <code>${command.examples.join('<br>')}</code>
                </div>
            ` : ''}
            <div class="command-tags">
                ${command.tags.map(tag => `
                    <span class="command-tag">${tag}</span>
                `).join('')}
            </div>
        </div>
    `;
    
    // Добавляем обработчик для кнопки копирования
    const copyBtn = card.querySelector('.copy-btn');
    if (copyBtn) {
        copyBtn.addEventListener('click', function() {
            const commandText = this.getAttribute('data-command');
            copyToClipboard(commandText);
            showNotification();
            
            this.classList.add('copied');
            setTimeout(() => {
                this.classList.remove('copied');
            }, 500);
        });
    }
    
    return card;
}

// Функция для создания интерактивного дерева файлов
function createFileTree(root = systemDirectories) {
    const tree = document.createElement('div');
    tree.className = 'file-tree';
    
    function createNode(name, content, path = '') {
        const isDirectory = content !== null;
        const currentPath = path ? `${path}/${name}` : name;
        
        const node = document.createElement('div');
        node.className = `file-node ${isDirectory ? 'directory collapsed' : 'file'}`;
        
        const icon = document.createElement('i');
        // Улучшенные иконки для директорий и файлов
        if (isDirectory) {
            if (name === 'log' || name.includes('logs')) {
                icon.className = 'fa-solid fa-clipboard-list';
                icon.style.color = '#f59e0b'; // Оранжевый для логов
            } else if (name.includes('config') || name === 'etc') {
                icon.className = 'fa-solid fa-gear';
                icon.style.color = '#3b82f6'; // Синий для конфигов
            } else {
                icon.className = 'fa-solid fa-folder';
                icon.style.color = '#7066ef'; // Фиолетовый для обычных папок
            }
        } else {
            // Более информативные иконки для файлов
            if (name.endsWith('.conf') || name.endsWith('.config')) {
                icon.className = 'fa-solid fa-cog';
                icon.style.color = '#3b82f6'; // Синий
            } else if (name.endsWith('.log')) {
                icon.className = 'fa-solid fa-file-lines';
                icon.style.color = '#f59e0b'; // Оранжевый
            } else if (name.endsWith('.php')) {
                icon.className = 'fa-brands fa-php';
                icon.style.color = '#10b981'; // Зеленый
            } else if (name.endsWith('.sql')) {
                icon.className = 'fa-solid fa-database';
                icon.style.color = '#ef4444'; // Красный
            } else {
                icon.className = 'fa-regular fa-file';
                icon.style.color = '#9ca3af'; // Серый
            }
        }
        
        const label = document.createElement('span');
        label.className = 'file-label';
        label.textContent = name;
        
        // Добавляем описание файла, если оно есть
        if (!isDirectory && fileDescriptions[name]) {
            const desc = fileDescriptions[name];
            node.title = desc.description;
            node.dataset.importance = desc.importance;
            node.dataset.category = desc.category;
            
            if (desc.importance === 'high') {
                label.classList.add('important-file');
            }
        }
        
        const labelContainer = document.createElement('div');
        labelContainer.className = 'label-container';
        labelContainer.appendChild(icon);
        labelContainer.appendChild(label);
        node.appendChild(labelContainer);
        
        if (isDirectory) {
            const children = document.createElement('div');
            children.className = 'children';
            
            for (const [childName, childContent] of Object.entries(content)) {
                const childNode = createNode(childName, childContent, currentPath);
                children.appendChild(childNode);
            }
            
            node.appendChild(children);
            
            node.addEventListener('click', (e) => {
                e.stopPropagation();
                node.classList.toggle('expanded');
                node.classList.toggle('collapsed');
            });
        }
        
        return node;
    }
    
    for (const [name, content] of Object.entries(root)) {
        tree.appendChild(createNode(name, content));
    }
    
    return tree;
}

// Функция для создания фильтров файловой системы
function createFileSystemFilters() {
    const filters = document.createElement('div');
    filters.className = 'file-system-filters';
    
    fileSystemCategories.forEach(category => {
        const button = document.createElement('button');
        button.className = 'category-btn';
        button.dataset.category = category.id;
        button.innerHTML = `<i class="${category.icon}"></i> ${category.name}`;
        
        button.addEventListener('click', () => {
            document.querySelectorAll('.category-btn').forEach(btn => 
                btn.classList.remove('active'));
            button.classList.add('active');
            
            const fileNodes = document.querySelectorAll('.file-node.file');
            if (category.id === 'all') {
                fileNodes.forEach(node => node.style.display = '');
            } else {
                fileNodes.forEach(node => {
                    node.style.display = 
                        node.dataset.category === category.id ? '' : 'none';
                });
            }
        });
        
        filters.appendChild(button);
    });
    
    return filters;
}

// Добавляем инициализацию файловой системы в основную функцию
function initFileSystem() {
    const container = document.getElementById('file-system-container');
    if (!container) return;
    
    // Добавляем заголовок раздела для лучшего выделения
    const headerBanner = document.createElement('div');
    headerBanner.className = 'section-header-banner';
    headerBanner.style.background = 'linear-gradient(135deg, #f59e0b, #d97706)';
    headerBanner.innerHTML = `
        <i class="fa-solid fa-folder-tree"></i>
        <span>Структура файлов и логов системы</span>
    `;
    container.parentNode.insertBefore(headerBanner, container);
    
    // Добавляем описание
    const description = document.createElement('div');
    description.className = 'file-system-description';
    description.innerHTML = `
        <h3><i class="fa-solid fa-folder-tree"></i> Структура файловой системы Debian</h3>
        <p>Интерактивная карта расположения основных файлов, логов и конфигураций. Используйте эту карту для быстрой навигации по важным компонентам системы.</p>
        <div class="info-box" style="margin-top: 15px;">
            <i class="fa-solid fa-circle-info info-icon"></i>
            <div>
                <h4>Работа с файловой системой</h4>
                <p>Для быстрого доступа к важным файлам вы можете использовать команду <code>cd</code> с указанием полного пути к директории. Например: <code>cd /var/log/nginx/</code> для доступа к логам Nginx.</p>
            </div>
        </div>
    `;
    container.appendChild(description);
    
    // Добавляем фильтры
    container.appendChild(createFileSystemFilters());
    
    // Добавляем дерево файлов
    const treeContainer = document.createElement('div');
    treeContainer.className = 'file-tree-container';
    treeContainer.appendChild(createFileTree());
    container.appendChild(treeContainer);
    
    // Добавляем легенду
    const legend = document.createElement('div');
    legend.className = 'file-system-legend';
    legend.innerHTML = `
        <div class="legend-item">
            <span class="legend-color high"></span>
            <span>Критически важные файлы</span>
        </div>
        <div class="legend-item">
            <span class="legend-color medium"></span>
            <span>Важные файлы</span>
        </div>
    `;
    container.appendChild(legend);
}

// ======= ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ =======
// Добавляем новую функцию для улучшения FAQ
function initFaqSection() {
    // Добавим информативные подсказки к вопросам
    const faqQuestions = document.querySelectorAll('.faq-question');
    
    faqQuestions.forEach(question => {
        // Добавляем визуальный эффект пульсации для непрочитанных вопросов
        if (!question.classList.contains('viewed')) {
            const pulseIndicator = document.createElement('span');
            pulseIndicator.className = 'pulse-indicator';
            pulseIndicator.style.position = 'absolute';
            pulseIndicator.style.right = '15px';
            pulseIndicator.style.top = '50%';
            pulseIndicator.style.transform = 'translateY(-50%)';
            pulseIndicator.style.width = '8px';
            pulseIndicator.style.height = '8px';
            pulseIndicator.style.borderRadius = '50%';
            pulseIndicator.style.backgroundColor = '#d946ef';
            pulseIndicator.style.animation = 'pulse 2s infinite';
            question.style.position = 'relative';
            question.appendChild(pulseIndicator);
        }
        
        // Улучшаем поведение вопросов при клике
        question.addEventListener('click', function() {
            // Отмечаем вопрос как просмотренный
            this.classList.add('viewed');
            
            // Удаляем индикатор пульсации
            const pulseIndicator = this.querySelector('.pulse-indicator');
            if (pulseIndicator) {
                pulseIndicator.style.animation = 'fadeOut 0.5s forwards';
                setTimeout(() => {
                    pulseIndicator.remove();
                }, 500);
            }
            
            // Остальное поведение остается прежним
            // ...существующий код...
        });
    });
}

// Добавляем вызов новой функции
// Это уже добавлено в документ.addEventListener('DOMContentLoaded')

// ======= ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ =======
// Добавляем новую функцию для обработки справочника команд
function addNewCommandBlock(blockData) {
    // Создаем новый блок через функцию из data.js
    const newBlock = createNewCommandBlock(
        blockData.id,
        blockData.title,
        blockData.icon,
        blockData.category,
        blockData.description,
        blockData.steps,
        blockData.notes,
        blockData.warnings,
        blockData.tags
    );
    
    // Обновляем UI
    regenerateCommandBlocks();
    regenerateTableOfContents();
    
    // Обновляем навигацию
    if (!navItems.some(item => item.id === blockData.id)) {
        navItems.push({ id: blockData.id, title: blockData.title });
        regenerateNavMenu();
    }
    
    return newBlock;
}

// Функция для добавления новой команды в справочник
function addNewCommand(commandData) {
    // Создаем новую команду через функцию из data.js
    const newCommand = addCommandToReference(
        commandData.command,
        commandData.syntax,
        commandData.description,
        commandData.usage,
        commandData.options,
        commandData.examples,
        commandData.category,
        commandData.tags
    );
    
    // Обновляем UI справочника команд
    regenerateCommandReference();
    
    return newCommand;
}

// Функция для повторной генерации блоков команд
function regenerateCommandBlocks() {
    const commandsContainer = document.getElementById('commands-container');
    if (!commandsContainer) return;
    
    // Очищаем контейнер
    commandsContainer.innerHTML = '';
    
    // Заново генерируем блоки
    generateCommandBlocks();
    
    // Настраиваем обработчики
    setupEventListeners();
}

// Функция для повторной генерации содержания
function regenerateTableOfContents() {
    // Пустая функция, так как боковая панель больше не используется
    // Оставляем для совместимости с существующим кодом
}

// Функция для повторной генерации навигационного меню
function regenerateNavMenu() {
    const navMenu = document.getElementById('nav-menu');
    if (!navMenu) return;
    
    // Очищаем меню
    navMenu.innerHTML = '';
    
    // Заново генерируем меню
    generateNavMenu();
}

// Функция для повторной генерации справочника команд
function regenerateCommandReference() {
    // Заново генерируем справочник
    generateCommandReference();
    
    // Отображаем все команды
    showAllCommands();
}

// Функция для добавления новой версии ПО
function addNewSoftware(softwareData) {
    // Определяем, в какую категорию добавлять ПО
    if (softwareData.category === 'database') {
        softwareVersions.database.push(softwareData);
    } else if (['web', 'programming', 'base'].includes(softwareData.category)) {
        softwareVersions[softwareData.category === 'web' ? 'webServer' : 
                         softwareData.category === 'programming' ? 'php' : 'system'] = softwareData;
    } else {
        softwareVersions.utils.push(softwareData);
    }
    
    // Обновляем отображение
    if (document.getElementById('software-list')) {
        displaySoftware('all');
    }
    
    return softwareData;
}

// Функция для добавления новой категории фильтров ПО
function addNewSoftwareCategory(categoryId, categoryName) {
    // Находим контейнер категорий
    const categoriesContainer = document.querySelector('.version-categories');
    if (!categoriesContainer) return false;
    
    // Проверяем, не существует ли уже такая категория
    if (document.querySelector(`.category-btn[data-category="${categoryId}"]`)) {
        return false;
    }
    
    // Создаем новую кнопку категории
    const newCategoryBtn = document.createElement('button');
    newCategoryBtn.className = 'category-btn';
    newCategoryBtn.dataset.category = categoryId;
    newCategoryBtn.textContent = categoryName;
    
    // Добавляем обработчик
    newCategoryBtn.addEventListener('click', () => {
        document.querySelectorAll('.category-btn').forEach(btn => btn.classList.remove('active'));
        newCategoryBtn.classList.add('active');
        
        const fileNodes = document.querySelectorAll('.file-node.file');
        if (categoryId === 'all') {
            fileNodes.forEach(node => node.style.display = '');
        } else {
            fileNodes.forEach(node => {
                node.style.display = 
                    node.dataset.category === categoryId ? '' : 'none';
            });
        }
    });
    
    // Добавляем в контейнер
    categoriesContainer.appendChild(newCategoryBtn);
    
    return true;
}

// Функция для динамической загрузки справочных материалов из внешнего файла
async function loadExternalCommandData(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        
        // Добавляем новые команды в справочник
        if (data.commands && Array.isArray(data.commands)) {
            data.commands.forEach(cmd => {
                addCommandToReference(
                    cmd.command,
                    cmd.syntax,
                    cmd.description,
                    cmd.usage,
                    cmd.options,
                    cmd.examples,
                    cmd.category,
                    cmd.tags
                );
            });
            
            // Обновляем UI
            regenerateCommandReference();
        }
        
        // Добавляем новые блоки команд
        if (data.blocks && Array.isArray(data.blocks)) {
            data.blocks.forEach(block => {
                createNewCommandBlock(
                    block.id,
                    block.title,
                    block.icon,
                    block.category,
                    block.description,
                    block.steps,
                    block.notes,
                    block.warnings,
                    block.tags
                );
            });
            
            // Обновляем UI
            regenerateCommandBlocks();
            regenerateTableOfContents();
            regenerateNavMenu();
        }
        
        return true;
    } catch (error) {
        console.error("Ошибка загрузки внешних данных:", error);
        return false;
    }
}

// Новая функция для инициализации API для внешнего управления
function initCommandAPI() {
    // Создаем глобальный объект для API
    window.commandAPI = {
        // Методы для работы с блоками команд
        blocks: {
            add: addNewCommandBlock,
            getAll: () => commandBlocks,
            getById: (id) => commandBlocks.find(block => block.id === id),
            getByCategory: (category) => commandBlocks.filter(block => block.category === category),
            getByTag: (tag) => commandBlocks.filter(block => block.tags.includes(tag))
        },
        
        // Методы для работы с командами
        commands: {
            add: addNewCommand,
            getAll: () => commandReference,
            getByName: (name) => commandReference.filter(cmd => cmd.command.includes(name)),
            getByCategory: (category) => commandReference.filter(cmd => cmd.category === category),
            getByTag: (tag) => commandReference.filter(cmd => cmd.tags.includes(tag))
        },
        
        // Методы для работы с ПО
        software: {
            add: addNewSoftware,
            addCategory: addNewSoftwareCategory,
            getAll: () => ({
                system: softwareVersions.system,
                webServer: softwareVersions.webServer,
                php: softwareVersions.php,
                database: softwareVersions.database,
                utils: softwareVersions.utils
            })
        },
        
        // Загрузка внешних данных
        loadExternalData: loadExternalCommandData,
        
        // Методы для обновления UI
        updateUI: {
            regenerateCommandBlocks,
            regenerateTableOfContents,
            regenerateNavMenu,
            regenerateCommandReference
        },
        
        // Файловая система API
        filesystem: {
            disks: {
                getAll: getDisks,
                add: addDisk,
                save: saveDisks
            },
            mountPoints: {
                getAll: getMountPoints,
                add: addMountPoint,
                save: saveMountPoints
            },
            refreshViews: () => {
                const container = document.getElementById('filesystem-diagram');
                if (container) {
                    const currentView = container.dataset.currentView || 'physical';
                    showFileSystemView(currentView);
                }
            }
        }
    };
    
    console.log('Command API initialized. Use window.commandAPI to access methods.');
}

// Функция для настройки мобильного меню
function setupMobileMenu() {
    // Создаем кнопку переключения меню
    const menuToggle = document.createElement('div');
    menuToggle.className = 'menu-toggle';
    menuToggle.innerHTML = '<i class="fa-solid fa-bars"></i>';
    document.body.appendChild(menuToggle);
    
    // Добавляем обработчик событий
    menuToggle.addEventListener('click', function() {
        document.body.classList.toggle('menu-active');
        
        // Меняем иконку
        const icon = this.querySelector('i');
        if (document.body.classList.contains('menu-active')) {
            icon.className = 'fa-solid fa-xmark';
        } else {
            icon.className = 'fa-solid fa-bars';
        }
    });
    
    // Закрывать меню при клике на пункт меню (для мобильных устройств)
    document.querySelectorAll('#nav-menu a').forEach(link => {
        link.addEventListener('click', function() {
            if (window.innerWidth <= 992) {
                document.body.classList.remove('menu-active');
                const icon = document.querySelector('.menu-toggle i');
                if (icon) {
                    icon.className = 'fa-solid fa-bars';
                }
            }
        });
    });
}

// === ДОПОЛНИТЕЛЬНЫЕ ФУНКЦИИ ===

// Функция для инициализации индикатора прогресса скролла
function initScrollProgress() {
    const progressContainer = document.createElement('div');
    progressContainer.className = 'progress-container';
    
    const progressBar = document.createElement('div');
    progressBar.className = 'progress-bar';
    
    progressContainer.appendChild(progressBar);
    document.body.appendChild(progressContainer);
    
    window.addEventListener('scroll', function() {
        const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrollPercent = (scrollTop / scrollHeight) * 100;
        
        progressBar.style.width = scrollPercent + '%';
    });
}

// Функция для инициализации панели быстрого доступа
function initQuickToolbar() {
    const quickToolbar = document.createElement('div');
    quickToolbar.className = 'quick-toolbar';
    
    // Кнопка прокрутки вверх
    const scrollTopButton = document.createElement('div');
    scrollTopButton.className = 'quick-button scroll-top-button';
    scrollTopButton.innerHTML = '<i class="fa-solid fa-arrow-up"></i>';
    scrollTopButton.title = 'Прокрутить вверх';
    scrollTopButton.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // Кнопка поиска
    const searchButton = document.createElement('div');
    searchButton.className = 'quick-button search-button';
    searchButton.innerHTML = '<i class="fa-solid fa-search"></i>';
    searchButton.title = 'Быстрый поиск по странице';
    searchButton.addEventListener('click', function() {
        const searchTerm = prompt('Введите текст для поиска:');
        if (searchTerm && searchTerm.length > 2) {
            performPageSearch(searchTerm);
        }
    });
    
    quickToolbar.appendChild(scrollTopButton);
    quickToolbar.appendChild(searchButton);
    
    document.body.appendChild(quickToolbar);
    
    // Показываем кнопку прокрутки только когда пользователь прокрутил вниз
    window.addEventListener('scroll', function() {
        if (window.scrollY > 300) {
            scrollTopButton.style.opacity = '1';
            scrollTopButton.style.pointerEvents = 'auto';
        } else {
            scrollTopButton.style.opacity = '0.4';
            scrollTopButton.style.pointerEvents = 'none';
        }
    });
}

// Функция для поиска по странице с подсветкой результатов
function performPageSearch(searchTerm) {
    // Удаляем предыдущие подсветки
    document.querySelectorAll('.search-highlight').forEach(el => {
        const parent = el.parentNode;
        parent.replaceChild(document.createTextNode(el.textContent), el);
        parent.normalize();
    });
    
    const searchRegex = new RegExp(searchTerm, 'gi');
    const contentNodes = document.querySelectorAll('.content p, .content h2, .content h3, .command-explanation, .step-description, .terminal-command');
    
    let matchCount = 0;
    let firstMatch = null;
    
    contentNodes.forEach(node => {
        const content = node.innerHTML;
        if (searchRegex.test(content)) {
            // Подсвечиваем совпадения
            node.innerHTML = content.replace(searchRegex, match => {
                matchCount++;
                return `<span class="search-highlight">${match}</span>`;
            });
            
            // Сохраняем первое совпадение для прокрутки
            if (!firstMatch) {
                firstMatch = node.querySelector('.search-highlight');
            }
        }
    });
    
    // Прокручиваем к первому совпадению
    if (firstMatch) {
        firstMatch.scrollIntoView({
            behavior: 'smooth',
            block: 'center'
        });
        
        // Анимируем первое совпадение
        firstMatch.style.transition = 'background-color 0.5s ease';
        firstMatch.style.backgroundColor = 'rgba(245, 158, 11, 0.5)';
        setTimeout(() => {
            firstMatch.style.backgroundColor = 'rgba(245, 158, 11, 0.2)';
        }, 1000);
        
        // Показываем количество совпадений
        showNotification(`Найдено ${matchCount} совпадений`);
    } else {
        showNotification('Совпадений не найдено');
    }
}

// Функция для инициализации клавиатурных сокращений
function initKeyboardShortcuts() {
    document.addEventListener('keydown', function(e) {
        // Ctrl + / - вызов быстрого поиска
        if (e.ctrlKey && e.key === '/') {
            e.preventDefault();
            const searchButton = document.querySelector('.search-button');
            if (searchButton) {
                searchButton.click();
            }
        }
        
        // Ctrl + Home - прокрутка вверх страницы
        if (e.ctrlKey && e.key === 'Home') {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }
        
        // Escape - закрыть все модальные окна
        if (e.key === 'Escape') {
            // Закрываем все модальные окна и всплывающие элементы
            document.querySelectorAll('.tooltip.visible').forEach(tooltip => {
                tooltip.classList.remove('visible');
            });
        }
    });
}

// Функция для подсветки кода в командах и примерах
function initCodeHighlighting() {
    document.querySelectorAll('.terminal-command, .command-syntax code, .command-example code').forEach(codeBlock => {
        // Remove this entire function body to prevent adding color to commands
    });
}

// Функция для улучшения правой навигации
function enhanceRightNavigation() {
    const rightNav = document.querySelector('.right-nav');
    if (!rightNav) return;
    
    // Добавляем индикаторы к элементам навигации
    rightNav.querySelectorAll('a').forEach(anchor => {
        // Добавляем цветной индикатор
        const indicator = document.createElement('span');
        indicator.className = 'section-nav-indicator';
        anchor.appendChild(indicator);
        
        // Добавляем анимации при наведении
        anchor.addEventListener('mouseenter', function() {
            indicator.style.transform = 'translateY(-50%) scale(1.5)';
        });
        
        anchor.addEventListener('mouseleave', function() {
            indicator.style.transform = 'translateY(-50%) scale(1)';
        });
        
        // Улучшаем анимацию кликов
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                // Добавляем класс для анимации секции
                document.querySelectorAll('section').forEach(section => {
                    section.classList.remove('right-nav-section-highlight');
                });
                
                targetElement.classList.add('right-nav-section-highlight');
                
                window.scrollTo({
                    top: targetElement.offsetTop - 70,
                    behavior: 'smooth'
                });
                
                history.pushState(null, null, this.getAttribute('href'));
                updateActiveLinks(targetId);
            }
        });
    });
    
    // Добавляем эффект отскока к активным элементам
    window.addEventListener('scroll', function() {
        const scrollPosition = window.scrollY + 80;
        let activeSection = null;
        
        // Проверяем важные разделы
        const importantSections = ['intro', 'command-reference', 'software-versions', 'logs-data-info', 'system-architecture', 'faq-section', 'resources-section'];
        
        importantSections.forEach(sectionId => {
            const section = document.getElementById(sectionId);
            
            if (section && scrollPosition >= section.offsetTop && 
                scrollPosition < section.offsetTop + section.offsetHeight) {
                activeSection = sectionId;
                
                // Анимируем индикатор активного раздела
                const activeLink = document.querySelector(`.right-nav a[href="#${sectionId}"] .section-nav-indicator`);
                
                if (activeLink) {
                    activeLink.style.transform = 'translateY(-50%) scale(1.5)';
                    activeLink.style.boxShadow = '0 0 12px currentColor';
                    
                    setTimeout(() => {
                        activeLink.style.transform = 'translateY(-50%) scale(1.2)';
                        activeLink.style.boxShadow = '0 0 8px currentColor';
                    }, 300);
                }
            }
        });
        
        if (activeSection) {
            // Обновляем активные ссылки в правой навигации
            document.querySelectorAll('.right-nav a').forEach(link => {
                link.classList.remove('active');
                const linkIndicator = link.querySelector('.section-nav-indicator');
                
                if (linkIndicator && link.getAttribute('href') !== `#${activeSection}`) {
                    linkIndicator.style.transform = 'translateY(-50%) scale(1)';
                    linkIndicator.style.boxShadow = '0 0 8px rgba(0,0,0,0.2)';
                }
                
                if (link.getAttribute('href') === `#${activeSection}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}

// === Добавление системной диаграммы ===
function initSystemArchitecture() {
    const container = document.getElementById('system-diagram');
    if (!container) return;
    
    // Создаем SVG элемент
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute('width', '100%');
    svg.setAttribute('height', '100%');
    svg.setAttribute('viewBox', '0 0 800 500');
    svg.style.maxWidth = '800px';
    
    // Определяем компоненты системы (упрощенная версия)
    const components = [
        // Базы данных
        { id: 'postgresql', label: 'PostgreSQL 17', x: 200, y: 150, width: 150, height: 60, color: '#f59e0b', icon: 'fa-solid fa-database' },
        { id: 'mysql', label: 'MySQL', x: 600, y: 150, width: 120, height: 60, color: '#f59e0b', icon: 'fa-solid fa-database' },
        { id: 'timescaledb', label: 'TimescaleDB', x: 200, y: 250, width: 150, height: 50, color: '#f59e0b', icon: 'fa-solid fa-clock' },
        { id: 'boost', label: 'Boost.MySQL', x: 600, y: 250, width: 150, height: 50, color: '#f59e0b', icon: 'fa-solid fa-bolt' },
        
        // Веб-сервисы
        { id: 'nginx', label: 'Nginx', x: 400, y: 350, width: 120, height: 60, color: '#10b981', icon: 'fa-solid fa-server' },
        { id: 'php', label: 'PHP 8.2', x: 300, y: 250, width: 120, height: 60, color: '#10b981', icon: 'fa-brands fa-php' },
        { id: 'php74', label: 'PHP 7.4', x: 500, y: 250, width: 120, height: 60, color: '#10b981', icon: 'fa-brands fa-php' },
        
        // Службы
        { id: 'zabbix', label: 'Zabbix', x: 200, y: 350, width: 120, height: 60, color: '#10b981', icon: 'fa-solid fa-chart-line' },
        { id: 'asterisk', label: 'Asterisk', x: 600, y: 350, width: 120, height: 60, color: '#10b981', icon: 'fa-solid fa-phone' },
    ];
    
    // Определяем связи между компонентами (упрощенная версия)
    const connections = [
        // Связи PHP
        { from: 'php', to: 'nginx' },
        { from: 'php74', to: 'nginx' },
        
        // Связи системных сервисов
        { from: 'php', to: 'zabbix' },
        { from: 'php74', to: 'asterisk' },
        
        // Связи PostgreSQL
        { from: 'postgresql', to: 'timescaledb' },
        { from: 'postgresql', to: 'zabbix' },
        
        // Связи MySQL
        { from: 'mysql', to: 'asterisk' },
        { from: 'mysql', to: 'boost' },
        
        // Связи веб-сервисов
        { from: 'nginx', to: 'zabbix' },
        { from: 'asterisk', to: 'nginx' },
    ];
    
    // Рисуем связи
    connections.forEach(conn => {
        const fromComp = components.find(c => c.id === conn.from);
        const toComp = components.find(c => c.id === conn.to);
        
        if (fromComp && toComp) {
            const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
            line.setAttribute('x1', fromComp.x);
            line.setAttribute('y1', fromComp.y + fromComp.height/2);
            line.setAttribute('x2', toComp.x);
            line.setAttribute('y2', toComp.y - toComp.height/2);
            line.setAttribute('stroke', fromComp.color);
            line.setAttribute('class', 'diagram-line');
            svg.appendChild(line);
        }
    });
    
    // Рисуем компоненты
    components.forEach(comp => {
        const group = document.createElementNS("http://www.w3.org/2000/svg", "g");
        
        // Создаем прямоугольник
        const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        rect.setAttribute('x', comp.x - comp.width/2);
        rect.setAttribute('y', comp.y - comp.height/2);
        rect.setAttribute('width', comp.width);
        rect.setAttribute('height', comp.height);
        rect.setAttribute('rx', '8');
        rect.setAttribute('fill', 'white');
        rect.setAttribute('stroke', comp.color);
        rect.setAttribute('class', 'diagram-node');
        
        // Создаем текст
        const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
        text.setAttribute('x', comp.x);
        text.setAttribute('y', comp.y + 5);
        text.setAttribute('class', 'diagram-label');
        text.textContent = comp.label;
        
        // Добавляем компоненты в SVG
        group.appendChild(rect);
        group.appendChild(text);
        
        // Добавляем всплывающую подсказку
        group.addEventListener('mouseenter', function() {
            const tooltip = document.createElement('div');
            tooltip.className = 'tooltip';
            tooltip.textContent = getComponentDescription(comp.id);
            tooltip.style.position = 'absolute';
            document.body.appendChild(tooltip);
            
            // Обновляем позицию подсказки при движении мыши
            document.addEventListener('mousemove', moveTooltip);
            function moveTooltip(e) {
                tooltip.style.left = (e.pageX + 15) + 'px';
                tooltip.style.top = (e.pageY + 15) + 'px';
            }
            
            // Показываем подсказку
            setTimeout(() => tooltip.classList.add('visible'), 10);
            
            // Удаляем подсказку при уходе мыши
            group.addEventListener('mouseleave', function() {
                tooltip.classList.remove('visible');
                document.removeEventListener('mousemove', moveTooltip);
                setTimeout(() => tooltip.remove(), 300);
            }, { once: true });
        });
        
        svg.appendChild(group);
    });
    
    // Добавляем SVG в контейнер
    container.appendChild(svg);
    
    // Анимация появления
    setTimeout(() => {
        const nodes = svg.querySelectorAll('.diagram-node');
        nodes.forEach((node, index) => {
            setTimeout(() => {
                node.style.opacity = 0;
                node.style.transform = 'scale(0.8)';
                
                setTimeout(() => {
                    node.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
                    node.style.opacity = 1;
                    node.style.transform = 'scale(1)';
                }, 50);
            }, index * 100);
        });
    }, 300);
}

// Функция для получения описания компонента
function getComponentDescription(id) {
    const descriptions = {
        'postgresql': 'СУБД PostgreSQL 17',
        'mysql': 'СУБД MySQL 8.0',
        'timescaledb': 'Расширение TimescaleDB для временных рядов',
        'boost': 'Boost.MySQL',
        'nginx': 'Веб-сервер Nginx',
        'php': 'Интерпретатор PHP 8.2 с FPM',
        'php74': 'PHP 7.4.33 (скомпилированный из исходников без OpenSSL)',
        'zabbix': 'Система мониторинга Zabbix',
        'asterisk': 'Система телефонии Asterisk',
    };
    
    return descriptions[id] || id;
}

// New function to initialize filesystem structure
function initFileSystemStructure() {
    const container = document.getElementById('filesystem-container');
    if (!container) return;
    
    // Create view buttons
    const viewsContainer = document.createElement('div');
    viewsContainer.className = 'filesystem-views';
    
    const views = [
        { id: 'physical', name: 'Физическая структура', icon: 'fa-solid fa-hdd' },
        { id: 'logical', name: 'Логическая структура', icon: 'fa-solid fa-folder-tree' },
        { id: 'mount', name: 'Точки монтирования', icon: 'fa-solid fa-sitemap' },
        { id: 'visual', name: 'Визуальная схема', icon: 'fa-solid fa-diagram-project' }
    ];
    
    views.forEach((view, index) => {
        const button = document.createElement('button');
        button.className = `view-button ${index === 0 ? 'active' : ''}`;
        button.dataset.view = view.id;
        button.innerHTML = `<i class="${view.icon}"></i> ${view.name}`;
        
        button.addEventListener('click', () => {
            document.querySelectorAll('.view-button').forEach(btn => 
                btn.classList.remove('active'));
            button.classList.add('active');
            
            const fileNodes = document.querySelectorAll('.file-node.file');
            if (view.id === 'all') {
                fileNodes.forEach(node => node.style.display = '');
            } else {
                fileNodes.forEach(node => {
                    node.style.display = 
                        node.dataset.category === view.id ? '' : 'none';
                });
            }
            
            showFileSystemView(button.dataset.view);
        });
        
        viewsContainer.appendChild(button);
    });
    
    container.appendChild(viewsContainer);
    
    // Create filesystem diagram container
    const diagramContainer = document.createElement('div');
    diagramContainer.className = 'filesystem-diagram';
    diagramContainer.id = 'filesystem-diagram';
    container.appendChild(diagramContainer);
    
    // Create filesystem info
    const infoContainer = document.createElement('div');
    infoContainer.className = 'filesystem-info';
    
    const infoCards = [
        {
            title: 'Дисковая подсистема',
            icon: 'fa-solid fa-hdd',
            items: [
                'RAID1 для загрузочных разделов',
                'RAID1 для системного раздела',
                'LVM для управления дисковым пространством',
                'LUKS для шифрования данных'
            ]
        },
        {
            title: 'Разделы файловой системы',
            icon: 'fa-solid fa-folder-open',
            items: [
                '/boot/efi - 512 МБ (FAT32) - загрузчик UEFI',
                '/ - 30 ГБ (ext4) - системный раздел',
                '/var - 20 ГБ (ext4) - логи и переменные данные',
                '/home - 50 ГБ (ext4) - домашние каталоги',
                '/store - остаток (ext4) - хранилище данных'
            ]
        },
        {
            title: 'Важные директории',
            icon: 'fa-solid fa-clipboard-list',
            items: [
                '/etc - конфигурационные файлы',
                '/var/log - журналы и логи',
                '/usr/local - локально установленное ПО',
                '/store/postgresql - данные PostgreSQL',
                '/var/www - файлы веб-сервера'
            ]
        }
    ];
    
    infoCards.forEach(card => {
        const cardElement = document.createElement('div');
        cardElement.className = 'info-card';
        
        const title = document.createElement('h4');
        title.innerHTML = `<i class="${card.icon}"></i> ${card.title}`;
        cardElement.appendChild(title);
        
        const list = document.createElement('ul');
        card.items.forEach(item => {
            const listItem = document.createElement('li');
            listItem.textContent = item;
            list.appendChild(listItem);
        });
        
        cardElement.appendChild(list);
        infoContainer.appendChild(cardElement);
    });
    
    container.appendChild(infoContainer);
    
    // Initialize with physical view by default
    showFileSystemView('physical');
}

// Function to show specific filesystem view
function showFileSystemView(viewType) {
    const container = document.getElementById('filesystem-diagram');
    if (!container) return;
    
    container.innerHTML = '';
    container.dataset.currentView = viewType; // Store current view type
    
    switch (viewType) {
        case 'physical':
            renderPhysicalView(container);
            break;
        case 'logical':
            renderLogicalView(container);
            break;
        case 'mount':
            renderMountPointsView(container);
            break;
        case 'visual':
            renderVisualDiskStructure(container);
            break;
        default:
            renderPhysicalView(container);
    }
}

// Function to render physical disk structure
function renderPhysicalView(container) {
    container.innerHTML = `
        <h3 style="text-align: center; margin-bottom: 20px; color: #3b82f6;">Физическая структура дисков</h3>
        <div style="display: flex; flex-wrap: wrap; gap: 20px; justify-content: center;">
            <div style="flex: 1; min-width: 300px; max-width: 600px; background: white; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); overflow: hidden; border: 2px solid #3b82f6;">
                <div style="background: linear-gradient(135deg, #3b82f6, #60a5fa); color: white; padding: 12px 16px; font-weight: bold;">
                    Диск 1 (sda) - 223.6G
                </div>
                <div style="padding: 16px;">
                    <div style="display: flex; flex-direction: column; gap: 8px;">
                        <div style="display: flex; gap: 10px; align-items: center;">
                            <div style="width: 80px; text-align: right; font-weight: bold; color: #3b82f6;">sda1</div>
                            <div style="flex: 1; height: 30px; background: #dbeafe; border-radius: 6px; position: relative; padding: 5px 8px; font-size: 0.8rem;">
                                <span>74.5G → md0 (RAID1) → /</span>
                            </div>
                        </div>
                        <div style="display: flex; gap: 10px; align-items: center;">
                            <div style="width: 80px; text-align: right; font-weight: bold; color: #3b82f6;">sda2</div>
                            <div style="flex: 1; height: 30px; background: #dbeafe; border-radius: 6px; position: relative; padding: 5px 8px; font-size: 0.8rem;">
                                <span>4.7G → md1 (RAID1) → [SWAP]</span>
                            </div>
                        </div>
                        <div style="display: flex; gap: 10px; align-items: center;">
                            <div style="width: 80px; text-align: right; font-weight: bold; color: #3b82f6;">sda3</div>
                            <div style="flex: 1; height: 30px; background: #dbeafe; border-radius: 6px; position: relative; padding: 5px 8px; font-size: 0.8rem;">
                                <span>954M → md3 (RAID1) → /boot</span>
                            </div>
                        </div>
                        <div style="display: flex; gap: 10px; align-items: center;">
                            <div style="width: 80px; text-align: right; font-weight: bold; color: #3b82f6;">sda4</div>
                            <div style="flex: 1; height: 30px; background: #dbeafe; border-radius: 6px; position: relative; padding: 5px 8px; font-size: 0.8rem;">
                                <span>954M → md4 (RAID1) → /boot/efi</span>
                            </div>
                        </div>
                        <div style="display: flex; gap: 10px; align-items: center;">
                            <div style="width: 80px; text-align: right; font-weight: bold; color: #3b82f6;">sda5</div>
                            <div style="flex: 1; height: 30px; background: #dbeafe; border-radius: 6px; position: relative; padding: 5px 8px; font-size: 0.8rem;">
                                <span>142.5G → md2 (RAID1) → /home</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div style="flex: 1; min-width: 300px; max-width: 600px; background: white; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); overflow: hidden; border: 2px solid #3b82f6;">
                <div style="background: linear-gradient(135deg, #3b82f6, #60a5fa); color: white; padding: 12px 16px; font-weight: bold;">
                    Диск 2 (sdb) - 223.6G
                </div>
                <div style="padding: 16px;">
                    <div style="display: flex; flex-direction: column; gap: 8px;">
                        <div style="display: flex; gap: 10px; align-items: center;">
                            <div style="width: 80px; text-align: right; font-weight: bold; color: #3b82f6;">sdb1</div>
                            <div style="flex: 1; height: 30px; background: #dbeafe; border-radius: 6px; position: relative; padding: 5px 8px; font-size: 0.8rem;">
                                <span>74.5G → md0 (RAID1) → /</span>
                            </div>
                        </div>
                        <div style="display: flex; gap: 10px; align-items: center;">
                            <div style="width: 80px; text-align: right; font-weight: bold; color: #3b82f6;">sdb2</div>
                            <div style="flex: 1; height: 30px; background: #dbeafe; border-radius: 6px; position: relative; padding: 5px 8px; font-size: 0.8rem;">
                                <span>4.7G → md1 (RAID1) → [SWAP]</span>
                            </div>
                        </div>
                        <div style="display: flex; gap: 10px; align-items: center;">
                            <div style="width: 80px; text-align: right; font-weight: bold; color: #3b82f6;">sdb3</div>
                            <div style="flex: 1; height: 30px; background: #dbeafe; border-radius: 6px; position: relative; padding: 5px 8px; font-size: 0.8rem;">
                                <span>954M → md3 (RAID1) → /boot</span>
                            </div>
                        </div>
                        <div style="display: flex; gap: 10px; align-items: center;">
                            <div style="width: 80px; text-align: right; font-weight: bold; color: #3b82f6;">sdb4</div>
                            <div style="flex: 1; height: 30px; background: #dbeafe; border-radius: 6px; position: relative; padding: 5px 8px; font-size: 0.8rem;">
                                <span>954M</span>
                            </div>
                        </div>
                        <div style="display: flex; gap: 10px; align-items: center;">
                            <div style="width: 80px; text-align: right; font-weight: bold; color: #3b82f6;">sdb5</div>
                            <div style="flex: 1; height: 30px; background: #dbeafe; border-radius: 6px; position: relative; padding: 5px 8px; font-size: 0.8rem;">
                                <span>142.5G → md2 (RAID1) → /home</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div style="flex: 1; min-width: 300px; max-width: 600px; background: white; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); overflow: hidden; border: 2px solid #ef4444;">
                <div style="background: linear-gradient(135deg, #ef4444, #f87171); color: white; padding: 12px 16px; font-weight: bold;">
                    Диск 3 (sdc) - Hot Swap - 223.6G
                </div>
                <div style="padding: 16px;">
                    <div style="display: flex; flex-direction: column; gap: 8px;">
                        <div style="display: flex; gap: 10px; align-items: center;">
                            <div style="width: 80px; text-align: right; font-weight: bold; color: #ef4444;">sdc1</div>
                            <div style="flex: 1; height: 30px; background: #fee2e2; border-radius: 6px; position: relative; padding: 5px 8px; font-size: 0.8rem;">
                                <span>74.5G → md0 (RAID1) → /</span>
                            </div>
                        </div>
                        <div style="display: flex; gap: 10px; align-items: center;">
                            <div style="width: 80px; text-align: right; font-weight: bold; color: #ef4444;">sdc2</div>
                            <div style="flex: 1; height: 30px; background: #fee2e2; border-radius: 6px; position: relative; padding: 5px 8px; font-size: 0.8rem;">
                                <span>4.7G → md1 (RAID1) → [SWAP]</span>
                            </div>
                        </div>
                        <div style="display: flex; gap: 10px; align-items: center;">
                            <div style="width: 80px; text-align: right; font-weight: bold; color: #ef4444;">sdc3</div>
                            <div style="flex: 1; height: 30px; background: #fee2e2; border-radius: 6px; position: relative; padding: 5px 8px; font-size: 0.8rem;">
                                <span>954M → md3 (RAID1) → /boot</span>
                            </div>
                        </div>
                        <div style="display: flex; gap: 10px; align-items: center;">
                            <div style="width: 80px; text-align: right; font-weight: bold; color: #ef4444;">sdc4</div>
                            <div style="flex: 1; height: 30px; background: #fee2e2; border-radius: 6px; position: relative; padding: 5px 8px; font-size: 0.8rem;">
                                <span>954M → md4 (RAID1) → /boot/efi</span>
                            </div>
                        </div>
                        <div style="display: flex; gap: 10px; align-items: center;">
                            <div style="width: 80px; text-align: right; font-weight: bold; color: #ef4444;">sdc5</div>
                            <div style="flex: 1; height: 30px; background: #fee2e2; border-radius: 6px; position: relative; padding: 5px 8px; font-size: 0.8rem;">
                                <span>142.5G → md2 (RAID1) → /home</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        <div style="margin-top: 20px; display: flex; justify-content: center;">
            <div style="flex: 0 1 800px; background: white; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); overflow: hidden; border: 2px solid #8b5cf6;">
                <div style="background: linear-gradient(135deg, #8b5cf6, #a78bfa); color: white; padding: 12px 16px; font-weight: bold; text-align: center;">
                    Hardware RAID - LSI MegaRAID (sdd) - 3.6T
                </div>
                <div style="padding: 16px; display: flex; gap: 10px; align-items: center;">
                    <div style="width: 80px; text-align: right; font-weight: bold; color: #8b5cf6;">sdd1</div>
                    <div style="flex: 1; height: 40px; background: #ede9fe; border-radius: 6px; position: relative; padding: 10px 8px; font-size: 0.9rem; text-align: center;">
                        <span>3.6T → /store (RAID10 hardware, 4 диска на backplane)</span>
                    </div>
                </div>
            </div>
        </div>
        
        <div style="margin-top: 30px; padding: 20px; background-color: #f9fafb; border-radius: 12px; border: 1px solid #e5e7eb; max-width: 800px; margin-left: auto; margin-right: auto;">
            <h4 style="margin-top: 0; margin-bottom: 15px; color: #4b5563; font-size: 1.1rem;">Условные обозначения:</h4>
            <div style="display: flex; flex-wrap: wrap; gap: 15px; margin-bottom: 15px;">
                <div style="display: flex; align-items: center; gap: 8px;">
                    <div style="width: 16px; height: 16px; border-radius: 4px; background-color: #3b82f6;"></div>
                    <span>Основные диски</span>
                </div>
                <div style="display: flex; align-items: center; gap: 8px;">
                    <div style="width: 16px; height: 16px; border-radius: 4px; background-color: #ef4444;"></div>
                    <span>Диск горячей замены (Hot Swap)</span>
                </div>
                <div style="display: flex; align-items: center; gap: 8px;">
                    <div style="width: 16px; height: 16px; border-radius: 4px; background-color: #8b5cf6;"></div>
                    <span>Hardware RAID</span>
                </div>
            </div>
            <p style="margin-bottom: 0; color: #6b7280; font-style: italic;">Все RAID1 массивы используются для защиты от отказа дисков. Диск горячей замены автоматически включается в массив при выходе из строя одного из основных дисков.</p>
        </div>
    `;
}

// Function to render logical view
function renderLogicalView(container) {
    const logicalStructure = [
        {
            name: 'RAID Arrays',
            items: [
                { name: 'md0', description: 'RAID1 for system partition (root)', members: 'sda1, sdb1, sdc1 (hot-swap)', size: '74.4G' },
                { name: 'md1', description: 'RAID1 for swap partition', members: 'sda2, sdb2, sdc2 (hot-swap)', size: '4.7G' },
                { name: 'md2', description: 'RAID1 for home partition', members: 'sda5, sdb5, sdc5 (hot-swap)', size: '142.4G' },
                { name: 'md3', description: 'RAID1 for boot partition', members: 'sda3, sdb3, sdc3 (hot-swap)', size: '953M' },
                { name: 'md4', description: 'RAID1 for EFI partition', members: 'sda4, sdc4', size: '953.9M' },
                { name: 'LSI MegaRAID', description: 'Hardware RAID 10 for data storage', members: '4 HDD disks on backplane', size: '3.6T' }
            ]
        },
        {
            name: 'LUKS Encrypted Volumes',
            items: [
                { name: 'md0_crypt', description: 'Encrypted system partition', members: 'md0 (RAID1)', size: '74.4G' },
                { name: 'md1_crypt', description: 'Encrypted swap partition', members: 'md1 (RAID1)', size: '4.6G' },
                { name: 'md2_crypt', description: 'Encrypted home partition', members: 'md2 (RAID1)', size: '142.4G' }
            ]
        },
        {
            name: 'Mount Points',
            items: [
                { name: '/', description: 'Root filesystem', members: 'md0_crypt', size: '74.4G' },
                { name: '/boot', description: 'Boot partition', members: 'md3', size: '953M' },
                { name: '/boot/efi', description: 'EFI System Partition', members: 'md4', size: '953.9M' },
                { name: '/home', description: 'User data', members: 'md2_crypt', size: '142.4G' },
                { name: '/store', description: 'Data storage', members: 'sdd1 (Hardware RAID10)', size: '3.6T' },
                { name: '[SWAP]', description: 'Swap space', members: 'md1_crypt', size: '4.6G' }
            ]
        }
    ];
    
    // Create a container for the diagram
    const diagramContainer = document.createElement('div');
    diagramContainer.className = 'logical-structure-diagram';
    diagramContainer.style.display = 'flex';
    diagramContainer.style.flexDirection = 'column';
    diagramContainer.style.gap = '20px';
    diagramContainer.style.width = '100%';
    diagramContainer.style.overflow = 'auto';
    
    // Add a title
    const title = document.createElement('h3');
    title.textContent = 'Логическая структура дисковой подсистемы';
    title.style.textAlign = 'center';
    title.style.marginBottom = '20px';
    title.style.color = '#6b21a8';
    container.appendChild(title);
    
    // Create the structure visualization
    const visualization = document.createElement('div');
    visualization.className = 'visualization-container';
    visualization.style.display = 'flex';
    visualization.style.justifyContent = 'space-between';
    visualization.style.flexWrap = 'wrap';
    visualization.style.gap = '20px';
    visualization.style.marginBottom = '30px';
    
    // Colors for different sections
    const sectionColors = {
        'RAID Arrays': '#8b5cf6',
        'LUKS Encrypted Volumes': '#ef4444',
        'Mount Points': '#10b981'
    };
    
    // Create columns for each section
    logicalStructure.forEach(section => {
        const sectionEl = document.createElement('div');
        sectionEl.className = 'structure-section';
        sectionEl.style.flex = '1';
        sectionEl.style.minWidth = '300px';
        sectionEl.style.backgroundColor = 'white';
        sectionEl.style.borderRadius = '12px';
        sectionEl.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
        sectionEl.style.overflow = 'hidden';
        
        // Section header
        const header = document.createElement('div');
        header.className = 'structure-section-header';
        header.textContent = section.name;
        header.style.padding = '12px 16px';
        header.style.backgroundColor = sectionColors[section.name];
        header.style.color = 'white';
        header.style.fontWeight = 'bold';
        header.style.borderRadius = '12px 12px 0 0';
        sectionEl.appendChild(header);
        
        // Section items
        const itemsContainer = document.createElement('div');
        itemsContainer.className = 'structure-section-items';
        itemsContainer.style.padding = '16px';
        
        section.items.forEach(item => {
            const itemEl = document.createElement('div');
            itemEl.className = 'structure-item';
            itemEl.style.marginBottom = '15px';
            itemEl.style.padding = '12px';
            itemEl.style.backgroundColor = '#f9fafb';
            itemEl.style.borderRadius = '8px';
            itemEl.style.borderLeft = `4px solid ${sectionColors[section.name]}`;
            
            const nameEl = document.createElement('div');
            nameEl.className = 'item-name';
            nameEl.textContent = item.name;
            nameEl.style.fontWeight = 'bold';
            nameEl.style.marginBottom = '5px';
            itemEl.appendChild(nameEl);
            
            const descEl = document.createElement('div');
            descEl.className = 'item-description';
            descEl.textContent = item.description;
            descEl.style.fontSize = '0.9rem';
            descEl.style.marginBottom = '5px';
            itemEl.appendChild(descEl);
            
            const detailsEl = document.createElement('div');
            detailsEl.className = 'item-details';
            detailsEl.style.display = 'flex';
            detailsEl.style.justifyContent = 'space-between';
            detailsEl.style.fontSize = '0.85rem';
            detailsEl.style.color = '#6b7280';
            
            const membersEl = document.createElement('span');
            membersEl.textContent = `Компоненты: ${item.members}`;
            detailsEl.appendChild(membersEl);
            
            const sizeEl = document.createElement('span');
            sizeEl.textContent = `Размер: ${item.size}`;
            sizeEl.style.fontWeight = 'bold';
            detailsEl.appendChild(sizeEl);
            
            itemEl.appendChild(detailsEl);
            itemsContainer.appendChild(itemEl);
        });
        
        sectionEl.appendChild(itemsContainer);
        visualization.appendChild(sectionEl);
    });
    
    // Add arrows to show relationships (simplified)
    const arrowsContainer = document.createElement('div');
    arrowsContainer.className = 'arrows-hint';
    arrowsContainer.innerHTML = `
        <div style="text-align: center; padding: 10px; background-color: #f3f4f6; border-radius: 8px; margin-top: 20px;">
            <p style="margin-bottom: 10px; font-weight: bold;">Взаимосвязи компонентов:</p>
            <div style="display: flex; justify-content: center; gap: 15px; flex-wrap: wrap;">
                <div style="display: flex; align-items: center;">
                    <span style="color: #8b5cf6; font-weight: bold;">RAID Arrays</span>
                    <span style="margin: 0 8px;">→</span>
                    <span style="color: #ef4444; font-weight: bold;">LUKS Encryption</span>
                </div>
                <div style="display: flex; align-items: center;">
                    <span style="color: #ef4444; font-weight: bold;">LUKS Encryption</span>
                    <span style="margin: 0 8px;">→</span>
                    <span style="color: #10b981; font-weight: bold;">Mount Points</span>
                </div>
            </div>
        </div>
    `;
    
    container.appendChild(visualization);
    container.appendChild(arrowsContainer);
    
    // Add a description box
    const description = document.createElement('div');
    description.className = 'logical-description';
    description.style.backgroundColor = '#f9fafb';
    description.style.padding = '20px';
    description.style.borderRadius = '12px';
    description.style.marginTop = '20px';
    description.style.border = '1px solid #e5e7eb';
    
    description.innerHTML = `
        <h4 style="margin-top: 0; margin-bottom: 15px; color: #6b21a8;">Пояснения к логической структуре:</h4>
        <ul style="margin: 0; padding-left: 20px;">
            <li style="margin-bottom: 8px;">
                <strong>RAID Arrays</strong> - отказоустойчивые массивы, объединяющие физические диски.
                RAID1 обеспечивает зеркалирование данных между дисками.
            </li>
            <li style="margin-bottom: 8px;">
                <strong>LUKS Encryption</strong> - слой шифрования, защищающий данные в случае физического доступа к дискам.
                Расшифровка происходит автоматически при загрузке с использованием TPM2.
            </li>
            <li style="margin-bottom: 8px;">
                <strong>Mount Points</strong> - точки монтирования в файловой системе, 
                через которые осуществляется доступ к данным на разделах.
            </li>
            <li style="margin-bottom: 8px;">
                <strong>Hot-Swap</strong> - технология горячей замены, позволяющая системе 
                автоматически восстанавливаться при выходе из строя одного из дисков без простоя.
            </li>
        </ul>
    `;
    
    container.appendChild(description);
}

// Function to render mount points view
function renderMountPointsView(container) {
    const mountPoints = [
        { path: '/', device: '/dev/mapper/md0_crypt', fstype: 'ext4', options: 'defaults', category: 'system' },
        { path: '/boot', device: '/dev/md3', fstype: 'ext4', options: 'defaults', category: 'system' },
        { path: '/boot/efi', device: '/dev/md4', fstype: 'vfat', options: 'umask=0077', category: 'system' },
        { path: '/home', device: '/dev/mapper/md2_crypt', fstype: 'ext4', options: 'defaults', category: 'data' },
        { path: '/store', device: '/dev/sdd1', fstype: 'ext4', options: 'defaults', category: 'data' },
        { path: '[SWAP]', device: '/dev/mapper/md1_crypt', fstype: 'swap', options: 'defaults', category: 'system' },
        { path: '/store/postgresql/17/main', device: '/store/postgresql/17/main', fstype: 'bind', options: 'bind', category: 'data' }
    ];
    
    // Create visual mount points representation
    const mountVisual = document.createElement('div');
    mountVisual.style.marginBottom = '30px';
    mountVisual.style.display = 'flex';
    mountVisual.style.flexWrap = 'wrap';
    mountVisual.style.gap = '20px';
    mountVisual.style.justifyContent = 'center';
    
    // Group mount points by category
    const systemPoints = mountPoints.filter(m => m.category === 'system');
    const dataPoints = mountPoints.filter(m => m.category === 'data');
    
    // System mount points container
    const systemContainer = document.createElement('div');
    systemContainer.style.flex = '1';
    systemContainer.style.minWidth = '350px';
    systemContainer.style.maxWidth = '600px';
    systemContainer.style.backgroundColor = 'white';
    systemContainer.style.borderRadius = '12px';
    systemContainer.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
    systemContainer.style.border = '2px solid #3b82f6';
    systemContainer.style.overflow = 'hidden';
    
    // System header
    const systemHeader = document.createElement('div');
    systemHeader.style.backgroundColor = '#3b82f6';
    systemHeader.style.color = 'white';
    systemHeader.style.padding = '15px';
    systemHeader.style.fontWeight = 'bold';
    systemHeader.style.fontSize = '1.2rem';
    systemHeader.style.display = 'flex';
    systemHeader.style.alignItems = 'center';
    systemHeader.style.gap = '10px';
    systemHeader.innerHTML = '<i class="fa-solid fa-gears"></i> Системные точки монтирования';
    systemContainer.appendChild(systemHeader);
    
    // System mount points
    const systemContent = document.createElement('div');
    systemContent.style.padding = '20px';
    
    systemPoints.forEach(point => {
        const pointEl = document.createElement('div');
        pointEl.style.marginBottom = '15px';
        pointEl.style.padding = '15px';
        pointEl.style.backgroundColor = '#f0f9ff';
        pointEl.style.borderRadius = '10px';
        pointEl.style.borderLeft = '5px solid #3b82f6';
        
        // Create an attractive layout with icons
        pointEl.innerHTML = `
            <div style="display: flex; align-items: center; margin-bottom: 8px;">
                <i class="fa-solid fa-folder-open" style="color: #3b82f6; font-size: 1.2rem; margin-right: 10px;"></i>
                <span style="font-weight: bold; font-size: 1.1rem;">${point.path}</span>
            </div>
            <div style="display: flex; flex-wrap: wrap; gap: 10px; margin-top: 10px;">
                <div style="flex: 1; min-width: 200px;">
                    <div style="display: flex; align-items: center; margin-bottom: 5px;">
                        <i class="fa-solid fa-hard-drive" style="color: #64748b; width: 20px;"></i>
                        <span style="margin-left: 8px; color: #64748b;">Устройство:</span>
                        <span style="margin-left: 5px; font-family: monospace; background: #e2e8f0; padding: 2px 6px; border-radius: 4px;">${point.device}</span>
                    </div>
                    <div style="display: flex; align-items: center; margin-bottom: 5px;">
                        <i class="fa-solid fa-file-code" style="color: #64748b; width: 20px;"></i>
                        <span style="margin-left: 8px; color: #64748b;">ФС:</span>
                        <span style="margin-left: 5px; font-family: monospace; background: #e2e8f0; padding: 2px 6px; border-radius: 4px;">${point.fstype}</span>
                    </div>
                    <div style="display: flex; align-items: center;">
                        <i class="fa-solid fa-sliders" style="color: #64748b; width: 20px;"></i>
                        <span style="margin-left: 8px; color: #64748b;">Опции:</span>
                        <span style="margin-left: 5px; font-family: monospace; background: #e2e8f0; padding: 2px 6px; border-radius: 4px;">${point.options}</span>
                    </div>
                </div>
            </div>
        `;
        
        systemContent.appendChild(pointEl);
    });
    
    systemContainer.appendChild(systemContent);
    mountVisual.appendChild(systemContainer);
    
    // Data mount points container
    const dataContainer = document.createElement('div');
    dataContainer.style.flex = '1';
    dataContainer.style.minWidth = '350px';
    dataContainer.style.maxWidth = '600px';
    dataContainer.style.backgroundColor = 'white';
    dataContainer.style.borderRadius = '12px';
    dataContainer.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
    dataContainer.style.border = '2px solid #10b981';
    dataContainer.style.overflow = 'hidden';
    
    // Data header
    const dataHeader = document.createElement('div');
    dataHeader.style.backgroundColor = '#10b981';
    dataHeader.style.color = 'white';
    dataHeader.style.padding = '15px';
    dataHeader.style.fontWeight = 'bold';
    dataHeader.style.fontSize = '1.2rem';
    dataHeader.style.display = 'flex';
    dataHeader.style.alignItems = 'center';
    dataHeader.style.gap = '10px';
    dataHeader.innerHTML = '<i class="fa-solid fa-database"></i> Точки монтирования данных';
    dataContainer.appendChild(dataHeader);
    
    // Data mount points
    const dataContent = document.createElement('div');
    dataContent.style.padding = '20px';
    
    dataPoints.forEach(point => {
        const pointEl = document.createElement('div');
        pointEl.style.marginBottom = '15px';
        pointEl.style.padding = '15px';
        pointEl.style.backgroundColor = '#ecfdf5';
        pointEl.style.borderRadius = '10px';
        pointEl.style.borderLeft = '5px solid #10b981';
        
        // Create an attractive layout with icons
        pointEl.innerHTML = `
            <div style="display: flex; align-items: center; margin-bottom: 8px;">
                <i class="fa-solid fa-folder-open" style="color: #10b981; font-size: 1.2rem; margin-right: 10px;"></i>
                <span style="font-weight: bold; font-size: 1.1rem;">${point.path}</span>
            </div>
            <div style="display: flex; flex-wrap: wrap; gap: 10px; margin-top: 10px;">
                <div style="flex: 1; min-width: 200px;">
                    <div style="display: flex; align-items: center; margin-bottom: 5px;">
                        <i class="fa-solid fa-hard-drive" style="color: #64748b; width: 20px;"></i>
                        <span style="margin-left: 8px; color: #64748b;">Устройство:</span>
                        <span style="margin-left: 5px; font-family: monospace; background: #e2e8f0; padding: 2px 6px; border-radius: 4px;">${point.device}</span>
                    </div>
                    <div style="display: flex; align-items: center; margin-bottom: 5px;">
                        <i class="fa-solid fa-file-code" style="color: #64748b; width: 20px;"></i>
                        <span style="margin-left: 8px; color: #64748b;">ФС:</span>
                        <span style="margin-left: 5px; font-family: monospace; background: #e2e8f0; padding: 2px 6px; border-radius: 4px;">${point.fstype}</span>
                    </div>
                    <div style="display: flex; align-items: center;">
                        <i class="fa-solid fa-sliders" style="color: #64748b; width: 20px;"></i>
                        <span style="margin-left: 8px; color: #64748b;">Опции:</span>
                        <span style="margin-left: 5px; font-family: monospace; background: #e2e8f0; padding: 2px 6px; border-radius: 4px;">${point.options}</span>
                    </div>
                </div>
            </div>
        `;
        
        dataContent.appendChild(pointEl);
    });
    
    dataContainer.appendChild(dataContent);
    mountVisual.appendChild(dataContainer);
    
    // Add mount points visual representation
    container.appendChild(mountVisual);
    
    // Create table for mount points (keeping the existing code)
    const table = document.createElement('table');
    table.className = 'partition-table';
    table.style.width = '100%';
    table.style.borderCollapse = 'collapse';
    
    // Add table header
    const thead = document.createElement('thead');
    thead.innerHTML = `
        <tr>
            <th style="text-align: left; padding: 8px; border-bottom: 1px solid #e5e7eb;">Точка монтирования</th>
            <th style="text-align: left; padding: 8px; border-bottom: 1px solid #e5e7eb;">Устройство</th>
            <th style="text-align: left; padding: 8px; border-bottom: 1px solid #e5e7eb;">Файловая система</th>
            <th style="text-align: left; padding: 8px; border-bottom: 1px solid #e5e7eb;">Опции монтирования</th>
            <th style="text-align: left; padding: 8px; border-bottom: 1px solid #e5e7eb;">Категория</th>
        </tr>
    `;
    table.appendChild(thead);
    
    // Add table body
    const tbody = document.createElement('tbody');
    mountPoints.forEach(mount => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">${mount.path}</td>
            <td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">${mount.device}</td>
            <td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">${mount.fstype}</td>
            <td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">${mount.options}</td>
            <td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">
                <span class="category-badge" style="
                    padding: 4px 8px;
                    border-radius: 4px;
                    font-size: 0.8rem;
                    background-color: ${
                        mount.category === 'system' ? '#dbeafe' : 
                        mount.category === 'logs' ? '#fef3c7' : 
                        '#dcfce7'
                    };
                    color: ${
                        mount.category === 'system' ? '#1e40af' : 
                        mount.category === 'logs' ? '#92400e' : 
                        '#166534'
                    };">
                    ${mount.category}
                </span>
            </td>
        `;
        tbody.appendChild(row);
    });
    table.appendChild(tbody);
    
    // Add additional filesystem explanation
    const explanation = document.createElement('div');
    explanation.style.marginTop = '2rem';
    explanation.style.padding = '1rem';
    explanation.style.backgroundColor = '#f9fafb';
    explanation.style.borderRadius = '8px';
    explanation.style.border = '1px solid #e5e7eb';
    
    explanation.innerHTML = `
        <h4 style="margin-bottom: 1rem;">Примечания по файловой системе:</h4>
        <ul style="margin: 0; padding-left: 1.5rem;">
            <li style="margin-bottom: 0.5rem;">
                <strong>Диск 3 (sdc)</strong> - настроен как диск горячей замены (hot-swap). При выходе из строя одного из основных дисков, 
                система автоматически использует этот диск для восстановления RAID-массива без простоя.
            </li>
            <li style="margin-bottom: 0.5rem;">
                <strong>/boot/efi</strong> - Раздел EFI необходим для загрузки системы в режиме UEFI. Он находится на RAID1 для отказоустойчивости.
            </li>
            <li style="margin-bottom: 0.5rem;">
                <strong>LUKS шифрование</strong> - Все основные разделы (кроме /boot и /boot/efi) зашифрованы с использованием LUKS.
                Расшифровка происходит автоматически при загрузке с использованием TPM2.
            </li>
            <li style="margin-bottom: 0.5rem;">
                <strong>/store</strong> - Отдельный RAID10-массив на аппаратном контроллере LSI MegaRAID, состоящий из 4 HDD дисков.
                Используется для хранения данных баз данных и пользовательских файлов.
            </li>
            <li style="margin-bottom: 0.5rem;">
                <strong>RAID1</strong> - Все критически важные разделы (/, /boot, /boot/efi, /home) защищены с помощью RAID1,
                что обеспечивает отказоустойчивость при выходе из строя одного из дисков.
            </li>
            <li style="margin-bottom: 0.5rem;">
                <strong>Производительность</strong> - PostgreSQL и другие базы данных рекомендуется размещать на /store для повышения
                производительности благодаря выделенному RAID10 массиву.
            </li>
            <li style="margin-bottom: 0.5rem;">
                <strong>Файловая система</strong> - Используется ext4 для всех разделов кроме /boot/efi (там используется FAT32,
                как требуется для UEFI загрузки).
            </li>
        </ul>
        <p style="margin-top: 1rem; font-style: italic; color: #4b5563;">
            Эта конфигурация обеспечивает максимальную надежность через избыточность RAID1, защиту через шифрование LUKS 
            и производительность через выделенный RAID10 массив для данных.
        </p>
    `;
    
    container.appendChild(table);
    container.appendChild(explanation);
}

// Function to render visual disk structure
function renderVisualDiskStructure(container) {
    // Create SVG container
    const svgContainer = document.createElement('div');
    svgContainer.style.width = '100%';
    svgContainer.style.height = '600px';
    svgContainer.style.overflow = 'auto';
    svgContainer.style.padding = '20px';
    
    // Create SVG element
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute('width', '900');
    svg.setAttribute('height', '500');
    svg.setAttribute('viewBox', '0 0 900 500');
    svg.style.display = 'block';
    svg.style.margin = '0 auto';
    
    // Define the disks
    const disks = [
        { name: 'Диск 1 (sda)', x: 100, width: 180, color: '#3b82f6' },
        { name: 'Диск 2 (sdb)', x: 350, width: 180, color: '#3b82f6' },
        { name: 'Диск 3 (sdc) - Hot Swap', x: 600, width: 180, color: '#ef4444' },
        { name: 'LSI MegaRAID (sdd)', x: 220, y: 380, width: 400, height: 60, color: '#8b5cf6' }
    ];
    
    // Define the partitions for the first three disks
    const partitions = [
        { name: 'sda1 → md0 (RAID1) → / (74.5G)', disk: 0, height: 90 },
        { name: 'sda2 → md1 (RAID1) → [SWAP] (4.7G)', disk: 0, height: 30 },
        { name: 'sda3 → md3 (RAID1) → /boot (954M)', disk: 0, height: 25 },
        { name: 'sda4 → md4 (RAID1) → /boot/efi (954M)', disk: 0, height: 25 },
        { name: 'sda5 → md2 (RAID1) → /home (142.5G)', disk: 0, height: 120 },
        
        { name: 'sdb1 → md0 (RAID1) → / (74.5G)', disk: 1, height: 90 },
        { name: 'sdb2 → md1 (RAID1) → [SWAP] (4.7G)', disk: 1, height: 30 },
        { name: 'sdb3 → md3 (RAID1) → /boot (954M)', disk: 1, height: 25 },
        { name: 'sdb4 (954M)', disk: 1, height: 25 },
        { name: 'sdb5 → md2 (RAID1) → /home (142.5G)', disk: 1, height: 120 },
        
        { name: 'sdc1 → md0 (RAID1) → / (74.5G)', disk: 2, height: 90 },
        { name: 'sdc2 → md1 (RAID1) → [SWAP] (4.7G)', disk: 2, height: 30 },
        { name: 'sdc3 → md3 (RAID1) → /boot (954M)', disk: 2, height: 25 },
        { name: 'sdc4 → md4 (RAID1) → /boot/efi (954M)', disk: 2, height: 25 },
        { name: 'sdc5 → md2 (RAID1) → /home (142.5G)', disk: 2, height: 120 }
    ];
    
    // Define the data disk
    const dataDisk = { name: 'sdd1 → /store (3.6T)', disk: 3, height: 60 };
    
    // Draw the disk containers
    disks.forEach((disk, index) => {
        // Create disk rectangle
        const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        disk.y = disk.y || 50; // Default y position
        disk.height = disk.height || 300; // Default height for the first three disks
        
        rect.setAttribute('x', disk.x);
        rect.setAttribute('y', disk.y);
        rect.setAttribute('width', disk.width);
        rect.setAttribute('height', disk.height);
        rect.setAttribute('rx', '5');
        rect.setAttribute('fill', 'white');
        rect.setAttribute('stroke', disk.color);
        rect.setAttribute('stroke-width', '2');
        
        // Add disk label
        const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
        text.setAttribute('x', disk.x + disk.width/2);
        text.setAttribute('y', disk.y - 15);
        text.setAttribute('text-anchor', 'middle');
        text.setAttribute('font-family', 'Arial, sans-serif');
        text.setAttribute('font-size', '14');
        text.setAttribute('font-weight', 'bold');
        text.setAttribute('fill', disk.color);
        text.textContent = disk.name;
        
        svg.appendChild(rect);
        svg.appendChild(text);
    });
    
    // Draw the partitions
    let yOffsets = [disks[0].y + 10, disks[1].y + 10, disks[2].y + 10];
    
    partitions.forEach(partition => {
        const disk = disks[partition.disk];
        const y = yOffsets[partition.disk];
        
        // Create partition rectangle
        const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        rect.setAttribute('x', disk.x + 10);
        rect.setAttribute('y', y);
        rect.setAttribute('width', disk.width - 20);
        rect.setAttribute('height', partition.height);
        rect.setAttribute('rx', '3');
        rect.setAttribute('fill', 'white');
        rect.setAttribute('stroke', disk.color);
        rect.setAttribute('stroke-width', '1.5');
        
        // Add partition label
        const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
        text.setAttribute('x', disk.x + disk.width/2);
        text.setAttribute('y', y + partition.height/2 + 5);
        text.setAttribute('text-anchor', 'middle');
        text.setAttribute('font-family', 'Arial, sans-serif');
        text.setAttribute('font-size', '11');
        text.setAttribute('fill', '#4b5563');
        text.textContent = partition.name;
        
        svg.appendChild(rect);
        svg.appendChild(text);
        
        yOffsets[partition.disk] += partition.height + 5;
    });
    
    // Draw data partition
    const dataDiskObj = disks[dataDisk.disk];
    
    // Draw data partition
    const dataRect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    dataRect.setAttribute('x', dataDiskObj.x + 10);
    dataRect.setAttribute('y', dataDiskObj.y);
    dataRect.setAttribute('width', dataDiskObj.width - 20);
    dataRect.setAttribute('height', dataDisk.height);
    dataRect.setAttribute('rx', '3');
    dataRect.setAttribute('fill', 'white');
    dataRect.setAttribute('stroke', dataDiskObj.color);
    dataRect.setAttribute('stroke-width', '1.5');
    
    // Add data partition label
    const dataText = document.createElementNS("http://www.w3.org/2000/svg", "text");
    dataText.setAttribute('x', dataDiskObj.x + dataDiskObj.width/2);
    dataText.setAttribute('y', dataDiskObj.y + dataDisk.height/2 + 5);
    dataText.setAttribute('text-anchor', 'middle');
    dataText.setAttribute('font-family', 'Arial, sans-serif');
    dataText.setAttribute('font-size', '14');
    dataText.setAttribute('fill', '#4b5563');
    dataText.textContent = dataDisk.name;
    
    svg.appendChild(dataRect);
    svg.appendChild(dataText);
    
    // Add arrows between corresponding RAID partitions
    const arrows = [
        { from: { x: disks[0].x + disks[0].width, y: disks[0].y + 45 }, to: { x: disks[1].x, y: disks[1].y + 45 } },
        { from: { x: disks[1].x + disks[1].width, y: disks[1].y + 45 }, to: { x: disks[2].x, y: disks[2].y + 45 } },
        { from: { x: disks[0].x + disks[0].width, y: disks[0].y + 45 + 30 + 5 + 15 }, to: { x: disks[1].x, y: disks[1].y + 45 + 30 + 5 + 15 } },
        { from: { x: disks[1].x + disks[1].width, y: disks[1].y + 45 + 30 + 5 + 15 }, to: { x: disks[2].x, y: disks[2].y + 45 + 30 + 5 + 15 } },
        { from: { x: disks[0].x + disks[0].width, y: disks[0].y + 45 + 30 + 5 + 15 + 25 + 5 + 12 }, to: { x: disks[1].x, y: disks[1].y + 45 + 30 + 5 + 15 + 25 + 5 + 12 } },
        { from: { x: disks[1].x + disks[1].width, y: disks[1].y + 45 + 30 + 5 + 15 + 25 + 5 + 12 }, to: { x: disks[2].x, y: disks[2].y + 45 + 30 + 5 + 15 + 25 + 5 + 12 } },
    ];
    
    arrows.forEach(arrow => {
        const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
        line.setAttribute('x1', arrow.from.x);
        line.setAttribute('y1', arrow.from.y);
        line.setAttribute('x2', arrow.to.x);
        line.setAttribute('y2', arrow.to.y);
        line.setAttribute('stroke', '#9ca3af');
        line.setAttribute('stroke-width', '1.5');
        line.setAttribute('stroke-dasharray', '5,3');
        
        svg.appendChild(line);
    });
    
    // Add legend at the bottom
    const legend = document.createElement('div');
    legend.style.marginTop = '20px';
    legend.style.display = 'flex';
    legend.style.justifyContent = 'center';
    legend.style.gap = '20px';
    legend.style.flexWrap = 'wrap';
    
    const legendItems = [
        { color: '#3b82f6', text: 'Основной диск' },
        { color: '#ef4444', text: 'Диск горячей замены (Hot Swap)' },
        { color: '#8b5cf6', text: 'Hardware RAID' },
    ];
    
    legendItems.forEach(item => {
        const legendItem = document.createElement('div');
        legendItem.style.display = 'flex';
        legendItem.style.alignItems = 'center';
        legendItem.style.gap = '8px';
        
        const colorSquare = document.createElement('div');
        colorSquare.style.width = '15px';
        colorSquare.style.height = '15px';
        colorSquare.style.backgroundColor = item.color;
        colorSquare.style.borderRadius = '3px';
        
        const legendText = document.createElement('span');
        legendText.textContent = item.text;
        
        legendItem.appendChild(colorSquare);
        legendItem.appendChild(legendText);
        legend.appendChild(legendItem);
    });
    
    // Add notes section
    const notes = document.createElement('div');
    notes.style.marginTop = '20px';
    notes.style.padding = '15px';
    notes.style.backgroundColor = '#f9fafb';
    notes.style.borderRadius = '8px';
    notes.style.border = '1px solid #e5e7eb';
    
    notes.innerHTML = `
        <h4 style="margin-top: 0; margin-bottom: 10px;">Примечания:</h4>
        <ul style="margin: 0; padding-left: 20px;">
            <li>Все критические разделы (/, /boot, /boot/efi, /home) защищены с помощью RAID1</li>
            <li>Диск 3 (sdc) настроен как диск горячей замены для быстрой замены при отказе</li>
            <li>Все разделы RAID1 (кроме /boot и /boot/efi) дополнительно зашифрованы с помощью LUKS</li>
            <li>Данные хранятся на отдельном аппаратном RAID10 массиве емкостью 3.6ТБ</li>
            <li>Настройка TPM2 обеспечивает автоматическую разблокировку зашифрованных разделов при загрузке</li>
            <li>Корневой раздел (/) содержит все системные файлы и компоненты</li>
            <li>Для работы баз данных критично размещать их на /store для лучшей производительности</li>
            <li>Конфигурация RAID1 обеспечивает защиту от отказа одного диска без потери данных</li>
        </ul>
        <p style="margin-top: 10px; font-style: italic; color: #4b5563;">
            Эта конфигурация оптимизирована для высокой надежности через избыточность RAID1, защиту через шифрование LUKS 
            и производительность через выделенный RAID10 массив для данных.
        </p>
    `;
    
    svgContainer.appendChild(svg);
    container.appendChild(svgContainer);
    container.appendChild(legend);
    container.appendChild(notes);
}

// Add new API functions for extending filesystem data
function addMountPoint(path, device, fstype, options, category = 'data') {
    // Function to add new mount points to the filesystem section
    const mountPoints = getMountPoints();
    mountPoints.push({ path, device, fstype, options, category });
    saveMountPoints(mountPoints);
    
    // Refresh the view if it's currently visible
    const container = document.getElementById('filesystem-diagram');
    if (container && container.dataset.currentView === 'mount') {
        renderMountPointsView(container);
    }
    
    return true;
}

function getMountPoints() {
    // Get mount points from localStorage or return default set
    const storedPoints = localStorage.getItem('mountPoints');
    if (storedPoints) {
        return JSON.parse(storedPoints);
    }
    
    // Return default mount points if nothing is stored
    return [
        { path: '/', device: '/dev/mapper/md0_crypt', fstype: 'ext4', options: 'defaults', category: 'system' },
        { path: '/boot', device: '/dev/md3', fstype: 'ext4', options: 'defaults', category: 'system' },
        { path: '/boot/efi', device: '/dev/md4', fstype: 'vfat', options: 'umask=0077', category: 'system' },
        { path: '/home', device: '/dev/mapper/md2_crypt', fstype: 'ext4', options: 'defaults', category: 'data' },
        { path: '/store', device: '/dev/sdd1', fstype: 'ext4', options: 'defaults', category: 'data' },
        { path: '[SWAP]', device: '/dev/mapper/md1_crypt', fstype: 'swap', options: 'defaults', category: 'system' },
        { path: '/store/postgresql/17/main', device: '/store/postgresql/17/main', fstype: 'bind', options: 'bind', category: 'data' }
    ];
}

function saveMountPoints(mountPoints) {
    // Save mount points to localStorage
    localStorage.setItem('mountPoints', JSON.stringify(mountPoints));
}

// Add API for disk management
function addDisk(name, size, partitions = []) {
    const disks = getDisks();
    disks.push({ name, size, partitions });
    saveDisks(disks);
    
    // Refresh the view if it's currently visible
    const container = document.getElementById('filesystem-diagram');
    if (container && container.dataset.currentView === 'physical') {
        renderPhysicalView(container);
    }
    
    return true;
}

function getDisks() {
    // Get disks from localStorage or return default set
    const storedDisks = localStorage.getItem('disks');
    if (storedDisks) {
        return JSON.parse(storedDisks);
    }
    
    // Return default disks if nothing is stored
    return [
        {
            name: 'Диск 1 (sda)',
            size: '223.6G',
            partitions: [
                { name: 'sda1', type: 'Linux system', size: '74.5G', raid: 'md0 (RAID1)', fs: 'LUKS → ext4', mount: '/' },
                { name: 'sda2', type: 'Linux swap', size: '4.7G', raid: 'md1 (RAID1)', fs: 'LUKS → swap', mount: '[SWAP]' },
                { name: 'sda3', type: 'Linux boot', size: '954M', raid: 'md3 (RAID1)', fs: 'ext4', mount: '/boot' },
                { name: 'sda4', type: 'EFI System', size: '954M', raid: 'md4 (RAID1)', fs: 'FAT32', mount: '/boot/efi' },
                { name: 'sda5', type: 'Linux home', size: '142.5G', raid: 'md2 (RAID1)', fs: 'LUKS → ext4', mount: '/home' }
            ]
        },
        {
            name: 'Диск 2 (sdb)',
            size: '223.6G',
            partitions: [
                { name: 'sdb1', type: 'Linux system', size: '74.5G', raid: 'md0 (RAID1)', fs: 'LUKS → ext4', mount: '/' },
                { name: 'sdb2', type: 'Linux swap', size: '4.7G', raid: 'md1 (RAID1)', fs: 'LUKS → swap', mount: '[SWAP]' },
                { name: 'sdb3', type: 'Linux boot', size: '954M', raid: 'md3 (RAID1)', fs: 'ext4', mount: '/boot' },
                { name: 'sdb4', type: 'EFI System', size: '954M', raid: 'md4 (RAID1)', fs: 'FAT32', mount: '/boot/efi' },
                { name: 'sdb5', type: 'Linux home', size: '142.5G', raid: 'md2 (RAID1)', fs: 'LUKS → ext4', mount: '/home' }
            ]
        },
        {
            name: 'Диск 3 (sdc) - Горячая замена (Hot Swap)',
            size: '223.6G',
            partitions: [
                { name: 'sdc1', type: 'Linux system', size: '74.5G', raid: 'md0 (RAID1)', fs: 'LUKS → ext4', mount: '/' },
                { name: 'sdc2', type: 'Linux swap', size: '4.7G', raid: 'md1 (RAID1)', fs: 'LUKS → swap', mount: '[SWAP]' },
                { name: 'sdc3', type: 'Linux boot', size: '954M', raid: 'md3 (RAID1)', fs: 'ext4', mount: '/boot' },
                { name: 'sdc4', type: 'EFI System', size: '954M', raid: 'md4 (RAID1)', fs: 'FAT32', mount: '/boot/efi' },
                { name: 'sdc5', type: 'Linux home', size: '142.5G', raid: 'md2 (RAID1)', fs: 'LUKS → ext4', mount: '/home' }
            ]
        },
        {
            name: 'Диск 3 (sdd) - LSI MegaRAID (Hot Swap)',
            size: '3.6T',
            partitions: [
                { name: 'sdd1', type: 'Linux system', size: '3.6T', raid: 'RAID10 (Hardware)', fs: 'ext4', mount: '/store' }
            ]
        }
    ];
}

function saveDisks(disks) {
    // Save disks to localStorage
    localStorage.setItem('disks', JSON.stringify(disks));
}