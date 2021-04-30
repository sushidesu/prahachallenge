# インデックスを理解する

## 質問

### 1

検索用に最適化された(B-Tree)のデータを作り、データの検索を高速化する仕組み。

B-Treeはルート、ブランチ、リーフの階層構造になっており、リーフノードには実データとテーブルの行へのポインタが保存されている。頭から順にデータを探していくのに比べて、データを半分に分けて徐々に範囲を狭めながら探していくため、より高速に検索が可能。

[B-treeインデックス入門 - Qiita](https://qiita.com/kiyodori/items/f66a545a47dc59dd8839)

### 2

> とりあえず全部インデックス
> slow query log

- indexにはデメリットがある (updateやinsertが遅くなる)
- クエリによってはindexが使われない
- slow query log は 遅いクエリを見つけるためのログ
- クエリ自体の見直しで改善する場合もあるため、不要なインデックスを避けるためにもログ・実行計画を確認する

### 3

カーディナリとは、カラムに格納されているデータの種類の多さを現す指標のこと。一般に、カーディナリが高いほどインデックスを貼ったとき効果がある。

[カーディナリティについてまとめてみた - Qiita](https://qiita.com/soyanchu/items/034be19a2e3cb87b2efb)

### 4

カバリングインデックスとは、実テーブルにアクセスすることなくインデックスのリーフだけでデータが取得できるように作成されたインデックスのこと。

[MySQLでインデックスを使って高速化するならCovering Indexが使えそう - (ﾟ∀ﾟ)o彡 sasata299's blog](http://blog.livedoor.jp/sasata299/archives/51336006.html)

## 実装

### 1

<details><summary>調べたこと</summary>

#### 実行時間の測定方法

`events_statements_history_long` は Empty だったので `events_statements_history` から実行時間を取得。

```sql
SELECT sql_text, TRUNCATE(timer_wait/1000000000000, 6) as Duration FROM performance_schema.events_statements_history;
```

```sql
-- 最新10件を取得
SELECT event_id, sql_text, TRUNCATE(timer_wait/1000000000000, 6) as Duration FROM performance_schema.events_statements_history order by event_id DESC limit 10;
```

- 参考
  - [第130回　クエリをプロファイリングしてみる：MySQL道普請便り｜gihyo.jp … 技術評論社](https://gihyo.jp/dev/serial/01/mysql-road-construction-news/0130)
  - [MySQL :: MySQL 8.0 Reference Manual :: 27.19.1 Query Profiling Using Performance Schema](https://dev.mysql.com/doc/refman/8.0/en/performance-schema-query-profiling.html)
  - [MySQL :: MySQL 8.0 Reference Manual :: 27.9 Performance Schema Tables for Current and Historical Events](https://dev.mysql.com/doc/refman/8.0/en/performance-schema-event-tables.html)

#### インデックスが使われない条件

> - 中間一致・後方一致のLIKE文
> - インデックス列で演算をやっている
> - IS NULLを使っている
> - インデックス列に対して関数を使っている
> - インデックス列に否定形を使っている

[インデックスが使えない検索条件 - Qiita](https://qiita.com/NagaokaKenichi/items/44cabcafa3d02d9cd896)

<details>
はじめに調べておくべきだった、、、
</details>

#### インデックス一覧

```sql
select table_name, index_name from information_schema.statistics where table_name = 'employees';

select table_name, index_name from information_schema.statistics where table_name in ('titles', 'employees', 'salaries');
```

</details>

#### クエリその1

誕生日が 4/8 (年は不問) の従業員を取得

```sql
SELECT * FROM employees WHERE DATE_FORMAT(birth_date, '%m%d') = '0408';
```

<details><summary>結果 (インデックスが使用されなかったため隠しています)</summary>

結果

```text
+--------+------------+----------------+-----------------+--------+------------+
| emp_no | birth_date | first_name     | last_name       | gender | hire_date  |
+--------+------------+----------------+-----------------+--------+------------+
|  10191 | 1959-04-08 | Zdislav        | Nastansky       | M      | 1986-04-10 |
|  10284 | 1954-04-08 | Masali         | Murrill         | F      | 1997-07-02 |
|  10358 | 1953-04-08 | Qunsheng       | Tagansky        | M      | 1991-02-19 |
|  10372 | 1952-04-08 | Anneli         | Frijda          | F      | 1985-07-30 |
|  10462 | 1956-04-08 | Sumali         | Schlenzig       | M      | 1996-03-25 |
|  10704 | 1960-04-08 | Yolla          | Kropatsch       | M      | 1988-07-08 |
|  10920 | 1955-04-08 | Ronghao        | Narahara        | M      | 1991-07-09 |
|  10936 | 1953-04-08 | Mountaz        | Schicker        | F      | 1987-10-27 |
  ~~~
+--------+------------+----------------+-----------------+--------+------------+
833 rows in set (0.11 sec)
```

インデックスなしの実行時間

```text
+------------------------------------------------------------------------+----------+
| sql_text                                                               | Duration |
+------------------------------------------------------------------------+----------+
| SELECT * FROM employees WHERE DATE_FORMAT(birth_date, '%M%D') = '0408' | 0.117479 |
+------------------------------------------------------------------------+----------+
```

インデックスありの実行時間

```text
+------------------------------------------------------------------------+----------+
| sql_text                                                               | Duration |
+------------------------------------------------------------------------+----------+
| SELECT * FROM employees WHERE DATE_FORMAT(birth_date, '%m%d') = '0408' | 0.108250 |
| SELECT * FROM employees WHERE DATE_FORMAT(birth_date, '%m%d') = '0408' | 0.108050 |
| SELECT * FROM employees WHERE DATE_FORMAT(birth_date, '%m%d') = '0408' | 0.108612 |
| SELECT * FROM employees WHERE DATE_FORMAT(birth_date, '%m%d') = '0408' | 0.108168 |
+------------------------------------------------------------------------+----------+
```

インデックスが使われていることの証明 -> **使われていない** (検索に関数を使用しているため)

```sh
mysql> EXPLAIN SELECT * FROM employees WHERE DATE_FORMAT(birth_date, '%m%d') = '0408';
+----+-------------+-----------+------------+------+---------------+------+---------+------+--------+----------+-------------+
| id | select_type | table     | partitions | type | possible_keys | key  | key_len | ref  | rows   | filtered | Extra       |
+----+-------------+-----------+------------+------+---------------+------+---------+------+--------+----------+-------------+
|  1 | SIMPLE      | employees | NULL       | ALL  | NULL          | NULL | NULL    | NULL | 299468 |   100.00 | Using where |
+----+-------------+-----------+------------+------+---------------+------+---------+------+--------+----------+-------------+
1 row in set, 1 warning (0.00 sec)
```
</details>

#### クエリその2

誕生日と入社日が同じ

```sql
SELECT * FROM employees WHERE DATE_FORMAT(birth_date, '%m%d') = DATE_FORMAT(hire_date, '%m%d');
```

<details><summary>結果 (インデックスが使用されなかったため隠しています)</summary>

結果

```text
+--------+------------+----------------+-----------------+--------+------------+
| emp_no | birth_date | first_name     | last_name       | gender | hire_date  |
+--------+------------+----------------+-----------------+--------+------------+
|  10175 | 1960-01-11 | Aleksandar     | Ananiadou       | F      | 1988-01-11 |
|  10637 | 1954-07-11 | Heejo          | Frolund         | M      | 1993-07-11 |
|  10645 | 1957-03-01 | Fumiyo         | Esposito        | M      | 1988-03-01 |
|  12330 | 1961-04-26 | Oguz           | Eugenio         | F      | 1988-04-26 |
|  12400 | 1958-02-25 | Genki          | Winter          | M      | 1995-02-25 |
  ~~~
+--------+------------+----------------+-----------------+--------+------------+
819 rows in set (0.15 sec)
```

インデックスなしの実行時間

```text
+------------------------------------------------------------------------------------------------+----------+
| sql_text                                                                                       | Duration |
+------------------------------------------------------------------------------------------------+----------+
| SELECT * FROM employees WHERE DATE_FORMAT(birth_date, '%m%d') = DATE_FORMAT(hire_date, '%m%d') | 0.144788 |
+------------------------------------------------------------------------------------------------+----------+
```

インデックスありの実行時間

```text
+----------+------------------------------------------------------------------------------------------------+----------+
| event_id | sql_text                                                                                       | Duration |
+----------+------------------------------------------------------------------------------------------------+----------+
|      136 | SELECT * FROM employees WHERE DATE_FORMAT(birth_date, '%m%d') = DATE_FORMAT(hire_date, '%m%d') | 0.142766 |
|      135 | SELECT * FROM employees WHERE DATE_FORMAT(birth_date, '%m%d') = DATE_FORMAT(hire_date, '%m%d') | 0.145017 |
|      134 | SELECT * FROM employees WHERE DATE_FORMAT(birth_date, '%m%d') = DATE_FORMAT(hire_date, '%m%d') | 0.145064 |
+----------+------------------------------------------------------------------------------------------------+----------+
```

インデックスが使われていることの証明 -> **使われていない** (検索に関数を使用しているため)

```sh
mysql> EXPLAIN SELECT * FROM employees WHERE DATE_FORMAT(birth_date, '%m%d') = DATE_FORMAT(hire_date, '%m%d');
+----+-------------+-----------+------------+------+---------------+------+---------+------+--------+----------+-------------+
| id | select_type | table     | partitions | type | possible_keys | key  | key_len | ref  | rows   | filtered | Extra       |
+----+-------------+-----------+------------+------+---------------+------+---------+------+--------+----------+-------------+
|  1 | SIMPLE      | employees | NULL       | ALL  | NULL          | NULL | NULL    | NULL | 299468 |   100.00 | Using where |
+----+-------------+-----------+------------+------+---------------+------+---------+------+--------+----------+-------------+
1 row in set, 1 warning (0.01 sec)
```
</details>

#### クエリその3 (課題中の例題より)

従業員の男女比

```sql
select gender, count(*) from employees group by gender;
```

結果

```text
+--------+----------+
| gender | count(*) |
+--------+----------+
| M      |   179973 |
| F      |   120051 |
+--------+----------+
2 rows in set (0.10 sec)
```

インデックスなしの実行時間

```text
+------------------------------------------------------------------------------+----------+
| sql_text                                                                     | Duration |
+------------------------------------------------------------------------------+----------+
| select gender, count(*) from employees group by gender                       | 0.106303 |
+------------------------------------------------------------------------------+----------+
```

インデックスありの実行時間

```text
+----------+-------------------------------------------------------------------+----------+
| event_id | sql_text                                                          | Duration |
+----------+-------------------------------------------------------------------+----------+
|      149 | select gender, count(*) from employees group by gender            | 0.106855 |
|      148 | select gender, count(*) from employees group by gender            | 0.106419 |
|      147 | select gender, count(*) from employees group by gender            | 0.106515 |
+----------+-------------------------------------------------------------------+----------+
```

インデックスが使われていることの証明 -> **使われている** (フルインデックススキャン)

```sh
mysql> EXPLAIN select gender, count(*) from employees group by gender;
+----+-------------+-----------+------------+-------+---------------+--------------+---------+------+--------+----------+-------------+
| id | select_type | table     | partitions | type  | possible_keys | key          | key_len | ref  | rows   | filtered | Extra       |
+----+-------------+-----------+------------+-------+---------------+--------------+---------+------+--------+----------+-------------+
|  1 | SIMPLE      | employees | NULL       | index | gender_index  | gender_index | 1       | NULL | 299468 |   100.00 | Using index |
+----+-------------+-----------+------------+-------+---------------+--------------+---------+------+--------+----------+-------------+
1 row in set, 1 warning (0.00 sec)
```

#### クエリその4 (課題中の例題より)

入社年ごとの従業員数

```sql
select DATE_FORMAT(hire_date, '%Y') as hire_year, count(*)
from employees
group by hire_year;
```

結果

```text
+-----------+----------+
| hire_year | count(*) |
+-----------+----------+
| 1985      |    35316 |
| 1986      |    36150 |
| 1987      |    33501 |
| 1988      |    31436 |
| 1989      |    28394 |
| 1990      |    25610 |
| 1991      |    22568 |
| 1992      |    20402 |
| 1993      |    17772 |
| 1994      |    14835 |
| 1995      |    12115 |
| 1996      |     9574 |
| 1997      |     6669 |
| 1998      |     4155 |
| 1999      |     1514 |
| 2000      |       13 |
+-----------+----------+
16 rows in set (0.20 sec)
```

インデックスなしの実行時間

```text
+-----------------------------------------------------------------------------------------+----------+
| sql_text                                                                                | Duration |
+-----------------------------------------------------------------------------------------+----------+
| select DATE_FORMAT(hire_date, '%Y') as hire_year, count(*)
from employees
group by hire_year                                                                        | 0.197608 |
+-----------------------------------------------------------------------------------------+----------+
```

インデックスありの実行時間

```text
+----------+----------------------------------------------------------------------------------------------+----------+
| event_id | sql_text                                                                                     | Duration |
+----------+----------------------------------------------------------------------------------------------+----------+
|      142 | select DATE_FORMAT(hire_date, '%Y') as hire_year, count(*) from employees group by hire_year | 0.153178 |
|      141 | select DATE_FORMAT(hire_date, '%Y') as hire_year, count(*) from employees group by hire_year | 0.152142 |
|      140 | select DATE_FORMAT(hire_date, '%Y') as hire_year, count(*) from employees group by hire_year | 0.151106 |
+----------+----------------------------------------------------------------------------------------------+----------+
```

インデックスが使われていることの証明 -> **使われている** (フルインデックススキャン)

```sh
mysql> EXPLAIN select DATE_FORMAT(hire_date, '%Y') as hire_year, count(*) from employees group by hire_year;
+----+-------------+-----------+------------+-------+-----------------+-----------------+---------+------+--------+----------+----------------------------------------------+
| id | select_type | table     | partitions | type  | possible_keys   | key             | key_len | ref  | rows   | filtered | Extra                                        |
+----+-------------+-----------+------------+-------+-----------------+-----------------+---------+------+--------+----------+----------------------------------------------+
|  1 | SIMPLE      | employees | NULL       | index | hire_date_index | hire_date_index | 3       | NULL | 299468 |   100.00 | Using index; Using temporary; Using filesort |
+----+-------------+-----------+------------+-------+-----------------+-----------------+---------+------+--------+----------+----------------------------------------------+
1 row in set, 1 warning (0.00 sec)
```

#### クエリその5

first_nameがXから始まる従業員

```sql
select * from employees where first_name like 'X%';
```

結果

```text
+--------+------------+------------+------------------+--------+------------+
| emp_no | birth_date | first_name | last_name        | gender | hire_date  |
+--------+------------+------------+------------------+--------+------------+
|  10087 | 1959-07-23 | Xinglin    | Eugenio          | F      | 1986-09-08 |
|  10104 | 1961-11-19 | Xinyu      | Warwick          | M      | 1987-04-16 |
|  10110 | 1957-03-07 | Xuejia     | Ullian           | F      | 1986-08-22 |
|  10149 | 1953-05-20 | Xiadong    | Perry            | F      | 1986-11-05 |
|  10208 | 1960-01-02 | Xiping     | Klerer           | M      | 1991-12-23 |
|  10215 | 1954-04-02 | Xiaobin    | Duclos           | M      | 1987-10-19 |
|  10226 | 1964-12-28 | Xinglin    | Plessier         | M      | 1989-10-27 |
|  10276 | 1964-07-27 | Xuejun     | Hempstead        | M      | 1985-07-21 |
|  10504 | 1953-04-07 | Xiong      | Varker           | M      | 1988-12-03 |
|  10516 | 1960-02-20 | Xiadong    | Luga             | M      | 1985-10-19 |
|  10576 | 1957-08-23 | Xiaoqiu    | Krychniak        | M      | 1988-05-17 |
|  10664 | 1962-06-02 | Xumin      | Peck             | M      | 1989-12-24 |
|  10688 | 1964-02-28 | Xiaopeng   | Lanphier         | F      | 1985-03-25 |
|  10775 | 1956-03-12 | Xiaoheng   | Sluis            | M      | 1988-12-09 |
|  11094 | 1958-08-28 | Xiaoshan   | Ratnaker         | F      | 1991-08-26 |
 ~~~
+--------+------------+------------+------------------+--------+------------+
4687 rows in set (0.08 sec)
```

インデックスなしの実行時間

```text
+----------+-------------------------------------------------------+----------+
| event_id | sql_text                                              | Duration |
+----------+-------------------------------------------------------+----------+
|      167 | select * from employees where first_name like 'X%'    | 0.076636 |
|      166 | select * from employees where first_name like 'X%'    | 0.079298 |
|      165 | select * from employees where first_name like 'X%'    | 0.076938 |
+----------+-------------------------------------------------------+----------+
```

インデックスありの実行時間

```text
+----------+-------------------------------------------------------+----------+
| event_id | sql_text                                              | Duration |
+----------+-------------------------------------------------------+----------+
|      174 | select * from employees where first_name like 'X%'    | 0.019835 |
|      173 | select * from employees where first_name like 'X%'    | 0.016846 |
|      172 | select * from employees where first_name like 'X%'    | 0.020265 |
+----------+-------------------------------------------------------+----------+
```

インデックスが使われていることの証明 -> **使われている** (indexを用いた範囲検索)

```sh
mysql> EXPLAIN select * from employees where first_name like 'X%';
+----+-------------+-----------+------------+-------+------------------+------------------+---------+------+------+----------+-----------------------+
| id | select_type | table     | partitions | type  | possible_keys    | key              | key_len | ref  | rows | filtered | Extra                 |
+----+-------------+-----------+------------+-------+------------------+------------------+---------+------+------+----------+-----------------------+
|  1 | SIMPLE      | employees | NULL       | range | first_name_index | first_name_index | 16      | NULL | 4687 |   100.00 | Using index condition |
+----+-------------+-----------+------------+-------+------------------+------------------+---------+------+------+----------+-----------------------+
1 row in set, 1 warning (0.00 sec)
```

### 2

INSERT/DELETE/UPDATEするたびにB-Treeを再構築する必要があるため、インデックスがない状態よりも遅くなる。(インデックスが増えるほど、遅くなる)

#### 実際に試す

**たくさんのインデックスがある**

```text
+------------+------------------+
| table_name | index_name       |
+------------+------------------+
| employees  | PRIMARY          |
| employees  | hire_date_index  |
| employees  | birth_date_index |
| employees  | first_name_index |
| employees  | last_name_index  |
+------------+------------------+
5 rows in set (0.01 sec)
```

**インデックスありのINSERT速度**

```text
+----------+-------------------------------------------------------------------------------------------------+----------+
| event_id | sql_text                                                                                        | Duration |
+----------+-------------------------------------------------------------------------------------------------+----------+
|      137 | insert into employees values (888889, '1989-01-01', 'hoge', 'mugi', 'M', '1989-01-01')          | 0.006449 |
|      135 | insert into employees values (888888, '2000-01-01', 'hoge', 'mugi', 'M', '2000-01-01')          | 0.008389 |
+----------+-------------------------------------------------------------------------------------------------+----------+
```

**インデックスなしのINSERT速度**

```text
+----------+-------------------------------------------------------------------------------------------------+----------+
| event_id | sql_text                                                                                        | Duration |
+----------+-------------------------------------------------------------------------------------------------+----------+
|      146 | insert into employees values (888892, '1991-01-01', 'hoge', 'mugi', 'M', '1990-01-01')          | 0.002451 |
|      145 | insert into employees values (888891, '1990-01-01', 'hoge', 'mugi', 'M', '1990-01-01')          | 0.001553 |
+----------+-------------------------------------------------------------------------------------------------+----------+
```

## クイズ

### クイズ1

誕生年 (birth_date の 年のみ) ごとの従業員の人数を取得してください。

<details><summary>想定回答</summary>

```sql
select DATE_FORMAT(birth_date, '%Y') as birth_year, count(*) from employees
group by birth_year;
```

実行結果

```text
+------------+----------+
| birth_year | count(*) |
+------------+----------+
| 1952       |    21209 |
| 1953       |    22857 |
| 1954       |    23228 |
| 1955       |    23104 |
| 1956       |    23051 |
| 1957       |    22850 |
| 1958       |    23276 |
| 1959       |    23311 |
| 1960       |    23126 |
| 1961       |    23065 |
| 1962       |    23014 |
| 1963       |    23080 |
| 1964       |    22913 |
| 1965       |     1940 |
+------------+----------+
14 rows in set (0.19 sec)
```

インデックスなしの実行時間

```text
+-------------------------------------------------------------------------------------------------+----------+
| sql_text                                                                                        | Duration |
+-------------------------------------------------------------------------------------------------+----------+
| select DATE_FORMAT(birth_date, '%Y') as birth_year, count(*) from employees group by birth_year | 0.184223 |
| select DATE_FORMAT(birth_date, '%Y') as birth_year, count(*) from employees group by birth_year | 0.184435 |
| select DATE_FORMAT(birth_date, '%Y') as birth_year, count(*) from employees group by birth_year | 0.184538 |
+-------------------------------------------------------------------------------------------------+----------+
```

インデックスありの実行時間

```text
+----------+--------------------------------------------------------------------------------------------------+----------+
| event_id | sql_text                                                                                         | Duration |
+----------+--------------------------------------------------------------------------------------------------+----------+
|      182 | select DATE_FORMAT(birth_date, '%Y') as birth_year, count(*) from employees group by birth_year  | 0.150969 |
|      181 | select DATE_FORMAT(birth_date, '%Y') as birth_year, count(*) from employees group by birth_year  | 0.152565 |
|      180 | select DATE_FORMAT(birth_date, '%Y') as birth_year, count(*) from employees group by birth_year  | 0.152185 |
+----------+--------------------------------------------------------------------------------------------------+----------+
```

インデックスがつかわれていることの証明

```sh
mysql> EXPLAIN select DATE_FORMAT(birth_date, '%Y') as birth_year, count(*) from employees group by birth_year;
+----+-------------+-----------+------------+-------+------------------+------------------+---------+------+--------+----------+----------------------------------------------+
| id | select_type | table     | partitions | type  | possible_keys    | key              | key_len | ref  | rows   | filtered | Extra                                        |
+----+-------------+-----------+------------+-------+------------------+------------------+---------+------+--------+----------+----------------------------------------------+
|  1 | SIMPLE      | employees | NULL       | index | birth_date_index | birth_date_index | 3       | NULL | 299468 |   100.00 | Using index; Using temporary; Using filesort |
+----+-------------+-----------+------------+-------+------------------+------------------+---------+------+--------+----------+----------------------------------------------+
1 row in set, 1 warning (0.00 sec)
```

</details>

### クイズ2

最も若い従業員のリストを取得してください。 (最も誕生日が新しい社員)

<details><summary>想定回答</summary>

```sql
select * from employees as a
where birth_date = (
  select max(birth_date)
  from employees
);
```

結果

```text
+--------+------------+----------------+-----------------+--------+------------+
| emp_no | birth_date | first_name     | last_name       | gender | hire_date  |
+--------+------------+----------------+-----------------+--------+------------+
|  11157 | 1965-02-01 | Mario          | Cochrane        | M      | 1985-03-30 |
|  33293 | 1965-02-01 | Adamantios     | Vanwelkenhuysen | M      | 1987-12-12 |
|  37592 | 1965-02-01 | Berni          | Stranks         | M      | 1985-11-05 |
|  59869 | 1965-02-01 | Zsolt          | Riefers         | M      | 1987-09-25 |
|  60091 | 1965-02-01 | Surveyors      | Bade            | F      | 1988-05-01 |
|  66702 | 1965-02-01 | Deniz          | Thibadeau       | F      | 1986-03-11 |
|  74344 | 1965-02-01 | Hiroyasu       | Provine         | M      | 1994-11-25 |
  ~~~
+--------+------------+----------------+-----------------+--------+------------+
49 rows in set (0.16 sec)
```

インデックスなしの実行速度

```text
+----------+-----------------------------------------------------------------------------------------------+----------+
| event_id | sql_text                                                                                      | Duration |
+----------+-----------------------------------------------------------------------------------------------+----------+
|       86 | select * from employees as a where birth_date = (   select max(birth_date)   from employees ) | 0.161431 |
|       85 | select * from employees as a where birth_date = (   select max(birth_date)   from employees ) | 0.156976 |
|       84 | select * from employees as a where birth_date = (   select max(birth_date)   from employees ) | 0.157587 |
|       83 | select * from employees as a where birth_date = (   select max(birth_date)   from employees ) | 0.157697 |
|       82 | select * from employees as a where birth_date = (   select max(birth_date)   from employees ) | 0.156541 |
+----------+-----------------------------------------------------------------------------------------------+----------+
```

インデックスありの実行速度 (とても早くなっていてびっくり)

```text
+----------+-----------------------------------------------------------------------------------------------+----------+
| event_id | sql_text                                                                                      | Duration |
+----------+-----------------------------------------------------------------------------------------------+----------+
|       92 | select * from employees as a where birth_date = (   select max(birth_date)   from employees ) | 0.000454 |
|       91 | select * from employees as a where birth_date = (   select max(birth_date)   from employees ) | 0.000471 |
|       90 | select * from employees as a where birth_date = (   select max(birth_date)   from employees ) | 0.000455 |
|       89 | select * from employees as a where birth_date = (   select max(birth_date)   from employees ) | 0.001321 |
+----------+-----------------------------------------------------------------------------------------------+----------+
```

</details>

### クイズ3

イニシャルがX.Xの従業員一覧を取得してください。

<details><summary>想定回答</summary>

```sql
select * from employees
where first_name like 'X%' and last_name like 'X%';
```

```text
+--------+------------+------------+-----------+--------+------------+
| emp_no | birth_date | first_name | last_name | gender | hire_date  |
+--------+------------+------------+-----------+--------+------------+
|  61385 | 1964-06-22 | Xinan      | Xiaoshan  | M      | 1986-02-06 |
|  71038 | 1959-06-01 | Xinyu      | Xiaoshan  | F      | 1990-02-02 |
| 266190 | 1952-04-16 | Xiahua     | Xiaoshan  | M      | 1987-12-19 |
| 266757 | 1964-12-30 | Xiaobin    | Xiaoshan  | F      | 1990-12-09 |
| 490237 | 1960-01-23 | Xudong     | Xiaoshan  | F      | 1991-02-19 |
| 494383 | 1957-03-30 | Xiaoheng   | Xiaoshan  | M      | 1987-03-14 |
+--------+------------+------------+-----------+--------+------------+
6 rows in set (0.07 sec)
```

インデックスなしの実行速度

```text
+----------+------------------------------------------------------------------------------------+----------+
| event_id | sql_text                                                                           | Duration |
+----------+------------------------------------------------------------------------------------+----------+
|      114 | select * from employees where first_name like 'X%' and last_name like 'X%'         | 0.074367 |
|      113 | select * from employees where first_name like 'X%' and last_name like 'X%'         | 0.074267 |
|      112 | select * from employees where first_name like 'X%' and last_name like 'X%'         | 0.073671 |
+----------+------------------------------------------------------------------------------------+----------+
```

first_nameとlast_nameにインデックスを貼ったときの実行速度

```text
+----------+----------------------------------------------------------------------------+----------+
| event_id | sql_text                                                                   | Duration |
+----------+----------------------------------------------------------------------------+----------+
|      127 | select * from employees where first_name like 'X%' and last_name like 'X%' | 0.000622 |
|      126 | select * from employees where first_name like 'X%' and last_name like 'X%' | 0.000610 |
|      125 | select * from employees where first_name like 'X%' and last_name like 'X%' | 0.000625 |
|      124 | select * from employees where first_name like 'X%' and last_name like 'X%' | 0.000621 |
|      123 | select * from employees where first_name like 'X%' and last_name like 'X%' | 0.000648 |
+----------+----------------------------------------------------------------------------+----------+
```

インデックスが使われていることの証明

```sh
mysql> explain select * from employees where first_name like 'X%' and last_name like 'X%';                                           
+----+-------------+-----------+------------+-------+----------------------------------+-----------------+---------+------+------+----------+------------------------------------+
| id | select_type | table     | partitions | type  | possible_keys                    | key             | key_len | ref  | rows | filtered | Extra                              |
+----+-------------+-----------+------------+-------+----------------------------------+-----------------+---------+------+------+----------+------------------------------------+
|  1 | SIMPLE      | employees | NULL       | range | first_name_index,last_name_index | last_name_index | 18      | NULL |  187 |     1.57 | Using index condition; Using where |
+----+-------------+-----------+------------+-------+----------------------------------+-----------------+---------+------+------+----------+------------------------------------+
1 row in set, 1 warning (0.00 sec)
```

</details>

### ボツクイズ (インデックスが使われなかったり、クエリが複雑だったり)

<details><summary>イニシャルが同じアルファベットになる従業員 (例: Moriyoshi Merey -> M.M)</summary>

```sql
select * from employees
where left(first_name, 1) = left(last_name, 1);
```

結果

```text
+--------+----------------+------------------+
| emp_no | first_name     | last_name        |
+--------+----------------+------------------+
|  10056 | Brendon        | Bernini          |
|  10060 | Breannda       | Billingsley      |
|  10098 | Sreekrishna    | Servieres        |
|  10100 | Hironobu       | Haraldson        |
|  10118 | Zhonghui       | Zyda             |
|  10165 | Miyeon         | Macedo           |
|  10166 | Samphel        | Siegrist         |
|  10169 | Sampalli       | Snedden          |
|  10175 | Aleksandar     | Ananiadou        |
|  10179 | Deniz          | Duclos           |
|  10182 | Moriyoshi      | Merey            |
  ~~~
+--------+----------------+------------------+
16121 rows in set (0.08 sec)
```

インデックスなしの実行時間

```text
+-----------------------------------------------------------------------------------------------------+----------+
| sql_text                                                                                            | Duration |
+-----------------------------------------------------------------------------------------------------+----------+
| select emp_no, first_name, last_name from employees
where left(first_name, 1) = left(last_name, 1)                                                        | 0.077762 |
+-----------------------------------------------------------------------------------------------------+----------+
```

インデックスは使われていない

```sh
mysql> EXPLAIN  select * from employees where left(first_name, 1) = left(last_name, 1);
+----+-------------+-----------+------------+------+---------------+------+---------+------+--------+----------+-------------+
| id | select_type | table     | partitions | type | possible_keys | key  | key_len | ref  | rows   | filtered | Extra       |
+----+-------------+-----------+------------+------+---------------+------+---------+------+--------+----------+-------------+
|  1 | SIMPLE      | employees | NULL       | ALL  | NULL          | NULL | NULL    | NULL | 299468 |   100.00 | Using where |
+----+-------------+-----------+------------+------+---------------+------+---------+------+--------+----------+-------------+
1 row in set, 1 warning (0.00 sec)
```

</details>

<details><summary>入社年ごとの平均給与</summary>

```sql
-- パターン1 (過去の給与も含まれてしまう)
select DATE_FORMAT(hire_date, '%Y') as hire_year, AVG(salary) from employees
join salaries on (employees.emp_no = salaries.emp_no)
group by hire_year;
```

```sql
-- パターン2
select DATE_FORMAT(hire_date, '%Y') as hire_year, avg(last_salaries.salary) from employees
join (
  select a.emp_no, a.salary, a.to_date from salaries as a join (
    select emp_no, max(to_date) as max_to_date from salaries group by emp_no
  ) as b
  on a.emp_no = b.emp_no and a.to_date = b.max_to_date
) as last_salaries
on employees.emp_no = last_salaries.emp_no
group by hire_year;
```

```text
+-----------+---------------------------+
| hire_year | avg(last_salaries.salary) |
+-----------+---------------------------+
| 1985      |                76095.2911 |
| 1986      |                74729.4528 |
| 1987      |                73381.9008 |
| 1988      |                71859.4060 |
| 1989      |                70869.0143 |
| 1990      |                69358.1638 |
| 1991      |                68016.5966 |
| 1992      |                66543.0110 |
| 1993      |                65602.9905 |
| 1994      |                63981.0406 |
| 1995      |                62561.9324 |
| 1996      |                61298.2919 |
| 1997      |                59854.7013 |
| 1998      |                58848.6366 |
| 1999      |                57508.7084 |
| 2000      |                55637.3077 |
+-----------+---------------------------+
16 rows in set (3.45 sec)
```

```text
+----------+-------------------------------------------------------------------------------------------------------+----------+
| event_id | sql_text                                                                                              | Duration |
+----------+-------------------------------------------------------------------------------------------------------+----------+
|      105 | select DATE_FORMAT(hire_date, '%Y') as hire_year, avg(last_salaries.salary) from employees join ( ... | 3.444052 |
|      104 | select DATE_FORMAT(hire_date, '%Y') as hire_year, avg(last_salaries.salary) from employees join ( ... | 3.427367 |
|      103 | select DATE_FORMAT(hire_date, '%Y') as hire_year, avg(last_salaries.salary) from employees join ( ... | 3.427084 |
+----------+-------------------------------------------------------------------------------------------------------+----------+
```

</details>

<details><summary>過去一度でも 'Manager' になったことのある職員のリスト</summary>

```sql
select title, first_name, last_name
from employees join titles on (employees.emp_no = titles.emp_no)
group by title, employees.emp_no
having title = 'Manager';
```
実行結果

```text
+---------+-------------+--------------+
| title   | first_name  | last_name    |
+---------+-------------+--------------+
| Manager | Margareta   | Markovitch   |
| Manager | Vishwani    | Minakawa     |
| Manager | Ebru        | Alpin        |
| Manager | Isamu       | Legleitner   |
| Manager | Shirish     | Ossenbruggen |
| Manager | Karsten     | Sigstam      |
| Manager | Krassimir   | Wegerle      |
| Manager | Rosine      | Cools        |
| Manager | Shem        | Kieras       |
| Manager | Oscar       | Ghazalie     |
| Manager | DeForest    | Hagimont     |
| Manager | Leon        | DasSarma     |
| Manager | Peternela   | Onuegbe      |
| Manager | Rutger      | Hofmeyr      |
| Manager | Sanjoy      | Quadeer      |
| Manager | Dung        | Pesch        |
| Manager | Przemyslawa | Kaelbling    |
| Manager | Hauke       | Zhang        |
| Manager | Arie        | Staelin      |
| Manager | Hilary      | Kambil       |
| Manager | Tonny       | Butterworth  |
| Manager | Marjo       | Giarratana   |
| Manager | Xiaobin     | Spinelli     |
| Manager | Yuchang     | Weedman      |
+---------+-------------+--------------+
24 rows in set (1.19 sec)
```

インデックスなしの実行時間

```text
+----------+----------------------------------------------------------------------------------------------------------------------------------------------------------------+----------+
| event_id | sql_text                                                                                                                                                       | Duration |
+----------+----------------------------------------------------------------------------------------------------------------------------------------------------------------+----------+
|       32 | select title, first_name, last_name from employees join titles on (employees.emp_no = titles.emp_no) group by title, employees.emp_no having title = 'Manager' | 1.239358 |
|       31 | select title, first_name, last_name from employees join titles on (employees.emp_no = titles.emp_no) group by title, employees.emp_no having title = 'Manager' | 1.192526 |
|       30 | select title, first_name, last_name from employees join titles on (employees.emp_no = titles.emp_no) group by title, employees.emp_no having title = 'Manager' | 1.173564 |
+----------+----------------------------------------------------------------------------------------------------------------------------------------------------------------+----------+

+----------+------------------------------------------------------------------------------------------------------------------------------------------------------------------------+----------+
| event_id | sql_text                                                                                                                                                               | Duration |
+----------+------------------------------------------------------------------------------------------------------------------------------------------------------------------------+----------+
|       23 | select title, first_name, last_name from employees join titles on (employees.emp_no = titles.emp_no) group by title, employees.emp_no having title = 'Manager'         | 1.180582 |
|       22 | select title, first_name, last_name from employees join titles on (employees.emp_no = titles.emp_no) group by title, employees.emp_no having title = 'Manager'         | 1.189388 |
|       21 | select title, first_name, last_name from employees join titles on (employees.emp_no = titles.emp_no) group by title, employees.emp_no having title = 'Manager'         | 1.187800 |
+----------+------------------------------------------------------------------------------------------------------------------------------------------------------------------------+----------+
```

インデックスありの実行時間 (むしろ遅くなっている?)

```text
+----------+----------------------------------------------------------------------------------------------------------------------------------------------------------------+----------+
| event_id | sql_text                                                                                                                                                       | Duration |
+----------+----------------------------------------------------------------------------------------------------------------------------------------------------------------+----------+
|       42 | select title, first_name, last_name from employees join titles on (employees.emp_no = titles.emp_no) group by title, employees.emp_no having title = 'Manager' | 1.280496 |
|       41 | select title, first_name, last_name from employees join titles on (employees.emp_no = titles.emp_no) group by title, employees.emp_no having title = 'Manager' | 1.321866 |
+----------+----------------------------------------------------------------------------------------------------------------------------------------------------------------+----------+
```

インデックスが使われていることの証明

```sh
mysql> EXPLAIN select title, first_name, last_name from employees join titles on (employees.emp_no = titles.emp_no) group by title, employees.emp_no having title = 'Manager';
+----+-------------+-----------+------------+--------+---------------+-------------+---------+-------------------------+------+----------+----------------------------------------------+
| id | select_type | table     | partitions | type   | possible_keys | key         | key_len | ref                     | rows | filtered | Extra                                        |
+----+-------------+-----------+------------+--------+---------------+-------------+---------+-------------------------+------+----------+----------------------------------------------+
|  1 | SIMPLE      | titles    | NULL       | index  | PRIMARY       | title_index | 52      | NULL                    |    1 |   100.00 | Using index; Using temporary; Using filesort |
|  1 | SIMPLE      | employees | NULL       | eq_ref | PRIMARY       | PRIMARY     | 4       | employees.titles.emp_no |    1 |   100.00 | NULL                                         |
+----+-------------+-----------+------------+--------+---------------+-------------+---------+-------------------------+------+----------+----------------------------------------------+
2 rows in set, 1 warning (0.00 sec)
```

</details>
