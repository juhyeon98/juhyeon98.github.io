---
title: "Ubuntu - Obisidian 한글입력 문제"
layout: post
permalink: /ubuntu-obsidian
date: 2025-01-15
---

# Ubuntu - Obisidian 한글입력 문제
## 문제점 파악
* snap으로 설치한 Obsidian에서 한글 입력이 되지 않는 문제가 발생했습니다.
* 그 외 모든 앱과 시스템에서는 한글 입력이 가능한데, Obsidian에서만 되지 않는 것으로 보아 snap이 시스템과 완전히 독립적인 공간이라서 나타나는 문제로 파악했습니다.

## snap
* Ubuntu를 개발한 Canonical에서 개발한 패키지 관리 시스템입니다.
* 전통적인 패키지 관리 시스템인 `apt` 는 의존성 관리와 동시에 직접 시스템에 설치하는 방식입니다.
* snap은 격리된 공간인 `Sandbox` 에 앱을 설치하고 실행하는 방식입니다.
    * 이때, `Sandbox` 는 `snapd` 라는 데몬이 관리하는 공간입니다.
    * container에 비해 약하게 격리시킨 공간입니다.
    * snap의 `Sandbox` 는 보안 정책이 엄격하게 정의되어 있어서 변경하거나 커스터마이징하기 어렵습니다.
* snap이 `Sandbox` 라는 공간에서 앱을 설치하고 실행하는 이유는 다음과 같습니다.
    * 버전 충돌을 방지
    * 앱 하나에 대한 문제가 시스템 문제로 가지 않기 위함
    * 의존성 지옥 방지
    * 다양한 배포판에서도 일관되게 동작하기 위함
    * 보안을 통해 리소스 접근을 제한하기 위함

## Appimage
* 리눅스용 포터블 애플리케이션 포맷입니다.
* snap이 Windows에서 MSI와 비슷한 역할을 한다면, Appimage는 EXE와 유사한 역할을 한다고 볼 수 있습니다.
* 설치 과정이 필요없고, 다운로드되어 실행 권한만 부여하면 바로 실행이 됩니다.
* `apt` 와 같은 전통적인 패키지 관리 시스템은 의존성을 관리하지만, Appimage는 의존성을 관리하지 않기 때문에 의존성을 따로 관리해야한다는 번거로움이 있습니다.


## Chrome-sandbox
* Chromium/Electron 기반의 앱을 위한 `Sandbox` 입니다.
* snap이 강력한 보안 정책으로 인해 커스텀이 불가능했다면, Chrome-sandbox는 비교적 보안 정책이 느슨하기 때문에 커스텀이 가능합니다.
* 동작 방식은 다음과 같습니다.
    1. Appimage나 SELinux은 MAC(Mandatory Access Control)을 사용해서, 접근하려는 시스템을 판별한다.
    2. Seccomp-RPF 필터를 통해 시스템 콜을 제한한다.
    3. Cgroups를 통해 시스템 리소스 사용을 제한한다.
* 이러한 동작때문에 SUID(Settings User ID)가 있어야 접근이 가능합니다.

# 해결책
* Obsidian을 snap이 아닌, Chrome-sandbox로 설치해야 합니다.
* Obsidian의 Appimage 파일을 설치하고, Appimage의 권한에 실행권한을 추가합니다.

<br/>

```bash
chmod +x Obsidian-1.7.7.AppImage # 앱 이름이나 버전은 다를 수 있습니다.
```

<br/>

* Appimage 파일을 추출합니다.

<br/>

```bash
./Obsidian-1.7.7.AppImage --appimage-extract
```

<br/>

* 추출한 디렉터리로 이동해서, Chrome-sandbox 파일의 소유권과 권한을 설정합니다.

<br/>

```bash
cd squashfs-root;
sudo chown root:root chrome-sandbox;
sudo chmod 4755 chrome-sandbox;
```

<br/>

* 설정을 마치고 실행하면 됩니다.

<br/>

```bash
./AppRun
```

<br/>

* 추가로, Gnome 바로가기에 설정해두고 싶다면, 바로가기를 위한 파일을 생성해 두어야 합니다.

<br/>

```bash
vi ~/.local/share/applications/obsidian.desktop
```

<br/>

* 바로가기 파일 안에는 다음과 같은 내용을 추가해야 합니다.

<br/>

```text
[Desktop Entry]
Version=1.0
Type=Application
Name=Obsidian
Comment=Obsidian Notes
Exec=/home/leenux/다운로드/squashfs-root/AppRun
Icon=/home/leenux/다운로드/squashfs-root/obsidian.png
Categories=Office;
Terminal=false
StartupWMClass=obsidian
```

<br/>

* 내용을 추가한 뒤, 바로가기 파일에 실행 권한을 부여하면 바로가기 파일을 통해 실행할 수 있습니다.

<br/>

```bash
chmod +x ~/.local/share/applications/obsidian.desktop
```

<br/>

## 참고한 자료
> [Snap](https://snapcraft.io/docs)
> [문제 해결](https://lazyartisan.tistory.com/5)