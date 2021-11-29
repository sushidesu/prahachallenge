# マルチAZに跨るVPCを構築する

## 課題1

### 1

- サブネット
  - ネットワークを分割したもの
- パブリックサブネット
  - InternetGatewayを持ち、直接インターネットと通信ができるサブネット
  - >アウトバウンドトラフィックを直接インターネットに送信できますが、プライベートサブネットのインスタンスはできません。
- プライベートサブネット
  - InternetGatewayを持たないため、直接インターネットと通信ができないサブネット
  - パブリックサブネットに設置したNATゲートウェイを使用することで、インターネットにアクセスすることはできるが、インターネットからプライベートサブネットへの接続はできない
- 参考
  - [パブリックサブネットとプライベートサブネットを持つ VPC (NAT) - Amazon Virtual Private Cloud](https://docs.aws.amazon.com/ja_jp/vpc/latest/userguide/VPC_Scenario2.html)
  - [パブリックサブネット vs プライベートサブネット | エクスチュア株式会社ブログ](https://ex-ture.com/blog/2021/07/14/publicsubnet-vs-plivatesubnet/)

### 2

public->privateへのsshに使用する鍵を `scp` によって転送する。

```sh
~
❯ scp -i "praha-ec2.pem" praha-ec2.pem ec2-user@XXXXX.amazonaws.com:
/etc/profile.d/lang.sh: line 19: warning: setlocale: LC_CTYPE: cannot change locale (UTF-8): No such file or directory
praha-ec2.pem                                                                         100%  387    17.2KB/s   00:00    
```

転送された鍵を使用して、publicサブネットにあるEC2からprivateサブネットにあるEC2にsshすることができた。

```sh
~
❯ ssh -i "praha-ec2.pem" ec2-user@XXXXX.amazonaws.com

       __|  __|_  )
       _|  (     /   Amazon Linux 2 AMI
      ___|\___|___|

https://aws.amazon.com/amazon-linux-2/
-bash: warning: setlocale: LC_CTYPE: cannot change locale (UTF-8): No such file or directory
[ec2-user@ip-10-0-0-12 ~]$ ssh -i "praha-ec2.pem" ec2-user@10.0.1.25

       __|  __|_  )
       _|  (     /   Amazon Linux 2 AMI
      ___|\___|___|

https://aws.amazon.com/amazon-linux-2/
```
