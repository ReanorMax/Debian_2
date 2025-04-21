// Структура данных для хранения всех блоков команд
// Каждый блок имеет:
// - id: уникальный идентификатор блока
// - title: заголовок блока
// - icon: иконка из Font Awesome
// - steps: массив шагов (инструкций), каждый шаг имеет описание и команду
// - description: общее описание того, что делает этот блок
// - notes: дополнительные примечания (необязательно)
// - warnings: предупреждения (необязательно)

const commandBlocks = [
    {
        id: "timeshift-setup",
        title: "Блок 1: Установка и настройка Timeshift",
        icon: "fa-solid fa-clock-rotate-left",
        steps: [
            {
                description: "Устанавливаем инструмент для создания точек восстановления системы (Timeshift)",
                command: "sudo apt update && sudo apt install -y timeshift",
                comment: "Обновление списка пакетов и установка утилиты Timeshift для создания точек восстановления системы"
            },
            {
                description: "Создаем начальную точку восстановления",
                command: "sudo timeshift --create --comments \"Первый снимок после установки Timeshift\"",
                comment: "Создание первой точки восстановления системы с комментарием"
            },
            {
                description: "Настройка SSH для разрешения удаленного входа под пользователем root",
                command: "sudo sed -i 's/^#PermitRootLogin.*/PermitRootLogin yes/' /etc/ssh/sshd_config && sudo sed -i 's/^#PermitRootLogin.*/PermitRootLogin yes/' /etc/ssh/sshd_config",
                comment: "Разрешение входа в систему по SSH под пользователем root путем изменения конфигурационного файла SSH"
            },
            {
                description: "Применяем новые настройки SSH перезапуском службы",
                command: "sudo systemctl restart ssh",
                comment: "Перезапуск службы SSH для применения новых настроек"
            }
        ],
        description: "В этом блоке мы устанавливаем и настраиваем Timeshift для создания точек восстановления системы, что позволит нам вернуться к рабочему состоянию в случае ошибок в дальнейшей настройке. Также настраиваем SSH для удаленного администрирования.",
        notes: "Timeshift работает аналогично Time Machine в macOS или Системному восстановлению в Windows, создавая снимки системы, к которым можно вернуться в случае сбоя.",
        warnings: "Разрешение входа под пользователем root по SSH может представлять угрозу безопасности. В производственной среде рекомендуется использовать ключи SSH и отключить вход по паролю."
    },
    {
        id: "raid-efi-setup",
        title: "Блок 2: Создание отказоустойчивого EFI раздела с RAID1",
        icon: "fa-solid fa-hard-drive",
        steps: [
            {
                description: "Устанавливаем необходимые утилиты для работы с RAID и EFI",
                command: "sudo apt update && sudo apt install -y mdadm efibootmgr",
                comment: "Обновление списка пакетов и установка утилит (mdadm для работы с RAID, efibootmgr для управления загрузчиком)"
            },
            {
                description: "Создаем RAID1 массив для EFI раздела",
                command: "sudo mdadm --create --verbose /dev/md4 --level=1 --raid-devices=2 --metadata=1.0 /dev/sdb4 /dev/sdc4",
                comment: "Создание RAID1 массива на разметке GPT с метаданными версии 1.0 из двух партиций (/dev/sdb4 и /dev/sdc4)"
            },
            {
                description: "Форматируем созданный RAID массив в FAT32 для EFI",
                command: "sudo mkfs.vfat /dev/md4",
                comment: "Форматирование созданного RAID1 массива в файловую систему FAT32 (требуется для EFI раздела)"
            },
            {
                description: "Создаем точку монтирования и монтируем RAID массив",
                command: "sudo mkdir -p /boot/efi && sudo mount /dev/md4 /boot/efi",
                comment: "Создание точки монтирования для EFI раздела и монтирование RAID массива"
            },
            {
                description: "Добавляем запись в fstab для автомонтирования при загрузке",
                command: "sudo blkid -s UUID -o value /dev/md4 | xargs -I {} sh -c 'echo \"UUID={} /boot/efi vfat umask=0077 0 1\" >> /etc/fstab'",
                comment: "Получение UUID созданного RAID массива и добавление записи в fstab для автоматического монтирования при загрузке"
            },
            {
                description: "Добавляем конфигурацию RAID в mdadm.conf",
                command: "sudo mdadm --examine --scan | grep metadata=1.0 >> /etc/mdadm/mdadm.conf",
                comment: "Добавление конфигурации RAID массива в mdadm.conf для восстановления массива при загрузке"
            },
            {
                description: "Обновляем initramfs для поддержки RAID при загрузке",
                command: "sudo update-initramfs -u",
                comment: "Обновление initramfs для включения поддержки RAID при загрузке"
            },
            {
                description: "Устанавливаем GRUB на оба диска для отказоустойчивости",
                command: "sudo grub-install --target=x86_64-efi --efi-directory=/boot/efi --bootloader-id=debian --recheck /dev/sdb\nsudo grub-install --target=x86_64-efi --efi-directory=/boot/efi --bootloader-id=debian --recheck /dev/sdc\nsudo update-grub",
                comment: "Установка GRUB на оба диска и обновление конфигурации загрузчика"
            },
            {
                description: "Проверка состояния RAID массива",
                command: "cat /proc/mdstat",
                comment: "Проверка состояния созданного RAID массива"
            },
            {
                description: "Проверка монтирования EFI раздела",
                command: "mount | grep efi",
                comment: "Проверка корректного монтирования EFI раздела"
            },
            {
                description: "Проверка записей загрузчика EFI",
                command: "efibootmgr -v",
                comment: "Проверка настроек и записей загрузчика EFI"
            }
        ],
        description: "В этом блоке мы создаем отказоустойчивый EFI раздел на базе RAID1, настраиваем автоматическое монтирование и устанавливаем загрузчик GRUB на оба диска. Такая конфигурация обеспечивает бесперебойную загрузку системы даже при выходе из строя одного из дисков.",
        notes: "Конечный результат: 1) Создан отказоустойчивый EFI раздел на базе RAID1; 2) Настроено автоматическое монтирование EFI раздела; 3) Добавлена поддержка RAID в конфигурацию системы; 4) Установлен загрузчик GRUB на оба диска; 5) Система готова к работе с двумя дисками, где любой из них может быть использован для загрузки.",
        warnings: "Важно: перед выполнением этих команд сделайте резервную копию существующего EFI раздела: mkdir -p /backup/efi && cp -a /boot/efi/* /backup/efi/"
    },
    {
        id: "nginx-php-postgresql",
        title: "Блок 3: Настройка сервера с Nginx, PHP и PostgreSQL",
        icon: "fa-solid fa-server",
        steps: [
            {
                description: "Обновляем систему и пакеты",
                command: "sudo apt update && sudo apt upgrade -y",
                comment: "Обновление списка пакетов и существующих программ до актуальных версий"
            },
            {
                description: "Добавляем специализированные репозитории для PHP",
                command: "[ \"$(lsb_release -is)\" = \"Ubuntu\" ] && sudo add-apt-repository ppa:ondrej/php -y || echo \"deb http://deb.debian.org/debian $(lsb_release -cs)-backports main\" | sudo tee /etc/apt/sources.list.d/backports.list",
                comment: "Добавление репозиториев для PHP (автоматически определяем Ubuntu или Debian)"
            },
            {
                description: "Устанавливаем основные системные утилиты",
                command: "sudo apt install -y mc sudo net-tools dosfstools command-not-found apt-file plocate git vim curl wget libnewt-dev libssl-dev libncurses5-dev subversion libsqlite3-dev build-essential libjansson-dev libxml2-dev uuid-dev libcurl4-gnutls-dev timeshift",
                comment: "Установка набора необходимых программ и библиотек для работы системы и разработки"
            },
            {
                description: "Настраиваем инструменты поиска пакетов",
                command: "sudo /etc/cron.daily/plocate && sudo apt-file update && sudo update-command-not-found",
                comment: "Обновление баз данных для поисковых инструментов (помогает при поиске команд и пакетов)"
            },
            {
                description: "Устанавливаем и настраиваем веб-сервер Nginx",
                command: "command -v nginx || (sudo apt install -y nginx && sudo systemctl enable nginx && sudo systemctl start nginx)",
                comment: "Установка Nginx, если он еще не установлен, включение автозапуска и запуск службы"
            },
            {
                description: "Устанавливаем базовую версию PHP",
                command: "command -v php || sudo apt install -y php",
                comment: "Базовая установка PHP, если он еще не установлен в системе"
            },
            {
                description: "Устанавливаем PHP 8.2 с необходимыми модулями",
                command: "PHP_VERSION=\"8.2\"\ndpkg -l | grep -q \"php$PHP_VERSION\" || (sudo apt install -y php$PHP_VERSION php$PHP_VERSION-fpm php$PHP_VERSION-pgsql php$PHP_VERSION-cli php$PHP_VERSION-common php$PHP_VERSION-opcache php$PHP_VERSION-mysql php$PHP_VERSION-zip php$PHP_VERSION-gd php$PHP_VERSION-mbstring php$PHP_VERSION-curl php$PHP_VERSION-xml php$PHP_VERSION-bcmath && sudo systemctl enable php$PHP_VERSION-fpm && sudo systemctl start php$PHP_VERSION-fpm)",
                comment: "Установка PHP 8.2 со всеми необходимыми модулями (для работы с PostgreSQL, MySQL и другими функциями)"
            },
            {
                description: "Устанавливаем и настраиваем PostgreSQL",
                command: "dpkg -l | grep -q \"postgresql\" || (sudo apt install -y postgresql postgresql-contrib && sudo systemctl start postgresql && sudo systemctl enable postgresql)",
                comment: "Установка PostgreSQL с дополнительными компонентами, если он еще не установлен"
            },
            {
                description: "Создаем точку восстановления после завершения настройки",
                command: "command -v timeshift && sudo timeshift --create --comments \"Система настроена для работы с Nginx, PHP, PostgreSQL\"",
                comment: "Создание снимка системы через Timeshift после завершения основной настройки"
            },
            {
                description: "Проверяем состояние службы Nginx",
                command: "systemctl status nginx",
                comment: "Проверка текущего состояния веб-сервера Nginx"
            },
            {
                description: "Проверяем состояние службы PHP-FPM",
                command: "systemctl status php8.2-fpm",
                comment: "Проверка текущего состояния службы PHP-FPM"
            },
            {
                description: "Проверяем состояние службы PostgreSQL",
                command: "systemctl status postgresql",
                comment: "Проверка текущего состояния СУБД PostgreSQL"
            },
            {
                description: "Просмотр существующих точек восстановления",
                command: "timeshift --list",
                comment: "Список всех созданных точек восстановления системы"
            }
        ],
        description: "В этом блоке мы устанавливаем и настраиваем стек технологий для веб-сервера: Nginx в качестве веб-сервера, PHP 8.2 с модулем FPM для обработки PHP-скриптов, и PostgreSQL в качестве СУБД. Такая конфигурация является основой для размещения современных веб-приложений.",
        notes: "После выполнения этого блока вы получите: 1) полностью настроенный веб-сервер Nginx; 2) PHP 8.2 с необходимыми расширениями; 3) СУБД PostgreSQL, готовую к использованию; 4) все службы настроены на автозапуск; 5) создана точка восстановления на случай непредвиденных проблем.",
        warnings: "После установки PostgreSQL рекомендуется изменить пароль пользователя postgres для повышения безопасности. Для этого выполните: sudo -u postgres psql -c \"ALTER USER postgres WITH PASSWORD 'новый_пароль';\""
    },
    {
        id: "mysql-setup",
        title: "Блок 4: Установка и настройка MySQL",
        icon: "fa-solid fa-database",
        steps: [
            {
                description: "Проверяем наличие MySQL",
                command: "dpkg -l | grep -q '^ii.*mysql-server' && echo \"MySQL уже установлен.\" || echo \"MySQL не обнаружен. Начинаем установку...\"",
                comment: "Проверка наличия установленного MySQL сервера в системе перед началом установки"
            },
            {
                description: "Устанавливаем необходимые утилиты и библиотеки",
                command: "sudo apt update -y && sudo apt install -y wget lsb-release gnupg2 libboost-all-dev php-mysql php-curl php-mbstring php-xml php-gd",
                comment: "Обновление списка пакетов и установка необходимых утилит для загрузки файлов, работы с ключами GPG, а также библиотек Boost и модулей PHP"
            },
            {
                description: "Добавляем официальный репозиторий MySQL и устанавливаем сервер",
                command: "[ \"$(dpkg -l | grep -c '^ii.*mysql-server')\" -eq 0 ] && {\nwget https://dev.mysql.com/get/mysql-apt-config_0.8.33-1_all.deb\nsudo dpkg -i mysql-apt-config_0.8.33-1_all.deb\nsudo dpkg-reconfigure mysql-apt-config\nsudo apt update -y\nsudo DEBIAN_FRONTEND=noninteractive apt install -y mysql-server mysql-client libmysqlclient-dev",
                comment: "Если Michigan не установлен: 1) Загрузка и установка конфигурационного пакета MySQL; 2) Настройка репозитория; 3) Установка MySQL сервера, клиента и библиотек разработчика"
            },
            {
                description: "Настраиваем безопасность MySQL",
                command: "echo \"ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY '';\" | sudo mysql\necho \"FLUSH PRIVILEGES;\" | sudo mysql",
                comment: "Настройка аутентификации для пользователя root и обновление привилегий"
            },
            {
                description: "Настраиваем автозапуск службы MySQL",
                command: "sudo systemctl start mysql && sudo systemctl enable mysql",
                comment: "Запуск службы MySQL и включение автозапуска при загрузке системы"
            },
            {
                description: "Проверяем состояние службы MySQL",
                command: "sudo systemctl status mysql > /dev/null && echo \"MySQL работает корректно.\" || { echo \"MySQL не запущен!\"; exit 1; }",
                comment: "Проверка статуса MySQL: успешно работает или завершение скрипта с ошибкой, если служба не запущена"
            }
        ],
        description: "В этом блоке мы устанавливаем и настраиваем MySQL - популярную реляционную СУБД для хранения данных веб-приложений. Блок включает установку сервера и клиента MySQL из официальных репозиториев, базовую настройку безопасности и проверку работоспособности.",
        notes: "После выполнения этого блока вы получите: 1) полностью функциональный MySQL сервер; 2) настроенную аутентификацию пользователя root; 3) все необходимые модули PHP для работы с MySQL; 4) службу, настроенную на автоматический запуск при загрузке системы.",
        warnings: "По умолчанию мы настраиваем пустой пароль для пользователя root MySQL. В производственной среде обязательно установите надежный пароль, изменив соответствующую команду. Также рекомендуется выполнить sudo mysql_secure_installation для дополнительной защиты сервера."
    },
    {
        id: "asterisk-setup",
        title: "Блок 5: Установка и настройка Asterisk",
        icon: "fa-solid fa-phone",
        steps: [
            {
                description: "Обновление системы и установка зависимостей",
                command: "sudo apt-get update\nsudo apt-get install -y build-essential libjansson-dev libxml2-dev libncurses5-dev libpq-dev wget libedit-dev php-mysqli php-mysql php-pdo php-sqlite3 mysql-server libmysqlclient-dev",
                comment: "Установка необходимых библиотек и инструментов для сборки Asterisk"
            },
            {
                description: "Проверка наличия существующей установки Asterisk",
                command: "ls /usr/local/asterisk/sbin/asterisk",
                comment: "Проверяем, не установлен ли уже Asterisk в системе"
            },
            {
                description: "Создание директории для исходников и переход в неё",
                command: "mkdir -p /root/install_ks/pack/dists/asterisk/\ncd /root/install_ks/pack/dists/asterisk/",
                comment: "Подготовка рабочей директории для сборки Asterisk"
            },
            {
                description: "Загрузка и распаковка исходного кода Asterisk",
                command: "wget http://downloads.asterisk.org/pub/telephony/asterisk/asterisk-18-current.tar.gz\ntar xf asterisk-18-current.tar.gz\ncd asterisk-18.*",
                comment: "Получение последней версии исходного кода Asterisk 18 и его распаковка"
            },
            {
                description: "Конфигурация и компиляция Asterisk",
                command: "./configure --prefix=/usr/local/asterisk --with-mysqlclient --with-jansson-bundled\nmake",
                comment: "Настройка параметров сборки и компиляция Asterisk с поддержкой MySQL"
            },
            {
                description: "Настройка модулей Asterisk",
                command: "make menuselect",
                comment: "Интерактивное меню для выбора модулей. Активируйте res_config_mysql, app_mysql и cdr_mysql"
            },
            {
                description: "Установка Asterisk",
                command: "make install",
                comment: "Установка скомпилированных файлов в систему"
            },
            {
                description: "Настройка конфигурационных файлов",
                command: "rm -rf /usr/local/asterisk/etc/asterisk\nmkdir -p /usr/local/asterisk/etc\ntar xf /root/install_ks/pack/asterisk.tar.gz -C /usr/local/asterisk/etc/\nln -s /usr/local/asterisk/etc/asterisk /etc/asterisk",
                comment: "Установка и настройка конфигурационных файлов Asterisk"
            },
            {
                description: "Создание символических ссылок",
                command: "ln -sf /usr/local/asterisk/sbin/astcanary /usr/bin/astcanary\nln -sf /usr/local/asterisk/sbin/astdb2bdb /usr/bin/astdb2bdb\nln -sf /usr/local/asterisk/sbin/astdb2sqlite3 /usr/bin/astdb2sqlite3\nln -sf /usr/local/asterisk/sbin/asterisk /usr/bin/asterisk\nln -sf /usr/local/asterisk/sbin/astgenkey /usr/bin/astgenkey\nln -sf /usr/local/asterisk/sbin/astversion /usr/bin/astversion\nln -sf /usr/local/asterisk/sbin/autosupport /usr/bin/autosupport\nln -sf /usr/local/asterisk/sbin/rasterisk /usr/bin/rasterisk\nln -sf /usr/local/asterisk/sbin/safe_asterisk /usr/bin/safe_asterisk",
                comment: "Создание символических ссылок для удобного доступа к утилитам Asterisk"
            },
            {
                description: "Настройка баз данных MySQL",
                command: "mysql -u root -e \"CREATE DATABASE IF NOT EXISTS DBLicence;\"\nmysql -u root -e \"CREATE DATABASE IF NOT EXISTS asterisk;\"\nmysql -u root DBLicence < /root/install_ks/pack/DBLicence.sql\nmysql -u root asterisk < /root/install_ks/pack/asterisk.sql",
                comment: "Создание и инициализация необходимых баз данных"
            },
            {
                description: "Установка веб-интерфейса",
                command: "cd /var/www/\ncp /root/install_ks/pack/htdocs.tar.gz ./\ntar xf htdocs.tar.gz",
                comment: "Установка веб-интерфейса для управления Asterisk"
            },
            {
                description: "Настройка планировщика задач",
                command: "crontab -e",
                comment: "Добавьте следующие строки:\n@reboot sleep 15 && /usr/local/asterisk/etc/asterisk/script/daemon/poller\n@reboot sleep 45 && php /usr/local/asterisk/etc/asterisk/script/ami/talk_detect.php\n*/5 * * * * /usr/local/asterisk/etc/asterisk/script/daemon/poller"
            }
        ],
        description: "Установка и настройка Asterisk - открытой системы телефонии. Включает компиляцию из исходного кода, настройку модулей MySQL, установку веб-интерфейса и настройку автоматизации.",
        notes: "После установки проверьте работу Asterisk командой 'asterisk -r' и убедитесь, что все модули загружены командой 'module show' в консоли Asterisk.",
        warnings: "Процесс компиляции может занять значительное время. Убедитесь, что у вас достаточно свободного места на диске и оперативной памяти."
    },
    {
        id: "postgresql-setup",
        title: "Блок 6: Установка и настройка PostgreSQL 17 с TimescaleDB",
        icon: "fa-solid fa-database",
        steps: [
            {
                description: "Создание и настройка каталога данных PostgreSQL",
                command: "POSTGRES_DATA_DIR=\"/store/postgresql/17/main\"\nsudo mkdir -p \"$POSTGRES_DATA_DIR\"\nsudo chown -R postgres:postgres \"$POSTGRES_DATA_DIR\"\nsudo chmod 700 \"$POSTGRES_DATA_DIR\"",
                comment: "Создание каталога для данных PostgreSQL и установка необходимых прав доступа"
            },
            {
                description: "Добавление официального репозитория PostgreSQL",
                command: "wget --quiet -O - https://www.postgresql.org/media/keys/ACCC4CF8.asc | sudo gpg --dearmor -o /usr/share/keyrings/postgresql.gpg\necho \"deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/postgresql.gpg] http://apt.postgresql.org/pub/repos/apt $(lsb_release -cs)-pgdg main\" | sudo tee /etc/apt/sources.list.d/pgdg.list > /dev/null",
                comment: "Импорт ключа подписи и добавление репозитория PostgreSQL"
            },
            {
                description: "Установка PostgreSQL 17",
                command: "sudo apt update\nsudo apt install -y postgresql-17 postgresql-contrib-17",
                comment: "Установка основного сервера PostgreSQL и дополнительных компонентов"
            },
            {
                description: "Создание кластера PostgreSQL",
                command: "if ! pg_lsclusters | grep -q \"17 main\"; then\n    sudo pg_createcluster --datadir=\"$POSTGRES_DATA_DIR\" 17 main --start\nelse\n    echo \"[INFO] Кластер PostgreSQL 17 уже существует.\"\nfi",
                comment: "Создание нового кластера PostgreSQL если он еще не существует"
            },
            {
                description: "Добавление репозитория TimescaleDB",
                command: "echo \"deb https://packagecloud.io/timescale/timescaledb/debian/ $(lsb_release -cs) main\" | sudo tee /etc/apt/sources.list.d/timescaledb.list > /dev/null",
                comment: "Добавление репозитория TimescaleDB для установки расширения"
            },
            {
                description: "Импорт ключа TimescaleDB",
                command: "wget --quiet -O - https://packagecloud.io/timescale/timescaledb/gpgkey | sudo gpg --dearmor -o /etc/apt/trusted.gpg.d/timescaledb.gpg",
                comment: "Импорт ключа подписи TimescaleDB"
            },
            {
                description: "Установка TimescaleDB",
                command: "sudo apt update\nsudo apt install -y timescaledb-2-postgresql-17",
                comment: "Установка расширения TimescaleDB для PostgreSQL 17"
            },
            {
                description: "Настройка и применение TimescaleDB",
                command: "sudo timescaledb-tune --quiet --yes\nsudo systemctl restart postgresql@17-main",
                comment: "Автоматическая настройка параметров PostgreSQL для TimescaleDB и перезапуск службы"
            },
            {
                description: "Создание пользователя zabbix в PostgreSQL",
                command: "if ! sudo -u postgres psql -tAc \"SELECT 1 FROM pg_roles WHERE rolname='zabbix'\" | grep -q 1; then\n    sudo -u postgres createuser --pwprompt zabbix\nelse\n    echo \"[INFO] Пользователь zabbix уже существует.\"\nfi",
                comment: "Создание пользователя zabbix для работы с базой данных"
            },
            {
                description: "Создание базы данных для Zabbix",
                command: "if ! sudo -u postgres psql -lqt | cut -d \\| -f 1 | grep -qw \"zabbix\"; then\n    sudo -u postgres createdb -O zabbix zabbix\nelse\n    echo \"[INFO] База данных zabbix уже существует.\"\nfi",
                comment: "Создание базы данных zabbix с владельцем zabbix"
            },
            {
                description: "Добавление расширения TimescaleDB в базу Zabbix",
                command: "if ! sudo -u postgres psql -d zabbix -c \"\\dx\" | grep -q \"timescaledb\"; then\n    sudo -u postgres psql -d zabbix -c \"CREATE EXTENSION IF NOT EXISTS timescaledb;\"\nelse\n    echo \"[INFO] Расширение TimescaleDB уже добавлено в базу данных Zabbix.\"\nfi",
                comment: "Добавление расширения TimescaleDB в базу данных zabbix для расширенных возможностей работы с временными рядами"
            }
        ],
        description: "В этом блоке мы устанавливаем и настраиваем PostgreSQL 17 с расширением TimescaleDB, создаем пользователя и базу данных для Zabbix. TimescaleDB добавляет новые возможности для обработки и хранения временных данных, что особенно полезно для систем мониторинга.",
        notes: "После установки у вас будет настроен PostgreSQL 17 с оптимизированными параметрами для работы с TimescaleDB. Создан пользователь и база данных для Zabbix с поддержкой расширенных возможностей TimescaleDB.",
        warnings: "Перед установкой убедитесь, что у вас достаточно места на диске в каталоге /store. Также рекомендуется сделать резервную копию данных, если вы обновляете существующую установку PostgreSQL."
    },
    {
        id: "nginx-zabbix-setup",
        title: "Блок 7: Установка и настройка Nginx для Zabbix",
        icon: "fa-solid fa-globe",
        steps: [
            {
                description: "Проверка наличия установленной службы Nginx",
                command: "systemctl list-units --full -all | grep -qw \"nginx.service\"",
                comment: "Проверяем, установлен ли Nginx через systemd"
            },
            {
                description: "Установка веб-сервера Nginx",
                command: "sudo apt install -y nginx",
                comment: "Установка Nginx для обслуживания веб-интерфейса Zabbix"
            },
            {
                description: "Включение и запуск службы Nginx",
                command: "sudo systemctl enable nginx\nsudo systemctl start nginx",
                comment: "Включение автозапуска и запуск службы Nginx"
            },
            {
                description: "Создание конфигурационного файла для Zabbix",
                command: `NGINX_CONF_FILE="/etc/nginx/sites-available/zabbix"\n\ncat <<EOF > "$NGINX_CONF_FILE"\nserver {\n    listen 80;\n    server_name localhost;\n\n    root /usr/share/zabbix;\n    index index.php index.html index.htm;\n\n    location / {\n        try_files \$uri \$uri/ =404;\n    }\n\n    error_page 404 /404.html;\n    error_page 500 502 503 504 /50x.html;\n\n    location ~ \\.php$ {\n        include snippets/fastcgi-php.conf;\n        fastcgi_pass unix:/var/run/php/php8.2-fpm.sock;\n        fastcgi_param SCRIPT_FILENAME \$document_root\$fastcgi_script_name;\n        include fastcgi_params;\n    }\n\n    location ~ /\\.ht {\n        deny all;\n    }\n}\nEOF`,
                comment: "Создание конфигурационного файла Nginx для Zabbix с настройками PHP-FPM"
            },
            {
                description: "Создание символической ссылки для активации конфигурации",
                command: "sudo ln -sf /etc/nginx/sites-available/zabbix /etc/nginx/sites-enabled/zabbix",
                comment: "Активация конфигурации Nginx для Zabbix через символическую ссылку"
            },
            {
                description: "Перезапуск Nginx для применения изменений",
                command: "sudo systemctl restart nginx",
                comment: "Перезапуск службы Nginx для применения новой конфигурации"
            }
        ],
        description: "Этот блок настраивает веб-сервер Nginx для работы с Zabbix. Включает установку Nginx, создание специальной конфигурации для обработки PHP-скриптов и настройку виртуального хоста.",
        notes: "После выполнения этого блока у вас будет настроен веб-сервер, готовый для обслуживания веб-интерфейса Zabbix с поддержкой PHP-FPM.",
        warnings: "Убедитесь, что порт 80 не занят другими службами. Также проверьте, что путь к сокету PHP-FPM соответствует вашей версии PHP."
    },
    {
        id: "zabbix-setup",
        title: "Блок 8: Установка и настройка Zabbix",
        icon: "fa-solid fa-chart-line",
        steps: [
            {
                description: "Добавление официального репозитория Zabbix",
                command: "wget https://repo.zabbix.com/zabbix/7.2/release/debian/pool/main/z/zabbix-release/zabbix-release_latest_7.2+debian$(lsb_release -rs)_all.deb\nsudo dpkg -i zabbix-release_latest_7.2+debian$(lsb_release -rs)_all.deb\nsudo apt update",
                comment: "Загрузка и установка пакета с репозиторием Zabbix, обновление списка пакетов"
            },
            {
                description: "Установка компонентов Zabbix",
                command: "sudo apt install -y zabbix-server-pgsql zabbix-frontend-php php8.2-pgsql zabbix-nginx-conf zabbix-sql-scripts zabbix-agent",
                comment: "Установка сервера Zabbix с поддержкой PostgreSQL, веб-интерфейса, агента и других компонентов"
            },
            {
                description: "Инициализация базы данных Zabbix",
                command: "gunzip -c /usr/share/zabbix/sql-scripts/postgresql/server.sql.gz | sudo -u postgres psql -d zabbix",
                comment: "Импорт начальной схемы базы данных Zabbix"
            },
            {
                description: "Настройка подключения к базе данных",
                command: "sudo sed -i '/^DBName=/s/=.*/=zabbix/' /etc/zabbix/zabbix_server.conf\nsudo sed -i '/^DBUser=/s/=.*/=zabbix/' /etc/zabbix/zabbix_server.conf\nsudo sed -i '/^DBPassword=/s/=.*/=ваш_пароль/' /etc/zabbix/zabbix_server.conf",
                comment: "Настройка параметров подключения к базе данных PostgreSQL в конфигурации Zabbix"
            },
            {
                description: "Настройка часового пояса PHP",
                command: "sudo sed -i \"s/^;date.timezone =$/date.timezone = Europe\\/Moscow/\" /etc/php/8.2/fpm/php.ini\nsudo systemctl restart php8.2-fpm",
                comment: "Установка часового пояса для PHP и перезапуск PHP-FPM"
            },
            {
                description: "Активация и запуск служб Zabbix",
                command: "sudo systemctl enable zabbix-server zabbix-agent\nsudo systemctl start zabbix-server zabbix-agent",
                comment: "Включение автозапуска и запуск основных служб Zabbix"
            }
        ],
        description: "В этом блоке мы устанавливаем систему мониторинга Zabbix с использованием PostgreSQL в качестве базы данных. Настраиваем все необходимые компоненты, включая веб-интерфейс через Nginx и агент для локального мониторинга.",
        notes: "После выполнения всех команд веб-интерфейс Zabbix будет доступен по адресу http://your_host/zabbix/. При первом входе используйте логин Admin и пароль zabbix.",
        warnings: "Обязательно измените стандартный пароль пользователя Admin после первого входа в систему. Также убедитесь, что вы заменили 'ваш_пароль' на реальный пароль для пользователя базы данных."
    },
    {
        id: "zabbix-sql-setup",
        title: "Блок 9: Импорт SQL-файла в базу данных Zabbix",
        icon: "fa-solid fa-database",
        steps: [
            {
                description: "Проверка существования SQL-файла",
                command: "ls /root/install_ks/pack/zabbix_st_tables.sql",
                comment: "Проверка наличия файла zabbix_st_tables.sql"
            },
            {
                description: "Создание роли zadmin",
                command: "sudo -u postgres psql -c \"DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname='zadmin') THEN CREATE ROLE zadmin SUPERUSER LOGIN PASSWORD 'Hfdpbnbt2021'; END IF; END $$;\"",
                comment: "Создание роли zadmin с правами суперпользователя, если она не существует"
            },
            {
                description: "Проверка существования базы данных zabbix",
                command: "psql -U postgres -t -c \"SELECT 1 FROM pg_database WHERE datname='zabbix';\"",
                comment: "Проверка наличия базы данных zabbix"
            },
            {
                description: "Создание базы данных zabbix (если не существует)",
                command: "if ! psql -U postgres -t -c \"SELECT 1 FROM pg_database WHERE datname='zabbix'\" | grep -q 1; then\n    sudo -u postgres createdb -O zabbix zabbix\nfi",
                comment: "Создание базы данных zabbix, если она не существует"
            },
            {
                description: "Установка прав доступа к SQL-файлу",
                command: "chmod 644 /root/install_ks/pack/zabbix_st_tables.sql",
                comment: "Установка необходимых прав доступа для чтения SQL-файла"
            },
            {
                description: "Импорт SQL-файла в базу данных",
                command: "psql -U zabbix -d zabbix -f /root/install_ks/pack/zabbix_st_tables.sql",
                comment: "Импорт структуры таблиц и данных в базу данных zabbix"
            }
        ],
        description: "В этом блоке мы импортируем дополнительные таблицы и данные в базу данных Zabbix. Создаем необходимую роль zadmin с правами суперпользователя и проверяем существование всех необходимых компонентов перед импортом.",
        notes: "После выполнения всех команд будут созданы: 1) Роль zadmin с необходимыми правами; 2) Импортированы все необходимые таблицы в базу данных zabbix.",
        warnings: "Важно! Храните пароли в безопасном месте и измените их после установки. В производственной среде используйте более надежные пароли."
    },
    {
        id: "tpm-luks-setup",
        title: "Блок 10: Настройка TPM и LUKS в Debian",
        icon: "fa-solid fa-shield-halved",
        steps: [
            {
                description: "Установка необходимых пакетов для работы с TPM и LUKS",
                command: "apt update\napt install -y clevis clevis-luks clevis-systemd clevis-tpm2 tpm2-tools clevis-initramfs\nupdate-initramfs -u -k all",
                comment: "Установка Clevis, TPM2 Tools и обновление initramfs для поддержки автоматической расшифровки"
            },
            {
                description: "Привязка TPM к устройству с LUKS",
                command: "clevis luks bind -d /dev/md1 tpm2 '{\"pcr_bank\":\"sha256\",\"pcr_ids\":\"7\"}'",
                comment: "Привязка TPM к зашифрованному устройству с использованием PCR7 (метрики загрузки)"
            },
            {
                description: "Проверка текущего состояния LUKS после смены материнской платы",
                command: "cryptsetup luksDump /dev/md0",
                comment: "Отображение информации о слотах LUKS и их состоянии"
            },
            {
                description: "Отвязка старой привязки Clevis/TPM",
                command: "clevis luks unbind -d /dev/md0 -s 1",
                comment: "Удаление существующей привязки TPM из слота 1"
            },
            {
                description: "Очистка PCR №7",
                command: "tpm2_pcrextend 7:sha256=0",
                comment: "Сброс значения PCR №7 после смены материнской платы"
            },
            {
                description: "Создание новой привязки TPM",
                command: "clevis luks bind -d /dev/md0 tpm2 '{\"pcr_bank\":\"sha256\",\"pcr_ids\":\"7\"}'",
                comment: "Создание новой привязки TPM к устройству после смены оборудования"
            },
            {
                description: "Обновление initramfs",
                command: "update-initramfs -u",
                comment: "Обновление initramfs для применения новой конфигурации TPM"
            }
        ],
        description: "Этот блок описывает процесс настройки автоматической расшифровки диска с помощью TPM через LUKS, включая процедуру миграции после замены материнской платы. Используется Clevis для управления ключами и TPM 2.0 для безопасного хранения ключей шифрования.",
        notes: "После выполнения этой инструкции система будет автоматически расшифровывать диск при загрузке, используя TPM для безопасного хранения ключей.",
        warnings: "Обязательно сохраните пароль от LUKS в надежном месте! При сбое TPM или замене материнской платы он потребуется для восстановления доступа к данным."
    },
    {
        id: "sphera-shell-setup",
        title: "Блок 11: Настройка интерактивной оболочки пользователя sphera",
        icon: "fa-solid fa-terminal",
        steps: [
            {
                description: "Изменение файла .bashrc пользователя sphera",
                command: "echo '\n# Запуск скрипта startscript.sh при входе пользователя sphera\nif [ \"$USER\" = \"sphera\" ]; then\n  sudo /usr/local/bin/startscript.sh\nfi' >> /home/sphera/.bashrc",
                comment: "Добавление автоматического запуска startscript.sh при входе пользователя sphera"
            },
            {
                description: "Создание конфигурации sudoers для пользователя sphera",
                command: "echo 'sphera ALL=(ALL) NOPASSWD: /usr/local/bin/startscript.sh' | sudo tee /etc/sudoers.d/sphera",
                comment: "Настройка прав для запуска скрипта без пароля"
            },
            {
                description: "Установка прав на выполнение скрипта",
                command: "sudo chmod +x /usr/local/bin/startscript.sh",
                comment: "Предоставление прав на выполнение скрипта"
            },
            {
                description: "Добавление дополнительных прав для системных команд",
                command: "echo 'sphera ALL=(ALL:ALL) NOPASSWD: /usr/bin/lsof, /usr/bin/kill' | sudo tee -a /etc/sudoers.d/sphera",
                comment: "Настройка дополнительных прав для работы с процессами"
            },
            {
                description: "Создание интерактивного меню",
                command: "cat << 'EOF' | sudo tee /usr/local/bin/startscript.sh\n#!/bin/bash\nPS3=\"Выберите действие: \"\noptions=(\"Просмотр информации о системе\" \"Проверка сетевого соединения\" \"Выход\")\nselect opt in \"${options[@]}\"; do\ncase $opt in\n\"Просмотр информации о системе\") uname -a ;;\n\"Проверка сетевого соединения\") ping -c 3 google.com ;;\n\"Выход\") break ;;\n*) echo \"Неверный пункт меню\";;\nesac\ndone\nEOF",
                comment: "Создание базового интерактивного меню с основными функциями"
            },
            {
                description: "Проверка синтаксиса и прав скрипта",
                command: "bash -n /usr/local/bin/startscript.sh && echo \"Синтаксис корректен\"",
                comment: "Проверка корректности синтаксиса скрипта"
            }
        ],
        description: "В этом блоке мы настраиваем ограниченную интерактивную оболочку для пользователя sphera, которая предоставляет доступ только к определенному набору команд через меню. Это повышает безопасность системы, ограничивая действия гостевого пользователя предопределенным набором функций.",
        notes: "После настройки при входе пользователя sphera автоматически запускается интерактивное меню с ограниченным набором команд. Меню можно расширять, добавляя новые функции в скрипт startscript.sh.",
        warnings: "Предоставление прав sudo без пароля может создать уязвимости в системе. Убедитесь, что скрипт startscript.sh надежно защищен и содержит только необходимые команды. Регулярно проверяйте журналы на предмет подозрительной активности."
    },
    {
        id: "logs-data-info",
        title: "Блок 12: Расположение файлов, логов и данных",
        icon: "fa-solid fa-folder-tree",
        steps: [
            {
                description: "Проверка расположения логов NGINX",
                command: "ls -l /var/log/nginx/",
                comment: "Основные логи NGINX находятся в /var/log/nginx/ (access.log и error.log)"
            },
            {
                description: "Проверка расположения логов PostgreSQL",
                command: "ls -l /store/postgresql/17/main/log/",
                comment: "Логи PostgreSQL хранятся в основной директории данных в подпапке log"
            },
            {
                description: "Проверка расположения логов Zabbix",
                command: "ls -l /var/log/zabbix/",
                comment: "Логи Zabbix сервера и агента находятся в /var/log/zabbix/"
            },
            {
                description: "Проверка расположения логов PHP-FPM",
                command: "ls -l /var/log/php8.2-fpm.log",
                comment: "Лог PHP-FPM для версии 8.2"
            },
            {
                description: "Проверка расположения логов Asterisk",
                command: "ls -l /var/log/asterisk/",
                comment: "Логи системы телефонии Asterisk"
            },
            {
                description: "Проверка журналов системы",
                command: "journalctl --disk-usage\nls -l /var/log/syslog",
                comment: "Системные журналы: journald и syslog"
            }
        ],
        description: "В этом блоке собрана информация о расположении файлов конфигурации, логов и данных всех установленных сервисов. Понимание структуры хранения данных важно для мониторинга, отладки и обслуживания системы.",
        notes: `
Основные директории данных:
- PostgreSQL: /store/postgresql/17/main/
- NGINX: /etc/nginx/, /var/www/html/
- Zabbix: /etc/zabbix/, /usr/share/zabbix/
- PHP: /etc/php/8.2/
- Asterisk: /usr/local/asterisk/etc/asterisk/

Конфигурационные файлы:
- PostgreSQL: postgresql.conf, pg_hba.conf в /store/postgresql/17/main/
- NGINX: /etc/nginx/nginx.conf, sites-available/
- Zabbix: /etc/zabbix/zabbix_server.conf
- PHP-FPM: /etc/php/8.2/fpm/php.ini, pool.d/www.conf
- Asterisk: /usr/local/asterisk/etc/asterisk/*.conf

Директории логов:
- Системные: /var/log/
- NGINX: /var/log/nginx/
- PostgreSQL: /store/postgresql/17/main/log/
- Zabbix: /var/log/zabbix/
- PHP-FPM: /var/log/php8.2-fpm.log
- Asterisk: /var/log/asterisk/

Данные приложений:
- PostgreSQL: /store/postgresql/17/main/base/
- Zabbix: База данных PostgreSQL
- Веб-директории: /var/www/html/
- Asterisk: /usr/local/asterisk/var/
`,
        warnings: "Важно регулярно проверять и ротировать логи во избежание переполнения диска. Используйте logrotate для автоматического управления логами. Также убедитесь, что права доступа к конфигурационным файлам и логам установлены корректно."
    },
    {
        id: "bash-setup",
        title: "Блок: Проверка и настройка /bin/bash",
        icon: "fa-solid fa-terminal",
        steps: [
            {
                description: "Проверка существования файла /bin/bash",
                command: "ls -l /bin/bash",
                comment: "Проверяем наличие и права доступа к файлу /bin/bash"
            },
            {
                description: "Проверка версии и работоспособности bash",
                command: "/bin/bash --version",
                comment: "Выводим информацию о версии bash для проверки его работоспособности"
            },
            {
                description: "Создание резервной копии текущей ссылки /bin/sh",
                command: "sudo mv /bin/sh /bin/sh.dash",
                comment: "Сохраняем оригинальную ссылку /bin/sh как /bin/sh.dash"
            },
            {
                description: "Создание новой символической ссылки на bash",
                command: "sudo ln -sf /bin/bash /bin/sh",
                comment: "Создаем символическую ссылку /bin/sh, указывающую на /bin/bash"
            },
            {
                description: "Проверка созданной ссылки",
                command: "ls -l /bin/sh",
                comment: "Проверяем, что символическая ссылка создана правильно и указывает на /bin/bash"
            }
        ],
        description: "В этом блоке мы проверяем наличие и работоспособность интерпретатора команд bash, создаем резервную копию существующей ссылки /bin/sh и настраиваем систему на использование bash как основного интерпретатора команд.",
        notes: "После выполнения этого блока /bin/sh будет символической ссылкой на /bin/bash. Оригинальная ссылка будет сохранена как /bin/sh.dash.",
        warnings: "Важно: изменение /bin/sh может повлиять на работу системных скриптов. Выполняйте эти действия только если вы уверены в необходимости использования bash вместо dash в качестве /bin/sh. Всегда имейте возможность восстановить оригинальную конфигурацию через резервную копию."
    },
    {
        id: "intel-kms-setup",
        title: "Блок: Настройка KMS для Intel",
        icon: "fa-solid fa-microchip",
        steps: [
            {
                description: "Редактирование конфигурации GRUB для включения Intel KMS",
                command: "sudo sed -i 's/GRUB_CMDLINE_LINUX_DEFAULT=\"quiet splash\"/GRUB_CMDLINE_LINUX_DEFAULT=\"quiet splash i915.modeset=1\"/' /etc/default/grub",
                comment: "Добавление параметра i915.modeset=1 для активации KMS Intel"
            },
            {
                description: "Применение изменений конфигурации GRUB",
                command: "sudo update-grub",
                comment: "Обновление загрузчика GRUB для применения новых параметров"
            }
        ],
        description: "В этом блоке мы настраиваем Kernel Mode Setting (KMS) для видеокарт Intel. KMS обеспечивает более надёжное управление графической подсистемой по сравнению с устаревшим VBE.",
        notes: `KMS (Kernel Mode Setting) имеет следующие преимущества:
- Ядро Linux напрямую управляет видеокартой
- Сохраняет конфигурацию даже при отключении монитора
- Автоматически активирует видеовывод при подключении
- Работает со всеми современными видеокартами Intel`,
        warnings: "Убедитесь, что используете видеокарту Intel. Для NVIDIA и AMD используются другие драйверы и параметры. При использовании гибридной графики параметр работает только для Intel-части."
    },
    {
        id: "symlink-setup",
        title: "Блок: Настройка символических ссылок",
        icon: "fa-solid fa-link",
        steps: [
            {
                description: "Проверка существования целевой директории",
                command: "ls -ld /usr/share/aster",
                comment: "Проверяем наличие и права доступа к директории /usr/share/aster"
            },
            {
                description: "Создание директории, если она отсутствует",
                command: "sudo mkdir -p /usr/share/aster",
                comment: "Создаем целевую директорию, если она не существует"
            },
            {
                description: "Изменение символической ссылки",
                command: "sudo ln -snf /usr/share/aster /usr/local/httpd/htdocs",
                comment: "Создаем или обновляем символическую ссылку с параметрами: -s (создание ссылки), -n (не следовать существующей ссылке), -f (принудительная замена)"
            },
            {
                description: "Проверка созданной ссылки",
                command: "ls -l /usr/local/httpd/htdocs",
                comment: "Проверяем, что символическая ссылка создана корректно и указывает на нужную директорию"
            }
        ],
        description: "В этом блоке мы изменяем символическую ссылку /usr/local/httpd/htdocs для указания на директорию /usr/share/aster. Такая операция может потребоваться при реорганизации структуры веб-сервера или изменении расположения файлов сайта.",
        notes: "При использовании параметра -f существующая ссылка будет удалена без предупреждения. Убедитесь, что у вас есть резервная копия конфигурации перед внесением изменений.",
        warnings: "Изменение символических ссылок может повлиять на работу веб-сервера. После изменения обязательно проверьте работоспособность сервиса."
    },
    {
        id: "php74-source-setup",
        title: "Блок 13: Установка PHP 7.4 из исходников",
        icon: "fa-brands fa-php",
        steps: [
            {
                description: "Обновление системы и установка зависимостей",
                command: "sudo apt update\n\nsudo apt install -y build-essential libxml2-dev libcurl4-openssl-dev pkg-config \\\nlibjpeg-dev libpng-dev libwebp-dev libfreetype6-dev libonig-dev libzip-dev bison re2c autoconf wget curl unzip libmysqlclient-dev",
                comment: "Обновление списка пакетов и установка необходимых пакетов для сборки PHP"
            },
            {
                description: "Скачивание исходных кодов PHP",
                command: "wget https://www.php.net/distributions/php-7.4.33.tar.gz -O php-7.4.33.tar.gz\n\ntar -xvzf php-7.4.33.tar.gz\n\ncd php-7.4.33",
                comment: "Загрузка и распаковка архива с исходными кодами PHP 7.4.33"
            },
            {
                description: "Конфигурация сборки (исключаем OpenSSL)",
                command: "./configure --prefix=/usr/local/php7.4 \\\n--enable-fpm \\\n--with-curl \\\n--with-zlib \\\n--with-mysqli \\\n--enable-mbstring \\\n--with-pdo-mysql \\\n--enable-soap \\\n--enable-intl \\\n--enable-bcmath \\\n--enable-shmop \\\n--enable-sysvsem \\\n--enable-pcntl \\\n--enable-mbregex \\\n--enable-calendar \\\n--with-gettext \\\n--enable-exif \\\n--with-bz2 \\\n--enable-ctype \\\n--with-iconv \\\n--with-jpeg \\\n--with-webp \\\n--with-freetype \\\n--with-zip \\\n--without-openssl",
                comment: "Настройка параметров сборки PHP без поддержки OpenSSL"
            },
            {
                description: "Компиляция и установка",
                command: "make -j$(nproc)\n\nsudo make install",
                comment: "Запуск параллельной сборки и установка PHP в систему"
            },
            {
                description: "Настройка альтернативной версии PHP",
                command: "sudo update-alternatives --install /usr/bin/php php /usr/local/php7.4/bin/php 74\n\nupdate-alternatives --list php\n\nsudo update-alternatives --config php",
                comment: "Добавление PHP 7.4 в систему альтернатив и настройка версии по умолчанию"
            },
            {
                description: "Создание конфигурационного файла php-fpm",
                command: "cat <<EOF | sudo tee /usr/local/php7.4/etc/php-fpm.conf\n[global]\npid = /usr/local/php7.4/var/run/php-fpm.pid\nerror_log = /usr/local/php7.4/var/log/php-fpm.log\ninclude=/usr/local/php7.4/etc/php-fpm.d/*.conf\nEOF",
                comment: "Настройка основного конфигурационного файла php-fpm"
            },
            {
                description: "Создание конфигурации пула www",
                command: "cat <<EOF | sudo tee /usr/local/php7.4/etc/php-fpm.d/www.conf\n[www]\nlisten = /usr/local/php7.4/var/run/php-fpm.sock\nlisten.owner = www-data\nlisten.group = www-data\nlisten.mode = 0660\nuser = www-data\ngroup = www-data\npm = dynamic\npm.max_children = 5\npm.start_servers = 2\npm.min_spare_servers = 1\npm.max_spare_servers = 3\nphp_flag[log_errors] = on\nphp_value[error_log] = /usr/local/php7.4/var/log/php_errors.log\nEOF",
                comment: "Настройка пула процессов для www"
            },
            {
                description: "Создание systemd-сервиса для php-fpm",
                command: "cat <<EOF | sudo tee /etc/systemd/system/php7.4-fpm.service\n[Unit]\nDescription=The PHP 7.4 FastCGI Process Manager\nAfter=network.target\n\n[Service]\nType=simple\nPIDFile=/usr/local/php7.4/var/run/php-fpm.pid\nExecStart=/usr/local/php7.4/sbin/php-fpm --nodaemonize --fpm-config /usr/local/php7.4/etc/php-fpm.conf\nExecReload=/bin/kill -USR2 \\$MAINPID\nPrivateTmp=true\n\n[Install]\nWantedBy=multi-user.target\nEOF",
                comment: "Создание systemd-юнита для управления службой php-fpm"
            },
            {
                description: "Включение и запуск службы PHP-FPM",
                command: "sudo systemctl daemon-reload\nsudo systemctl enable php7.4-fpm\nsudo systemctl start php7.4-fpm",
                comment: "Перезагрузка конфигурации demona systemd, активация и запуск PHP-FPM"
            },
            {
                description: "Тестирование установки",
                command: "echo \"<?php phpinfo(); ?>\" | sudo tee /var/www/html/info.php > /dev/null\n\nphp -v\n\nsystemctl status php7.4-fpm",
                comment: "Создание тестового PHP-файла и проверка версии PHP и статуса службы"
            },
            {
                description: "Очистка после установки",
                command: "cd ..\nrm -rf php-7.4.33 php-7.4.33.tar.gz",
                comment: "Удаление исходных кодов после успешной установки"
            }
        ],
        description: "В этом блоке мы устанавливаем PHP 7.4 из исходных кодов с отключенной поддержкой OpenSSL. Такая конфигурация может потребоваться для специфических задач. Установка из исходников позволяет более тонко настроить параметры сборки PHP и включить только необходимые модули.",
        notes: "После выполнения этого блока у вас будет установлен PHP 7.4 из исходных кодов в директорию /usr/local/php7.4. Вы сможете переключаться между разными версиями PHP через систему альтернатив. Конфигурационные файлы находятся в /usr/local/php7.4/etc/, а логи PHP-FPM записываются в /usr/local/php7.4/var/log/php-fpm.log.",
        warnings: "Сборка из исходников требует значительного времени и ресурсов системы. Убедитесь, что у вас достаточно свободного места на диске и оперативной памяти. Отключение OpenSSL делает PHP небезопасным для использования с протоколами, требующими шифрования, например HTTPS. Такая конфигурация подходит только для специфических случаев.",
        category: "programming",
        tags: ["PHP", "компиляция", "исходный код", "веб-разработка"]
    },
    {
        id: "service-transfer",
        title: "Блок 14: Перенос служб с одного сервера на другой",
        icon: "fa-solid fa-exchange-alt",
        steps: [
            {
                description: "Определение местоположения файлов служб на исходном сервере",
                command: "sudo find /etc/systemd/system/ /lib/systemd/system/ -name \"TestCall.service\"\nsudo find /etc/systemd/system/ /lib/systemd/system/ -name \"DateChange.service\"",
                comment: "Поиск файлов служб TestCall.service и DateChange.service в системных каталогах"
            },
            {
                description: "Копирование файлов служб на новый сервер",
                command: "scp /etc/systemd/system/TestCall.service root@new_server:/etc/systemd/system/\nscp /etc/systemd/system/DateChange.service root@new_server:/etc/systemd/system/",
                comment: "Копирование файлов служб с исходного сервера на новый с помощью scp"
            },
            {
                description: "Проверка зависимостей служб",
                command: "cat /etc/systemd/system/TestCall.service\ncat /etc/systemd/system/DateChange.service",
                comment: "Проверка путей в ExecStart и других зависимостей, указанных в файлах служб"
            },
            {
                description: "Проверка наличия файлов и каталогов на новом сервере",
                command: "ls -l /etc/asterisk/script/alert.sh\nls -l /home/date/Dateupd.sh",
                comment: "Проверка наличия скриптов, указанных в конфигурации служб"
            },
            {
                description: "Создание отсутствующих каталогов",
                command: "sudo mkdir -p /etc/asterisk/script/\nsudo mkdir -p /home/date/",
                comment: "Создание необходимых каталогов для скриптов служб"
            },
            {
                description: "Копирование скриптов с исходного сервера",
                command: "scp user@old_server:/etc/asterisk/script/alert.sh /etc/asterisk/script/\nscp user@old_server:/home/date/Dateupd.sh /home/date/",
                comment: "Копирование исполняемых скриптов с исходного сервера на новый"
            },
            {
                description: "Настройка прав доступа для скрипта alert.sh",
                command: "sudo chown www-data:www-data /etc/asterisk/script/alert.sh\nsudo chmod 777 /etc/asterisk/script/alert.sh",
                comment: "Установка владельца www-data и прав доступа 777 для скрипта alert.sh (хотя права 777 не рекомендуются в целях безопасности)"
            },
            {
                description: "Настройка прав доступа для скрипта Dateupd.sh",
                command: "sudo chmod +x /home/date/Dateupd.sh\nsudo chown root:root /home/date/Dateupd.sh",
                comment: "Предоставление прав на выполнение для скрипта Dateupd.sh и установка владельца root"
            },
            {
                description: "Настройка прав доступа к каталогам",
                command: "sudo chmod 755 /etc/asterisk/script/\nsudo chmod 755 /home/date/",
                comment: "Установка стандартных прав доступа 755 для каталогов скриптов"
            },
            {
                description: "Проверка выполнения скриптов вручную",
                command: "sudo -u www-data /etc/asterisk/script/alert.sh\nsudo -u root /home/date/Dateupd.sh",
                comment: "Тестовый запуск скриптов от имени соответствующих пользователей для проверки работоспособности"
            },
            {
                description: "Обновление systemd на новом сервере",
                command: "sudo systemctl daemon-reload",
                comment: "Перезагрузка конфигурации systemd для применения новых файлов служб"
            },
            {
                description: "Включение и запуск служб",
                command: "sudo systemctl enable TestCall.service\nsudo systemctl enable DateChange.service\nsudo systemctl start TestCall.service\nsudo systemctl start DateChange.service",
                comment: "Включение служб для автозапуска при загрузке системы и их запуск"
            },
            {
                description: "Проверка статуса служб",
                command: "sudo systemctl status TestCall.service\nsudo systemctl status DateChange.service",
                comment: "Проверка статуса работы перенесенных служб"
            },
            {
                description: "Проверка логов служб",
                command: "sudo journalctl -u TestCall.service\nsudo journalctl -u DateChange.service",
                comment: "Просмотр журналов служб для выявления возможных ошибок или предупреждений"
            }
        ],
        description: "В этом блоке описывается процесс переноса системных служб с одного сервера на другой. Этот процесс включает локализацию файлов служб, их копирование, настройку зависимостей, прав доступа и проверку функциональности на новом сервере.",
        notes: "После переноса служб важно убедиться, что все зависимости и связанные файлы также перенесены и имеют правильные разрешения. Обязательно проверьте работу служб после переноса.",
        warnings: "Права доступа 777 для файлов скриптов могут быть небезопасными. По возможности используйте более ограниченные права, например 755 или 750. Также убедитесь, что на новом сервере установлены все необходимые зависимости и библиотеки для корректной работы скриптов.",
        category: "service",
        tags: ["systemd", "службы", "перенос", "миграция", "серверы"]
    },
    {
        id: "postgresql-migration",
        title: "Блок 15: Перенос базы данных PostgreSQL на раздел /store",
        icon: "fa-solid fa-database",
        steps: [
            {
                description: "Проверка текущего расположения данных PostgreSQL",
                command: "sudo -u postgres psql -c \"SHOW data_directory;\"",
                comment: "Получение информации о текущем расположении файлов базы данных PostgreSQL"
            },
            {
                description: "Проверка версии PostgreSQL",
                command: "psql --version",
                comment: "Проверка установленной версии PostgreSQL"
            },
            {
                description: "Проверка прав доступа к разделу /store",
                command: "ls -ld /store",
                comment: "Отображение информации о правах доступа к целевому разделу"
            },
            {
                description: "Проверка свободного места на /store",
                command: "df -h /store",
                comment: "Проверка доступного пространства на разделе /store перед переносом"
            },
            {
                description: "Создание директории для данных PostgreSQL",
                command: "sudo mkdir -p /store/postgresql/data",
                comment: "Создание структуры директорий для нового расположения данных"
            },
            {
                description: "Настройка прав доступа для директории",
                command: "sudo chown -R postgres:postgres /store\nsudo chmod -R 700 /store",
                comment: "Установка правильного владельца и прав доступа для директории данных PostgreSQL"
            },
            {
                description: "Проверка установленных прав",
                command: "ls -ld /store",
                comment: "Проверка корректности примененных прав доступа"
            },
            {
                description: "Остановка службы PostgreSQL",
                command: "sudo systemctl stop postgresql",
                comment: "Остановка службы PostgreSQL перед переносом данных"
            },
            {
                description: "Проверка статуса службы",
                command: "sudo systemctl status postgresql",
                comment: "Проверка, что служба успешно остановлена (Active: inactive (dead))"
            },
            {
                description: "Копирование данных в новую директорию",
                command: "sudo rsync -avxHAX --progress /var/lib/postgresql/17/main/ /store/postgresql/data/",
                comment: "Перенос данных с сохранением всех атрибутов, прав и расширенных атрибутов"
            },
            {
                description: "Проверка размера скопированных данных",
                command: "du -sh /var/lib/postgresql/17/main\ndu -sh /store/postgresql/data",
                comment: "Сравнение размеров исходной и новой директорий для проверки корректности копирования"
            },
            {
                description: "Изменение конфигурации PostgreSQL",
                command: "sudo nano /etc/postgresql/17/main/postgresql.conf",
                comment: "Открытие конфигурационного файла для изменения пути к директории данных"
            },
            {
                description: "Запуск службы PostgreSQL",
                command: "sudo systemctl start postgresql",
                comment: "Запуск PostgreSQL с новой конфигурацией"
            },
            {
                description: "Проверка статуса службы",
                command: "sudo systemctl status postgresql",
                comment: "Проверка успешного запуска службы PostgreSQL"
            },
            {
                description: "Проверка использования новой директории",
                command: "sudo -u postgres psql -c \"SHOW data_directory;\"",
                comment: "Проверка, что PostgreSQL использует новое расположение данных"
            },
            {
                description: "Тестовый запрос для проверки работоспособности",
                command: "sudo -u postgres psql -c \"SELECT version();\"",
                comment: "Проверка, что PostgreSQL работает корректно с новой директорией данных"
            },
            {
                description: "Проверка логов на наличие ошибок",
                command: "sudo tail -n 50 /var/log/postgresql/postgresql-17-main.log",
                comment: "Анализ журналов PostgreSQL для выявления возможных проблем"
            },
            {
                description: "Очистка старых данных (опционально)",
                command: "sudo rm -rf /var/lib/postgresql/17/main/*",
                comment: "Удаление старых файлов после успешного переноса и проверки работоспособности"
            }
        ],
        description: "В этом блоке описан процесс переноса базы данных PostgreSQL на раздел /store для улучшения производительности и управления дисковым пространством. Перенос позволяет разместить данные базы на специально выделенном разделе, что может повысить производительность и упростить резервное копирование.",
        notes: "После переноса база данных PostgreSQL будет храниться на разделе /store, который рекомендуется размещать на быстром RAID-массиве или SSD для максимальной производительности. Данные будут доступны через стандартный интерфейс PostgreSQL без каких-либо изменений для пользователей и приложений.",
        warnings: "Внимание! Перед переносом обязательно создайте резервную копию базы данных! Процесс требует остановки службы PostgreSQL, что приведет к временной недоступности баз данных. Планируйте обслуживание в период минимальной нагрузки.",
        category: "database",
        tags: ["PostgreSQL", "миграция", "производительность", "хранение данных"]
    }
];

