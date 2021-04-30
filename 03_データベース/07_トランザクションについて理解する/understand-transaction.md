# トランザクションについて理解する

## 1 (質問)

### 1

デッドロックとは、要求するリソースをお互いに専有しあっているせいで処理が進まなくなる現象のこと。

### 2

ISOLATION LEVEL (トランザクション分離レベル) とは、同時に2つ以上のトランザクションが実行されている際に、どれだけデータの不整合の発生を許容するかの指標。

発生する不整合は以下の3つに分類される。

| 名前 | 説明 |
| --- | --- |
| Dirty Read | 他のトランザクションによって変更される予定のデータを読み取ってしまう |
| Non-Repeatable Read | 他のトランザクションの実行前のデータと実行後のデータを読み取ってしまう |
| Phantom Read | 他のトランザクションによって追加された行を読み取ってしまう<br>集計関数を用いる場合等に問題になる |

各 ISOLATION LEVEL ごとに発生する可能性のある問題をまとめると、以下のようになる。

| ISOLATION LEVEL | 発生する可能性のある問題 |
| --- | --- |
| SERIALIZABLE | なし |
| REPEATABLE READ | Phantom Read |
| READ COMMITED | Non-Repeatable Read, Phantom Read |
| READ UNCOMMITED | Dirty Read, Non-Repeatable Read, Phantom Read |

しかし、MySQLでは REPEATABLE READでも Phantom Readは発生しない。

