# スロークエリを理解する

## 課題1

### 調査

参考

- [MySQL :: MySQL 8.0 Reference Manual :: 5.4.5 The Slow Query Log](https://dev.mysql.com/doc/refman/8.0/en/slow-query-log.html)
- [日々の覚書: MySQLのスローログ関連のパラメーターが評価される順番](https://yoku0825.blogspot.com/2015/02/mysql.html)

(mysqlでの) スロークエリとは以下のすべての条件を満たすクエリのこと

- `long_query_time` 以上の実行時間 または `log_queries_not_using_indexes` に当てはまる
- かつ `min_examined_row_limit` 以上の行を見ている

以下の変数で設定を変更できる

- slow_query_log: 有効無効を設定する
- long_query_time: 最小0, デフォルト10 (秒)
- min_examined_row_limit: 行数, 最小0, デフォルト0
- slow_query_log_file でログファイル名を指定可能
- log_slow_admin_statements: 管理ステートメントを集計対象に含めるかどうか
- log_queries_not_using_indexes: フルスキャンを行うようなクエリをスロークエリとして集計するかどうか

### 1

`slow_query_log` 変数に `ON` を設定することで、スロークエリログを有効化した。

```sh
mysql> set global slow_query_log = ON;
Query OK, 0 rows affected (0.01 sec)

mysql> show variables like 'slow%';
+---------------------+--------------------------------------+
| Variable_name       | Value                                |
+---------------------+--------------------------------------+
| slow_launch_time    | 2                                    |
| slow_query_log      | ON                                   |
| slow_query_log_file | /var/lib/mysql/e0de365a29e6-slow.log |
+---------------------+--------------------------------------+
3 rows in set (0.00 sec)
```

### 2

`long_query_time` に `0.1` を指定することで、実行に0.1秒以上かかったクエリをスロークエリログに記録するように設定。

[Mysql slow queryの設定と解析方法 - 主夫ときどきプログラマ](https://masayuki14.hatenablog.com/entry/20120704/1341360260) に書いてあるように、 `long_query_time` の値が変わっていないように見えたが再度ログインすることで変更が確認できた。

> long_query_time の値が変更されていない場合がありますが、その時は一度コンソールを閉じ
> 最ログインすると変更されていることが確認できます。

```sh
mysql> set global long_query_time = 0.1;
Query OK, 0 rows affected (0.00 sec)

// 再起動

mysql> show variables like 'long_query%';
+-----------------+----------+
| Variable_name   | Value    |
+-----------------+----------+
| long_query_time | 0.100000 |
+-----------------+----------+
1 row in set (0.00 sec)
```

### 3

実行時間が0.1秒より短いのクエリを3つ実行

#### 1

実行時間: 約0.07秒 → 記録されない

```sh
mysql> select birth_date, count(*) from employees group by birth_date;
+------------+----------+
| birth_date | count(*) |
+------------+----------+
| 1952-02-01 |        6 |
| 1952-02-02 |       70 |
...
| 1965-01-31 |       64 |
| 1965-02-01 |       49 |
+------------+----------+
4750 rows in set (0.07 sec)
```

#### 2

実行時間: 約0.07秒 → 記録されない

```sh
mysql> select * from employees where first_name = last_name;
+--------+------------+-------------+-------------+--------+------------+
| emp_no | birth_date | first_name  | last_name   | gender | hire_date  |
+--------+------------+-------------+-------------+--------+------------+
|  27859 | 1959-09-09 | Ashish      | Ashish      | F      | 1993-04-25 |
|  64984 | 1965-01-06 | Eldridge    | Eldridge    | F      | 1986-06-24 |
|  79275 | 1952-04-25 | Perry       | Perry       | F      | 1993-04-21 |
| 438867 | 1963-09-13 | Mandell     | Mandell     | F      | 1987-07-29 |
| 455063 | 1964-03-27 | Ravishankar | Ravishankar | M      | 1986-11-04 |
| 498407 | 1964-07-01 | Christ      | Christ      | F      | 1991-10-08 |
+--------+------------+-------------+-------------+--------+------------+
6 rows in set (0.07 sec)
```

#### 3

実行時間: 約0.09秒 → 記録されない

```sh
mysql> select * from employees where hire_date between date('1996-01-01') and date('1996-12-31');
+--------+------------+----------------+------------------+--------+------------+
| emp_no | birth_date | first_name     | last_name        | gender | hire_date  |
+--------+------------+----------------+------------------+--------+------------+
|  10093 | 1964-06-11 | Sailaja        | Desikan          | M      | 1996-11-05 |
|  10120 | 1960-03-26 | Armond         | Fairtlough       | F      | 1996-07-06 |
|  10183 | 1954-10-17 | Mechthild      | Bonifati         | M      | 1996-08-11 |
|  10230 | 1955-09-11 | Clyde          | Vernadat         | M      | 1996-06-16 |
...
| 499929 | 1959-11-03 | Phillip        | Schnabel         | M      | 1996-05-12 |
| 499967 | 1954-04-21 | Bangqing       | Bodoff           | M      | 1996-08-15 |
| 499977 | 1956-06-05 | Martial        | Weisert          | F      | 1996-09-17 |
+--------+------------+----------------+------------------+--------+------------+
9574 rows in set (0.09 sec)
```

### 4

実行時間が0.1秒以上のクエリを3つ実行 -> 記録される

#### 1

実行時間: 約0.19秒

```sh
mysql> select * from employees where hire_date = date('1980-06-09');
Empty set (0.19 sec)
```

→ ログに記録された

```text
Time                 Id Command    Argument
# Time: 2021-04-06T08:07:32.260660Z
# User@Host: root[root] @  [172.17.0.1]  Id:     4
# Query_time: 0.182143  Lock_time: 0.000073 Rows_sent: 0  Rows_examined: 300024
use employees;
SET timestamp=1617696452;
select * from employees where hire_date = date('1980-06-09');
```

#### 2

実行時間: 約0.66秒

```sh
select * from employees;
...
| 499998 | 1956-09-05 | Patricia       | Breugel          | M      | 1993-10-13 |
| 499999 | 1958-05-01 | Sachin         | Tsukuda          | M      | 1997-11-30 |
+--------+------------+----------------+------------------+--------+------------+
300024 rows in set (0.66 sec)
```

→ ログに記録された

```text
Time                 Id Command    Argument
# Time: 2021-04-07T12:52:52.594311Z
# User@Host: root[root] @  [172.17.0.1]  Id:     5
# Query_time: 0.661766  Lock_time: 0.000075 Rows_sent: 300024  Rows_examined: 300024
use employees;
SET timestamp=1617799972;
select * from employees;
```

#### 3

実行時間: 約0.16秒

```sh
mysql> select hire_date, count(*) from employees group by hire_date;
+------------+----------+
| hire_date  | count(*) |
+------------+----------+
| 1985-01-01 |        9 |
| 1985-01-14 |        1 |
| 1985-02-01 |       15 |
| 1985-02-02 |      110 |
| 1985-02-03 |      107 |
...
| 2000-01-23 |        1 |
| 2000-01-28 |        1 |
+------------+----------+
5434 rows in set (0.16 sec)
```

→ ログに記録された

```text
# Time: 2021-04-07T13:00:52.613199Z
# User@Host: root[root] @  [172.17.0.1]  Id:     5
# Query_time: 0.154779  Lock_time: 0.000069 Rows_sent: 5434  Rows_examined: 310892
SET timestamp=1617800452;
select hire_date, count(*) from employees group by hire_date;
```

## 課題2

`mysqldumpslow` コマンドを使う

オプション一覧 ([MySQL :: MySQL 8.0 Reference Manual :: 4.6.9 mysqldumpslow — Summarize Slow Query Log Files](https://dev.mysql.com/doc/refman/8.0/en/mysqldumpslow.html))

| オプション名 | 説明 |
| --- | --- |
| `-a` | 数値をN、文字列をSに省略せず出力する |
| `-n N` | 少なくとも N 桁の数字を名前に抽象化します (?) |
| `-g pattern` | `pattern` に一致するクエリのみを抽出 |
| `-l` | total_time から lock_time を差し引かない |
| `-r` | 並び替え順序を逆にする |
| `-s t (at)` | query_timeで並び替え (aをつけると平均) |
| `-s l (al)` | lock_timeで並び替え |
| `-s r (ar)` | rowsで並び替え |
| `-s c` | countで並び替え |
| `-t N` | 最初のN個のクエリを表示する |

### 1

`-s c` オプションを用いて最も頻度が高くスロークエリに現れるクエリを特定

6回実行された: `select * from employees where left(first_name, N) = left(last_name, N)`

```sh
❯ mysqldumpslow slow-query.log -s c

Reading mysql slow query log from slow-query.log
Count: 6  Time=0.11s (0s)  Lock=0.00s (0s)  Rows=16121.0 (96726), root[root]@[172.17.0.1]
  select * from employees where left(first_name, N) = left(last_name, N)

Count: 3  Time=0.10s (0s)  Lock=0.00s (0s)  Rows=0.0 (0), root[root]@[172.17.0.1]
  select * from employees where hire_date = date('S') and birth_date = date('S')

Count: 1  Time=0.00s (0s)  Lock=0.00s (0s)  Rows=0.0 (0), 0users@0hosts
  mysqld, Version: N.N.N (MySQL Community Server (GPL)). started with:
  # Time: N-N-06T08:N:N.260660Z
  # User@Host: root[root] @  [N.N.N.N]  Id:     N
  # Query_time: N.N  Lock_time: N.N Rows_sent: N  Rows_examined: N
  use employees;
  SET timestamp=N;
  select * from employees where hire_date = date('S');
  ...
```

### 2

`-s t` オプションを用いて実行時間が最も長いクエリを特定

27秒かかった: ` select * from employees join salaries on (employees.emp_no = salaries.emp_no) where salaries.salary > N`

```sh
❯ mysqldumpslow slow-query.log -s t

Reading mysql slow query log from slow-query.log
Count: 1  Time=27.68s (27s)  Lock=0.00s (0s)  Rows=1495933.0 (1495933), root[root]@[172.17.0.1]
  select * from employees join salaries on (employees.emp_no = salaries.emp_no) where salaries.salary > N

Count: 6  Time=0.11s (0s)  Lock=0.00s (0s)  Rows=16121.0 (96726), root[root]@[172.17.0.1]
  select * from employees where left(first_name, N) = left(last_name, N)
...
```

### 3

`-s l` オプションを用いてロック時間が最も長いクエリを特定

最長で0.000183秒かかった: `select * from employees where left(first_name, N) = left(last_name, N)`

```sh
❯ mysqldumpslow slow-query.log -s l

Reading mysql slow query log from slow-query.log
Count: 6  Time=0.11s (0s)  Lock=0.00s (0s)  Rows=16121.0 (96726), root[root]@[172.17.0.1]
  select * from employees where left(first_name, N) = left(last_name, N)

Count: 3  Time=0.10s (0s)  Lock=0.00s (0s)  Rows=0.0 (0), root[root]@[172.17.0.1]
  select * from employees where hire_date = date('S') and birth_date = date('S')
...
```

## 課題3

### 1

頻度が最も高いスロークエリにインデックスを作成

```sql
select * from employees where left(first_name, 1) = left(last_name, 1)
```

last_name, first_name の複合インデックスを作成したが、`left()` 関数を使用しているため、インデックスは使用されなかった。

### 2

実行時間が最も長いスロークエリにインデックスを作成

`select * from employees join salaries on (employees.emp_no = salaries.emp_no) where salaries.salary > N`

元のクエリが適当すぎたためクエリを修正

```sql
select * from employees
join (
  select salaries.emp_no, salary
  from salaries
  join (
    select emp_no, max(from_date) as max_from_date
    from salaries
    group by emp_no
  ) as s
  on (
    salaries.emp_no = s.emp_no
    and salaries.from_date = s.max_from_date
  )
) as last_salaries
on (employees.emp_no = last_salaries.emp_no)
where last_salaries.salary > 150000;
```

結果 (27s -> 1.57s)

```text
+--------+------------+------------+-----------+--------+------------+--------+--------+
| emp_no | birth_date | first_name | last_name | gender | hire_date  | emp_no | salary |
+--------+------------+------------+-----------+--------+------------+--------+--------+
|  66793 | 1964-05-15 | Lansing    | Kambil    | M      | 1985-06-20 |  66793 | 150052 |
|  46439 | 1953-01-31 | Ibibia     | Junet     | M      | 1985-05-20 |  46439 | 150345 |
| 279776 | 1955-05-06 | Mohammed   | Moehrke   | M      | 1986-06-10 | 279776 | 150740 |
| 238117 | 1959-06-21 | Mitsuyuki  | Stanfel   | M      | 1988-01-03 | 238117 | 152220 |
| 276633 | 1954-01-27 | Shin       | Birdsall  | M      | 1987-10-08 | 276633 | 152412 |
| 237542 | 1954-10-05 | Weicheng   | Hatcliff  | F      | 1985-04-12 | 237542 | 152687 |
| 266526 | 1957-02-14 | Weijing    | Chenoweth | F      | 1986-10-08 | 266526 | 152710 |
| 205000 | 1956-01-14 | Charmane   | Griswold  | M      | 1990-06-23 | 205000 | 153715 |
| 493158 | 1961-05-20 | Lidong     | Meriste   | M      | 1987-05-09 | 493158 | 154376 |
|  80823 | 1963-01-21 | Willard    | Baca      | M      | 1985-02-26 |  80823 | 154459 |
| 109334 | 1955-08-02 | Tsutomu    | Alameldin | M      | 1985-02-15 | 109334 | 155190 |
| 253939 | 1957-12-03 | Sanjai     | Luders    | M      | 1987-04-15 | 253939 | 155513 |
|  47978 | 1956-03-24 | Xiahua     | Whitcomb  | M      | 1985-07-18 |  47978 | 155709 |
| 254466 | 1963-05-27 | Honesty    | Mukaidono | M      | 1986-08-08 | 254466 | 156286 |
|  43624 | 1953-11-14 | Tokuyasu   | Pesch     | M      | 1985-03-26 |  43624 | 158220 |
+--------+------------+------------+-----------+--------+------------+--------+--------+
15 rows in set (1.57 sec)
```

## 課題4

### 1

`LIMIT 1` なのにクエリが遅いのはなぜか

`LIMIT` の評価順序は最も後のため。

### 2

where で絞るのと on の違い

whereの場合 onで絞る -> where で絞るの2回検索が入るのに対して、onの場合は一回のループで絞り込みが完了するため？

## 課題5 (クイズ)

### クイズ1

long_query_timeのデフォルト値は何秒ですか？

<details><summary>回答例</summary>

10秒
</details>

### クイズ2

mysqldumpslowの文字や数値は抽象化され、似たクエリは同じものとしてカウントされますが、数値を抽象化しない結果を表示するにはどうすればよいでしょうか？

<details><summary>回答例</summary>

`-a` オプションを使用する。


これが、

```text
Count: 1  Time=0.14s (0s)  Lock=0.00s (0s)  Rows=80.0 (80), root[root]@[172.17.0.1]
  select * from employees where hire_date = date('S')
```

こうなる。

```text
Count: 1  Time=0.14s (0s)  Lock=0.00s (0s)  Rows=80.0 (80), root[root]@[172.17.0.1]
  select * from employees where hire_date = date('1990-03-06')
```
</details>

### クイズ3

long_query_time = 0, min_examined_row_limit を 1000 に設定して、以下のような実行計画を持つクエリを実行します。このクエリはスロークエリログに記録されるでしょうか？

```sh
mysql> explain select * from departments;
+----+-------------+-------------+------------+------+---------------+------+---------+------+------+----------+-------+
| id | select_type | table       | partitions | type | possible_keys | key  | key_len | ref  | rows | filtered | Extra |
+----+-------------+-------------+------------+------+---------------+------+---------+------+------+----------+-------+
|  1 | SIMPLE      | departments | NULL       | ALL  | NULL          | NULL | NULL    | NULL |    9 |   100.00 | NULL  |
+----+-------------+-------------+------------+------+---------------+------+---------+------+------+----------+-------+
1 row in set, 1 warning (0.00 sec)
```

<details><summary>回答例</summary>

記録されない。スロークエリには `long_query_time`, `min_examined_row_limit` の両方の条件に当てはまったクエリが記録されるため。

time=0, row=0のとき、記録されている。

```text
# Time: 2021-04-08T03:54:22.948786Z
# User@Host: root[root] @  [172.17.0.1]  Id:     3
# Query_time: 0.004484  Lock_time: 0.000063 Rows_sent: 9  Rows_examined: 9
SET timestamp=1617854062;
select * from departments;
```

time=0, row=1000のとき
記録されなかった (直前に実行した marioのクエリは記録されている)

```text
...
# Time: 2021-04-08T03:57:28.075551Z
# User@Host: root[root] @  [172.17.0.1]  Id:     5
# Query_time: 0.070709  Lock_time: 0.000154 Rows_sent: 254  Rows_examined: 300024
SET timestamp=1617854248;
select * from employees where first_name = 'Mario';
```

</details>