// Добавляем информацию о версиях программного обеспечения
const softwareVersions = {
    system: {
        name: "Debian GNU/Linux",
        version: "12",
        codename: "bookworm",
        description: "Операционная система Debian GNU/Linux 12 (bookworm)",
        details: "Стабильная версия дистрибутива Debian",
        category: "base"
    },
    webServer: {
        name: "NGINX",
        version: "1.22.1",
        description: "Высокопроизводительный веб-сервер",
        details: "Используется как основной веб-сервер для размещения веб-интерфейса Zabbix и других приложений",
        modules: [
            "HTTP/HTTPS",
            "FastCGI",
            "PHP-FPM",
            "Load Balancing"
        ],
        category: "web"
    },
    php: {
        name: "PHP",
        version: "8.2.26",
        description: "Язык программирования PHP",
        details: "Используется для веб-приложений",
        modules: [
            "fpm",
            "pgsql",
            "cli",
            "common",
            "opcache",
            "mysql",
            "zip",
            "gd",
            "mbstring",
            "curl",
            "xml",
            "bcmath"
        ],
        category: "programming"
    },
    database: [
        {
            name: "PostgreSQL",
            version: "17",
            description: "Основная СУБД PostgreSQL с TimescaleDB",
            details: "Установлен с расширением TimescaleDB для работы с временными рядами",
            modules: [
                "postgresql-contrib",
                "timescaledb-2"
            ],
            category: "database"
        },
        {
            name: "MySQL",
            version: "8.0.33",
            description: "СУБД MySQL",
            details: "Дополнительная база данных для совместимости. Установлена с поддержкой Boost.MySQL для асинхронной работы",
            modules: [
                "Boost.MySQL",
                "mysql-server",
                "mysql-client",
                "libmysqlclient-dev"
            ],
            category: "database"
        }
    ],
    utils: [
        {
            name: "Timeshift",
            version: "latest",
            description: "Утилита для создания точек восстановления системы",
            category: "backup"
        },
        {
            name: "mdadm",
            version: "latest",
            description: "Утилита для управления программным RAID",
            category: "storage"
        },
        // ... другие утилиты и библиотеки ...
    ],
    php74: {
        name: "PHP (из исходников)",
        version: "7.4.33",
        description: "PHP 7.4 скомпилированный вручную без OpenSSL",
        details: "Установлен из исходных кодов для приложений, требующих версию PHP 7.4",
        modules: [
            "fpm",
            "curl",
            "mysqli",
            "mbstring",
            "pdo-mysql",
            "soap",
            "intl",
            "bcmath",
            "zip"
        ],
        category: "programming"
    }
};

