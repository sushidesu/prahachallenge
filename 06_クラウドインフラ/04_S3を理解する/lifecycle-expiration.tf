locals {
  name_expiration = "lifecycle-expiration"
}

resource aws_s3_bucket lifecycle-expiration {
  bucket = "${local.name_expiration}"
  acl    = "private"

  tags = {
    Name = "${local.name_expiration}"
  }

  lifecycle_rule {
    id      = "rule-${local.name_expiration}"
    enabled = true

    tags = {
      Name = "rule-${local.name_expiration}"
    }

    expiration {
      days = 90
    }
  }
}