> REPEATABLE READ	起きない	起きない	起きない
>
> ※ REPEATABLE READ のファントムリードが起きないのは、MySQL の仕様
> [PHP + PDO + MySQL のトランザクション制御方法まとめ | Webセキュリティの小部屋](https://www.websec-room.com/2015/11/17/2356)

### 3

- 行レベルのロック
  - レコードのみをロックする
  - ロックの競合が発生しづらい
  - Phantom Readが発生する
- テーブルレベルのロック
  - テーブル全体をロックする
  - 頻繁に更新されるテーブルの場合、待ち時間が多く発生する
  - 強い整合性を確保できる (Phantom Readは発生しない)

### 4

- 楽観ロック
  - 更新対象のデータをロックしない
  - Versionカラムを使用して整合性を確保する
    - 取得時のVersionと更新時のversionが同じ場合のみデータが更新され、違う場合は処理をやり直す
- 悲観ロック
  - 更新対象のデータをロックする
  - 強い整合性を確保できる

## 2 (実装)

### 1 (Dirty Read)

#### クエリ

emp_noが10001の従業員のgenderを変更する以下のトランザクションを実行する。

```sh
mysql> select * from employees where emp_no = 10001;
+--------+------------+------------+-----------+--------+------------+
| emp_no | birth_date | first_name | last_name | gender | hire_date  |
+--------+------------+------------+-----------+--------+------------+
|  10001 | 1953-09-02 | Georgi     | Facello   | M      | 1986-06-26 |
+--------+------------+------------+-----------+--------+------------+
1 row in set (0.01 sec)

mysql> start transaction; -- ①トランザクション開始
Query OK, 0 rows affected (0.01 sec)

mysql> update employees set gender='F' where emp_no = 10001; -- ②レコードを更新
Query OK, 1 row affected (0.01 sec)
Rows matched: 1  Changed: 1  Warnings: 0

mysql> commit; -- ③トランザクションを終了
Query OK, 0 rows affected (0.00 sec)

mysql> select * from employees where emp_no = 10001;
+--------+------------+------------+-----------+--------+------------+
| emp_no | birth_date | first_name | last_name | gender | hire_date  |
+--------+------------+------------+-----------+--------+------------+
|  10001 | 1953-09-02 | Georgi     | Facello   | F      | 1986-06-26 |
+--------+------------+------------+-----------+--------+------------+
1 row in set (0.01 sec)
```

#### 実行

ISOLATION LEVEL を READ-UNCOMMITTED に変更

```sh
mysql> select @@global.tx_isolation, @@tx_isolation;
+-----------------------+------------------+
| @@global.tx_isolation | @@tx_isolation   |
+-----------------------+------------------+
| REPEATABLE-READ       | READ-UNCOMMITTED |
+-----------------------+------------------+
1 row in set, 2 warnings (0.00 sec)
```

```sh
mysql> start transaction;
Query OK, 0 rows affected (0.00 sec)

--- ①トランザクション開始後 → 変化なし

mysql> select * from employees where emp_no = 10001;
+--------+------------+------------+-----------+--------+------------+
| emp_no | birth_date | first_name | last_name | gender | hire_date  |
+--------+------------+------------+-----------+--------+------------+
|  10001 | 1953-09-02 | Georgi     | Facello   | M      | 1986-06-26 |
+--------+------------+------------+-----------+--------+------------+
1 row in set (0.00 sec)

-- ②レコード更新後 → **他のトランザクションのコミット前の変更が読み込まれた**

mysql> select * from employees where emp_no = 10001;
+--------+------------+------------+-----------+--------+------------+
| emp_no | birth_date | first_name | last_name | gender | hire_date  |
+--------+------------+------------+-----------+--------+------------+
|  10001 | 1953-09-02 | Georgi     | Facello   | F      | 1986-06-26 |
+--------+------------+------------+-----------+--------+------------+
1 row in set (0.00 sec)

-- (③トランザクション変更後、④自身のトランザクション終了後は省略)
```

### 2 (Non-Repeatable Read)

ISOLATION LEVELを変更

```sh
mysql> select @@global.tx_isolation, @@tx_isolation;
+-----------------------+----------------+
| @@global.tx_isolation | @@tx_isolation |
+-----------------------+----------------+
| REPEATABLE-READ       | READ-COMMITTED |
+-----------------------+----------------+
1 row in set, 2 warnings (0.00 sec)
```

同様に、genderを更新するトランザクションAを実行したときのトランザクションBの様子

```sh
mysql> start transaction;
Query OK, 0 rows affected (0.00 sec)

--- ①トランザクション開始後 → 変化なし

mysql> select * from employees where emp_no = 10001;
+--------+------------+------------+-----------+--------+------------+
| emp_no | birth_date | first_name | last_name | gender | hire_date  |
+--------+------------+------------+-----------+--------+------------+
|  10001 | 1953-09-02 | Georgi     | Facello   | M      | 1986-06-26 |
+--------+------------+------------+-----------+--------+------------+
1 row in set (0.00 sec)

--- ②レコードを更新後 → 変化なし

mysql> select * from employees where emp_no = 10001;
+--------+------------+------------+-----------+--------+------------+
| emp_no | birth_date | first_name | last_name | gender | hire_date  |
+--------+------------+------------+-----------+--------+------------+
|  10001 | 1953-09-02 | Georgi     | Facello   | M      | 1986-06-26 |
+--------+------------+------------+-----------+--------+------------+
1 row in set (0.00 sec)

--- ③トランザクションA終了後 → **更新後のレコードが読み込まれた**

mysql> select * from employees where emp_no = 10001;
+--------+------------+------------+-----------+--------+------------+
| emp_no | birth_date | first_name | last_name | gender | hire_date  |
+--------+------------+------------+-----------+--------+------------+
|  10001 | 1953-09-02 | Georgi     | Facello   | F      | 1986-06-26 |
+--------+------------+------------+-----------+--------+------------+
1 row in set (0.00 sec)

mysql> rollback;
Query OK, 0 rows affected (0.00 sec)

mysql> select * from employees where emp_no = 10001;
+--------+------------+------------+-----------+--------+------------+
| emp_no | birth_date | first_name | last_name | gender | hire_date  |
+--------+------------+------------+-----------+--------+------------+
|  10001 | 1953-09-02 | Georgi     | Facello   | F      | 1986-06-26 |
+--------+------------+------------+-----------+--------+------------+
1 row in set (0.00 sec)
```

### 3 (Phantom Read)

ISOLATION LEVEL は READ-COMMITTEDのまま

- トランザクションAで部門の追加を行い
- トランザクションBで部門の総数を数える

トランザクションA

```sh
mysql> start transaction; --- ①トランザクション開始
Query OK, 0 rows affected (0.00 sec)

mysql> insert into departments (dept_no, dept_name) values ('d010', 'Cheering');
Query OK, 1 row affected (0.00 sec) --- ②行の追加

mysql> select * from departments;
+---------+--------------------+
| dept_no | dept_name          |
+---------+--------------------+
| d001    | Marketing          |
| d002    | Finance            |
| d003    | Human Resources    |
| d004    | Production         |
| d005    | Development        |
| d006    | Quality Management |
| d007    | Sales              |
| d008    | Research           |
| d009    | Customer Service   |
| d010    | Cheering           |
+---------+--------------------+
10 rows in set (0.00 sec)

mysql> commit; --- ③トランザクション終了
Query OK, 0 rows affected (0.00 sec)
```

トランザクションB

```sh
mysql> start transaction;
Query OK, 0 rows affected (0.00 sec)

--- ①トランザクション開始後 → 変化なし

mysql> select count(dept_no) from departments;
+----------------+
| count(dept_no) |
+----------------+
|              9 |
+----------------+
1 row in set (0.00 sec)

--- ②行の追加後 → 変化なし

mysql> select count(dept_no) from departments;
+----------------+
| count(dept_no) |
+----------------+
|              9 |
+----------------+
1 row in set (0.00 sec)

--- ③トランザクションA終了後 → Aで追加した行が読み込まれた

mysql> select count(dept_no) from departments;
+----------------+
| count(dept_no) |
+----------------+
|             10 |
+----------------+
1 row in set (0.00 sec)

mysql> rollback;
Query OK, 0 rows affected (0.00 sec)

mysql> select count(dept_no) from departments;
+----------------+
| count(dept_no) |
+----------------+
|             10 |
+----------------+
1 row in set (0.00 sec)
```

## 3 (クイズ)

### 1

JavaScriptでデッドロックのような現象は発生するでしょうか？

<details><summary>回答例</summary>

発生する。Web Lock APIを使うパターンと、Promiseを使うパターンを見つけました。

- [JavaScriptでデッドロックを作ってみた - Qiita](https://qiita.com/uhyo/items/13e9bfdd34bb3db449d0)
- [非同期メソッドチェインさせる作りにしたいとき](http://var.blog.jp/archives/76845120.html)

</details>

### 2

共有ロック・占有ロックの違いを説明してください

<details><summary>回答例</summary>

- 共有ロック
  - 他のトランザクションのWRITEをロックし、READは許可するようなロック
  - 自分がデータの更新を行わず、読み取りだけ行うような場合に有効
- 占有ロック
  - 他のトランザクションのREAD/WRITEどちらもロックする
  - 自分がデータの更新を行う場合に有効

参考: [データベースの「ロック」という概念は2種類ある - Qiita](https://qiita.com/daiching/items/835fa37de22b397eece0)

</details>

### 3

departmentsテーブルに対して操作をする以下のようなトランザクションA,Bがあります。トランザクションAは `for update` を使用してロックを取得します。トランザクションAがまだコミットされていない状況でトランザクションBを実行すると、どうなりますか？

トランザクションA: 名前が`Cheering` の部門を更新するためにロックを取得する (未コミット) 。

```sh
mysql> select * from departments where dept_name = 'Cheering';
+---------+-----------+
| dept_no | dept_name |
+---------+-----------+
| d010    | Cheering  |
+---------+-----------+
1 row in set (0.00 sec)

mysql> select * from departments where dept_name = 'Cheering' for update;
+---------+-----------+
| dept_no | dept_name |
+---------+-----------+
| d010    | Cheering  |
+---------+-----------+
1 row in set (0.00 sec)
```

トランザクションB: 新たな部門を追加する。

```sh
mysql> start transaction;
Query OK, 0 rows affected (0.00 sec)

mysql> insert into departments values ('d011', 'Bird Watching');
```

<details><summary>回答例</summary>

トランザクションAがコミットされるまで、部門の追加処理が行われない。

`for update` は、一意に定まらない検索を行う場合、テーブルロックを取得する。そのため、トランザクションBはロックが開放されるまで行の追加処理を行うことができなかった。

```sh
mysql> insert into departments values ('d011', 'Bird Watching');
Query OK, 1 row affected (23.19 sec) ← 待ち時間
```

プライマリキーを指定して `select for update` を行う場合、行ロックのみを取得するため、トランザクションBはロックの開放を待たずに行の追加処理を行うことができる。

`トランザクションA`

```sh
mysql> select * from departments where dept_no = 'd010' for update;
+---------+-----------+
| dept_no | dept_name |
+---------+-----------+
| d010    | Cheering  |
+---------+-----------+
1 row in set (0.00 sec)
```

`トランザクションB`

```sh
mysql> insert into departments values ('d012', 'Fishing');
Query OK, 1 row affected (0.00 sec) ← 待ち時間が発生していない
```

参考: [MySQLの行ロックのふしぎ挙動で夜も安心して眠れない | 三鷹台でひきこもるプログラマの日記](http://mitakadai.me/archives/163)

</details>
