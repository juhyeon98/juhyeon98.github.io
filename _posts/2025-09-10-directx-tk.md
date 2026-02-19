---
title: "DirectX Tool Kit 라이브러리 적용"
layout: post
permalink: /directx-tk
date: 2025-09-10
---

# DirectX Tool Kit 라이브러리 적용
* DirectX 프로그래밍에서 `d3dx10.h` 라는 헤더파일은 자주 사용한다.
* 이 헤더파일은 Direct3D 개발을 위한 다양한 헬퍼 함수와 유틸리티 클래스, 구조체 등이 포함되어 있다.
* 그러나 `d3dx10.h` 는 더 이상 지원하지 않아 DirectX Tool Kit을 사용해야 한다.

## DirectXTK 빌드

<br/>
<img src="/assets/image/2025-09-10-directx-tk/1.png" width=600>
<br/>

* [DirectXTK GitHub 레포지토리](https://github.com/microsoft/DirectXTK)에서 clone 한다.
* clone을 받아 보면 여러 개의 솔루션 파일이 있는데, 여기에서 원하는 환경에 맞는 솔루션 파일을 선택한다.
* 여기에서는 `DirectXTK\_Desktop\_2022\_Win10` 을 선택

<br/>
<img src="/assets/image/2025-09-10-directx-tk/2.png" width=600>
<br/>

* 솔루션 파일을 열고 `빌드 - 솔루션 빌드` 를 통해 솔루션을 빌드한다.
* 이때 만일 `fxc.exe` 에 대한 오류가 발생한다면 환경변수를 설정해야 한다.
	* `fxc.exe` 의 위치는 보통 `C:\Progrma Files (x86)\Windows Kits\10\bin\[설치한 SKD]\x64` 에 있다.

## 헤더파일 가져오기
* 작업할 프로젝트에서 DirectXTK를 사용하려면 헤더파일을 가져와야 한다.
* 헤더파일을 직접 가져오는 방법도 있겠지만, Visual Studio에서는 솔루션 속성을 통해 헤더파일이 있는 위치를 참조하도록 할 수 있다.
* `프로젝트 - 속성 - VC++ 디렉터리` 에서 포함 디렉터리를 선택하여 편집한다.

<br/>
<img src="/assets/image/2025-09-10-directx-tk/3.png" width=600>
<img src="/assets/image/2025-09-10-directx-tk/4.png" width=600>
<br/>

## 라이브러리 가져오기
* 헤더파일만으로는 프로젝트를 온전히 컴파일할 수 없다.
* 헤더파일은 우리 프로젝트가 사용할 것들을 명시할 뿐, 실제 실행해 주는 것은 라이브러리이다.
* 따라서 앞서 빌드한 라이브러리에 대해서 명시해 줄 필요가 있다.
* 이 역시 헤더파일처럼 모두 가져올 필요 없이 참조만 하도록 하면 된다.
* `프로젝트 - 속성 - VC++ 디렉터리` 에 가서 라이브러리 디렉터리를 선택하여 편집한다.

<br/>
<img src="/assets/image/2025-09-10-directx-tk/5.png" width=600>
<img src="/assets/image/2025-09-10-directx-tk/6.png" width=600>
<br/>