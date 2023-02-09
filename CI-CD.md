# CI/CD на базе gitlab.com

Руководство по запуску CI/CD на базе gitlab.com

## Подготовка хоста

1\. Установить на хосте docker

```bash
sudo apt-get install docker
```

или, если не получается, [так](https://docs.docker.com/engine/install/debian/#install-from-a-package)

После пустить:

```bash
sudo systemctl enable docker
```

2\. Установить [gitlab-runner](https://docs.gitlab.com/runner/install/linux-repository.html)

3\. Настроить службу и пользователя `gitlab-runner`

```bash
sudo systemctl enable gitlab-runner
sudo usermod -aG sudo gitlab-runner
sudo usermod -aG docker gitlab-runner
sudo chmod 664 /var/run/docker.sock
```

4\. В файл `/etc/sudoers` добавить строку:

```config
gitlab-runner ALL= (root) NOPASSWD:ALL
```

перед

```config
@includedir /etc/sudoers.d
```

5\. Выйти из shh-соединения, зайти заново

## Настройка CI/CD на gitlab.com

1\. Зайти в проект

2\. В левом меню выбрать `Settings->CI/CD`

3\. Распахнуть настройки `Variables`

4\. Добавить `protected` переменные

* `CW_FRONT_PORT`

5\. Распахнуть настройки `Runners`

6\. В секции `Shared runners` выключить флажок `Enable shared runners for this project`

7\. Запомнить `URL` и `Token` проекта из секции `Project runners`

## Регистрация `gitlab-runner` хоста на gitlab.com

На хосте выполнить:

```bash
gitlab-runner register 
```

В поля `URL` и `Token` ввести запомненные ранее значения.

В `Tags` вбить `car_wash_frontend`

В качестве `Executor` выбрать `shell`

## Fire-wall ufw (не обязательно)

Убрать все порты из общего доступа на машине с БД и http-серверами.

Установка:

```bash
sudo apt-get install ufw
sudo ufw disable
```

Примерный файл конфигурации:

```ufw
deny incoming
allow outgoing

allow ssh
allow http
allow https

allow 5432:5433/tcp from 193.176.79.77
```

Запустить `ufw`:

```bash
sudo ufw enable
sudo systemctl enable ufw
```

## Проверка CI/CD

1\. Убедится что раннер появился в секции `Project runners` на странице `Settings->CI/CD->Runners`

2\. Сделать *`git commit`* на ветку `master`

3\. В левом меню выбрать `CI/CD->Pipelines`

4\. Убедиться в отсутствии ошибок

## CI/CD stages

1\. `build`: подготовка окружения и приложения

2\. `tests`: прохождение тестов

3\. `run`: запуск приложения на хосте

4\. `logs`: анализ логов после запуска приложения
