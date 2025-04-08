---
title: "[Rocky linux] Obsidian에서 한글이 입력되지 않는 문제"
author: 이주현
date: 2024-12-30
category: Linux
layout: post
tag: [Linux, Obsidian, snap, Appimage, Chrome-sandbox]
published: true
---

## 문제점 파악
- snap으로 설치한 Obsidian에서 한글 입력이 되지 않는 문제가 발생한다.
- 그 외 모든 앱과 시스템에서는 한글 입력이 가능한데, Obsidian에서만 되지 않는다.
- 이는 snap이 시스템과 독립적인 공간이라서 나타나는 문제이다.

## snap
- Ubuntu를 개발한 Canonical에서 개발한 패키지 관리 시스템이다.
- 전통적인 패키지 관리 시스템인 `apt`는 의존성 관리와 동시에 직접 시스템에 설치하는 방식이다.
- 그러나 snap은 격리된 공간인 Sandbox에서 앱을 설치하고 실행한다.
    - snap의 Sandbox는 snapd라는 데몬이 관리하는 공간이다.
    - container에 비해서 약하게 격리시키는 방식을 사용한다.
    - snap의 Sandbox는 보안 정책이 엄격하게 정의되어 있어서 변경하거나 커스터마이징 하기 어렵다.
- snap이 Sandbox라는 공간에서 앱을 설치하고 실행하는 이유는 다음과 같다.
<br>
1. 버전 충돌을 방지한다.
2. 앱 하나에 대한 문제가 시스템 문제로 가지 않기 위함이다.
3. 의존성 지옥을 방지한다.
4. 다양한 배포판에서도 일관되게 동작하기 위함이다.
5. 보안을 통해 리소스 접근을 제한하기 위함이다.
<br>
- 때문에, 리눅스 시스템에서 입력 방식과 관련된 iBus와 같은 시스템이 snap 앱에 접근하는데 제한이 될 수 있다.
- 즉, 커스터마이징이 가능한 Sandbox를 사용하는 패키지 매니저를 통해 설치해야 한다.

## 해결책
- snap으로 설치한 Obsidian을 삭제한다.
- 그리고 Obsidian의 Appimage를 설치한다.
- Obsidian의 Appimage의 권한에 실행권한을 추가한다.

```shell
$ chmod +x Obsidian-1.7.7.AppImage # 앱 이름이나 버전은 다를 수 있다.
```

- Appimage 파일을 추출한다.

```shell
$ ./Obsidian-1.7.7.AppImage --appimage-extract
```

- 추출한 디렉터리로 이동해서, chrome-sandbox 파일의 소유권과 권한을 설정한다.

```shell
$ cd squashfs-root
$ sudo chown root:root chrome-sandbox
$ sudo chmod 4755 chrome-sandbox
```

- 설정을 마치고 실행을 하면 제대로 실행이 된다.

```shell
$ ./AppRun
```

- 추가로, Gnome 바로가기에 설정해두고 싶다면, 바로가기를 위한 파일을 생성해 두면 된다.

```shell
$ vi ~/.local/share/applications/obsidian.desktop
```

- 바로가기 파일 안에는 다음과 같은 내용을 추가한다.

```
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

- 내용을 추가한 뒤, 바로가기 파일에 실행 권한을 부여하면 바로가기 파일을 통해 실행할 수 있다.

```shell
$ chmod +x ~/.local/share/applications/obsidian.desktop
```

## Appimage
- 리눅스용 포터블 애플리케이션 포맷이다.
- snap이 Windows에서 MSI 역할을 한다면, AppImage는 Windows에서 EXE 역할을 한다고 볼 수 있다.
- 설치 과정이 필요 없고, 다운로드되어 실행 권한만 부여하면 바로 실행된다.
- `apt`와 같은 전통적인 패키지 관리 시스템은 의존성을 관리하지만, Appimage는 의존성을 관리하지 않는다.
- 때문에, 설치를 할 때 필요한 의존성들을 모두 설치한다는 단점이 있다.

## Chrome-sandbox
- Chromium/Electron 기반의 앱을 위한 Sandbox이다.
- snap이 강력한 보안 정책으로 인해 커스텀이 불가능했다면, Chrome-sandbox는 비교적 보안 정책이 느슨하기 때문에 커스텀이 가능하다.
- 동작 방식으로는 다음과 같다.
    - AppArmor나 SELinux 같은 MAC(Mandatory Access Control)을 사용해서, 접근하려는 시스템을 판별한다.
    - Seccomp-RPF 필터를 통해 시스템 콜을 제한한다.
    - Cgroups를 통해 시스템 리소스 사용을 제한한다.
- 이러한 동작 방식으로 인해 SUID(Setting User ID)가 있어야 접근이 가능하다.

## 참고한 자료
- [snap](https://snapcraft.io/docs)
- [해결책](https://lazyartisan.tistory.com/5)