// Добавляем структуру для дерева файлов и логов
const systemDirectories = {
    var: {
        log: {
            // Директории для логов
            nginx: {
                'access.log': null,
                'error.log': null
            },
            zabbix: {
                'zabbix_server.log': null,
                'zabbix_agent.log': null
            },
            asterisk: {
                'full.log': null,
                'messages.log': null
            },
            'php8.2-fpm.log': null,
            syslog: null
        },
        www: {
            html: {
                // Веб-директории
                'index.php': null,
                'info.php': null
            }
        }
    },
    store: {
        postgresql: {
            '17': {
                main: {
                    // Основная директория PostgreSQL
                    base: {
                        // Файлы баз данных
                        'zabbix_db': null
                    },
                    log: {
                        'postgresql.log': null
                    },
                    'postgresql.conf': null,
                    'pg_hba.conf': null
                }
            }
        }
    },
    etc: {
        nginx: {
            'nginx.conf': null,
            'sites-available': {
                default: null,
                zabbix: null
            },
            'sites-enabled': {
                'zabbix': null
            }
        },
        zabbix: {
            'zabbix_server.conf': null,
            'zabbix_agentd.conf': null
        },
        php: {
            '8.2': {
                fpm: {
                    'php.ini': null,
                    'pool.d': {
                        'www.conf': null
                    }
                }
            }
        }
    },
    'usr': {
        'local': {
            'asterisk': {
                'etc': {
                    'asterisk': {
                        'asterisk.conf': null,
                        'sip.conf': null,
                        'extensions.conf': null
                    }
                },
                'var': {
                    // Данные Asterisk
                    'run': null,
                    'lib': null
                }
            },
            'httpd': {
                'htdocs': null // символическая ссылка
            }
        },
        share: {
            aster: {
                // Директория для файлов веб-сервера
                'index.html': null,
                'css': null,
                'js': null
            }
        }
    }
};

