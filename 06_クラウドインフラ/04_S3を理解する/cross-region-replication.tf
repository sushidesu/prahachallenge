provider "aws" {
  alias  = "central"
  region = "eu-central-1"
}

locals {
  name_replication = "replication"
}

# bucketを作成
resource "aws_s3_bucket" "destination" {
  bucket = "${local.name_replication}-destination"
  acl = "private"

  tags = {
    Name = "${local.name_replication}-destination"
  }

  versioning {
    enabled = true
  }
}

resource "aws_s3_bucket" "source" {
  bucket = "${local.name_replication}-source"
  acl = "private"

  tags = {
    Name = "${local.name_replication}-source"
  }

  versioning {
    enabled = true
  }
}

# role
resource "aws_iam_role" "replication" {
  name = "${local.name_replication}"

  assume_role_policy = <<POLICY
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": "sts:AssumeRole",
      "Principal": {
        "Service": "s3.amazonaws.com"
      },
      "Effect": "Allow",
      "Sid": ""
    }
  ]
}
POLICY
}

# policy
resource "aws_iam_policy" "replication" {
  name = "replication-policy"

  policy = <<POLICY
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": [
        "s3:GetReplicationConfiguration",
        "s3:ListBucket"
      ],
      "Effect": "Allow",
      "Resource": [
        "${aws_s3_bucket.source.arn}"
      ]
    },
    {
      "Action": [
        "s3:GetObjectVersionForReplication",
        "s3:GetObjectVersionAcl",
         "s3:GetObjectVersionTagging"
      ],
      "Effect": "Allow",
      "Resource": [
        "${aws_s3_bucket.source.arn}"
      ]
    },
    {
      "Action": [
        "s3:ReplicateObject",
        "s3:ReplicateDelete",
        "s3:ReplicateTags"
      ],
      "Effect": "Allow",
      "Resource": "${aws_s3_bucket.destination.arn}"
    }
  ]
}
POLICY
}

# attach
resource "aws_iam_role_policy_attachment" "replication" {
  role       = aws_iam_role.replication.id
  policy_arn = aws_iam_policy.replication.arn
}

# レプリケーションを設定
resource "aws_s3_bucket_replication_configuration" "replication" {
  role = aws_iam_role.replication.arn
  bucket = aws_s3_bucket.source.id

  rule {
    id = "${local.name_replication}-rule"
    status = "Enabled"

    destination {
      bucket = aws_s3_bucket.destination.arn
      storage_class = "GLACIER"
    }
  }
}
