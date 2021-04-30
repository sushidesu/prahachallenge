# SQL10本ノック

## 実践

### 1

1996年に3回以上注文

```sql
select CustomerID, count(OrderID) as OrderCount, OrderDate from Orders
  where OrderDate like '1996%'
  group by CustomerID
  having OrderCount >= 3
  order by OrderCount DESC;
```

結果

| CustomerID | OrderCount | OrderDate |
| --- | --- | --- |
| 65 | 6 | 1996-07-22 |
| 63 | 6 | 1996-08-05 |
| 20 | 6 | 1996-07-17 |
| 75 | 5 | 1996-08-01 |
| 46 | 5 | 1996-08-16 |
| 37 | 5 | 1996-09-05 |
| 87 | 4 | 1996-07-26 |
| 86 | 4 | 1996-09-09 |
| 80 | 4 | 1996-08-08 |
| 25 | 4 | 1996-07-2 |
| ... | | |

最もよく注文してくれた人

```sql
select Orders.CustomerID, CustomerName, count(OrderID) as OrderCount, OrderDate
  from Orders join Customers on (Orders.CustomerID = Customers.CustomerID)
  where OrderDate like '1996%'
  group by Orders.CustomerID
  having OrderCount >= 3
  order by OrderCount DESC limit 1;
```

| CustomerID | CustomerName | OrderCount | OrderDate |
| --- | --- | --- | --- |
| 65 | Rattlesnake Canyon Grocery | 6 | 1996-07-2 |

### 2

最も多くの注文詳細

```sql
select OrderID, count(OrderDetailID) as OrderDetailCount from OrderDetails
  group by OrderID
  order by OrderDetailCount desc limit 1;
```

結果

| OrderID | OrderDetailCount |
| --- | --- |
| 10406 | 5 |

### 3

一番お世話になっている運送会社

```sql
SELECT ShipperID, COUNT(OrderID) AS ShippingCount FROM Orders
  GROUP BY ShipperID
  ORDER BY ShippingCount DESC;
```

結果

Number of Records: 3

| ShipperID | ShippingCount |
| --- | --- |
| 2 | 74 |
| 3 | 68 |
| 1 | 54 |
### 4

売り上げの多い国

```sql
SELECT ROUND(SUM(Quantity * Price), 0) AS Sales, Country FROM Orders
  JOIN OrderDetails ON (Orders.OrderID = OrderDetails.OrderID)
  JOIN Products ON (OrderDetails.ProductID = Products.ProductID)
  JOIN Customers ON (Orders.CustomerID = Customers.CustomerID)
  GROUP BY Country
  ORDER BY Sales DESC;
```

結果

Number of Records: 21

| Sales | Country |
| --- | --- |
| 69612 | USA |
| 51672 | Austria |
| 47242 | Germany |
| 40215 | Brazil |
| ... | |

### 5

国ごとの売り上げを年ごとに集計

```sql
SELECT ROUND(SUM(Quantity * Price), 0) AS Sales, strftime('%Y', Orders.OrderDate) AS OrderYear, Country FROM Orders
  JOIN OrderDetails ON (Orders.OrderID = OrderDetails.OrderID)
  JOIN Products ON (OrderDetails.ProductID = Products.ProductID)
  JOIN Customers ON (Orders.CustomerID = Customers.CustomerID)
  GROUP BY ORderYear, Country
  ORDER BY Country ASC;
```

結果

Number of Records: 37

| Sales | OrderYear | Country |
| --- | --- | --- |
| 399 | 1997 | Argentina |
| 36715 | 1996 | Austria |
| 14957 | 1997 | Austria |
| 8051 | 1996 | Belgium |
| 32155 | 1996 | Brazil |
| 8060 | 1997 | Brazil |
| 9939 | 1996 | Canada |
| 21387 | 1997 | Canada |
| 3767 | 1996 | Denmark |
| ... | | |

### 6

年齢が一定以下の社員にフラグを立てる

```sql
-- Junior 列を追加
ALTER TABLE Employees ADD Junior boolean NOT NULL DEFAULT false;

-- 誕生日が1960年より後 -> BirthYear >= 1960
UPDATE Employees
  SET Junior = true
  WHERE cast(strftime('%Y', BirthDate) AS int) >= 1960;
```

castで一応 string -> numberに変換したが、必要ない？

結果

Number of Records: 10

