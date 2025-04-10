---
title: "[자료구조] 단순 연결 리스트"
author: 이주현
date: 2024-09-10
category: "Data struct"
layout: post
tag: ["Data strcut", "Linked list"]
published: true
---

## 연결 리스트의 개념
- 배열은 기본적으로 스택에 할당되기 때문에, 동적으로 그 크기를 늘리거나 줄일 수 없다.
- 리스트는 이러한 배열의 단점을 보완하기 위해 나온 자료구조로, 마치 채인처럼 노드를 줄줄이 연결한 구조를 가지고 있다.

<p align="center">
    <img src="../assets/resource/연결리스트 구조.png">
</p>

## 노드의 표현
- 연결 리스트는 저장할 "데이터"와 채인처럼 연결할 "포인터"가 기본적으로 들어간다.

```c
typedef struct s_node
{
	int data;
	struct node* next;
}node_t;

typedef node_t list_t;
```

- 여기에서 데이터는 단순하게 보기 위해 정수 값을, 포인터는 다음 노드를 가리키도록 설계했다.

## 삽입
- 리스트에서는 기본적으로 헤드(head)부분이 있다.
- 리스트는 헤드로만 접근이 가능하고, 헤드를 통해서 다른 요소들을 접근할 수 있다.
- 삽입 역시 헤드부분 - 앞 부분에 삽입이 되도록 우선 구현을 해보자.
- 삽입 원리는는 다음과 같다.
	1. 삽입할 데이터를 가지고 있는 노드를 하나 생성한다.
	2. 헤드가 비어있는(`NULL`) 경우, 헤드가 곧 생성한 노드가 된다.
	3. 그렇지 않다면, 생성한 노드의 다음 노드는 헤드가 되고 헤드는 새로운 노드가 된다.

```c
void insert_data(list_t** const head, const int data)
{
	node_t* new_node = (node_t*)malloc(sizeof(node_t));
	if (!new_node)	return;

	new_node->data = data;
	new_node->next = *head;
	(*head) = new_node;
}
```

- 이때, 매개변수로 들어오는 `head` 가 이중 포인터이다.
- 그 이유는 `head` 자체가 "맨 앞의 노드를 가리키는 포인터"이기 때문이다.
- 이렇게 되면, `insert_data` 에서 `head` 값이 변경되어야 한다.
- 즉, 매개변수로 이중 포인터를 넣어야 `head` 의 값 - 참조하는 공간의 주소 값이 변경된다.

```c
list_t* head = NULL;
insert_data(&head, data);
```

### 헤드 노드의 추가
- 앞서 구현한 부분에서 헤드 노드를 추가할 수도 있다.
- 물론, 이렇게 되면 헤드는 더이상 포인터가 아니라 실제 존재하는 노드가 된다.

```c
list_t head = { 0, 0 };
```

- 이때, `insert_data` 함수도 바뀌어야 한다.

```c
void insert_data(list_t* head, const int data)
{
	node_t* new_node = (node_t*)malloc(sizeof(node_t));
	if (!new_node)	return;

	new_node->data = data;
	new_node->next = head->next;
	head->next = new_node;
}
```

- 원리 자체는 동일하다.
- 하지만, 구현에 있어서 `head` 가 노드에 대한 포인터가 아닌 실제 노드이기 때문에, 매개변수로 포인터만 넘겨줘도 된다.
- 그리고 `head` 가 아닌, `head` 의 다음 노드를 가리키도록 해야 한다.
- 이렇게 하면, 저장공간에 `head` 노드 하나 더 차지한다는 점이 있다.

## 삭제
- 삭제 역시 삽입과 마찬가지로, 리스트의 앞 요소만 삭제하도록 하겠다.
- 삭제 원리는 다음과 같다.
	1. 삭제할 노드의 이전 노드를 구한다.
	2. 삭제할 노드의 다음 노드를 구한다.
	3. 1에서 구한 노드의 다음 노드로 2에서 구한 노드로 설정한다.
	4. 삭제할 노드를 메모리에서 할당 해제한다.
- 이때, 삭제할 노드는 `head` 의 다음 노드이다.

```c
void remove_data(list_t* head)
{
	if (!head || !(head->next))	return;

	node_t* next_node = head->next;
	head->next = next_node->next;
	free(next_node);
}
```

## 화면 출력
- 화면에 출력하는 함수는 반복문을 통해 리스트를 순환해야 한다.
	1. `head` 의 다음 노드에서부터 시작한다.
	2. `NULL` 이 될 때까지, 노드 안에 있는 데이터를 출력한다.

```c
void display(const list_t head)
{
	node_t* curr = head.next;

	system("cls");	// 화면을 지운다.
	printf("HEAD->");
	while (curr)
	{
		printf("[%d]->", curr->data);
		curr = curr->next;
	}
	puts("NULL");
	getchar();	// 사용자의 입력을 기다린다.
}
```

## 참고한 자료
- [이것이 자료구조+알고리즘이다 with C언어](https://www.yes24.com/Product/Goods/111362116)
- [오픈소스 자료구조 및 알고리즘 in C](https://www.inflearn.com/course/%EC%98%A4%ED%94%88%EC%86%8C%EC%8A%A4-%EC%9E%90%EB%A3%8C%EA%B5%AC%EC%A1%B0-%EC%95%8C%EA%B3%A0%EB%A6%AC%EC%A6%98-c/dashboard)