// Добавляем описания для новых файлов
const fileDescriptions = {
    // Описания конфигурационных файлов
    'postgresql.conf': {
        description: 'Основной конфигурационный файл PostgreSQL',
        category: 'config',
        importance: 'high'
    },
    'pg_hba.conf': {
        description: 'Конфигурация аутентификации PostgreSQL',
        category: 'config',
        importance: 'high'
    },
    'nginx.conf': {
        description: 'Основной конфигурационный файл Nginx',
        category: 'config',
        importance: 'high'
    },
    'zabbix_server.conf': {
        description: 'Конфигурация Zabbix сервера',
        category: 'config',
        importance: 'high'
    },
    'php.ini': {
        description: 'Основной конфигурационный файл PHP',
        category: 'config',
        importance: 'high'
    },
    
    // Описания лог-файлов
    'access.log': {
        description: 'Журнал доступа к веб-серверу',
        category: 'log',
        importance: 'medium'
    },
    'error.log': {
        description: 'Журнал ошибок',
        category: 'log',
        importance: 'high'
    },
    'postgresql.log': {
        description: 'Основной лог PostgreSQL',
        category: 'log',
        importance: 'high'
    },
    'zabbix_server.log': {
        description: 'Лог сервера Zabbix',
        category: 'log',
        importance: 'high'
    },
    'htdocs': {
        description: 'Символическая ссылка на директорию с файлами веб-сервера',
        category: 'config',
        importance: 'high',
        type: 'symlink'
    }
};