| EmployeeID | LastName | FirstName | BirthDate | Photo | Junior |
| --- | --- | --- | --- | --- | --- |
| 1 | Davolio | Nancy | 1968-12-08 | EmpID1.pic | 1 |
| 2 | Fuller | Andrew | 1952-02-19 | EmpID2.pic | 0 |
| 3 | Leverling | Janet | 1963-08-30 | EmpID3.pic | 1 |
| 4 | Peacock | Margaret | 1958-09-19 | EmpID4.pic | 0 |
| 5 | Buchanan | Steven | 1955-03-04 | EmpID5.pic | 0 |
| 6 | Suyama | Michael | 1963-07-02 | EmpID6.pic | 1 |
| 7 | King | Robert | 1960-05-29 | EmpID7.pic | 1 |
| 8 | Callahan | Laura | 1958-01-09 | EmpID8.pic | 0 |
| 9 | Dodsworth | Anne | 1969-07-02 | EmpID9.pic | 1 |
| 10 | West | Adam | 1928-09-19 | EmpID10.pic | 0 |

### 7

70回以上配送した運送会社にフラグを立てる

```sql
-- long_relation 列を追加
ALTER TABLE Shippers ADD long_relation boolean NOT NULL DEFAULT false;

-- Order回数 >= 70 のShipperの long_relation を true にする

-- 動かない
UPDATE Shippers
  SET long_relation = true
  FROM Orders JOIN Shippers ON (Orders.ShipperID = Shippers.ShipperID)
  GROUP BY Shippers.ShipperID
  HAVING Count(OrderID) >= 70;

-- 動いた!!
UPDATE Shippers
  SET long_relation = true
  WHERE ShipperID IN (
    SELECT Shippers.ShipperID
    FROM Orders JOIN Shippers ON (Orders.ShipperID = Shippers.ShipperID)
    GROUP BY Shippers.ShipperID
    HAVING Count(OrderID) >= 70
  );
```

結果

Number of Records: 3

| ShipperID | ShipperName | Phone | long_relation |
| --- | --- | --- | --- |
| 1 | Speedy Express | (503) 555-9831 | 0 |
| 2 | United Package | (503) 555-3199 | 1 |
| 3 | Federal Shipping | (503) 555-9931 | 0 |

### 8

それぞれのEmployeeが最後に担当したOrderとその日付を取得

```sql
SELECT Orders.EmployeeID, MAX(OrderDate) AS LatestOrderDate
   FROM Orders
   JOIN Employees ON (Orders.EmployeeID = Employees.EmployeeID)
   GROUP BY Employees.EmployeeID;
```

結果

Number of Records: 9

| EmployeeID | LatestOrderDate |
| --- | --- |
| 1 | 1997-01-06 |
| 2 | 1997-01-22 |
| 3 | 1997-02-11 |
| 4 | 1997-02-10 |
| 5 | 1996-12-27 |
| 6 | 1997-02-07 |
| 7 | 1997-01-28 |
| 8 | 1997-02-12 |
| 9 | 1997-01-10 |

### 9

NULLの扱いに慣れる

```sql
-- IDが3のCustomerName を null にする
UPDATE Customers
   SET CustomerName = null
   WHERE CustomerID = 3;

-- CustomerName が null の Customer を抽出
-- X: No result. になる
SELECT * FROM Customers
   WHERE CustomerName = null;
```

NULLのCustomerを抽出

```sql
-- 成功
SELECT * FROM Customers
  WHERE CustomerName is null;
```

結果

Number of Records: 1

| CustomerID | CustomerName | ContactName | Address | City | PostalCode | Country |
| --- | --- | --- | --- | --- | --- | --- |
| 3 | null | Antonio Moreno | Mataderos 2312 | México D.F. | 05023 | Mexico |

Null以外を取得

```sql
SELECT * FROM Customers
  WHERE CustomerName is not null;
```

結果

Number of Records: 90

| CustomerID | CustomerName | ContactName | Address | City | PostalCode | Country |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | Alfreds Futterkiste | Maria Anders | Obere Str. 57 | Berlin | 12209 | Germany |
| 2 | Ana Trujillo Emparedados y helados | Ana Trujillo | Avda. de la Constitución 2222 | México D.F. | 05021 | Mexico |
| 4 | Around the Horn | Thomas Hardy | 120 Hanover Sq. | London | WA1 1DP | UK |
| 5 | Berglunds snabbköp | Christina Berglund | Berguvsvägen 8 | Luleå | S-958 22 | Sweden |
| 6 | Blauer See Delikatessen | Hanna Moos | Forsterstr. 57 | Mannheim | 68306 | Germany |
| ... | | | | | | |

> しかし残念ながら、これでは期待した結果は得られません。なぜでしょうか？

NULLは値や変数ではないため、値との比較ができず、結果unkownになるため。(SQLはtrue,falseにunkownを加えた3値論理を採用している)

