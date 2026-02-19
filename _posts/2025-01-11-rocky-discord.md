---
title: "Rocky Linux - Discord 화면 공유 문제"
layout: post
permalink: /rocky-linux-discord
date: 2025-01-11
tags: [Rocky Linux, Linux, Discord, X11, Wayland]
---

# Rocky Linux - Discord 화면 공유 문제

## 문제점 파악
* Rocky Linux에서 Discord를 설치한 뒤, 음성 채널에서 화면공유를 시도하면 화면공유가 되지 않는 현상이 발생했습니다.
* 아래와 같은 명령어로 우선 디스플레이가 사용하고 있는 서버를 확인해 보았습니다.

<br/>

```bash
echo $XDG_SESSION_TYPE
```
<br/>

* 그 결과 디스플레이는 `Wayland` 라는 서버를 사용하고 있는 것을 확인할 수 있었습니다.
* Discord 화면 공유 기능이 `Wayland`와의 호환성이 맞지 않아 발생하는 문제로 파악하여, 서버를 일반적으로 사용되는 `X11`로 변경할 필요가 있어 보였습니다.

## x11

<br/>
<img src="/assets/image/2025-01-11-rocky-discord/1.webp" width=300>
<br/>

* `X11` 은 X Window System이라고도 하며, 주로 Unix 계열의 운영체제에서 윈도우 시스템 / GUI 환경을 제공하는 프로그램입니다.
* `X11` 은 클라이언트-서버 구조로 되어 있다는 특징이 있으며, 어떠한 클라이언트든 서버 - `X server` 에 접속해야 하기 때문에 보안적으로 취약할 수 있습니다.
* 실제 실행 시에는 다음과 같이 동작합니다.
	1. 입력 장치로부터 이벤트 발생하면, 커널이 `X server` 로 전송한다.
    2. `X server` 는 받은 이벤트가 어느 위치에서 발생했는지 확인하고, 해당 위치에 있는 클라이언트에 이벤트를 전달한다.
    3. 클라이언트는 이벤트에 대한 처리가 이루어지고, 응답과 동시에 렌더링 요청을 `X server` 에 전송한다.
    4. `X server` 가 클라이언트의 요청을 받으면, 컴포지터(compositor)에게 렌더링 요청을 전송한다.
    5. 컴포지터가 렌더링을 완료하면, `X server` 가 이를 받아 커널로 전송하여 실제 모니터에 출력되도록 한다.
* 여기에서 중요한 점은 **컴포지터**를 반드시 거쳐야 한다는 것입니다.
* 컴포지터가 실제로 렌더링을 실행하는 역할을 하며, `X server` 는 중재자처럼 데이터를 전달하기만 하기 때문에 성능이 비교적 떨어집니다.

## Wayland

<br/>
<img src="/assets/image/2025-01-11-rocky-discord/2.webp" width=200>
<br/>

* `Wayland` 역시 `X11` 과 동일하게 Unix 계열 운영체제에서 윈도우 시스템과 GUI 환경을 제공하는 프로그램(혹은 프로토콜)입니다.
* `Wayland` 역시 기본적인 구조는 클라이언트-서버 구조입니다만, `X11` 과 달리 **컴포지터가 없고** 서버가 직접 렌더링한다는 것입니다.
* 때문에 성능적으로 `X11` 보다 상대적으로 빠를 수 있으며, 보안적으로도 뛰어날 수 있습니다.
    * `X server` 는 단순 중재자로서 요청과 응답에 대해서 모두 투명할 뿐만 아니라 권한 범위가 전역적이어서 헛점이 많습니다.
    * 반면 `Wayland` 는 기본적으로 응답과 요청에 대해서 엄격하게 검토하는 로직이 들어 있으며, 클라이언트의 권한을 기준으로 동작하도록 되어 있습니다.
* 그러나 문제점은 이러한 강점이 어디까지나 **이론적인 부분**이라는 점이고, 버그가 `X11` 에 비해 심하기 때문에 불안정합니다.
* 무엇보다도 `Wayland` 를 지원하는 프로그램이 아직은 많이 없기 때문에 여전히 `X11` 이 사용되는 것이 현실입니다.

## 해결책
* 생각보다 해결책은 간단합니다.
* GDM(Gnome Display Manager)을 설정해주는 파일을 수정하기만 하면 됩니다.

<br/>

```bash
sudo vi /etc/gdm/custom.conf
```
<br/>

* 이때, 편한 텍스트 편집기를 사용하면 됩니다. (저는 `vim`이 편해서...)
* 이제 설정 파일의 Deamon 섹션에 다음과 같이 작성하면 됩니다. 

<br/>

```text
WaylandEnable=false
```
<br/>

* 이렇게 하면, GDM이 기본으로 설정되어 있는 `X11` 을 사용하게 됩니다.
* 설정을 마치고 재부팅을 해서 화면 공유를 시도하면, 정상적으로 동작하는 것을 확인할 수 있습니다.

## 참고한 자료
> [Wiki - X 윈도우 시스템](https://ko.wikipedia.org/wiki/X_%EC%9C%88%EB%8F%84_%EC%8B%9C%EC%8A%A4%ED%85%9C)
> [Wayland](https://wayland.freedesktop.org/architecture.html)
> [X11로 변경하는 법](https://www.linux.org/threads/advantages-of-wayland-over-x11.49441/)