// Добавляем категории для файловой системы
const fileSystemCategories = [
    {
        id: 'config',
        name: 'Конфигурационные файлы',
        icon: 'fa-solid fa-gear',
        description: 'Основные конфигурационные файлы системы и сервисов'
    },
    {
        id: 'log',
        name: 'Логи',
        icon: 'fa-solid fa-clipboard-list',
        description: 'Журналы работы системы и сервисов'
    },
    {
        id: 'data',
        name: 'Данные',
        icon: 'fa-solid fa-database',
        description: 'Директории с данными приложений'
    }
];

// Структура для навигационного меню
const navItems = [
    { id: "intro", title: "Введение", icon: "fa-solid fa-home", category: "intro" },
    { id: "timeshift-setup", title: "Timeshift", icon: "fa-solid fa-clock-rotate-left", category: "system" },
    { id: "raid-efi-setup", title: "RAID EFI", icon: "fa-solid fa-hard-drive", category: "storage" },
    { id: "nginx-php-postgresql", title: "Веб-сервер", icon: "fa-solid fa-server", category: "web" },
    { id: "mysql-setup", title: "MySQL", icon: "fa-solid fa-database", category: "database" },
    { id: "asterisk-setup", title: "Asterisk", icon: "fa-solid fa-phone", category: "telephony" },
    { id: "postgresql-setup", title: "PostgreSQL", icon: "fa-solid fa-database", category: "database" },
    { id: "security", title: "Безопасность", icon: "fa-solid fa-shield-halved", category: "security" },
    { id: "advanced", title: "Продвинутые настройки", icon: "fa-solid fa-sliders", category: "system" },
    { id: "command-reference", title: "Справочник команд", icon: "fa-solid fa-book", category: "special" },
    { id: "software-versions", title: "Версии ПО", icon: "fa-solid fa-code-branch", category: "special" },
    { id: "nginx-zabbix-setup", title: "Nginx для Zabbix", icon: "fa-solid fa-globe", category: "web" },
    { id: "zabbix-setup", title: "Zabbix", icon: "fa-solid fa-chart-line", category: "web" },
    { id: "zabbix-sql-setup", title: "SQL Импорт", icon: "fa-solid fa-database", category: "database" },
    { id: "tpm-luks-setup", title: "TPM и LUKS", icon: "fa-solid fa-shield-halved", category: "security" },
    { id: "sphera-shell-setup", title: "Оболочка sphera", icon: "fa-solid fa-terminal", category: "system" },
    { id: "logs-data-info", title: "Файлы и логи", icon: "fa-solid fa-folder-tree", category: "system" },
    { id: "intel-kms-setup", title: "Intel KMS", icon: "fa-solid fa-microchip", category: "system" },
    { id: "bash-setup", title: "Настройка Bash", icon: "fa-solid fa-terminal", category: "system" },
    { id: "symlink-setup", title: "Символические ссылки", icon: "fa-solid fa-link", category: "system" },
    { id: "php74-source-setup", title: "PHP 7.4 из исходников", icon: "fa-brands fa-php", category: "programming" },
    { id: "system-architecture", title: "Архитектура системы", icon: "fa-solid fa-sitemap", category: "system" },
    { id: "faq-section", title: "Часто задаваемые вопросы", icon: "fa-solid fa-question-circle", category: "special" },
    { id: "resources-section", title: "Полезные ресурсы", icon: "fa-solid fa-link", category: "special" },
    { id: "service-transfer", title: "Перенос служб", icon: "fa-solid fa-exchange-alt", category: "system" },
    { id: "postgresql-migration", title: "Перенос PostgreSQL", icon: "fa-solid fa-database", category: "database" }
];