こちらがわかりやすかったです: [3値論理とNULL (1/3)：CodeZine（コードジン）](https://codezine.jp/article/detail/532)

### 10

JOINの違い

```sql
-- EmployeeID = 1 を削除
DELETE FROM Employees
  WHERE EmployeeID = 1;
```

削除されたEmloyeeId=1が担当したOrdersを表示しないクエリ

```sql
SELECT OrderID, CustomerID, Employees.EmployeeID, OrderDate, ShipperID FROM Orders
  JOIN Employees On (Orders.EmployeeID = Employees.EmployeeID);
```

結果

Number of Records: 167

| OrderID | CustomerID | EmployeeID | OrderDate | ShipperID |
| --- | --- | --- | --- | --- |
| 10248 | 90 | 5 | 1996-07-04 | 3 |
| 10249 | 81 | 6 | 1996-07-05 | 1 |
| 10250 | 34 | 4 | 1996-07-08 | 2 |
| 10251 | 84 | 3 | 1996-07-08 | 1 |
| 10252 | 76 | 4 | 1996-07-09 | 2 |
| 10253 | 34 | 3 | 1996-07-10 | 2 |
| 10254 | 14 | 5 | 1996-07-11 | 2 |
| 10255 | 68 | 9 | 1996-07-12 | 3 |
| 10256 | 88 | 3 | 1996-07-15 | 2 |
| ... | | | | |

削除されたEmloyeeId=1が担当したOrdersを表示する（Employeesに関する情報はNULLで埋まる）クエリ

```sql
SELECT OrderID, CustomerID, Employees.EmployeeID, OrderDate, ShipperID FROM Orders
   LEFT JOIN Employees On (Orders.EmployeeID = Employees.EmployeeID)
   WHERE Employees.EmployeeID is null;
```

結果

Number of Records: 29

| OrderID | CustomerID | EmployeeID | OrderDate | ShipperID |
| --- | --- | --- | --- | --- |
| 10258 | 20 | null | 1996-07-17 | 1 |
| 10270 | 87 | null | 1996-08-01 | 1 |
| 10275 | 49 | null | 1996-08-07 | 1 |
| 10285 | 63 | null | 1996-08-20 | 2 |
| 10292 | 81 | null | 1996-08-28 | 2 |
| 10293 | 80 | null | 1996-08-29 | 3 |
| 10304 | 80 | null | 1996-09-12 | 2 |
| 10306 | 69 | null | 1996-09-16 | 3 |
| 10311 | 18 | null | 1996-09-20 | 3 |
| ... | | | | |

## 質問

### 1

実行される順序が違う。初めに実行されるのがWHERE句で、GROUPBYの結果に実行されるのがHAVING。GROUPBYの結果に適用したい場合はHAVINGを使用し、それ以外の場合にはWHEREを使用する。

参考: [[SQL] Where句とHaving句の違い | DevelopersIO](https://dev.classmethod.jp/articles/difference-where-and-having/)

> SQLが実行される順序は以下のようになっており
>
> ```text
> FROM → WHERE → GROUPBY → HAVING → SELECT → ORDERBY
> ```
>
> GroupByでグルーピングする前に抽出するのがWhere句で  
> GroupByでグルーピングした後に抽出するのがHaving句になります。

### 2

それぞれ、SQLコマンドの分類。

- DDL
  - Data Definition Language
  - データ定義言語
  - CREATE, DROP, ALTER, TRUNCATE, COMMENT, RENAME
- DML
  - Data Manipulation Language
  - データ操作言語
  - SELECT, INSERT, UPDATE, DELETE, MERGE, CALL, EXPLAIN PLAN, LOCK TABLE
- DCL
  - Data Control Language
  - データ制御言語
  - GRANT, REVOKE
- TCL
  - Transaction Control Language
  - トランザクション言語
  - COMMIT, ROLLBACK, SAVEPOINT, SET TRANSACTION

[【SQL】DDL, DML, DCL, TCL - SQL文の種類 - 優秀な開発者になりたい。](https://gr8developer.blogspot.com/2017/12/ddldmldcltcl.html)

---

ちなみに、[SQL | DDL, DQL, DML, DCL and TCL Commands - GeeksforGeeks](https://www.geeksforgeeks.org/sql-ddl-dql-dml-dcl-tcl-commands/) ではもう一つDQL(Data Query Language)というものが定義されており、SELECTが含まれていた。

## クイズ

### 1

トランザクションとはなんですか？

<details><summary>回答例</summary>

INSERT文などの複数のデータ更新処理を連続して実行し、一つの関連性のある集まりとして管理する際の管理の単位のこと。
</details>

### 2

TRUNCATE と DELETE はどちらも削除に使うSQL文です。違いは何でしょうか？

<details><summary>回答例</summary>

TRUNCATEはテーブル内の全てのデータを削除する。

DELETEはWHERE句で条件を指定することで、行単位での削除が可能。条件を何も指定しない場合、テーブル内の全てのデータを削除するが、TRUNCATEに比べて実行に時間がかかる。
</details>

### 3

`COUNT` 以外の集計関数を3つあげてください。

<details><summar>回答例</summary>

- AVG グループ内の平均値を計算する
- MAX 最大値を計算する
- MIN 最小値を計算する
- SUM 値を合計する
- STDEV 標準偏差を計算する
</details>
