provider "aws" {
  region = "ap-northeast-1"
}

provider "aws" {
  alias = "ohaio"
  region = "us-east-2"
}

locals {
  name = "praha-task-cdn"
}

resource "aws_s3_bucket" "very-distant-storage" {
  provider = aws.ohaio
  bucket = "${local.name}-ohaio"
  acl    = "private"

  tags = {
    Name = "${local.name}-ohaio"
  }
}

resource "aws_s3_bucket_policy" "allow_access_from_all_users" {
  provider = aws.ohaio
  bucket = aws_s3_bucket.very-distant-storage.id
  policy = data.aws_iam_policy_document.allow_access_from_all_users.json
}

// オブジェクトへの匿名アクセスを許可
data "aws_iam_policy_document" "allow_access_from_all_users" {
  statement {
    principals {
      type = "AWS"
      identifiers = ["*"]
    }

    actions = [
      "s3:GetObject",
    ]

    resources = [
      "${aws_s3_bucket.very-distant-storage.arn}/*",
    ]
  }
}
