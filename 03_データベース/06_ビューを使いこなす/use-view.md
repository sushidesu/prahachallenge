# ビューを使いこなす

## 1 (質問)

### 1

定義したクエリを元に、仮想的なテーブルを定義できる機能。実際にはデータを持たず、定義されたクエリをもとに各テーブルからデータを取得する。

> ビュー（VIEW）とは、テーブルの特定部分や複数テーブルを結合し、ユーザに必要な部分だけをあたかも一つのテーブルであるかのように見せるための、仮想的なテーブルの概念です。ビューの実体はデータを持たないSQL文であり、CREATE TABLE文で作成する物理的なテーブルとは異なります。
>
> [SQLで「ビュー作成」を行う：「データベーススペシャリスト試験」戦略的学習のススメ（17） - ＠IT](https://www.atmarkit.co.jp/ait/articles/1703/01/news190.html)

### 2

ビューの用途、メリット

- 複雑なクエリを簡素化する
- ビジネスロジックの一貫性を保つ
  - 何度も書くクエリを使い回すことができる
- セキュリティーの効果
  - 個人情報が含まれているテーブルから必要なデータのみをビューとして公開し、権限をビューのみに絞ることで、アクセスを制限できる

[MySQL Views - MySQL Tutorial](https://www.mysqltutorial.org/mysql-views-tutorial.aspx/)

デメリットは？

- ビューを安易に作りすぎた場合、メンテナンスが大変になる
- カラム削除の際に、影響範囲を把握しづらくなる
- ビジネスロジックがDB内に隠蔽されるため、見通しが悪くなる

[[データベース編]ビュー，トリガーを多用してはいけない | 日経クロステック（xTECH）](https://xtech.nikkei.com/it/article/COLUMN/20071126/287920/?rt=nocnt)

### 3

materialized view, 通常のビュー

| 通常のビュー | Materialized View |
| --- | --- |
| 実体を持たない | 問い合わせ結果をテーブルとして保持する |
| 参照のたびに検索を行う | 保存された結果を返す |
| パフォーマンス低 | パフォーマンス高 |
| 常に最新のデータを取得する | 更新処理 (リフレッシュ) が必要 |
| rowid は元テーブルと同じ | rowid が元テーブルと異なる |

参考

- [Difference between View and Materialized View in Database or SQL? | Java67](https://www.java67.com/2012/11/what-is-difference-between-view-vs-materialized-view-database-sql.html)
- [ビューとマテリアライズド・ビューの違いを理解する](https://products.sint.co.jp/siob/blog/oracle-view-mview)

## 2 (実装)

### クエリ1

「インデックスを理解する」より、最も若い従業員のリストを取得するクエリ

```sql
select * from employees
where birth_date = (
  select max(birth_date)
  from employees
);
```

実行速度 (インデックスなし) 約0.16秒

```text
+----------+------------------------------------------------------------------------------------------+----------+
| event_id | sql_text                                                                                 | Duration |
+----------+------------------------------------------------------------------------------------------+----------+
|       88 | select * from employees where birth_date = (   select max(birth_date)   from employees ) | 0.160961 |
|       87 | select * from employees where birth_date = (   select max(birth_date)   from employees ) | 0.163145 |
|       86 | select * from employees where birth_date = (   select max(birth_date)   from employees ) | 0.164257 |
+----------+------------------------------------------------------------------------------------------+----------+
```

ビューを作成

```sh
mysql> create view youngest_employees as select * from employees where birth_date = (   select max(birth_date)   from employees );
Query OK, 0 rows affected (0.01 sec)
```

ビューの実行速度 約0.16秒 → 変わらず。

```text
+----------+----------------------------------+----------+
| event_id | sql_text                         | Duration |
+----------+----------------------------------+----------+
|       95 | select * from youngest_employees | 0.157794 |
|       94 | select * from youngest_employees | 0.156645 |
|       93 | select * from youngest_employees | 0.158643 |
+----------+----------------------------------+----------+
```

### クエリ2

複合インデックスを理解するより、給料の高い10人を取得するクエリ (一部変更)

```sql
SELECT 
  employees.*,
  high_salaries.salary,
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

インデックス有り (salary_idx) の実行速度 約0.97秒

```text
+----------+----------------------+----------+
| event_id | left(sql_text, 20)   | Duration |
+----------+----------------------+----------+
|       59 | SELECT employees.*,  | 0.962497 |
|       58 | SELECT employees.*,  | 0.965113 |
|       57 | SELECT employees.*,  | 0.965739 |
+----------+----------------------+----------+
```

ビューを作成

```sh
create view salary_ranking as SELECT employees.*, high_salaries.salary  FROM ...(略)
Query OK, 0 rows affected (0.01 sec)
```

実行

```sql
select * from salary_ranking;
```

ビューの実行速度 約0.97秒 変わらず。ただsqlはとてもシンプルになった。

```text
+----------+------------------------------+----------+
| event_id | sql_text                     | Duration |
+----------+------------------------------+----------+
|       66 | select * from salary_ranking | 0.990712 |
|       65 | select * from salary_ranking | 0.966125 |
|       64 | select * from salary_ranking | 0.969412 |
+----------+------------------------------+----------+
```
