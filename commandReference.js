// Структура данных для хранения всех команд с детальным описанием
const commandReference = [
    // Команды apt
    {
        command: "apt update",
        syntax: "sudo apt update",
        description: "Обновляет список доступных пакетов и их версий из репозиториев, указанных в /etc/apt/sources.list",
        usage: "Используется перед установкой новых пакетов для получения информации о последних версиях доступных программ.",
        options: [
            { option: "-y", description: "Автоматически отвечает «да» на все вопросы (не интерактивный режим)" },
            { option: "-q", description: "Тихий режим, меньше вывода информации" }
        ],
        examples: [
            "sudo apt update && sudo apt upgrade -y"
        ],
        category: "package",
        tags: ["пакеты", "обновление", "системное администрирование"]
    },
    {
        command: "apt install",
        syntax: "sudo apt install [опции] пакет1 пакет2 ...",
        description: "Устанавливает новые пакеты из репозиториев в систему.",
        usage: "Основная команда для установки программ в Debian/Ubuntu.",
        options: [
            { option: "-y", description: "Автоматически отвечает «да» на все вопросы" },
            { option: "--no-install-recommends", description: "Не устанавливать рекомендуемые пакеты" },
            { option: "--reinstall", description: "Переустановить пакеты, которые уже установлены" }
        ],
        examples: [
            "sudo apt install -y nginx",
            "sudo apt install -y timeshift"
        ],
        category: "package",
        tags: ["пакеты", "установка", "системное администрирование"]
    },
    {
        command: "apt upgrade",
        syntax: "sudo apt upgrade [опции]",
        description: "Обновляет установленные пакеты до их последних версий.",
        usage: "Используется для поддержания системы в актуальном состоянии после обновления списка пакетов командой apt update.",
        options: [
            { option: "-y", description: "Автоматически отвечает «да» на все вопросы" },
            { option: "--no-install-recommends", description: "Не устанавливать рекомендуемые пакеты" }
        ],
        examples: [
            "sudo apt update && sudo apt upgrade -y"
        ],
        category: "package",
        tags: ["пакеты", "обновление", "системное администрирование"]
    },

    // Команды для работы с файловой системой
    {
        command: "mkfs.vfat",
        syntax: "sudo mkfs.vfat [опции] устройство",
        description: "Создает файловую систему FAT (File Allocation Table) на указанном устройстве.",
        usage: "Используется для форматирования EFI разделов, так как EFI требует файловую систему FAT32.",
        options: [
            { option: "-F 32", description: "Создать файловую систему FAT32" },
            { option: "-n LABEL", description: "Задать метку тома" }
        ],
        examples: [
            "sudo mkfs.vfat /dev/md4",
            "sudo mkfs.vfat -F 32 -n EFI /dev/sda1"
        ],
        category: "storage",
        tags: ["файловая система", "форматирование", "EFI"]
    },
    {
        command: "mount",
        syntax: "sudo mount [опции] устройство точка_монтирования",
        description: "Монтирует файловую систему устройства в указанную точку монтирования.",
        usage: "Используется для получения доступа к содержимому раздела через файловую систему Linux.",
        options: [
            { option: "-t тип", description: "Указать тип файловой системы" },
            { option: "-o опции", description: "Дополнительные опции монтирования" }
        ],
        examples: [
            "sudo mount /dev/md4 /boot/efi",
            "mount | grep efi"
        ],
        category: "storage",
        tags: ["файловая система", "монтирование", "системное администрирование"]
    },
    {
        command: "mkdir",
        syntax: "mkdir [опции] директория1 директория2 ...",
        description: "Создает новые директории в файловой системе.",
        usage: "Используется для создания структуры каталогов и точек монтирования.",
        options: [
            { option: "-p", description: "Создать всю структуру родительских каталогов, если они не существуют" },
            { option: "-m режим", description: "Установить права доступа для новой директории" }
        ],
        examples: [
            "sudo mkdir -p /boot/efi",
            "mkdir -p /backup/efi"
        ],
        category: "storage",
        tags: ["файловая система", "директории", "каталоги"]
    },

    // Команды для работы с RAID
    {
        command: "mdadm",
        syntax: "sudo mdadm [режим] [опции] устройство",
        description: "Утилита для управления программными RAID-массивами в Linux.",
        usage: "Используется для создания, мониторинга и управления RAID-массивами.",
        options: [
            { option: "--create", description: "Создать новый RAID-массив" },
            { option: "--level=N", description: "Указать уровень RAID (0, 1, 5, 6, 10)" },
            { option: "--raid-devices=N", description: "Указать количество устройств в массиве" },
            { option: "--examine", description: "Показать информацию о RAID-устройстве" },
            { option: "--scan", description: "Отобразить конфигурацию RAID для всех устройств" },
            { option: "--metadata=X.Y", description: "Указать версию метаданных RAID" }
        ],
        examples: [
            "sudo mdadm --create --verbose /dev/md4 --level=1 --raid-devices=2 --metadata=1.0 /dev/sdb4 /dev/sdc4",
            "sudo mdadm --examine --scan | grep metadata=1.0 >> /etc/mdadm/mdadm.conf"
        ],
        category: "storage",
        tags: ["RAID", "отказоустойчивость", "хранение данных"]
    },
    {
        command: "cat /proc/mdstat",
        syntax: "cat /proc/mdstat",
        description: "Отображает текущее состояние RAID-массивов в системе.",
        usage: "Используется для проверки статуса и состояния синхронизации RAID-массивов.",
        options: [],
        examples: [
            "cat /proc/mdstat",
            "watch -n 1 cat /proc/mdstat"
        ],
        category: "storage",
        tags: ["RAID", "мониторинг", "состояние системы"]
    },

    // Команды для работы с загрузчиком
    {
        command: "grub-install",
        syntax: "sudo grub-install [опции] устройство",
        description: "Устанавливает загрузчик GRUB на указанное устройство.",
        usage: "Используется для установки или восстановления загрузчика системы.",
        options: [
            { option: "--target=x86_64-efi", description: "Установить для 64-битной EFI системы" },
            { option: "--efi-directory=DIR", description: "Указать директорию, где смонтирован EFI раздел" },
            { option: "--bootloader-id=ID", description: "Идентификатор загрузчика в меню EFI" },
            { option: "--recheck", description: "Проверить наличие новых устройств" }
        ],
        examples: [
            "sudo grub-install --target=x86_64-efi --efi-directory=/boot/efi --bootloader-id=debian --recheck /dev/sdb"
        ],
        category: "system",
        tags: ["загрузчик", "GRUB", "EFI", "UEFI"]
    },
    {
        command: "update-grub",
        syntax: "sudo update-grub",
        description: "Обновляет конфигурацию загрузчика GRUB после внесения изменений",
        usage: "Используется после изменения параметров в /etc/default/grub для применения новых настроек.",
        options: [],
        examples: [
            "sudo update-grub"
        ],
        category: "system",
        tags: ["загрузчик", "GRUB", "конфигурация", "system"]
    },
    {
        command: "efibootmgr",
        syntax: "efibootmgr [опции]",
        description: "Управляет записями загрузки в прошивке UEFI.",
        usage: "Используется для просмотра и редактирования порядка загрузки UEFI.",
        options: [
            { option: "-v", description: "Подробный вывод информации" },
            { option: "-c", description: "Создать новую запись загрузки" },
            { option: "-d устройство", description: "Указать диск, содержащий загрузчик" },
            { option: "-p раздел", description: "Указать номер раздела с EFI" }
        ],
        examples: [
            "efibootmgr -v"
        ],
        category: "system",
        tags: ["загрузчик", "EFI", "UEFI", "BIOS"]
    },
    {
        command: "update-initramfs",
        syntax: "sudo update-initramfs [опции]",
        description: "Обновляет initramfs (начальную файловую систему в памяти) для загрузки ядра.",
        usage: "Запускается после изменения модулей ядра, драйверов или конфигурации RAID/LVM.",
        options: [
            { option: "-u", description: "Обновить существующий образ initramfs" },
            { option: "-k версия", description: "Указать версию ядра" },
            { option: "-c", description: "Создать новый образ" }
        ],
        examples: [
            "sudo update-initramfs -u"
        ],
        category: "system",
        tags: ["загрузка", "ядро", "initramfs", "RAID"]
    },

    // Команды для работы с сервисами
    {
        command: "systemctl",
        syntax: "sudo systemctl [команда] [сервис]",
        description: "Управляет системными службами через systemd.",
        usage: "Основная команда для управления запуском, остановкой и статусом системных служб.",
        options: [
            { option: "start", description: "Запустить сервис" },
            { option: "stop", description: "Остановить сервис" },
            { option: "restart", description: "Перезапустить сервис" },
            { option: "status", description: "Показать статус сервиса" },
            { option: "enable", description: "Включить автозапуск сервиса при загрузке" },
            { option: "disable", description: "Отключить автозапуск сервиса" }
        ],
        examples: [
            "sudo systemctl restart ssh",
            "sudo systemctl enable nginx",
            "systemctl status postgresql"
        ],
        category: "service",
        tags: ["сервисы", "системное администрирование", "systemd"]
    },
    {
        command: "systemctl list-units",
        syntax: "systemctl list-units [опции] [шаблон...]",
        description: "Отображает список всех systemd юнитов в системе.",
        usage: "Используется для просмотра состояния служб и других юнитов systemd.",
        options: [
            { option: "--full", description: "Показать полные имена юнитов" },
            { option: "-all", description: "Показать все юниты, включая неактивные" },
            { option: "--type=service", description: "Показать только службы" }
        ],
        examples: [
            "systemctl list-units --type=service",
            "systemctl list-units --full -all | grep nginx"
        ],
        category: "service",
        tags: ["systemd", "службы", "мониторинг"]
    },

    // Команды для работы с SSH
    {
        command: "sed",
        syntax: "sed [опции] скрипт [файл...]",
        description: "Редактирует потоки или файлы без открытия их в текстовом редакторе.",
        usage: "Мощная утилита для автоматизированного изменения текстовых файлов.",
        options: [
            { option: "-i", description: "Изменить файл на месте (без создания резервной копии)" },
            { option: "-e скрипт", description: "Выполнить скрипт редактирования" },
            { option: "-r", description: "Использовать расширенные регулярные выражения" }
        ],
        examples: [
            "sudo sed -i 's/^#PermitRootLogin.*/PermitRootLogin yes/' /etc/ssh/sshd_config"
        ],
        category: "system",
        tags: ["текст", "редактирование", "автоматизация"]
    },

    // Команды для работы с Timeshift
    {
        command: "timeshift",
        syntax: "sudo timeshift [опции]",
        description: "Создает и управляет точками восстановления системы.",
        usage: "Аналогично Time Machine в macOS-Sah или Системному восстановлению в Windows.",
        options: [
            { option: "--create", description: "Создать новую точку восстановления" },
            { option: "--restore", description: "Восстановить систему из точки восстановления" },
            { option: "--list", description: "Показать список существующих точек восстановления" },
            { option: "--delete", description: "Удалить точку восстановления" },
            { option: "--comments \"текст\"", description: "Добавить комментарий к точке восстановления" }
        ],
        examples: [
            "sudo timeshift --create --comments \"Первый снимок после установки Timeshift\"",
            "timeshift --list"
        ],
        category: "system",
        tags: ["резервное копирование", "восстановление", "безопасность"]
    },

    // Команды для работы с PostgreSQL
    {
        command: "dpkg -l",
        syntax: "dpkg -l [шаблон]",
        description: "Выводит список установленных пакетов или проверяет наличие пакета.",
        usage: "Используется для проверки, установлен ли определенный пакет в системе.",
        options: [
            { option: "-l", description: "Список всех установленных пакетов" },
            { option: "| grep пакет", description: "Фильтрация результатов по имени пакета" }
        ],
        examples: [
            "dpkg -l | grep -q \"postgresql\"",
            "dpkg -l | grep php"
        ],
        category: "package",
        tags: ["пакеты", "управление пакетами", "проверка"]
    },
    {
        command: "createuser",
        syntax: "sudo -u postgres createuser [options] имя_пользователя",
        description: "Создает нового пользователя PostgreSQL.",
        usage: "Используется для создания пользователей базы данных PostgreSQL с различными правами.",
        options: [
            { option: "--pwprompt", description: "Запросить пароль для нового пользователя" },
            { option: "-s", description: "Пользователь будет суперпользователем" },
            { option: "-d", description: "Пользователь сможет создавать базы данных" }
        ],
        examples: [
            "sudo -u postgres createuser --pwprompt zabbix"
        ],
        category: "database",
        tags: ["PostgreSQL", "пользователи", "администрирование"]
    },
    {
        command: "createdb",
        syntax: "sudo -u postgres createdb [options] имя_базы",
        description: "Создает новую базу данных PostgreSQL.",
        usage: "Используется для создания новых баз данных с указанием владельца и других параметров.",
        options: [
            { option: "-O владелец", description: "Указать владельца создаваемой базы данных" },
            { option: "-E кодировка", description: "Указать кодировку базы данных" }
        ],
        examples: [
            "sudo -u postgres createdb -O zabbix zabbix"
        ],
        category: "database",
        tags: ["PostgreSQL", "база данных", "администрирование"]
    },
    {
        command: "psql",
        syntax: "sudo -u postgres psql [options] [база_данных]",
        description: "Интерактивный терминал PostgreSQL.",
        usage: "Используется для выполнения SQL-запросов и администрирования PostgreSQL.",
        options: [
            { option: "-d база", description: "Указать базу данных для подключения" },
            { option: "-c команда", description: "Выполнить SQL-команду и выйти" },
            { option: "-t", description: "Вывести только строки" },
            { option: "-A", description: "Неформатированный вывод" }
        ],
        examples: [
            "sudo -u postgres psql -d zabbix -c \"CREATE EXTENSION IF NOT EXISTS timescaledb;\"",
            "sudo -u postgres psql -tAc \"SELECT 1 FROM pg_roles WHERE rolname='zabbix'\""
        ],
        category: "database",
        tags: ["PostgreSQL", "SQL", "администрирование"]
    },

    // Команды для определения версии системы
    {
        command: "lsb_release",
        syntax: "lsb_release [опции]",
        description: "Выводит информацию о дистрибутиве Linux.",
        usage: "Используется для определения версии и типа дистрибутива Linux.",
        options: [
            { option: "-is", description: "Показать только идентификатор дистрибутива (Ubuntu, Debian и т.д.)" },
            { option: "-cs", description: "Показать кодовое имя дистрибутива (focal, bullseye и т.д.)" },
            { option: "-a", description: "Показать всю информацию о дистрибутиве" }
        ],
        examples: [
            "[ \"$(lsb_release -is)\" = \"Ubuntu\" ]"
        ],
        category: "system",
        tags: ["система", "информация", "дистрибутив"]
    },

    // Команды для работы с MySQL
    {
        command: "mysql",
        syntax: "mysql [опции] [база_данных]",
        description: "Консольный клиент для работы с сервером MySQL.",
        usage: "Используется для выполнения SQL-запросов и администрирования сервера MySQL.",
        options: [
            { option: "-u пользователь", description: "Указать имя пользователя для подключения" },
            { option: "-p", description: "Запросить пароль для подключения" },
            { option: "-e \"запрос\"", description: "Выполнить SQL-запрос и выйти" },
            { option: "-h хост", description: "Указать хост сервера MySQL" }
        ],
        examples: [
            "echo \"ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY '';\" | sudo mysql"
        ],
        category: "service",
        tags: ["база данных", "SQL", "MySQL"]
    },
    {
        command: "command -v",
        syntax: "command -v программа",
        description: "Проверяет, доступна ли команда или программа в системе.",
        usage: "Используется для проверки, установлена ли определенная программа, перед её использованием или установкой.",
        options: [],
        examples: [
            "command -v nginx || (sudo apt install -y nginx)",
            "command -v php || sudo apt install -y php"
        ],
        category: "system",
        tags: ["программы", "проверка", "установка"]
    },
    {
        command: "gunzip",
        syntax: "gunzip -c файл.gz | команда",
        description: "Распаковывает gzip-архив и передает его содержимое в другую команду",
        usage: "Используется для распаковки SQL-скриптов и других сжатых файлов",
        options: [
            { option: "-c", description: "Вывод в стандартный поток вывода вместо создания файла" }
        ],
        examples: [
            "gunzip -c /usr/share/zabbix/sql-scripts/postgresql/server.sql.gz | sudo -u postgres psql -d zabbix"
        ],
        category: "system",
        tags: ["архивы", "сжатие", "потоки"]
    },
    {
        command: "sed -i",
        syntax: "sed -i 's/старый_текст/новый_текст/' файл",
        description: "Редактирует файлы без открытия текстового редактора",
        usage: "Используется для автоматического изменения конфигурационных файлов",
        options: [
            { option: "-i", description: "Изменение файла на месте" },
            { option: "s/pattern/replacement/", description: "Замена текста по шаблону" }
        ],
        examples: [
            "sudo sed -i '/^DBName=/s/=.*/=zabbix/' /etc/zabbix/zabbix_server.conf"
        ],
        category: "system",
        tags: ["конфигурация", "текст", "автоматизация"]
    },
    {
        command: "clevis luks bind",
        syntax: "clevis luks bind -d устройство tpm2 конфигурация",
        description: "Привязывает TPM к LUKS-зашифрованному устройству для автоматической расшифровки",
        usage: "Используется для настройки автоматической расшифровки диска через TPM",
        options: [
            { option: "-d устройство", description: "Зашифрованное устройство для привязки" },
            { option: "tpm2", description: "Использовать TPM 2.0 для хранения ключей" }
        ],
        examples: [
            "clevis luks bind -d /dev/md1 tpm2 '{\"pcr_bank\":\"sha256\",\"pcr_ids\":\"7\"}'"
        ],
        category: "security",
        tags: ["шифрование", "TPM", "LUKS", "безопасность"]
    },
    {
        command: "cryptsetup luksDump",
        syntax: "cryptsetup luksDump устройство",
        description: "Отображает информацию о LUKS-заголовке устройства",
        usage: "Используется для просмотра конфигурации LUKS, включая информацию о слотах ключей",
        options: [],
        examples: [
            "cryptsetup luksDump /dev/md0"
        ],
        category: "security",
        tags: ["шифрование", "LUKS", "безопасность"]
    },
    {
        command: "tpm2_pcrextend",
        syntax: "tpm2_pcrextend pcr:алгоритм=значение",
        description: "Расширяет значение указанного PCR в TPM",
        usage: "Используется для управления значениями PCR в TPM",
        options: [],
        examples: [
            "tpm2_pcrextend 7:sha256=0"
        ],
        category: "security",
        tags: ["TPM", "PCR", "безопасность"]
    },

    // Сетевые команды
    {
        command: "ip addr",
        syntax: "ip addr [show] [dev УСТРОЙСТВО]",
        description: "Отображает информацию о сетевых интерфейсах и IP-адресах.",
        usage: "Позволяет просмотреть все сетевые интерфейсы и их настройки, включая IP-адреса, MAC-адреса и состояние.",
        options: [
            { option: "show", description: "Показать информацию (используется по умолчанию)" },
            { option: "dev УСТРОЙСТВО", description: "Указать конкретный сетевой интерфейс" }
        ],
        examples: [
            "ip addr show",
            "ip addr show dev eth0"
        ],
        category: "network",
        tags: ["сеть", "IP", "адрес", "интерфейс"]
    },
    {
        command: "ip route",
        syntax: "ip route [show|add|del] [ПАРАМЕТРЫ]",
        description: "Управление таблицей маршрутизации.",
        usage: "Позволяет просматривать и изменять таблицу маршрутизации, добавлять статические маршруты.",
        options: [
            { option: "show", description: "Показать таблицу маршрутизации (используется по умолчанию)" },
            { option: "add", description: "Добавить маршрут" },
            { option: "del", description: "Удалить маршрут" }
        ],
        examples: [
            "ip route show",
            "sudo ip route add 192.168.2.0/24 via 192.168.1.1",
            "sudo ip route del 192.168.2.0/24"
        ],
        category: "network",
        tags: ["сеть", "маршрутизация", "шлюз", "route"]
    },
    {
        command: "ping",
        syntax: "ping [опции] хост",
        description: "Проверка доступности сетевого узла путем отправки ICMP Echo Request.",
        usage: "Используется для проверки соединения между локальным и удаленным хостом. Показывает время отклика и потери пакетов.",
        options: [
            { option: "-c число", description: "Количество пакетов для отправки" },
            { option: "-i интервал", description: "Интервал между отправкой пакетов в секундах" },
            { option: "-s размер", description: "Размер пакета в байтах" }
        ],
        examples: [
            "ping -c 4 google.com",
            "ping -c 10 -i 0.5 192.168.1.1"
        ],
        category: "network",
        tags: ["сеть", "диагностика", "ICMP", "доступность"]
    },
    {
        command: "traceroute",
        syntax: "traceroute [опции] хост",
        description: "Отслеживание маршрута пакетов до указанного хоста.",
        usage: "Показывает список маршрутизаторов, через которые проходят пакеты при достижении целевого хоста.",
        options: [
            { option: "-n", description: "Не выполнять DNS-разрешение имен" },
            { option: "-T", description: "Использовать TCP вместо UDP" },
            { option: "-m число", description: "Максимальное количество хопов (TTL)" }
        ],
        examples: [
            "traceroute google.com",
            "traceroute -n 8.8.8.8"
        ],
        category: "network",
        tags: ["сеть", "маршрутизация", "диагностика", "трассировка"]
    },
    {
        command: "netstat",
        syntax: "netstat [опции]",
        description: "Отображение сетевых соединений, таблицы маршрутизации, статистики интерфейсов.",
        usage: "Используется для отображения активных сетевых соединений, открытых портов и статистики сети.",
        options: [
            { option: "-t", description: "Отображать только TCP-соединения" },
            { option: "-u", description: "Отображать только UDP-соединения" },
            { option: "-l", description: "Отображать только слушающие сокеты" },
            { option: "-n", description: "Отображать числовые адреса, не разрешать имена" },
            { option: "-p", description: "Отображать PID и имя программы, к которой относится сокет" }
        ],
        examples: [
            "netstat -tulpn",
            "netstat -an | grep LISTEN"
        ],
        category: "network",
        tags: ["сеть", "сокеты", "соединения", "порты"]
    },
    {
        command: "ss",
        syntax: "ss [опции]",
        description: "Утилита для отображения информации о сокетах. Современная замена netstat.",
        usage: "Используется для анализа сетевых соединений с большей производительностью и детализацией, чем netstat.",
        options: [
            { option: "-t", description: "Отображать только TCP-соединения" },
            { option: "-u", description: "Отображать только UDP-соединения" },
            { option: "-l", description: "Отображать только слушающие сокеты" },
            { option: "-n", description: "Не разрешать службы или имена хостов" },
            { option: "-p", description: "Показывать процесс, использующий сокет" }
        ],
        examples: [
            "ss -tulpn",
            "ss -ta 'state established'"
        ],
        category: "network",
        tags: ["сеть", "сокеты", "соединения", "порты", "диагностика"]
    },
    {
        command: "dig",
        syntax: "dig [@сервер] [опции] имя [тип]",
        description: "Инструмент для опроса DNS-серверов и диагностики DNS.",
        usage: "Используется для получения информации о DNS-записях, проверки DNS-серверов и диагностики проблем с DNS.",
        options: [
            { option: "@сервер", description: "Указать конкретный DNS-сервер для запроса" },
            { option: "+short", description: "Сокращенный вывод, только ответы" },
            { option: "+trace", description: "Трассировка от корневых серверов" }
        ],
        examples: [
            "dig google.com",
            "dig @8.8.8.8 example.com MX",
            "dig +short example.com"
        ],
        category: "network",
        tags: ["сеть", "DNS", "домен", "диагностика"]
    },
    {
        command: "nslookup",
        syntax: "nslookup [опции] [имя | -] [сервер]",
        description: "Запрос DNS для получения имени хоста или IP-адреса.",
        usage: "Простой инструмент для запроса DNS-серверов. Менее подробный, чем dig, но проще в использовании.",
        options: [
            { option: "-type=тип", description: "Указать тип DNS-записи (A, MX, NS и т.д.)" }
        ],
        examples: [
            "nslookup google.com",
            "nslookup -type=MX example.com 8.8.8.8"
        ],
        category: "network",
        tags: ["сеть", "DNS", "домен", "имя хоста"]
    },
    {
        command: "host",
        syntax: "host [опции] имя [сервер]",
        description: "Утилита для поиска информации DNS.",
        usage: "Простой инструмент для запроса DNS-серверов, показывает как прямое, так и обратное разрешение имен.",
        options: [
            { option: "-t тип", description: "Указать тип DNS-записи" },
            { option: "-a", description: "Эквивалент -t ANY, показать все записи" }
        ],
        examples: [
            "host google.com",
            "host -t MX example.com"
        ],
        category: "network",
        tags: ["сеть", "DNS", "домен", "имя хоста"]
    },
    {
        command: "ifconfig",
        syntax: "ifconfig [интерфейс] [опции]",
        description: "Отображение и настройка сетевых интерфейсов (устаревшая команда, рекомендуется использовать ip).",
        usage: "Исторически использовалась для настройки сетевых интерфейсов. Показывает IP-адреса, MAC-адреса и статистику.",
        options: [
            { option: "up", description: "Активировать интерфейс" },
            { option: "down", description: "Отключить интерфейс" },
            { option: "netmask МАСКА", description: "Задать маску подсети" }
        ],
        examples: [
            "ifconfig",
            "sudo ifconfig eth0 192.168.1.2 netmask 255.255.255.0 up"
        ],
        category: "network",
        tags: ["сеть", "интерфейс", "IP", "адрес", "устаревшая"]
    },
    {
        command: "iwconfig",
        syntax: "iwconfig [интерфейс] [опции]",
        description: "Настройка беспроводного сетевого интерфейса (Wi-Fi).",
        usage: "Используется для настройки параметров Wi-Fi и просмотра состояния беспроводного соединения.",
        options: [
            { option: "essid ИМЯCЕТИ", description: "Задать имя сети (SSID)" },
            { option: "key КЛЮЧ", description: "Задать ключ шифрования" },
            { option: "mode РЕЖИМ", description: "Установить режим работы (Managed/Ad-Hoc)" }
        ],
        examples: [
            "iwconfig",
            "sudo iwconfig wlan0 essid \"MyNetwork\" key s:password123"
        ],
        category: "network",
        tags: ["сеть", "Wi-Fi", "беспроводная", "радио"]
    },
    {
        command: "tcpdump",
        syntax: "tcpdump [опции] [выражение]",
        description: "Анализатор сетевого трафика для мониторинга и захвата пакетов.",
        usage: "Мощный инструмент для захвата и анализа сетевого трафика. Используется для отладки сетевых проблем.",
        options: [
            { option: "-i интерфейс", description: "Указать сетевой интерфейс для прослушивания" },
            { option: "-n", description: "Не преобразовывать адреса в имена" },
            { option: "-w файл", description: "Записать захваченные пакеты в файл" },
            { option: "-r файл", description: "Прочитать пакеты из файла" }
        ],
        examples: [
            "sudo tcpdump -i eth0",
            "sudo tcpdump -n host 192.168.1.1",
            "sudo tcpdump -w capture.pcap port 80"
        ],
        category: "network",
        tags: ["сеть", "анализ трафика", "пакеты", "отладка"]
    },
    {
        command: "nc",
        syntax: "nc [опции] хост порт",
        description: "Утилита netcat для работы с TCP и UDP соединениями.",
        usage: "Универсальный сетевой инструмент, иногда называемый 'швейцарским ножом TCP/IP'. Может создавать TCP/UDP соединения, слушать порты.",
        options: [
            { option: "-l", description: "Режим прослушивания (создать сервер)" },
            { option: "-p порт", description: "Указать локальный порт" },
            { option: "-u", description: "Использовать UDP вместо TCP" },
            { option: "-v", description: "Подробный вывод" }
        ],
        examples: [
            "nc -v google.com 80",
            "nc -l -p 8888",
            "echo 'GET / HTTP/1.1\r\nHost: example.com\r\n\r\n' | nc example.com 80"
        ],
        category: "network",
        tags: ["сеть", "TCP", "UDP", "сокеты", "соединения"]
    },
    {
        command: "curl",
        syntax: "curl [опции] URL",
        description: "Инструмент для передачи данных с сервера или на сервер через различные протоколы.",
        usage: "Мощная утилита командной строки для передачи данных по URL. Поддерживает HTTP, HTTPS, FTP, SCP, SFTP и другие протоколы.",
        options: [
            { option: "-o файл", description: "Записать вывод в файл" },
            { option: "-O", description: "Сохранить в файл с именем из URL" },
            { option: "-I", description: "Только заголовки HTTP" },
            { option: "-X метод", description: "Указать HTTP-метод (GET, POST и т.д.)" },
            { option: "-H заголовок", description: "Добавить HTTP-заголовок" }
        ],
        examples: [
            "curl https://example.com",
            "curl -o file.html https://example.com",
            "curl -I https://example.com",
            "curl -X POST -d 'name=value' https://example.com/form"
        ],
        category: "network",
        tags: ["сеть", "HTTP", "загрузка", "API"]
    },
    {
        command: "wget",
        syntax: "wget [опции] URL",
        description: "Утилита для загрузки файлов по сети с поддержкой HTTP, HTTPS и FTP.",
        usage: "Несинтерактивный загрузчик сетевых файлов. Может продолжать прерванные загрузки и загружать файлы в фоновом режиме.",
        options: [
            { option: "-O файл", description: "Записать документы в файл" },
            { option: "-c", description: "Продолжить прерванную загрузку" },
            { option: "-b", description: "Фоновый режим" },
            { option: "-r", description: "Рекурсивная загрузка" }
        ],
        examples: [
            "wget https://example.com/file.zip",
            "wget -c https://example.com/large_file.iso",
            "wget -r -np -k https://example.com/"
        ],
        category: "network",
        tags: ["сеть", "загрузка", "HTTP", "FTP"]
    },
    {
        command: "iptables",
        syntax: "iptables [опции] [-t таблица] команда [спецификация]",
        description: "Инструмент настройки встроенного в ядро Linux файрвола netfilter.",
        usage: "Используется для управления IP-фильтрацией, трансляцией сетевых адресов (NAT) и другими пакетными манипуляциями.",
        options: [
            { option: "-A цепочка", description: "Добавить правило в конец цепочки" },
            { option: "-D цепочка", description: "Удалить правило из цепочки" },
            { option: "-I цепочка", description: "Вставить правило в начало цепочки" },
            { option: "-j действие", description: "Указать действие при совпадении с правилом" }
        ],
        examples: [
            "sudo iptables -L",
            "sudo iptables -A INPUT -p tcp --dport 22 -j ACCEPT",
            "sudo iptables -A FORWARD -s 192.168.1.0/24 -j ACCEPT"
        ],
        category: "network",
        tags: ["сеть", "безопасность", "файрвол", "фильтрация"]
    },
    {
        command: "ssh",
        syntax: "ssh [опции] [пользователь@]хост [команда]",
        description: "Клиент безопасного удаленного доступа с шифрованием данных.",
        usage: "Позволяет безопасно входить на удаленный компьютер и выполнять команды на удаленных системах.",
        options: [
            { option: "-p порт", description: "Указать порт для подключения" },
            { option: "-i файл", description: "Указать файл с приватным ключом" },
            { option: "-X", description: "Включить перенаправление X11" },
            { option: "-L локальный:удалённый", description: "Локальное перенаправление портов" }
        ],
        examples: [
            "ssh user@example.com",
            "ssh -p 2222 user@example.com",
            "ssh -i ~/.ssh/id_rsa user@example.com"
        ],
        category: "network",
        tags: ["сеть", "безопасность", "удаленный доступ", "шифрование"]
    },
    {
        command: "scp",
        syntax: "scp [опции] [[пользователь@]хост1:]файл1 ... [[пользователь@]хост2:]файл2",
        description: "Безопасное копирование файлов между компьютерами по сети с шифрованием.",
        usage: "Используется для безопасной передачи файлов между локальной и удаленной системами с использованием протокола SSH.",
        options: [
            { option: "-P порт", description: "Указать порт для подключения" },
            { option: "-r", description: "Рекурсивно копировать директории" },
            { option: "-i файл", description: "Указать файл с приватным ключом" },
            { option: "-p", description: "Сохранять атрибуты файлов" }
        ],
        examples: [
            "scp file.txt user@example.com:/home/user/",
            "scp -r directory/ user@example.com:/home/user/",
            "scp user@example.com:/home/user/file.txt local_file.txt"
        ],
        category: "network",
        tags: ["сеть", "безопасность", "копирование", "файлы"]
    },
    // Команды для мониторинга сети
    {
        command: "nmap",
        syntax: "nmap [опции] хост/сеть",
        description: "Утилита для сканирования сетей и проверки безопасности.",
        usage: "Сканирует компьютеры для обнаружения открытых портов, запущенных служб и получения информации о хостах.",
        options: [
            { option: "-sS", description: "TCP SYN сканирование (полуоткрытое)" },
            { option: "-sV", description: "Определение версии служб" },
            { option: "-O", description: "Определение операционной системы" },
            { option: "-p порты", description: "Сканировать только указанные порты" },
            { option: "-A", description: "Агрессивное сканирование (ОС, версии, скрипты)" }
        ],
        examples: [
            "nmap 192.168.1.0/24",
            "nmap -sV -p 22,80,443 example.com",
            "nmap -A 192.168.1.1"
        ],
        category: "network",
        tags: ["сеть", "безопасность", "сканирование", "порты"]
    },
    {
        command: "mtr",
        syntax: "mtr [опции] хост",
        description: "Комбинация traceroute и ping в одном инструменте для непрерывного мониторинга сети.",
        usage: "Отображает информацию о маршруте к удаленному хосту и статистику по каждому узлу в реальном времени.",
        options: [
            { option: "-n", description: "Не производить обратное разрешение DNS (быстрее)" },
            { option: "-c число", description: "Количество пакетов для отправки" },
            { option: "-r", description: "Вывод в формате отчета, а не интерактивного режима" }
        ],
        examples: [
            "mtr google.com",
            "mtr -n -c 10 -r 8.8.8.8"
        ],
        category: "network",
        tags: ["сеть", "мониторинг", "диагностика", "трассировка"]
    },
    {
        command: "iftop",
        syntax: "iftop [опции]",
        description: "Инструмент для мониторинга сетевого трафика в реальном времени.",
        usage: "Отображает текущее использование полосы пропускания в сети с разбивкой по хостам и соединениям.",
        options: [
            { option: "-i интерфейс", description: "Указать сетевой интерфейс для мониторинга" },
            { option: "-n", description: "Не преобразовывать IP-адреса в имена хостов" },
            { option: "-P", description: "Показывать порты" },
            { option: "-B", description: "Использовать байты вместо битов" }
        ],
        examples: [
            "sudo iftop",
            "sudo iftop -i eth0 -n -P"
        ],
        category: "network",
        tags: ["сеть", "мониторинг", "трафик", "bandwidth"]
    },
    {
        command: "iptraf",
        syntax: "iptraf-ng",
        description: "Интерактивный цветной монитор IP-трафика для консоли.",
        usage: "Позволяет наблюдать за IP-трафиком, TCP и UDP-соединениями, отображает статистику интерфейсов и многое другое.",
        options: [
            { option: "-i интерфейс", description: "Запуск мониторинга IP-трафика на указанном интерфейсе" },
            { option: "-g", description: "Запуск визуализации общих статистических данных" },
            { option: "-s интерфейс", description: "Запуск режима статистики по интерфейсу" }
        ],
        examples: [
            "sudo iptraf-ng",
            "sudo iptraf-ng -i eth0"
        ],
        category: "network",
        tags: ["сеть", "мониторинг", "трафик", "статистика"]
    },
    {
        command: "nethogs",
        syntax: "nethogs [опции] [интерфейс]",
        description: "Мониторинг сетевого трафика с разбивкой по процессам.",
        usage: "Показывает, какие процессы используют сетевое соединение и сколько трафика они потребляют.",
        options: [
            { option: "-d секунды", description: "Установить интервал обновления в секундах" },
            { option: "-t", description: "Запустить в текстовом режиме" },
            { option: "-p", description: "Показывать только процессы, использующие сеть" }
        ],
        examples: [
            "sudo nethogs",
            "sudo nethogs eth0",
            "sudo nethogs -d 1"
        ],
        category: "network",
        tags: ["сеть", "мониторинг", "процессы", "трафик"]
    },
    // Команды для безопасности сети
    {
        command: "fail2ban-client",
        syntax: "fail2ban-client [опции] команда",
        description: "Клиент для управления сервисом fail2ban, который блокирует IP-адреса с подозрительной активностью.",
        usage: "Позволяет просматривать и управлять блокировками, настраивать правила и просматривать статистику.",
        options: [
            { option: "status", description: "Показать статус всех jail'ов" },
            { option: "status jail", description: "Показать статус конкретного jail'а" },
            { option: "set jail unbanip IP", description: "Разблокировать указанный IP-адрес" }
        ],
        examples: [
            "sudo fail2ban-client status",
            "sudo fail2ban-client status sshd",
            "sudo fail2ban-client set sshd unbanip 192.168.1.100"
        ],
        category: "network",
        tags: ["сеть", "безопасность", "защита", "блокировка"]
    },
    {
        command: "ss",
        syntax: "ss [опции] [фильтр]",
        description: "Утилита для исследования сокетов, более быстрая и с большим количеством функций, чем netstat.",
        usage: "Отображает информацию об открытых сокетах, портах, установленных соединениях и их состоянии.",
        options: [
            { option: "-t", description: "Показать только TCP-сокеты" },
            { option: "-u", description: "Показать только UDP-сокеты" },
            { option: "-l", description: "Показать только слушающие сокеты" },
            { option: "-p", description: "Показать процессы, использующие сокеты" },
            { option: "-n", description: "Не разрешать имена служб и хостов" },
            { option: "-s", description: "Показать статистику сокетов" }
        ],
        examples: [
            "ss -tulpn",
            "ss -ta state established",
            "ss -o state established '( dport = :ssh or sport = :ssh )'"
        ],
        category: "network",
        tags: ["сеть", "сокеты", "мониторинг", "соединения"]
    },
    // Команды для мониторинга системы
    {
        command: "htop",
        syntax: "htop [опции]",
        description: "Интерактивный просмотрщик процессов с расширенными возможностями.",
        usage: "Отображает процессы в системе, их потребление ресурсов и позволяет управлять ими интерактивно.",
        options: [
            { option: "-d секунды", description: "Установить задержку обновления" },
            { option: "-u пользователь", description: "Показать только процессы указанного пользователя" },
            { option: "-p PID", description: "Показать только указанный процесс и его потомков" }
        ],
        examples: [
            "htop",
            "htop -u www-data",
            "htop -p 1234"
        ],
        category: "system",
        tags: ["система", "мониторинг", "процессы", "ресурсы"]
    },
    {
        command: "iostat",
        syntax: "iostat [опции] [интервал [счетчик]]",
        description: "Показывает статистику загрузки ЦП и дисковых устройств ввода-вывода.",
        usage: "Используется для мониторинга производительности системы и выявления узких мест в дисковой подсистеме.",
        options: [
            { option: "-c", description: "Показать только статистику ЦП" },
            { option: "-d", description: "Показать только статистику устройств" },
            { option: "-x", description: "Показать расширенную статистику" },
            { option: "-p", description: "Показать статистику для указанных устройств" }
        ],
        examples: [
            "iostat",
            "iostat -x 2 5",
            "iostat -p sda 1"
        ],
        category: "system",
        tags: ["система", "мониторинг", "диски", "производительность"]
    },
    {
        command: "bmon",
        syntax: "bmon [опции]",
        description: "Консольный монитор пропускной способности с детальными графиками.",
        usage: "Отображает пропускную способность сетевых интерфейсов в реальном времени с графическим представлением.",
        options: [
            { option: "-p", description: "Указать отображаемый интерфейс" },
            { option: "-r", description: "Частота считывания в секундах" }
        ],
        examples: [
            "bmon",
            "bmon -p eth0"
        ],
        category: "network",
        tags: ["сеть", "мониторинг", "пропускная способность", "графики"]
    }
];