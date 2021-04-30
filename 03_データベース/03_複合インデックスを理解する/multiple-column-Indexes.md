# 複合インデックスを理解する

## 質問

### 1

複合インデックスを作成すると、データベースは複数列をキーとして並び替えた並び順を保存する。このときの並び替えの優先度は指定の先頭が最も高くなる。並び替えられたものから検索を行うため、特に複数条件での検索を高速に行うことができる。

### 2

複合インデックスは、インデックスの先頭の列で並び替えられる構造のため、常に先頭のデータを経由して検索しなければならず、2つ目以降の列のみでの検索はフルテーブルスキャンになってしまう。

よく検索される姓だけを先頭に、複合インデックスを作成すると良い。

```sql
CREATE INDEX employees_name ON employees (last_name, first_name)
```

## 実装

### 1

イニシャルがQ.Qの従業員

```sql
SELECT
  *
FROM
  employees
WHERE
  first_name LIKE 'Q%'
  AND last_name LIKE 'Q%';
```

#### 結果

```text
+--------+------------+------------+-----------+--------+------------+
| emp_no | birth_date | first_name | last_name | gender | hire_date  |
+--------+------------+------------+-----------+--------+------------+
| 433684 | 1954-10-18 | Qiwen      | Quittner  | M      | 1993-07-10 |
| 472791 | 1964-12-25 | Qiwen      | Quittner  | M      | 1988-04-26 |
+--------+------------+------------+-----------+--------+------------+
```

#### インデックス無し有りの比較

|     | 実行速度 | type | rows |
| --- | --- | --- | --- |
| インデックス無し | 0.0744s | `ALL` | 299423 |
| インデックス有り | 0.0004s | `range` | 718 |

以下、詳細です

#### 1-インデックス無し

##### 1-EXPLAIN (インデックス無し)

```sh
mysql> explain SELECT   * FROM   employees WHERE   first_name LIKE 'Q%'   AND last_name LIKE 'Q%';
+----+-------------+-----------+------------+------+---------------+------+---------+------+--------+----------+-------------+
| id | select_type | table     | partitions | type | possible_keys | key  | key_len | ref  | rows   | filtered | Extra       |
+----+-------------+-----------+------------+------+---------------+------+---------+------+--------+----------+-------------+
|  1 | SIMPLE      | employees | NULL       | ALL  | NULL          | NULL | NULL    | NULL | 299423 |     1.23 | Using where |
+----+-------------+-----------+------------+------+---------------+------+---------+------+--------+----------+-------------+
1 row in set, 1 warning (0.00 sec)
```

##### 1-実行速度 (インデックス無し)

```text
+----------+-------------------------------------------------------------------------------------------------+----------+
| event_id | sql_text                                                                                        | Duration |
+----------+-------------------------------------------------------------------------------------------------+----------+
|       27 | select * from employees where first_name like 'Q%' and last_name like 'Q%'                      | 0.075070 |
|       26 | select * from employees where first_name like 'Q%' and last_name like 'Q%'                      | 0.074452 |
|       25 | select * from employees where first_name like 'Q%' and last_name like 'Q%'                      | 0.074155 |
|       24 | select * from employees where first_name like 'Q%' and last_name like 'Q%'                      | 0.074473 |
+----------+-------------------------------------------------------------------------------------------------+----------+
```

#### 1-インデックス有り

last_name, first_nameの順に複合インデックスを作成

```sh
mysql> show index from employees;
+-----------+------------+---------------------+--------------+-------------+-----------+-------------+----------+--------+------+------------+---------+---------------+
| Table     | Non_unique | Key_name            | Seq_in_index | Column_name | Collation | Cardinality | Sub_part | Packed | Null | Index_type | Comment | Index_comment |
+-----------+------------+---------------------+--------------+-------------+-----------+-------------+----------+--------+------+------------+---------+---------------+
| employees |          0 | PRIMARY             |            1 | emp_no      | A         |      299423 |     NULL | NULL   |      | BTREE      |         |               |
| employees |          1 | last_first_name_idx |            1 | last_name   | A         |        1610 |     NULL | NULL   |      | BTREE      |         |               |
| employees |          1 | last_first_name_idx |            2 | first_name  | A         |      275494 |     NULL | NULL   |      | BTREE      |         |               |
+-----------+------------+---------------------+--------------+-------------+-----------+-------------+----------+--------+------+------------+---------+---------------+
3 rows in set (0.00 sec)
```

