---
title: "Git - 잘못된 branch에서 작업한 경우"
layout: post
permalink: /git-wrong-branchs
date: 2025-11-09
---

# Git - 잘못된 branch에서 작업한 경우
## 문제 상황
* `65-dice-test-prefab` 에 작업하지 않고 `feature` 에 작업을 한 상황

<br/>
<img src="/assets/image/2025-11-09-git-wrong-branch/1.pgn" width=600>
<br/>

* 작업 내용을 모두 복사해서 작업 브랜치에 붙여넣는 방식도 있지만, 단점이 너무 많다.
    1. 복사하는데 시간이 너무 오래걸린다.
    2. Commit History가 남지 않는다.

## 해결 방법
1. 작업한 브랜치를 Local에서 또 다른 브랜치로 분기한다.
    * `feature` 브랜치에서 임시 브랜치 `dice-test-prefab` 로 분기한다.

<br/>
<img src="/assets/image/2025-11-09-git-wrong-branch/2.pgn" width=600>
<br/>

2. 작업한 브랜치를 초기화한다.
    * `feature` 브랜치를 `reset` 한다.

<br/>
<img src="/assets/image/2025-11-09-git-wrong-branch/3.pgn" width=600>
<br/>

3. Local에서 분기한 브랜치와 작업을 해야 했던 브랜치를 merge한다.
    * `65-dice-test-prefab` 브랜치로 `checkout` 하고, `dice-test-prefab` 을 `merge` 한다.

<br/>
<img src="/assets/image/2025-11-09-git-wrong-branch/4.pgn" width=600>
<br/>

4. merge한 브랜치에서 push한다.
    * `65-dice-test-prefab` 을 `push` 한다.