// Массив для хранения отзывов и информации о совместимости
const compatibilityInfo = [
    {
        blockId: "raid-efi-setup",
        distros: ["Debian 12", "Ubuntu 22.04+"],
        hardware: ["UEFI системы", "Поддержка RAID"],
        warnings: ["Не подходит для систем с Legacy BIOS", "Требуется минимум два диска"],
        success_rate: 95 // процент успешных внедрений
    },
    {
        blockId: "tpm-luks-setup",
        distros: ["Debian 11+", "Ubuntu 20.04+", "Fedora 34+"],
        hardware: ["TPM 2.0", "UEFI системы"],
        warnings: ["Требуется наличие модуля TPM 2.0", "На виртуальных машинах может потребоваться дополнительная настройка"],
        success_rate: 88
    }
    // Можно добавить больше совместимости для других блоков
];

// Функция для быстрого добавления нового блока команд
function createNewCommandBlock(id, title, icon, category, description, steps, notes, warnings, tags) {
    const newBlock = {
        id: id,
        title: title,
        icon: icon,
        category: category || "utilities",
        steps: steps || [],
        description: description || "",
        notes: notes || "",
        warnings: warnings || "",
        tags: tags || []
    };
    
    // Добавляем блок в массив commandBlocks
    commandBlocks.push(newBlock);
    
    return newBlock;
}