##### 1-EXPLAIN (インデックス有り)

```sh
mysql> explain select * from employees where first_name like 'Q%' and last_name like 'Q%';
+----+-------------+-----------+------------+-------+---------------------+---------------------+---------+------+------+----------+-----------------------+
| id | select_type | table     | partitions | type  | possible_keys       | key                 | key_len | ref  | rows | filtered | Extra                 |
+----+-------------+-----------+------------+-------+---------------------+---------------------+---------+------+------+----------+-----------------------+
|  1 | SIMPLE      | employees | NULL       | range | last_first_name_idx | last_first_name_idx | 34      | NULL |  718 |    11.11 | Using index condition |
+----+-------------+-----------+------------+-------+---------------------+---------------------+---------+------+------+----------+-----------------------+
1 row in set, 1 warning (0.00 sec)
```

##### 1-実行速度 (インデックス有り)

```text
+----------+----------------------------------------------------------------------------+----------+
| event_id | sql_text                                                                   | Duration |
+----------+----------------------------------------------------------------------------+----------+
|       96 | select * from employees where first_name like 'Q%' and last_name like 'Q%' | 0.000391 |
|       95 | select * from employees where first_name like 'Q%' and last_name like 'Q%' | 0.000368 |
|       94 | select * from employees where first_name like 'Q%' and last_name like 'Q%' | 0.000408 |
+----------+----------------------------------------------------------------------------+----------+
3 rows in set (0.00 sec)
```

##### 1-カバリングインデックス

カバリングインデックスになるように、ワイルドカードでのカラム指定をやめて、特定の列のみを取得してみる。 (emp_no, first_name, last_name)

ワイルドカードを使わないクエリの場合、EXPLAINのExtraに `Using index` の表記が増えていることより、カバリングインデックスになっていることが確認できた。