// Функция для добавления новой команды в справочник
function addCommandToReference(command, syntax, description, usage, options, examples, category, tags) {
    const newCommand = {
        command: command,
        syntax: syntax,
        description: description,
        usage: usage || "",
        options: options || [],
        examples: examples || [],
        category: category || "system",
        tags: tags || []
    };
    
    // Добавляем команду в массив commandReference
    commandReference.push(newCommand);
    
    return newCommand;
}

// Структура для хранения метаданных о блоках
const blockMetadata = {
    // Категории блоков
    categories: [
        { id: "system-setup", name: "Настройка системы", icon: "fa-solid fa-wrench" },
        { id: "storage", name: "Управление хранилищем", icon: "fa-solid fa-hard-drive" },
        { id: "server-setup", name: "Настройка серверов", icon: "fa-solid fa-server" },
        { id: "database", name: "Базы данных", icon: "fa-solid fa-database" },
        { id: "security", name: "Безопасность", icon: "fa-solid fa-shield-halved" },
        { id: "utilities", name: "Утилиты", icon: "fa-solid fa-toolbox" }
    ],
    
    // Теги для блоков
    tags: [
        "начальная настройка", "безопасность", "отказоустойчивость", "мониторинг",
        "веб-сервер", "база данных", "шифрование", "хранение данных", "загрузка",
        "телефония", "резервное копирование", "пользователи", "логи", "интерфейс"
    ]
};