> - Using index
>   - クエリがインデックスだけを用いて解決できることを示す
>   - Covering Index を使用している場合などに表示される
>   - Using index が Extra に表示されるようにインデックスを貼るのが一つの目標
>
> [最低限押さえておきたい EXPLAIN の見かた - Qiita](https://qiita.com/aidy91614/items/f17ab862986e9e5cdea6#-extra)

```sh
// ワイルドカード指定の場合
mysql> explain select * from employees where first_name like 'Q%' and last_name like 'Q%';
+----+-------------+-----------+------------+-------+---------------------+---------------------+---------+------+------+----------+-----------------------+
| id | select_type | table     | partitions | type  | possible_keys       | key                 | key_len | ref  | rows | filtered | Extra                 |
+----+-------------+-----------+------------+-------+---------------------+---------------------+---------+------+------+----------+-----------------------+
|  1 | SIMPLE      | employees | NULL       | range | last_first_name_idx | last_first_name_idx | 34      | NULL |  718 |    11.11 | Using index condition |
+----+-------------+-----------+------------+-------+---------------------+---------------------+---------+------+------+----------+-----------------------+
1 row in set, 1 warning (0.01 sec)

// 特定の列のみ取得
mysql> explain select emp_no, first_name, last_name from employees where first_name like 'Q%' and last_name like 'Q%';
+----+-------------+-----------+------------+-------+---------------------+---------------------+---------+------+------+----------+--------------------------+
| id | select_type | table     | partitions | type  | possible_keys       | key                 | key_len | ref  | rows | filtered | Extra                    |
+----+-------------+-----------+------------+-------+---------------------+---------------------+---------+------+------+----------+--------------------------+
|  1 | SIMPLE      | employees | NULL       | range | last_first_name_idx | last_first_name_idx | 34      | NULL |  718 |    11.11 | Using where; Using index |
+----+-------------+-----------+------------+-------+---------------------+---------------------+---------+------+------+----------+--------------------------+
1 row in set, 1 warning (0.01 sec)
```

ただ、実行速度に差は出なかった。元が十分速いため？

```text
カバリングインデックスの実行速度
+----------+----------------------------------------------------------------------------------------------------------------+----------+
| event_id | sql_text                                                                                                       | Duration |
+----------+----------------------------------------------------------------------------------------------------------------+----------+
|      114 | select emp_no, first_name, last_name from employees where first_name like 'Q%' and last_name like 'Q%'         | 0.000383 |
|      113 | select emp_no, first_name, last_name from employees where first_name like 'Q%' and last_name like 'Q%'         | 0.000423 |
|      112 | select emp_no, first_name, last_name from employees where first_name like 'Q%' and last_name like 'Q%'         | 0.000420 |
|      111 | select emp_no, first_name, last_name from employees where first_name like 'Q%' and last_name like 'Q%'         | 0.000395 |
|      110 | select emp_no, first_name, last_name from employees where first_name like 'Q%' and last_name like 'Q%'         | 0.000380 |
|      109 | select emp_no, first_name, last_name from employees where first_name like 'Q%' and last_name like 'Q%'         | 0.000469 |
+----------+----------------------------------------------------------------------------------------------------------------+----------+
```

### 2

1985年入社かつ、first_nameが `'Mario'` の従業員一覧 (スーパーマリオブラザーズの発売日: 1985年)

```sql
select * from employees where (hire_date between date('1985-01-01') and date ('1985-12-31')) and first_name = 'Mario';
```

#### 2-結果

```text
+--------+------------+------------+---------------+--------+------------+
| emp_no | birth_date | first_name | last_name     | gender | hire_date  |
+--------+------------+------------+---------------+--------+------------+
|  11157 | 1965-02-01 | Mario      | Cochrane      | M      | 1985-03-30 |
|  23200 | 1961-12-18 | Mario      | Magalhaes     | F      | 1985-07-19 |
|  33172 | 1959-07-14 | Mario      | Conti         | F      | 1985-04-14 |
|  34947 | 1952-12-12 | Mario      | Perfilyeva    | M      | 1985-04-22 |
|  46431 | 1960-06-18 | Mario      | Back          | M      | 1985-08-18 |
~~~
+--------+------------+------------+---------------+--------+------------+
29 rows in set (0.07 sec)
```

#### インデックス無し有りの比較

|     | 実行速度 | type | rows |
| --- | --- | --- | --- |
| インデックス無し | 0.0726s | `ALL` | 299423 |
| インデックス有り | 0.0004s | `range` | 29 |

以下、詳細です

#### 2-インデックス無し

##### 2-EXPLAIN (インデックス無し)

```sh
mysql> explain select * from employees where (hire_date between date('1985-01-01') and date ('1985-12-31')) and first_name = 'Mario';
+----+-------------+-----------+------------+------+---------------+------+---------+------+--------+----------+-------------+
| id | select_type | table     | partitions | type | possible_keys | key  | key_len | ref  | rows   | filtered | Extra       |
+----+-------------+-----------+------------+------+---------------+------+---------+------+--------+----------+-------------+
|  1 | SIMPLE      | employees | NULL       | ALL  | NULL          | NULL | NULL    | NULL | 299423 |     1.11 | Using where |
+----+-------------+-----------+------------+------+---------------+------+---------+------+--------+----------+-------------+
1 row in set, 1 warning (0.00 sec)
```

##### 2-実行速度 (インデックス無し)

```text
+----------+-----------------------------------------------------------------------------------------------------------------------+----------+
| event_id | sql_text                                                                                                              | Duration |
+----------+-----------------------------------------------------------------------------------------------------------------------+----------+
|       65 | select * from employees where (hire_date between date('1985-01-01') and date ('1985-12-31')) and first_name = 'Mario' | 0.073330 |
|       64 | select * from employees where (hire_date between date('1985-01-01') and date ('1985-12-31')) and first_name = 'Mario' | 0.072687 |
|       63 | select * from employees where (hire_date between date('1985-01-01') and date ('1985-12-31')) and first_name = 'Mario' | 0.072623 |
+----------+-----------------------------------------------------------------------------------------------------------------------+----------+
```

#### 2-インデックス有り

hire_date, first_nameの組み合わせで2通りの複合インデックスを作成

```sh
mysql> show index from employees;
+-----------+------------+--------------------------+--------------+-------------+-----------+-------------+----------+--------+------+------------+---------+---------------+
| Table     | Non_unique | Key_name                 | Seq_in_index | Column_name | Collation | Cardinality | Sub_part | Packed | Null | Index_type | Comment | Index_comment |
+-----------+------------+--------------------------+--------------+-------------+-----------+-------------+----------+--------+------+------------+---------+---------------+
| employees |          0 | PRIMARY                  |            1 | emp_no      | A         |      299423 |     NULL | NULL   |      | BTREE      |         |               |
| employees |          1 | hire_date_first_name_idx |            1 | hire_date   | A         |        4854 |     NULL | NULL   |      | BTREE      |         |               |
| employees |          1 | hire_date_first_name_idx |            2 | first_name  | A         |      292000 |     NULL | NULL   |      | BTREE      |         |               |
| employees |          1 | first_name_hire_date_idx |            1 | first_name  | A         |        1368 |     NULL | NULL   |      | BTREE      |         |               |
| employees |          1 | first_name_hire_date_idx |            2 | hire_date   | A         |      288094 |     NULL | NULL   |      | BTREE      |         |               |
+-----------+------------+--------------------------+--------------+-------------+-----------+-------------+----------+--------+------+------------+---------+---------------+
5 rows in set (0.01 sec)
```

##### 2-EXPLAIN (インデックス有り)

first_nameを先頭にした方が使われている。**hire_dateを先頭にした方のみ**でも試してみたが、こちらの場合はインデックスが使用されなかった。1985年入社に当てはまる従業員が多いため？

```sh
mysql> explain select * from employees where (hire_date between date('1985-01-01') and date ('1985-12-31')) and first_name = 'Mario';
+----+-------------+-----------+------------+-------+---------------------------------------------------+--------------------------+---------+------+------+----------+-----------------------+
| id | select_type | table     | partitions | type  | possible_keys                                     | key                      | key_len | ref  | rows | filtered | Extra                 |
+----+-------------+-----------+------------+-------+---------------------------------------------------+--------------------------+---------+------+------+----------+-----------------------+
|  1 | SIMPLE      | employees | NULL       | range | hire_date_first_name_idx,first_name_hire_date_idx | first_name_hire_date_idx | 19      | NULL |   29 |   100.00 | Using index condition |
+----+-------------+-----------+------------+-------+---------------------------------------------------+--------------------------+---------+------+------+----------+-----------------------+
1 row in set, 1 warning (0.01 sec)
```

##### 2-実行速度 (インデックス有り)

```text
mysql> SELECT event_id, sql_text, TRUNCATE(timer_wait/1000000000000, 6) as Duration FROM performance_schema.events_statements_history order by event_id DESC limit 3;
+----------+-----------------------------------------------------------------------------------------------------------------------+----------+
| event_id | sql_text                                                                                                              | Duration |
+----------+-----------------------------------------------------------------------------------------------------------------------+----------+
|       70 | select * from employees where (hire_date between date('1985-01-01') and date ('1985-12-31')) and first_name = 'Mario' | 0.000389 |
|       69 | select * from employees where (hire_date between date('1985-01-01') and date ('1985-12-31')) and first_name = 'Mario' | 0.000387 |
|       68 | select * from employees where (hire_date between date('1985-01-01') and date ('1985-12-31')) and first_name = 'Mario' | 0.000371 |
+----------+-----------------------------------------------------------------------------------------------------------------------+----------+
3 rows in set (0.00 sec)
```

##### 2-カバリングインデックス

カバリングインデックスになるように、新たにlast_nameを加えた複合インデックスを作成してみる。

```sh
mysql> show index from employees;
+-----------+------------+------------------------------------+--------------+-------------+-----------+-------------+----------+--------+------+------------+---------+---------------+
| Table     | Non_unique | Key_name                           | Seq_in_index | Column_name | Collation | Cardinality | Sub_part | Packed | Null | Index_type | Comment | Index_comment |
+-----------+------------+------------------------------------+--------------+-------------+-----------+-------------+----------+--------+------+------------+---------+---------------+
| employees |          0 | PRIMARY                            |            1 | emp_no      | A         |      299423 |     NULL | NULL   |      | BTREE      |         |               |
| employees |          1 | first_name_hire_date_last_name_idx |            1 | first_name  | A         |        1261 |     NULL | NULL   |      | BTREE      |         |               |
| employees |          1 | first_name_hire_date_last_name_idx |            2 | hire_date   | A         |      293859 |     NULL | NULL   |      | BTREE      |         |               |
| employees |          1 | first_name_hire_date_last_name_idx |            3 | last_name   | A         |      293189 |     NULL | NULL   |      | BTREE      |         |               |
+-----------+------------+------------------------------------+--------------+-------------+-----------+-------------+----------+--------+------+------------+---------+---------------+
4 rows in set (0.00 sec)
```

`Using index` の表記が増えていることより、カバリングインデックスになっていることが確認できた。

```sh
mysql> explain select emp_no, first_name, last_name, hire_date from employees where (hire_date between date('1985-01-01') and date ('1985-12-31')) and first_name = 'Mario';
+----+-------------+-----------+------------+-------+------------------------------------+------------------------------------+---------+------+------+----------+--------------------------+
| id | select_type | table     | partitions | type  | possible_keys                      | key                                | key_len | ref  | rows | filtered | Extra                    |
+----+-------------+-----------+------------+-------+------------------------------------+------------------------------------+---------+------+------+----------+--------------------------+
|  1 | SIMPLE      | employees | NULL       | range | first_name_hire_date_last_name_idx | first_name_hire_date_last_name_idx | 19      | NULL |   29 |   100.00 | Using where; Using index |
+----+-------------+-----------+------------+-------+------------------------------------+------------------------------------+---------+------+------+----------+--------------------------+
1 row in set, 1 warning (0.00 sec)
```

実行速度。若干速くなっている？

```text
mysql> SELECT event_id, sql_text, TRUNCATE(timer_wait/1000000000000, 6) as Duration FROM performance_schema.events_statements_history order by event_id DESC limit 3;
+----------+--------------------------------------------------------------------------------------------------------------------------------------------------------------+----------+
| event_id | sql_text                                                                                                                                                     | Duration |
+----------+--------------------------------------------------------------------------------------------------------------------------------------------------------------+----------+
|      113 | select emp_no, first_name, last_name, hire_date from employees where (hire_date between date('1985-01-01') and date ('1985-12-31')) and first_name = 'Mario' | 0.000293 |
|      112 | select emp_no, first_name, last_name, hire_date from employees where (hire_date between date('1985-01-01') and date ('1985-12-31')) and first_name = 'Mario' | 0.000345 |
|      111 | select emp_no, first_name, last_name, hire_date from employees where (hire_date between date('1985-01-01') and date ('1985-12-31')) and first_name = 'Mario' | 0.000347 |
+----------+--------------------------------------------------------------------------------------------------------------------------------------------------------------+----------+
3 rows in set (0.01 sec)
```

### 3

一番若い従業員を雇われた順に並べる

```sql
select * from employees
where birth_date = (
  select max(birth_date)
  from employees
)
order by hire_date ASC;
```

#### 3-結果

```text
+--------+------------+----------------+-----------------+--------+------------+
| emp_no | birth_date | first_name     | last_name       | gender | hire_date  |
+--------+------------+----------------+-----------------+--------+------------+
|  11157 | 1965-02-01 | Mario          | Cochrane        | M      | 1985-03-30 |
| 457832 | 1965-02-01 | Jackson        | Zielinski       | F      | 1985-04-04 |
| 299737 | 1965-02-01 | Patricio       | Itzfeldt        | M      | 1985-05-21 |
| 109062 | 1965-02-01 | Jamaludin      | Kandlur         | M      | 1985-05-26 |
| 248351 | 1965-02-01 | Jaana          | Milicia         | M      | 1985-06-02 |
~~~
+--------+------------+----------------+-----------------+--------+------------+
49 rows in set (0.17 sec)
```

#### インデックス無し有りの比較

|     | 実行速度 | type | rows |
| --- | --- | --- | --- |
| インデックス無し | 0.1650s | `ALL` | 299423 |
| インデックス有り | 0.0005s | `ref` | 49 |

以下、詳細です

#### 3-インデックス無し

##### 3-EXPLAIN (インデックス無し)

```sh
mysql> explain select * from employees where birth_date = (   select max(birth_date)   from employees ) order by hire_date ASC;
+----+-------------+-----------+------------+------+---------------+------+---------+------+--------+----------+-----------------------------+
| id | select_type | table     | partitions | type | possible_keys | key  | key_len | ref  | rows   | filtered | Extra                       |
+----+-------------+-----------+------------+------+---------------+------+---------+------+--------+----------+-----------------------------+
|  1 | PRIMARY     | employees | NULL       | ALL  | NULL          | NULL | NULL    | NULL | 299423 |    10.00 | Using where; Using filesort |
|  2 | SUBQUERY    | employees | NULL       | ALL  | NULL          | NULL | NULL    | NULL | 299423 |   100.00 | NULL                        |
+----+-------------+-----------+------------+------+---------------+------+---------+------+--------+----------+-----------------------------+
2 rows in set, 1 warning (0.01 sec)
```

##### 3-実行速度 (インデックス無し)

```text
+----------+-----------------------------------------------------------------------------------------------------------------+----------+
| event_id | sql_text                                                                                                        | Duration |
+----------+-----------------------------------------------------------------------------------------------------------------+----------+
|       72 | select * from employees where birth_date = (   select max(birth_date)   from employees ) order by hire_date ASC | 0.164992 |
|       71 | select * from employees where birth_date = (   select max(birth_date)   from employees ) order by hire_date ASC | 0.165256 |
|       70 | select * from employees where birth_date = (   select max(birth_date)   from employees ) order by hire_date ASC | 0.164335 |
+----------+-----------------------------------------------------------------------------------------------------------------+----------+
```

#### 3-インデックス有り

birth_date, hire_dateの順で複合インデックスを作成

```sh
mysql> show index from employees;
+-----------+------------+--------------------------+--------------+-------------+-----------+-------------+----------+--------+------+------------+---------+---------------+
| Table     | Non_unique | Key_name                 | Seq_in_index | Column_name | Collation | Cardinality | Sub_part | Packed | Null | Index_type | Comment | Index_comment |
+-----------+------------+--------------------------+--------------+-------------+-----------+-------------+----------+--------+------+------------+---------+---------------+
| employees |          0 | PRIMARY                  |            1 | emp_no      | A         |      299423 |     NULL | NULL   |      | BTREE      |         |               |
| employees |          1 | birth_date_hire_date_idx |            1 | birth_date  | A         |        4764 |     NULL | NULL   |      | BTREE      |         |               |
| employees |          1 | birth_date_hire_date_idx |            2 | hire_date   | A         |      298207 |     NULL | NULL   |      | BTREE      |         |               |
+-----------+------------+--------------------------+--------------+-------------+-----------+-------------+----------+--------+------+------------+---------+---------------+
3 rows in set (0.00 sec)
```

##### 3-EXPLAIN (インデックス有り)

```sh
mysql> explain select * from employees where birth_date = ( select max(birth_date) from employees ) order by hire_date ASC;
+----+-------------+-----------+------------+------+--------------------------+--------------------------+---------+-------+------+----------+------------------------------+
| id | select_type | table     | partitions | type | possible_keys            | key                      | key_len | ref   | rows | filtered | Extra                        |
+----+-------------+-----------+------------+------+--------------------------+--------------------------+---------+-------+------+----------+------------------------------+
|  1 | PRIMARY     | employees | NULL       | ref  | birth_date_hire_date_idx | birth_date_hire_date_idx | 3       | const |   49 |   100.00 | Using where                  |
|  2 | SUBQUERY    | NULL      | NULL       | NULL | NULL                     | NULL                     | NULL    | NULL  | NULL |     NULL | Select tables optimized away |
+----+-------------+-----------+------------+------+--------------------------+--------------------------+---------+-------+------+----------+------------------------------+
2 rows in set, 1 warning (0.01 sec)
```

##### 3-実行速度 (インデックス有り)

```text
+----------+-------------------------------------------------------------------------------------------------------------+----------+
| event_id | sql_text                                                                                                    | Duration |
+----------+-------------------------------------------------------------------------------------------------------------+----------+
|       92 | select * from employees where birth_date = ( select max(birth_date) from employees ) order by hire_date ASC | 0.000424 |
|       91 | select * from employees where birth_date = ( select max(birth_date) from employees ) order by hire_date ASC | 0.000478 |
|       90 | select * from employees where birth_date = ( select max(birth_date) from employees ) order by hire_date ASC | 0.000556 |
+----------+-------------------------------------------------------------------------------------------------------------+----------+
```

### 4 (複合インデックス関係無いです)

給料の高い社員ランキングTOP10

```sql
-- 給料の高い10人 (最新の給料で)
SELECT 
  * 
FROM 
  employees 
  JOIN (
    SELECT 
      salaries.emp_no, 
      salaries.salary, 
      salaries.from_date 
    FROM 
      salaries 
      JOIN (
        SELECT 
          emp_no, 
          Max(from_date) AS last_from_date 
        FROM 
          salaries 
        GROUP BY 
          emp_no
      ) AS last_salaries ON (
        salaries.emp_no = last_salaries.emp_no 
        AND salaries.from_date = last_salaries.last_from_date
      ) 
    ORDER BY 
      salaries.salary DESC 
    LIMIT 
      10
  ) AS high_salaries ON (
    employees.emp_no = high_salaries.emp_no
  );
```

結果

```text
+--------+------------+------------+-----------+--------+------------+--------+--------+------------+
| emp_no | birth_date | first_name | last_name | gender | hire_date  | emp_no | salary | from_date  |
+--------+------------+------------+-----------+--------+------------+--------+--------+------------+
|  43624 | 1953-11-14 | Tokuyasu   | Pesch     | M      | 1985-03-26 |  43624 | 158220 | 2002-03-22 |
| 254466 | 1963-05-27 | Honesty    | Mukaidono | M      | 1986-08-08 | 254466 | 156286 | 2001-08-04 |
|  47978 | 1956-03-24 | Xiahua     | Whitcomb  | M      | 1985-07-18 |  47978 | 155709 | 2002-07-14 |
| 253939 | 1957-12-03 | Sanjai     | Luders    | M      | 1987-04-15 | 253939 | 155513 | 2002-04-11 |
| 109334 | 1955-08-02 | Tsutomu    | Alameldin | M      | 1985-02-15 | 109334 | 155190 | 2002-02-11 |
|  80823 | 1963-01-21 | Willard    | Baca      | M      | 1985-02-26 |  80823 | 154459 | 2002-02-22 |
| 493158 | 1961-05-20 | Lidong     | Meriste   | M      | 1987-05-09 | 493158 | 154376 | 2002-05-05 |
| 205000 | 1956-01-14 | Charmane   | Griswold  | M      | 1990-06-23 | 205000 | 153715 | 2001-10-09 |
| 266526 | 1957-02-14 | Weijing    | Chenoweth | F      | 1986-10-08 | 266526 | 152710 | 2001-10-04 |
| 237542 | 1954-10-05 | Weicheng   | Hatcliff  | F      | 1985-04-12 | 237542 | 152687 | 2002-04-08 |
+--------+------------+------------+-----------+--------+------------+--------+--------+------------+
10 rows in set (3.15 sec)
```

## クイズ

### クイズ1

イニシャルがQ.Qの従業員一覧 (emp_no, first_name, last_name を取得)

### クイズ2

1985年入社かつ、first_nameが `'Mario'` の従業員一覧 (emp_no, first_name, last_name, hire_date を取得)

### クイズ3

一番若い (誕生日が一番新しい) 従業員を雇われた順に並べる (全列取得)
